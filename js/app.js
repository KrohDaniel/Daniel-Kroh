/* ================================================
   DANIEL KROH — Homepage Animations
   IntersectionObserver-basiert (keine ScrollTrigger-Listener)
   ================================================ */

(function () {
  "use strict";

  // ---- HERO ENTRANCE (einmalig, kein Scroll-Listener) ----
  function animateHero() {
    var hero = document.getElementById("hero");
    if (!hero) return;
    hero.classList.add("hero--entered");
  }

  // ---- REVEAL via IntersectionObserver ----
  function initReveal() {
    var elements = document.querySelectorAll(
      "[data-static-anim], [data-reveal]"
    );
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ---- COUNTER (einmalig beim ersten Sichtbarwerden) ----
  function initCounters() {
    var counters = document.querySelectorAll('.trust-metric[data-target]');
    if (!counters.length || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        var valueEl = el.querySelector(".trust-metric-value");
        if (valueEl) valueEl.textContent = el.dataset.target + (el.dataset.suffix || "");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || "";
        var valueEl = el.querySelector(".trust-metric-value");
        if (!valueEl || isNaN(target)) {
          observer.unobserve(el);
          return;
        }
        var start = performance.now();
        var duration = 1500;
        function tick(now) {
          var p = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          valueEl.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    animateHero();
    initReveal();
    initCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
