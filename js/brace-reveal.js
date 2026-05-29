/* =========================================================================
   <brace-reveal> — Partikel formen beim Hovern eine Code-Figur
   -------------------------------------------------------------------------
   Vanilla JS, Canvas 2D, keine Abhängigkeiten.

   Idee: Im Ruhezustand schwirren die Punkte ungeordnet über die Section.
   Hovert man über eine Hälfte, fliegen die "Form-Punkte" zusammen und
   zeichnen eine Figur. Cursor weg → wieder ungeordnet.

   Figuren (shape):
     "braces"  → große geschweifte Klammer "{ }" um die linke Hälfte
     "circles" → 6 Kreise im Ring um die rechte Hälfte (Mitte frei)

   Verwendung:
     <brace-reveal shape="braces" trigger="left"></brace-reveal>
     <brace-reveal shape="circles" trigger="right" ambient="0" fade="in"></brace-reveal>
   Attribute:
     shape="braces|circles"   Welche Figur
     trigger="left|right|section"  Welche Hälfte den Effekt auslöst
     color="#1a73e8"          Farbe der Form-Punkte
     ambient="1"              Dichte der Hintergrund-Punkte (0 = keine)
     fade="in"                Form-Punkte sind im Ruhezustand unsichtbar
     speed="1"                Tempo der Form-Animation (kleiner = langsamer)
   ========================================================================= */
(function () {
  'use strict';

  // gleiche Palette wie das Hero-Partikelfeld (particle-field.js)
  const PALETTE = [
    '#4285F4', // blau
    '#EA4335', // rot
    '#FBBC05', // gelb
    '#A142F4', // lila
    '#34A853', // grün
    '#00b8e6', // Marken-Cyan
    '#e89610', // Marken-Amber
  ];

  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  class BraceReveal extends HTMLElement {
    connectedCallback() {
      this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._noHover = window.matchMedia('(hover: none)').matches;

      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('aria-hidden', 'true');
      this.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.kind = this.getAttribute('shape') || 'braces';
      // ohne "color"-Attribut: bunte Palette wie im Hero; sonst Einzelfarbe
      this.shapeColor = this.getAttribute('color') || null;
      this.ambientFactor = this.hasAttribute('ambient') ? parseFloat(this.getAttribute('ambient')) : 1;
      this.trigger = this.getAttribute('trigger') || 'left';
      this.fadeIn = this.getAttribute('fade') === 'in';
      // langsame, ruhige Formung — per "speed" feinjustierbar
      this.speed = (parseFloat(this.getAttribute('speed')) || 1) * 0.028;

      this.reveal = 0;
      this.revealTarget = 0;

      this._onResize = this._resize.bind(this);
      this._onMove = this._pointerMove.bind(this);
      this._onLeave = () => { this.revealTarget = 0; };
      this._tick = this._frame.bind(this);

      window.addEventListener('resize', this._onResize, { passive: true });
      window.addEventListener('pointermove', this._onMove, { passive: true });
      window.addEventListener('pointerleave', this._onLeave, { passive: true });

      this._resize();

      this._io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) this._start(); else this._stop();
        if (this._noHover) this.revealTarget = e.isIntersecting ? 1 : 0;
      }, { threshold: 0.15 });
      this._io.observe(this);
    }

    disconnectedCallback() {
      this._stop();
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('pointermove', this._onMove);
      window.removeEventListener('pointerleave', this._onLeave);
      if (this._io) this._io.disconnect();
    }

    _start() {
      if (this._reduced) { this._renderStatic(); return; }
      if (this._raf) return;
      this._last = performance.now();
      this._raf = requestAnimationFrame(this._tick);
    }
    _stop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    _resize() {
      const rect = this.getBoundingClientRect();
      this.w = Math.max(1, rect.width);
      this.h = Math.max(1, rect.height);
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this._build();
      if (this._reduced) this._renderStatic();
    }

    /* --- Ziel-Punkte: geschweifte Klammern "{ }" ------------------------- */
    _sampleGlyph(char, targetH, step) {
      const px = Math.round(targetH * 1.25);
      const cv = document.createElement('canvas');
      cv.width = px; cv.height = Math.round(px * 1.4);
      const c = cv.getContext('2d');
      c.fillStyle = '#000';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = `600 ${px}px 'JetBrains Mono', ui-monospace, 'Courier New', monospace`;
      c.fillText(char, cv.width / 2, cv.height / 2);
      const data = c.getImageData(0, 0, cv.width, cv.height).data;
      const pts = [];
      let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      for (let y = 0; y < cv.height; y += step) {
        for (let x = 0; x < cv.width; x += step) {
          if (data[(y * cv.width + x) * 4 + 3] > 128) {
            pts.push({ x, y });
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }
      return { pts, minX, minY, w: maxX - minX || 1, h: maxY - minY || 1 };
    }

    _place(glyph, cx, cy, targetH, out) {
      const scale = targetH / glyph.h;
      const gcx = glyph.minX + glyph.w / 2;
      const gcy = glyph.minY + glyph.h / 2;
      for (const p of glyph.pts) {
        out.push({ x: cx + (p.x - gcx) * scale, y: cy + (p.y - gcy) * scale });
      }
    }

    _braceTargets() {
      const W = this.w, H = this.h;
      const braceH = H * 0.72;
      const cy = H * 0.5;
      // zentriert auf die ganze Section → Text sitzt mittig zwischen { und }
      const cx = W * 0.5;
      const halfSpan = Math.min(W * 0.43, 420); // Desktop: enger am Text; Mobile via W*0.43
      const openX = cx - halfSpan;   // "{" links
      const closeX = cx + halfSpan;  // "}" rechts
      const step = clamp(Math.round(braceH / 28), 3, 7);
      const out = [];
      this._place(this._sampleGlyph('{', braceH, step), openX, cy, braceH, out);
      this._place(this._sampleGlyph('}', braceH, step), closeX, cy, braceH, out);
      return out;
    }

    /* --- Ziel-Punkte: 6 Kreise im Ring (Mitte frei) --------------------- */
    _circleTargets() {
      const W = this.w, H = this.h;
      const cx = W * 0.75, cy = H * 0.5;          // Zentrum der rechten Hälfte
      const Rring = Math.min(W * 0.16, H * 0.29);  // Abstand der Kreise vom Zentrum
      const rc = Rring * 0.62;                      // Radius je Kreis
      const per = Math.max(30, Math.round((TAU * rc) / 8));
      const out = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 2 + i * (TAU / 6);     // oben beginnen, alle 60°
        const ccx = cx + Math.cos(a) * Rring;
        const ccy = cy + Math.sin(a) * Rring;
        for (let k = 0; k < per; k++) {
          const th = (k / per) * TAU;
          out.push({
            x: ccx + Math.cos(th) * rc + rand(-1.6, 1.6),
            y: ccy + Math.sin(th) * rc + rand(-1.6, 1.6),
          });
        }
      }
      return out;
    }

    _build() {
      const W = this.w, H = this.h;
      let targets = this.kind === 'circles' ? this._circleTargets() : this._braceTargets();

      const MAX = 700;
      if (targets.length > MAX) {
        const stride = targets.length / MAX;
        const t = [];
        for (let i = 0; i < MAX; i++) t.push(targets[(i * stride) | 0]);
        targets = t;
      }

      this.shapePts = targets.map((t) => ({
        hx: rand(0, W), hy: rand(0, H),
        tx: t.x, ty: t.y,
        r: rand(1.1, 2.2),
        phase: rand(0, TAU), freq: rand(0.3, 0.8),
        color: this.shapeColor || pick(PALETTE),
      }));

      const n = this.ambientFactor > 0
        ? clamp(Math.round((W * H) / 3200 * this.ambientFactor), 60, 420) : 0;
      this.ambient = new Array(n).fill(0).map(() => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.8, 1.8),
        phase: rand(0, TAU), freq: rand(0.2, 0.6),
        amp: rand(3, 10),
        alpha: rand(0.18, 0.5),
        color: this.shapeColor || pick(PALETTE),
      }));
    }

    _pointerMove(e) {
      const rect = this.getBoundingClientRect();
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      let on = inX && inY;
      if (on && this.trigger === 'left') on = e.clientX <= rect.left + rect.width * 0.5;
      else if (on && this.trigger === 'right') on = e.clientX >= rect.left + rect.width * 0.5;
      if (!this._noHover) this.revealTarget = on ? 1 : 0;
    }

    _frame(now) {
      const dt = clamp((now - this._last) / 16.667, 0, 3);
      this._last = now;
      this.reveal += (this.revealTarget - this.reveal) * this.speed * dt;
      this._render(now / 1000);
      this._raf = requestAnimationFrame(this._tick);
    }

    _render(t) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const e = ease(clamp(this.reveal, 0, 1));

      // Hintergrund-Punkte (bunt wie im Hero, dezent)
      for (const p of this.ambient) {
        const x = p.x + Math.sin(t * p.freq + p.phase) * p.amp;
        const y = p.y + Math.cos(t * p.freq * 1.2 + p.phase) * p.amp;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, TAU);
        ctx.fill();
      }

      // Form-Punkte: von Heimat (ungeordnet) zur Figur morphen
      const a0 = this.fadeIn ? 0 : 0.45;       // Ruhe-Deckkraft
      for (const p of this.shapePts) {
        const drift = 1 - e;
        const hx = p.hx + Math.sin(t * p.freq + p.phase) * 7 * drift;
        const hy = p.hy + Math.cos(t * p.freq * 1.1 + p.phase) * 7 * drift;
        const tx = p.tx + Math.sin(t * 2 + p.phase) * 1.1;
        const ty = p.ty + Math.cos(t * 2 + p.phase) * 1.1;
        ctx.globalAlpha = a0 + (0.95 - a0) * e;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(hx + (tx - hx) * e, hy + (ty - hy) * e, p.r, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    _renderStatic() {
      if (!this.shapePts) this._build();
      this.reveal = this._noHover ? 1 : 0;
      this._render(0);
    }
  }

  if (!customElements.get('brace-reveal')) {
    customElements.define('brace-reveal', BraceReveal);
  }
})();
