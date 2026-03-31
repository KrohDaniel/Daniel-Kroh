/* ================================================
   DANIEL KROH — Scroll-Driven App
   ================================================ */

(function () {
  "use strict";

  const FRAME_COUNT = 248;
  const FRAME_SPEED = 1.0;
  const IMAGE_SCALE = 1.0;

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const canvasWrap = document.getElementById("canvas-wrap");
  const scrollContainer = document.getElementById("scroll-container");
  const heroSection = document.getElementById("hero");
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  const loaderPercent = document.getElementById("loader-percent");
  const darkOverlay = document.getElementById("dark-overlay");

  const frames = new Array(FRAME_COUNT);
  let currentFrame = 0;
  let bgColor = "#0a0e1a";
  let allLoaded = false;

  // ---- CANVAS SIZING ----
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
    if (frames[currentFrame]) drawFrame(currentFrame);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // ---- FRAME PATH ----
  function framePath(i) {
    const num = String(i + 1).padStart(4, "0");
    return `frames/frame_${num}.jpg`;
  }

  // ---- BG COLOR SAMPLING ----
  function sampleBgColor(img) {
    const tmp = document.createElement("canvas");
    tmp.width = img.naturalWidth;
    tmp.height = img.naturalHeight;
    const tCtx = tmp.getContext("2d");
    tCtx.drawImage(img, 0, 0);
    const corners = [
      tCtx.getImageData(2, 2, 1, 1).data,
      tCtx.getImageData(img.naturalWidth - 3, 2, 1, 1).data,
      tCtx.getImageData(2, img.naturalHeight - 3, 1, 1).data,
      tCtx.getImageData(img.naturalWidth - 3, img.naturalHeight - 3, 1, 1).data,
    ];
    let r = 0, g = 0, b = 0;
    corners.forEach((c) => { r += c[0]; g += c[1]; b += c[2]; });
    r = Math.round(r / 4);
    g = Math.round(g / 4);
    b = Math.round(b / 4);
    bgColor = `rgb(${r},${g},${b})`;
  }

  // ---- DRAW FRAME ----
  function drawFrame(index) {
    const img = frames[index];
    if (!img) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ---- PRELOADER (FAST-START) ----
  // Loads first 10 frames, then resolves immediately so the page
  // becomes interactive. Remaining frames load in the background.
  function loadFrames() {
    return new Promise((resolve) => {
      let loaded = 0;
      const CRITICAL = Math.min(10, FRAME_COUNT);

      function updateProgress() {
        const pct = Math.round((loaded / FRAME_COUNT) * 100);
        loaderBar.style.width = pct + "%";
        loaderPercent.textContent = pct + "%";
      }

      function loadFrame(i) {
        return new Promise((res) => {
          const img = new Image();
          img.onload = () => {
            frames[i] = img;
            loaded++;
            updateProgress();
            if (i % 20 === 0) sampleBgColor(img);
            res();
          };
          img.onerror = () => {
            loaded++;
            updateProgress();
            res();
          };
          img.src = framePath(i);
        });
      }

      // Phase 1: load critical frames, then show the page
      const phase1 = [];
      for (let i = 0; i < CRITICAL; i++) {
        phase1.push(loadFrame(i));
      }

      Promise.all(phase1).then(() => {
        drawFrame(0);
        // Resolve immediately — page becomes interactive now
        resolve();

        // Phase 2: load remaining frames in background batches
        let queue = [];
        for (let i = CRITICAL; i < FRAME_COUNT; i++) {
          queue.push(i);
        }

        function loadBatch() {
          if (queue.length === 0) {
            allLoaded = true;
            return;
          }
          const batch = queue.splice(0, 15);
          Promise.all(batch.map(loadFrame)).then(loadBatch);
        }

        loadBatch();
      });
    });
  }

  // ---- LENIS SMOOTH SCROLL ----
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ---- HERO ANIMATION ----
  function animateHero() {
    const words = heroSection.querySelectorAll(".hero-heading span");
    const tagline = heroSection.querySelector(".hero-tagline");
    const heroCta = heroSection.querySelector(".hero-cta");
    const label = heroSection.querySelector(".section-label");
    const indicator = heroSection.querySelector(".scroll-indicator");

    gsap.to(label, { opacity: 1, duration: 0.6, delay: 0.3 });
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.5,
    });
    gsap.to(tagline, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.1 });
    if (heroCta) gsap.to(heroCta, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.4 });
    gsap.to(indicator, { opacity: 1, duration: 0.6, delay: 1.8 });
  }

  // ---- CIRCLE-WIPE HERO REVEAL ----
  function initHeroTransition() {
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Hero fades out
        heroSection.style.opacity = Math.max(0, 1 - p * 15);
        // Canvas reveals via expanding circle
        const wipeProgress = Math.min(1, Math.max(0, (p - 0.01) / 0.06));
        const radius = wipeProgress * 75;
        canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
      },
    });
  }

  // ---- FRAME-TO-SCROLL BINDING ----
  function initFrameScroll() {
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
        const index = Math.min(
          Math.floor(accelerated * FRAME_COUNT),
          FRAME_COUNT - 1
        );
        if (index !== currentFrame) {
          currentFrame = index;
          requestAnimationFrame(() => drawFrame(currentFrame));
        }
      },
    });
  }

  // ---- SECTION ANIMATIONS ----
  function positionSections() {
    const sections = document.querySelectorAll(".scroll-section");
    const containerHeight = scrollContainer.offsetHeight;

    sections.forEach((section) => {
      const enter = parseFloat(section.dataset.enter) / 100;
      const leave = parseFloat(section.dataset.leave) / 100;
      const mid = (enter + leave) / 2;
      section.style.top = mid * containerHeight + "px";
      section.style.transform = "translateY(-50%)";
    });
  }

  function setupSectionAnimation(section) {
    const type = section.dataset.animation;
    const persist = section.dataset.persist === "true";
    const enter = parseFloat(section.dataset.enter) / 100;
    const leave = parseFloat(section.dataset.leave) / 100;
    const children = section.querySelectorAll(
      ".section-label, .section-heading, .section-body, .section-note, .cta-button, .stat"
    );

    const tl = gsap.timeline({ paused: true });

    switch (type) {
      case "fade-up":
        tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-left":
        tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-right":
        tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "scale-up":
        tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" });
        break;
      case "rotate-in":
        tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" });
        break;
      case "stagger-up":
        tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        break;
      case "clip-reveal":
        tl.from(children, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" });
        break;
    }

    let wasVisible = false;
    const fadeRange = 0.03; // 3% scroll range for fade in/out

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const inRange = p >= enter && p <= leave;
        const pastLeave = p > leave;

        if (inRange && !wasVisible) {
          section.classList.add("is-visible");
          tl.play();
          wasVisible = true;
        } else if (!inRange && wasVisible) {
          if (persist && pastLeave) {
            // Keep visible
          } else {
            section.classList.remove("is-visible");
            tl.reverse();
            wasVisible = false;
          }
        }

        // Smooth opacity fade at edges
        if (wasVisible || inRange) {
          let opacity = 1;
          if (p < enter + fadeRange) {
            opacity = Math.max(0, (p - enter) / fadeRange);
          } else if (p > leave - fadeRange && !persist) {
            opacity = Math.max(0, (leave - p) / fadeRange);
          }
          section.style.opacity = opacity;
        }
      },
    });
  }

  function initSections() {
    positionSections();
    document.querySelectorAll(".scroll-section").forEach(setupSectionAnimation);
  }

  // ---- COUNTER ANIMATIONS ----
  function initCounters() {
    document.querySelectorAll(".stat-number").forEach((el) => {
      const target = parseFloat(el.dataset.value);
      const decimals = parseInt(el.dataset.decimals || "0");
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const statsSection = el.closest(".scroll-section");
          const enter = parseFloat(statsSection.dataset.enter) / 100;
          const leave = parseFloat(statsSection.dataset.leave) / 100;
          const p = self.progress;

          if (p >= enter && p <= leave) {
            const sectionProgress = Math.min(1, (p - enter) / ((leave - enter) * 0.6));
            const easedProgress = 1 - Math.pow(1 - sectionProgress, 3);
            const val = target * easedProgress;
            el.textContent = val.toFixed(decimals);
          }
        },
      });
    });
  }

  // ---- MARQUEE ----
  function initMarquees() {
    document.querySelectorAll(".marquee-wrap").forEach((el) => {
      const speed = parseFloat(el.dataset.scrollSpeed) || -25;
      const enterP = parseFloat(el.dataset.enter) / 100;
      const leaveP = parseFloat(el.dataset.leave) / 100;
      const fadeRange = 0.04;

      gsap.to(el.querySelector(".marquee-text"), {
        xPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          let opacity = 0;
          if (p >= enterP - fadeRange && p < enterP) {
            opacity = (p - (enterP - fadeRange)) / fadeRange;
          } else if (p >= enterP && p <= leaveP) {
            opacity = 1;
          } else if (p > leaveP && p <= leaveP + fadeRange) {
            opacity = 1 - (p - leaveP) / fadeRange;
          }
          el.style.opacity = opacity;
        },
      });
    });
  }

  // ---- DARK OVERLAY ----
  function initDarkOverlay() {
    const enter = 0.44;
    const leave = 0.65;
    const fadeRange = 0.04;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        let opacity = 0;
        if (p >= enter - fadeRange && p < enter) {
          opacity = 0.9 * ((p - (enter - fadeRange)) / fadeRange);
        } else if (p >= enter && p < leave) {
          opacity = 0.9;
        } else if (p >= leave && p <= leave + fadeRange) {
          opacity = 0.9 * (1 - (p - leave) / fadeRange);
        }
        darkOverlay.style.opacity = opacity;
      },
    });
  }

  // ---- STATIC SECTION ANIMATIONS ----
  function initStaticSections() {
    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? 30 : 50;
    const stagger = isMobile ? 0.08 : 0.12;
    const duration = isMobile ? 0.7 : 0.9;

    // Slide-left elements (text blocks)
    document.querySelectorAll('[data-static-anim="slide-left"]').forEach((el) => {
      const children = el.querySelectorAll(
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

    // Slide-right elements (images + text blocks on right)
    document.querySelectorAll('[data-static-anim="slide-right"]').forEach((el) => {
      const children = el.querySelectorAll(
        ".section-label, .static-heading, .static-body, .static-list, .static-link, .cta-button, .location-highlights, .trust-metrics"
      );

      // If it contains text children, animate them individually
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
        // Image container — simple fade up
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
    document.querySelectorAll('.trust-metric[data-static-anim="counter"]').forEach((el) => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const valueEl = el.querySelector(".trust-metric-value");

      if (isNaN(target)) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          valueEl.textContent = Math.round(obj.val) + suffix;
        },
      });
    });
  }

  // ---- INIT ----
  async function init() {
    gsap.registerPlugin(ScrollTrigger);
    await loadFrames();

    // Hide loader
    loader.classList.add("loaded");

    // Start hero animation
    animateHero();

    // Init scroll systems
    initHeroTransition();
    initFrameScroll();
    initSections();
    initCounters();
    initMarquees();
    initDarkOverlay();
    initStaticSections();

    // Recalc on resize
    window.addEventListener("resize", () => {
      positionSections();
      ScrollTrigger.refresh();
    });
  }

  init();
})();
