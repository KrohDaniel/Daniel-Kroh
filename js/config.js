/**
 * Zentrale Kontakt- & Social-Media-Daten
 * Hier einmal pflegen — wird überall auf der Seite verwendet.
 */
const CONFIG = {
  // Persönliche Daten
  name: "Daniel Kroh",
  company: "Data & AI Solutions",

  // Anschrift
  street: "Musterstraße 1",       // TODO: echte Adresse eintragen
  zip: "33100",                    // TODO: echte PLZ eintragen
  city: "Paderborn",

  // Kontaktdaten
  email: "info@kroh-daniel.de",
  phone: "+49 176 41045997",
  phoneDisplay: "0176 410 45 997",

  // Rechtliches / Impressum
  vatId: "DE XXXXXXXXX",           // TODO: Umsatzsteuer-ID eintragen

  // Social Media
  instagram: "https://www.instagram.com/daniel_kroh_/",
  linkedin: "https://www.linkedin.com/in/daniel-kroh-098047333/",

  // Weitere Profile
  github: "https://github.com/KrohDaniel",
  twitter: "https://x.com/daniel_kroh",
  website: "https://kroh-daniel.de",
};

/** Automatisch alle Links auf der Seite aus CONFIG befüllen */
document.addEventListener("DOMContentLoaded", () => {
  // Footer & Kontakt: mailto-Links
  document.querySelectorAll('a[href*="mailto:"]').forEach((a) => {
    a.href = `mailto:${CONFIG.email}`;
    const text = a.childNodes;
    for (const node of text) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent = `\n          ${CONFIG.email}\n        `;
      }
    }
    // Kontakt-Seite: .kontakt-channel-value
    const val = a.querySelector(".kontakt-channel-value");
    if (val) val.textContent = CONFIG.email;
  });

  // Footer & Kontakt: tel-Links
  document.querySelectorAll('a[href*="tel:"]').forEach((a) => {
    a.href = `tel:${CONFIG.phone.replace(/\s/g, "")}`;
    const text = a.childNodes;
    for (const node of text) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent = `\n          ${CONFIG.phoneDisplay}\n        `;
      }
    }
    const val = a.querySelector(".kontakt-channel-value");
    if (val) val.textContent = CONFIG.phoneDisplay;
  });

  // Footer Social Links
  document.querySelectorAll('.footer-social-link[aria-label="LinkedIn"]').forEach((a) => {
    a.href = CONFIG.linkedin;
  });
  document.querySelectorAll('.footer-social-link[aria-label="Instagram"]').forEach((a) => {
    a.href = CONFIG.instagram;
  });

  // Impressum & Datenschutz: data-config Felder
  const addr = document.querySelector('[data-config="address"]');
  if (addr) {
    addr.innerHTML = `${CONFIG.name}<br>${CONFIG.company}<br>${CONFIG.street}<br>${CONFIG.zip} ${CONFIG.city}`;
  }

  const contact = document.querySelector('[data-config="contact"]');
  if (contact) {
    contact.innerHTML = `Telefon: ${CONFIG.phoneDisplay}<br>E-Mail: ${CONFIG.email}`;
  }

  const vat = document.querySelector('[data-config="vat"]');
  if (vat) {
    vat.innerHTML = `Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>${CONFIG.vatId}`;
  }

  const responsible = document.querySelector('[data-config="responsible"]');
  if (responsible) {
    responsible.innerHTML = `${CONFIG.name}<br>${CONFIG.street}<br>${CONFIG.zip} ${CONFIG.city}`;
  }

  const responsibleFull = document.querySelector('[data-config="responsible-full"]');
  if (responsibleFull) {
    responsibleFull.innerHTML = `${CONFIG.name}<br>${CONFIG.company}<br>${CONFIG.street}<br>${CONFIG.zip} ${CONFIG.city}<br>E-Mail: ${CONFIG.email}<br>Telefon: ${CONFIG.phoneDisplay}`;
  }
});
