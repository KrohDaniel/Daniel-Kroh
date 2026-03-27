/* ================================================
   LEISTUNGEN & PREISE — Scroll Animations
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
  function animateHero() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(".lp-hero .section-label", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
    })
      .from(
        ".lp-hero-heading",
        { opacity: 0, y: 40, duration: 0.9, ease: "power3.out" },
        "-=0.3"
      )
      .from(
        ".lp-hero-sub",
        { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );
  }

  // ---- STAGGER CARDS (services + pricing) ----
  function initStaggerCards() {
    // Service cards
    const serviceCards = document.querySelectorAll(
      '.services-grid .service-card[data-anim="stagger"]'
    );
    if (serviceCards.length) {
      gsap.to(serviceCards, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // Pricing cards
    const pricingCards = document.querySelectorAll(
      '.pricing-grid .pricing-card[data-anim="stagger"]'
    );
    if (pricingCards.length) {
      gsap.to(pricingCards, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pricing-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }

  // ---- SECTION HEADINGS ----
  function initSectionHeadings() {
    document.querySelectorAll(".lp-section:not(.lp-cta-section)").forEach((section) => {
      const headingEls = section.querySelectorAll(
        ".section-label, .lp-heading"
      );

      if (headingEls.length) {
        gsap.from(headingEls, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      }
    });
  }

  // ---- VALUE CARD ----
  function initValueCard() {
    const card = document.querySelector(".lp-value-card");
    if (!card) return;

    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // ---- FAQ ITEMS ----
  function initFaqItems() {
    const items = document.querySelectorAll('.faq-item[data-anim="faq"]');
    if (!items.length) return;

    gsap.from(items, {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".faq-list",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // ---- CTA SECTION ----
  function initCta() {
    const cta = document.querySelector(".lp-cta-inner");
    if (!cta) return;

    const children = cta.querySelectorAll(
      ".section-label, .lp-heading, .lp-cta-body, .cta-button"
    );

    gsap.fromTo(children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cta,
          start: "top 100%",
          toggleActions: "play none none none",
        },
      }
    );
  }

  // ---- PRICING COUNTER ANIMATION ----
  function initPricingCounters() {
    document.querySelectorAll(".pricing-amount").forEach((el) => {
      const raw = el.textContent.replace(/\./g, "");
      const target = parseInt(raw);
      if (isNaN(target)) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el.closest(".pricing-card"),
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          const v = Math.round(obj.val);
          el.textContent = v >= 1000 ? v.toLocaleString("de-DE") : v;
        },
      });
    });
  }

  // ---- INIT ----
  animateHero();
  initSectionHeadings();
  initStaggerCards();
  initValueCard();
  initFaqItems();
  initCta();
  initPricingCounters();
})();
