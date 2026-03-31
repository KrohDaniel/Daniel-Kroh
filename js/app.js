/* ================================================
   DANIEL KROH — Homepage Animations
   Simple scroll-reveal animations (no frame/canvas)
   ================================================ */

(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // ---- HERO ENTRANCE ----
  function animateHero() {
    var hero = document.getElementById("hero");
    if (!hero) return;

    var words = hero.querySelectorAll(".hero-heading span");
    var tagline = hero.querySelector(".hero-tagline");
    var cta = hero.querySelector(".hero-cta");
    var label = hero.querySelector(".hero-label");

    if (label) gsap.to(label, { opacity: 1, duration: 0.6, delay: 0.2 });
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.4,
    });
    if (tagline) gsap.to(tagline, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.9 });
    if (cta) gsap.to(cta, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.2 });
  }

  // ---- STATIC SECTION SCROLL REVEALS ----
  function initStaticSections() {
    var isMobile = window.innerWidth <= 768;
    var offset = isMobile ? 30 : 50;
    var stagger = isMobile ? 0.08 : 0.12;
    var duration = isMobile ? 0.7 : 0.9;

    document.querySelectorAll('[data-static-anim="slide-left"]').forEach(function (el) {
      var children = el.querySelectorAll(
        ".section-label, .static-heading, .static-body, .static-list, .static-link, .cta-button, .location-highlights, .trust-metrics"
      );

      gsap.from(children, {
        y: offset,
        opacity: 0,
        stagger: stagger,
        duration: duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    document.querySelectorAll('[data-static-anim="slide-right"]').forEach(function (el) {
      var children = el.querySelectorAll(
        ".section-label, .static-heading, .static-body, .static-list, .static-link, .cta-button, .location-highlights, .trust-metrics"
      );

      if (children.length > 0) {
        gsap.from(children, {
          y: offset,
          opacity: 0,
          stagger: stagger,
          duration: duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      } else {
        gsap.from(el, {
          y: offset,
          opacity: 0,
          duration: duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    // Trust metric counters
    document.querySelectorAll('.trust-metric[data-static-anim="counter"]').forEach(function (el) {
      var target = parseInt(el.dataset.target);
      var suffix = el.dataset.suffix || "";
      var valueEl = el.querySelector(".trust-metric-value");

      if (isNaN(target)) return;

      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          valueEl.textContent = Math.round(obj.val) + suffix;
        },
      });
    });
  }

  // ---- INIT ----
  animateHero();
  initStaticSections();
})();
