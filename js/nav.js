/* Mobile Navigation Toggle */
(function () {
  "use strict";

  const burger = document.querySelector(".nav-burger");
  const mobileNav = document.getElementById("mobile-nav");
  if (!burger || !mobileNav) return;

  function toggle() {
    const isOpen = burger.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  burger.addEventListener("click", toggle);

  // Close on link click
  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileNav.classList.contains("is-open")) toggle();
    });
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) toggle();
  });
})();

/* Scroll Progress Bar */
(function () {
  "use strict";
  var bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + "%";
  }, { passive: true });
})();
