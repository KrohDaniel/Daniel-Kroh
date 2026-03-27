/* ================================================
   ABOUT PAGE — Scroll Animations
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
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(".about-hero-text", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    })
      .to(
        ".about-hero-portrait",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.7"
      )
      .to(
        ".about-hero .scroll-indicator",
        {
          opacity: 1,
          duration: 0.6,
        },
        "-=0.3"
      );
  }

  // ---- FADE-UP SECTIONS ----
  function initFadeUp() {
    document.querySelectorAll('[data-anim="fade-up"]').forEach((section) => {
      const children = section.querySelectorAll(
        ".section-label, .about-heading, .about-body, .cta-button"
      );

      gsap.fromTo(children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  // ---- SLIDE-UP SECTIONS ----
  function initSlideUp() {
    document.querySelectorAll('[data-anim="slide-up"]').forEach((section) => {
      const image = section.querySelector(".workspace-image");
      const caption = section.querySelector(".workspace-caption");
      const captionChildren = caption
        ? caption.querySelectorAll(".section-label, .about-heading, .about-body")
        : [];

      if (image) {
        gsap.to(image, {
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (captionChildren.length) {
        gsap.from(captionChildren, {
          y: 40,
          opacity: 0,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });
  }

  // ---- SKILL CARDS STAGGER ----
  function initSkillCards() {
    document.querySelectorAll('[data-anim="stagger"]').forEach((section) => {
      const cards = section.querySelectorAll(".skill-card");
      const heading = section.querySelectorAll(
        ".section-label, .about-heading"
      );

      gsap.from(heading, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector(".skills-grid"),
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  // ---- TIMELINE ITEMS ----
  function initTimeline() {
    document.querySelectorAll('[data-anim="timeline"]').forEach((section) => {
      const heading = section.querySelectorAll(
        ".section-label, .about-heading"
      );
      const items = section.querySelectorAll(".timeline-item");

      gsap.from(heading, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      items.forEach((item, i) => {
        const side = item.dataset.side;
        const fromX = side === "left" ? -40 : 40;

        gsap.to(item, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(item, {
          x: fromX,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });
  }

  // ---- PARALLAX on workspace image ----
  function initParallax() {
    const wrap = document.querySelector(".workspace-image-wrap");
    const img = document.querySelector(".workspace-image");
    if (!wrap || !img) return;

    gsap.to(img, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // ---- INIT ----
  animateHero();
  initFadeUp();
  initSlideUp();
  initSkillCards();
  initTimeline();
  initParallax();
})();
