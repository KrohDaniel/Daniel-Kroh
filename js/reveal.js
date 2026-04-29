/* ================================================
   REVEAL — IntersectionObserver-basierte Fade-Ins
   Ersetzt GSAP ScrollTrigger für bessere Scroll-Performance
   ================================================ */

(function () {
  "use strict";

  function reveal() {
    var selectors = [
      "[data-static-anim]",
      "[data-anim]",
      ".skill-card",
      ".service-card",
      ".pricing-card",
      ".timeline-item",
      ".ref-card",
      ".showcase-intro",
      ".about-hero-text",
      ".about-hero-portrait",
      ".workspace-caption",
    ];
    var elements = document.querySelectorAll(selectors.join(","));
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  function counters() {
    var els = document.querySelectorAll(".trust-metric[data-target]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        var v = el.querySelector(".trust-metric-value");
        if (v) v.textContent = el.dataset.target + (el.dataset.suffix || "");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || "";
        var v = el.querySelector(".trust-metric-value");
        if (!v || isNaN(target)) { io.unobserve(el); return; }
        var start = performance.now();
        function tick(now) {
          var p = Math.min(1, (now - start) / 1500);
          var eased = 1 - Math.pow(1 - p, 3);
          v.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    els.forEach(function (el) { io.observe(el); });
  }

  function init() {
    reveal();
    counters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
