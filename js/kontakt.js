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

  // ---- FORM SUBMISSION ----
  const form = document.getElementById("kontakt-form");
  const successEl = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Honeypot check
      const honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      const submitBtn = form.querySelector(".form-submit");
      const submitText = form.querySelector(".form-submit-text");
      const originalText = submitText ? submitText.textContent : "";

      // Loading state
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Wird gesendet...";

      // Collect checked interests
      const checked = Array.from(form.querySelectorAll('input[name="interesse"]:checked'));
      const interesse = checked.map(function (cb) { return cb.value; });

      const payload = {
        name: form.querySelector("#name").value,
        email: form.querySelector("#email").value,
        phone: form.querySelector("#phone").value,
        interesse: interesse,
        message: form.querySelector("#message").value,
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          form.style.display = "none";
          if (successEl) successEl.classList.add("is-visible");
        } else {
          const data = await res.json().catch(function () { return {}; });
          alert(data.error || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }
      } catch (err) {
        alert("Verbindungsfehler. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@kroh-daniel.de");
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = originalText;
      }
    });
  }

  // ---- SUCCESS STATE (URL param fallback) ----
  var params = new URLSearchParams(window.location.search);
  if (params.get("success") === "true") {
    if (form && successEl) {
      form.style.display = "none";
      successEl.classList.add("is-visible");
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();
