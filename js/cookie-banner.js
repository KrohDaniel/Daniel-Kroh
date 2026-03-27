/* ================================================
   COOKIE CONSENT — DSGVO-konform
   Speichert Einwilligung in localStorage.
   Blockiert nicht-essenzielle Skripte bis Consent.
   ================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var CONSENT_VERSION = 1;

  function getConsent() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data && data.version === CONSENT_VERSION) return data;
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveConsent(level) {
    var data = {
      level: level,            // "all" oder "essential"
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /** Aktiviert Skripte mit data-cookie-category="analytics" */
  function activateOptionalScripts() {
    var scripts = document.querySelectorAll('script[data-cookie-category="analytics"]');
    scripts.forEach(function (el) {
      var s = document.createElement('script');
      if (el.src) s.src = el.src;
      if (el.textContent) s.textContent = el.textContent;
      s.type = 'text/javascript';
      el.parentNode.replaceChild(s, el);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('is-visible');
    banner.addEventListener('transitionend', function () {
      banner.remove();
    }, { once: true });
  }

  function init() {
    var consent = getConsent();

    // Consent bereits vorhanden
    if (consent) {
      if (consent.level === 'all') activateOptionalScripts();
      return;
    }

    // Banner ins DOM einfügen
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<div class="cookie-banner-text">' +
          '<p>Diese Website verwendet Cookies. Essenzielle Cookies sind für die Funktion der Seite notwendig. ' +
          'Analyse-Cookies helfen uns, die Website zu verbessern. ' +
          '<a href="datenschutz.html">Mehr erfahren</a></p>' +
        '</div>' +
        '<div class="cookie-banner-actions">' +
          '<button class="cookie-btn cookie-btn--essential" data-consent="essential">Nur Essenzielle</button>' +
          '<button class="cookie-btn cookie-btn--accept" data-consent="all">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    // Leicht verzögert einblenden für Transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('is-visible');
      });
    });

    // Event-Handler
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;

      var level = btn.getAttribute('data-consent');
      saveConsent(level);

      if (level === 'all') activateOptionalScripts();

      hideBanner(banner);
    });
  }

  // Starten wenn DOM bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
