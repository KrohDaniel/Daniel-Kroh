/* ================================================
   KONTAKT PAGE — Animations & Form
   ================================================ */

(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // ---- LENIS SMOOTH SCROLL ----
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ---- HERO ENTRANCE ----
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .from(".kontakt-hero .section-label", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
    })
    .from(
      ".kontakt-hero-heading",
      { opacity: 0, y: 40, duration: 0.9, ease: "power3.out" },
      "-=0.3"
    )
    .from(
      ".kontakt-hero-sub",
      { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" },
      "-=0.5"
    );

  // ---- FADE-UP ELEMENTS ----
  document.querySelectorAll('[data-anim="fade-up"]').forEach(function (el) {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // ---- SUCCESS STATE (URL param) ----
  var params = new URLSearchParams(window.location.search);
  if (params.get("success") === "true") {
    var form = document.getElementById("kontakt-form");
    var success = document.getElementById("form-success");
    if (form && success) {
      form.style.display = "none";
      success.classList.add("is-visible");
    }
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();
