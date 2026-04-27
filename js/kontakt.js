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

  // ---- SUCCESS OVERLAY ----
  const form = document.getElementById("kontakt-form");
  const overlay = document.getElementById("success-overlay");
  const closeBtn = document.getElementById("success-close");
  const closeBtnAlt = document.getElementById("success-close-btn");

  function showSuccessOverlay() {
    if (overlay) {
      overlay.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    }
  }

  function hideSuccessOverlay() {
    if (overlay) {
      overlay.classList.remove("is-visible");
      document.body.style.overflow = "";
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", hideSuccessOverlay);
  if (closeBtnAlt) closeBtnAlt.addEventListener("click", hideSuccessOverlay);
  if (overlay) {
    overlay.querySelector(".success-overlay-backdrop").addEventListener("click", hideSuccessOverlay);
  }

  // ---- TURNSTILE WIDGET (explicit render with site key from /api/config) ----
  let turnstileWidgetId = null;
  let turnstileApiReady = false;
  let turnstileSiteKey = null;

  const submitBtnEl = form ? form.querySelector(".form-submit") : null;
  const submitTextEl = form ? form.querySelector(".form-submit-text") : null;
  const originalSubmitText = submitTextEl ? submitTextEl.textContent : "Nachricht senden";

  function setSubmitDisabled(disabled, label) {
    if (!submitBtnEl) return;
    submitBtnEl.disabled = disabled;
    if (submitTextEl && label) submitTextEl.textContent = label;
  }

  // Disable submit until widget is ready
  setSubmitDisabled(true, "Lade Bot-Schutz...");

  function tryRenderTurnstile() {
    if (!turnstileApiReady || !turnstileSiteKey) return;
    const container = document.getElementById("turnstile-widget");
    if (!container || !window.turnstile) return;
    if (turnstileWidgetId !== null) return;
    turnstileWidgetId = window.turnstile.render(container, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      callback: function () {
        setSubmitDisabled(false, originalSubmitText);
      },
      "expired-callback": function () {
        setSubmitDisabled(true, "Bot-Schutz erneuern");
      },
      "error-callback": function () {
        setSubmitDisabled(true, "Bot-Schutz Fehler");
      },
    });
  }

  // Cloudflare's api.js calls this once it's loaded
  window.onTurnstileReady = function () {
    turnstileApiReady = true;
    tryRenderTurnstile();
  };

  // Fetch the site key from our API
  fetch("/api/config")
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (!cfg || !cfg.turnstileSiteKey) {
        setSubmitDisabled(true, "Konfiguration fehlt");
        console.error("TURNSTILE_SITE_KEY env variable is not set on the server.");
        return;
      }
      turnstileSiteKey = cfg.turnstileSiteKey;
      tryRenderTurnstile();
    })
    .catch(function (err) {
      console.error("Config load failed:", err);
      setSubmitDisabled(true, "Verbindungsfehler");
    });

  function resetTurnstileWidget() {
    if (window.turnstile && turnstileWidgetId !== null) {
      window.turnstile.reset(turnstileWidgetId);
      setSubmitDisabled(true, originalSubmitText);
    }
  }

  // ---- FORM SUBMISSION ----
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Honeypot check (frontend — silent reject for bots)
      const honey = form.querySelector('[name="_honey"]');
      const honeyWebsite = form.querySelector('[name="website"]');
      if ((honey && honey.value) || (honeyWebsite && honeyWebsite.value)) return;

      const submitBtn = form.querySelector(".form-submit");
      const submitText = form.querySelector(".form-submit-text");
      const originalText = submitText ? submitText.textContent : "";

      // Cloudflare Turnstile token
      const turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
      if (!turnstileToken || !turnstileToken.value) {
        alert("Bitte bestätigen Sie, dass Sie kein Roboter sind.");
        return;
      }

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
        turnstileToken: turnstileToken.value,
        website: honeyWebsite ? honeyWebsite.value : "",
        _honey: honey ? honey.value : "",
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          form.reset();
          resetTurnstileWidget();
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
          showSuccessOverlay();
        } else {
          const data = await res.json().catch(function () { return {}; });
          alert(data.error || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
          resetTurnstileWidget();
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }
      } catch (err) {
        alert("Verbindungsfehler. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@kroh-daniel.de");
        if (window.turnstile) window.turnstile.reset();
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = originalText;
      }
    });
  }
})();
