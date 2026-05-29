/* =========================================================================
   <particle-field> — Punkte sammeln sich um den Cursor, mit festem Abstand
   -------------------------------------------------------------------------
   Vanilla JS, Canvas 2D, keine Abhängigkeiten.

   Verhalten:
     - Viele kleine, ungeordnet umherschwirrende Punkte.
     - ALLE Punkte werden zum Cursor gezogen und sammeln sich dort.
     - Eine Abstands-Beschränkung verhindert, dass Punkte aufeinander liegen
       → es entsteht eine gleichmäßig gepackte Wolke mit Lücken dazwischen.
     - Folgt dem Cursor; ohne Cursor sammeln sie sich sanft in der Mitte.

   Verwendung:
     <particle-field></particle-field>
   Optionale Attribute:
     count="160"          Anzahl Punkte (Default skaliert mit Fläche)
     colors="#4285F4,..." Komma-Liste eigener Farben
     spacing="18"         Mindestabstand zwischen den Punkten in px
     pull="1"             Stärke der Anziehung zum Cursor
     links="false"        Verbindungslinien zwischen nahen Punkten aus
     interactive="false"  Cursor-Reaktion aus (Wolke bleibt mittig)
   ========================================================================= */
(function () {
  'use strict';

  const DEFAULT_COLORS = [
    '#4285F4', // blau
    '#EA4335', // rot
    '#FBBC05', // gelb
    '#A142F4', // lila
    '#34A853', // grün
    '#00b8e6', // Marken-Cyan
    '#e89610', // Marken-Amber
  ];

  const TAU = Math.PI * 2;
  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  class ParticleField extends HTMLElement {
    connectedCallback() {
      this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('aria-hidden', 'true');
      this.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.colors = (this.getAttribute('colors') || '')
        .split(',').map(c => c.trim()).filter(Boolean);
      if (!this.colors.length) this.colors = DEFAULT_COLORS;

      this.interactive = this.getAttribute('interactive') !== 'false';
      this.showLinks = this.getAttribute('links') !== 'false';
      this.countAttr = parseInt(this.getAttribute('count'), 10) || 0;
      this.spacing = parseFloat(this.getAttribute('spacing')) || 18;
      this.reach = parseFloat(this.getAttribute('reach')) || 220;   // Cursor-Einflussradius
      this.pull = (parseFloat(this.getAttribute('pull')) || 1) * 0.02;
      this.sepIters = 6; // Korrektur-Durchläufe der Abstands-Beschränkung pro Frame

      // Sammelpunkt: folgt dem Cursor, sonst Mitte
      this.focus = { x: 0, y: 0, active: false };

      this._onResize = this._resize.bind(this);
      this._onMove = this._pointerMove.bind(this);
      this._onLeave = this._pointerLeave.bind(this);
      this._tick = this._frame.bind(this);

      window.addEventListener('resize', this._onResize, { passive: true });
      if (this.interactive) {
        window.addEventListener('pointermove', this._onMove, { passive: true });
        window.addEventListener('pointerleave', this._onLeave, { passive: true });
      }

      this._resize();

      this._io = new IntersectionObserver(([e]) => {
        e.isIntersecting ? this._start() : this._stop();
      }, { threshold: 0 });
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
      this.w = rect.width;
      this.h = rect.height;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.focus.x = this.w / 2;
      this.focus.y = this.h * 0.45;
      this._build();
      if (this._reduced) this._renderStatic();
    }

    _count() {
      if (this.countAttr) return this.countAttr;
      return clamp(Math.round((this.w * this.h) / 8000), 60, 200);
    }

    _build() {
      const n = this._count();
      // Heimat-Positionen auf einem leicht zufälligen Raster → gleichmäßige
      // Verteilung über das ganze Canvas, wenn der Cursor nicht einwirkt.
      const cols = Math.max(1, Math.round(Math.sqrt(n * (this.w / this.h))));
      const rows = Math.max(1, Math.ceil(n / cols));
      const cw = this.w / cols, ch = this.h / rows;
      this.particles = [];
      for (let i = 0; i < n; i++) {
        const gx = i % cols, gy = (i / cols) | 0;
        const hx = clamp((gx + 0.5) * cw + rand(-cw * 0.38, cw * 0.38), 0, this.w);
        const hy = clamp((gy + 0.5) * ch + rand(-ch * 0.38, ch * 0.38), 0, this.h);
        this.particles.push(this._spawn(hx, hy));
      }
    }

    _spawn(hx, hy) {
      return {
        hx, hy,            // Heimat-Position (gleichmäßige Verteilung)
        x: hx, y: hy,
        vx: 0, vy: 0,
        r: rand(1.1, 2.4),
        color: this.colors[(Math.random() * this.colors.length) | 0],
        baseAlpha: rand(0.4, 0.9),
        alpha: 0.6,
        phase: rand(0, TAU),
        freq: rand(0.4, 1.1),
      };
    }

    _pointerMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= this.w && y <= this.h;
      this.focus.x = clamp(x, 0, this.w);
      this.focus.y = clamp(y, 0, this.h);
      this.focus.active = inside;
    }

    _pointerLeave() {
      this.focus.active = false;
    }

    _frame(now) {
      const dt = clamp((now - this._last) / 16.667, 0, 3);
      this._last = now;
      this._update(dt, now / 1000);
      this._render();
      this._raf = requestAnimationFrame(this._tick);
    }

    _update(dt, t) {
      const f = this.focus;
      const active = f.active;
      const reach = this.reach, reach2 = reach * reach;
      const kA = this.pull;     // Anziehung zum Cursor (nur im Radius)
      const kH = 0.01;          // Rückfederung zur Heimat (gleichmäßige Verteilung)
      const ps = this.particles;

      // 1) Kräfte: im Cursor-Radius anziehen, sonst zur Heimat zurück
      for (const p of ps) {
        let influence = 0;
        if (active) {
          const dx = f.x - p.x, dy = f.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach2) {
            const d = Math.sqrt(d2) || 0.001;
            influence = 1 - d / reach;           // 1 am Cursor → 0 am Rand des Radius
            p.vx += dx * kA * influence * dt;
            p.vy += dy * kA * influence * dt;
          }
        }

        // Rückfederung zur Heimat (umso stärker, je weniger der Cursor einwirkt)
        const home = 1 - influence;
        p.vx += (p.hx - p.x) * kH * home * dt;
        p.vy += (p.hy - p.y) * kH * home * dt;

        // dezentes "Leben"
        p.vx += Math.cos(t * p.freq + p.phase) * 0.025 * dt;
        p.vy += Math.sin(t * p.freq * 1.3 + p.phase) * 0.025 * dt;

        p.vx *= 0.90;
        p.vy *= 0.90;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // im Cursor-Radius gesammelte Punkte leuchten etwas heller
        const targetA = p.baseAlpha * (0.7 + 0.5 * influence);
        p.alpha += (clamp(targetA, 0, 1) - p.alpha) * 0.08;
      }

      // 2) Abstands-Beschränkung: keine zwei Punkte dürfen aufeinander liegen.
      //    Mehrere Durchläufe, damit dicht gepackte Punkte sicher auseinander-
      //    gehen (ein Durchlauf reicht bei starker Anziehung nicht).
      const md = this.spacing;
      const md2 = md * md;
      for (let it = 0; it < this.sepIters; it++) {
        for (let i = 0; i < ps.length; i++) {
          const a = ps[i];
          for (let j = i + 1; j < ps.length; j++) {
            const b = ps[j];
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let d2 = dx * dx + dy * dy;
            if (d2 >= md2) continue;
            if (d2 < 0.0001) {            // exakt deckungsgleich → leicht versetzen
              dx = (i % 2 ? 0.5 : -0.5);
              dy = (j % 2 ? 0.5 : -0.5);
              d2 = dx * dx + dy * dy;
            }
            const d = Math.sqrt(d2);
            const push = (md - d) / 2;     // jeden um die halbe Überlappung schieben
            const ux = dx / d, uy = dy / d;
            a.x += ux * push; a.y += uy * push;
            b.x -= ux * push; b.y -= uy * push;
          }
        }
      }
    }

    _render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const ps = this.particles;

      if (this.showLinks) {
        const MAX = this.spacing * 1.7, MAX2 = MAX * MAX;
        ctx.lineWidth = 0.7;
        for (let i = 0; i < ps.length; i++) {
          const a = ps[i];
          for (let j = i + 1; j < ps.length; j++) {
            const b = ps[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < MAX2) {
              const o = (1 - Math.sqrt(d2) / MAX) * 0.22 * Math.min(a.alpha, b.alpha);
              ctx.globalAlpha = o;
              ctx.strokeStyle = a.color;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of ps) {
        ctx.globalAlpha = clamp(p.alpha, 0, 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    _renderStatic() {
      if (!this.particles) this._build();
      this._render();
    }
  }

  if (!customElements.get('particle-field')) {
    customElements.define('particle-field', ParticleField);
  }
})();
