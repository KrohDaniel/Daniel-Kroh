/* =========================================================================
   <icon-marquee> — Endloses Icon-Laufband mit durchlaufender Sinus-Welle
   -------------------------------------------------------------------------
   Vanilla JS, keine Abhängigkeiten. Runde Icon-Chips scrollen horizontal;
   eine ortsfeste Sinus-Welle hebt/senkt die Chips und vergrößert sie an den
   Wellenbergen (Coding/Dev-Referenz, angelehnt an Google Antigravity).

   Verwendung:  <icon-marquee></icon-marquee>
   Attribute:
     speed="0.55"   Scroll-Tempo (px/Frame)
     gap="84"       Abstand der Chips in px
     size="60"      Chip-Durchmesser in px
   ========================================================================= */
(function () {
  'use strict';

  // SVG-Innenmarkup je Icon (24×24, stroke = currentColor)
  const ICONS = [
    '<path d="M9 10 4 14l5 4"/><path d="M20 5v5a4 4 0 0 1-4 4H4"/>',                                  // enter / return
    '<path d="M4 9V6a2 2 0 0 1 2-2h3"/><path d="M20 9V6a2 2 0 0 0-2-2h-3"/><path d="M4 15v3a2 2 0 0 0 2 2h3"/><path d="M20 15v3a2 2 0 0 1-2 2h-3"/>', // fullscreen
    '<circle cx="10.5" cy="10.5" r="6"/><path d="m20 20-4.3-4.3"/><path d="M18 3v4M16 5h4" stroke-width="1.4"/>', // search + sparkle
    '<path d="M12 2.5 13.8 9 20.5 12 13.8 15 12 21.5 10.2 15 3.5 12 10.2 9z" fill="currentColor" stroke="none"/>', // sparkle (Gemini)
    '<path d="M8 8a2.5 2.5 0 1 0-2.5-2.5V8m0 0v8m0 0A2.5 2.5 0 1 0 8 16H8m0 0h8m0 0a2.5 2.5 0 1 0 2.5 2.5V16m0 0V8m0 0a2.5 2.5 0 1 0-2.5-2.5V8m0 0H8"/>', // command ⌘
    '<path d="M12 2.7 4 7v10l8 4.3 8-4.3V7z"/><path d="m4 7 8 4.3L20 7"/><path d="M12 11.3V21.5"/>', // cube / box
    '<path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',     // folder
    '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',          // copy / files
    '<circle cx="6" cy="12" r="2.1"/><circle cx="18" cy="6" r="2.1"/><circle cx="18" cy="18" r="2.1"/><path d="M7.9 11.1 16 7"/><path d="m7.9 12.9 8.1 4.1"/>', // share / branch
    '<path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/>',                                              // code </>
    '<path d="M4 12h11"/><path d="m11 8 4 4-4 4"/><path d="M20 5v14"/>',                              // tab / indent
    '<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><path d="m7 9.5 3 2.5-3 2.5"/><path d="M13 15h4"/>', // terminal
  ];

  const TAU = Math.PI * 2;
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  class IconMarquee extends HTMLElement {
    connectedCallback() {
      this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.speed = parseFloat(this.getAttribute('speed')) || 0.55;
      this.step = parseFloat(this.getAttribute('gap')) || 84;
      this.csize = parseFloat(this.getAttribute('size')) || 60;

      this.track = document.createElement('div');
      this.track.className = 'icon-marquee-track';
      this.appendChild(this.track);

      this.AMP = 26;       // vertikale Wellenhöhe
      this.SB = 0.74;      // Grund-Skalierung
      this.SA = 0.26;      // Skalierungs-Amplitude (Berg = größer)
      this.offset = 0;

      this._onResize = this._layout.bind(this);
      this._tick = this._frame.bind(this);
      window.addEventListener('resize', this._onResize, { passive: true });

      this._layout();

      this._io = new IntersectionObserver(([e]) => {
        e.isIntersecting ? this._start() : this._stop();
      }, { threshold: 0 });
      this._io.observe(this);
    }

    disconnectedCallback() {
      this._stop();
      window.removeEventListener('resize', this._onResize);
      if (this._io) this._io.disconnect();
    }

    _start() {
      if (this._raf || this._reduced) { if (this._reduced) this._render(); return; }
      this._last = performance.now();
      this._raf = requestAnimationFrame(this._tick);
    }
    _stop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    _layout() {
      const W = this.getBoundingClientRect().width || window.innerWidth;
      this.w = W;
      const need = Math.ceil(W / this.step) + 4;     // genug Chips zum Füllen + Puffer
      this.total = need * this.step;
      // Wellenlänge so wählen, dass die Welle über die Gesamtbreite periodisch
      // ist → nahtloses Wrappen ohne Sprung in Höhe/Größe.
      const waves = Math.max(1, Math.round(this.total / 520));
      this.K = (TAU * waves) / this.total;

      // Chips (wieder-)aufbauen, falls Anzahl sich ändert
      if (!this.chips || this.chips.length !== need) {
        this.track.innerHTML = '';
        this.chips = [];
        for (let i = 0; i < need; i++) {
          const chip = document.createElement('div');
          chip.className = 'icon-marquee-chip';
          chip.style.width = chip.style.height = this.csize + 'px';
          chip.style.marginLeft = chip.style.marginTop = (-this.csize / 2) + 'px';
          chip.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            ICONS[i % ICONS.length] + '</svg>';
          this.track.appendChild(chip);
          this.chips.push(chip);
        }
      }
      this._render();
    }

    _frame(now) {
      const dt = clamp((now - this._last) / 16.667, 0, 3);
      this._last = now;
      this.offset = (this.offset + this.speed * dt) % this.total;
      this._render();
      this._raf = requestAnimationFrame(this._tick);
    }

    _render() {
      const { chips, step, total, K, AMP, SB, SA } = this;
      if (!chips) return;
      for (let i = 0; i < chips.length; i++) {
        // Position im Container (0..total), wandert nach links
        let x = (i * step - this.offset) % total;
        if (x < 0) x += total;
        const s = Math.sin(x * K);
        const y = -AMP * s;                 // Berg = nach oben
        const scale = SB + SA * s;          // Berg = größer
        const c = chips[i];
        c.style.left = x + 'px';
        c.style.transform = `translateY(${y}px) scale(${scale})`;
        c.style.zIndex = String(100 + Math.round(s * 50)); // Berge nach vorne
      }
    }
  }

  if (!customElements.get('icon-marquee')) {
    customElements.define('icon-marquee', IconMarquee);
  }
})();
