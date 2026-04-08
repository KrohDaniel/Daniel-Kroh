# Daniel Kroh — Webdesign, SEO & KI-Lösungen

Persönliche Business-Website für Webdesign, SEO & KI-Automatisierung in Paderborn / OWL.
Gehostet auf **Vercel**, Domain über **Spaceship**.

**Live:** [kroh-daniel.de](https://kroh-daniel.de)

---

## Tech-Stack

- **Frontend:** Static HTML, CSS, Vanilla JS
- **Animationen:** GSAP + ScrollTrigger
- **Analytics:** Umami (DSGVO-konform)
- **Hosting:** Vercel
- **Fonts:** Google Fonts (Space Grotesk, Inter) — non-render-blocking

---

## Projektstruktur

```
Daniel-Kroh/
├── index.html              # Startseite
├── about.html              # Über mich
├── leistungen.html         # Leistungen & Preise
├── kontakt.html            # Kontaktformular
├── termin.html             # Terminbuchung (Cal.com)
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung
├── agb.html                # AGB
│
├── css/
│   ├── style.css           # Haupt-Styles + Header + Hero
│   ├── about.css           # About-Page spezifisch
│   ├── leistungen.css      # Leistungen-Page spezifisch
│   ├── kontakt.css         # Kontakt-Page spezifisch
│   ├── termin.css          # Termin-Page spezifisch
│   ├── legal.css           # Impressum/Datenschutz/AGB
│   └── cookie-banner.css   # Cookie-Consent-Banner
│
├── js/
│   ├── app.js              # Scroll-Reveal-Animationen (GSAP)
│   ├── nav.js              # Mobile Nav + Scroll Progress Bar
│   ├── config.js           # Globale Konfiguration
│   ├── cookie-banner.js    # DSGVO Consent Handling
│   ├── about.js            # About-Page Logik
│   ├── leistungen.js       # Leistungen-Page Logik
│   ├── kontakt.js          # Formular-Validierung
│   └── termin.js           # Termin-Page Logik
│
├── public/                 # Bilder (WebP optimiert)
│   ├── favicon/            # Favicon-Set
│   ├── *_opt.webp          # Komprimierte Bilder (WebP)
│   └── portrait_opt.webp   # Portrait
│
├── media/                  # Logos und Original-Assets
│   └── logo_transparent.png
│
├── robots.txt              # Crawler-Regeln
├── sitemap.xml             # XML-Sitemap (8 URLs)
├── vercel.json             # Vercel Deployment-Config
├── package.json            # NPM Dependencies (nodemailer)
├── leitfaden-google-seo.md # SEO-Checkliste für Projekte
└── README.md               # Dieses Dokument
```

---

## Lokale Entwicklung

### Server starten

```bash
# Option 1: Node-basiert
npx serve .

# Option 2: Python
python3 -m http.server 3000
```

Dann `http://localhost:3000` öffnen.

### Bilder komprimieren

```bash
# JPG -> WebP (beste Qualität/Größe)
npx cwebp-bin -q 80 input.jpg -o output.webp

# PNG -> komprimiertes JPG (Fallback)
sips -s format jpeg -s formatOptions 75 input.png --out output.jpg

# Bild verkleinern (max. 1200px Breite)
sips -Z 1200 image.jpg
```

### Bildgrößen prüfen

```bash
sips -g pixelWidth -g pixelHeight image.jpg
```

---

## Deployment

```bash
# Änderungen committen
git add .
git commit -m "..."
git push origin main
```

Vercel deployed automatisch bei Push auf `main`.

---

## SEO-Setup

Siehe [leitfaden-google-seo.md](leitfaden-google-seo.md) für die komplette Checkliste.

**Implementiert:**
- `<title>`, `<meta description>`, `<link rel="canonical">` auf allen Seiten
- Open Graph Tags (Social Sharing)
- Schema.org JSON-LD (ProfessionalService, Person, WebSite) in `index.html`
- `robots.txt` + `sitemap.xml`
- Core Web Vitals: alle Bilder mit `width`/`height`/`loading="lazy"`
- Non-render-blocking Google Fonts (`media="print" onload`)
- WebP-Bilder für schnelles Laden

**Google Search Console:** Sitemap eingereicht, 8 Seiten indexiert.

---

## Wichtige Konfigurationen

### Umami Analytics

Auf allen Seiten im `<head>`:
```html
<script defer src="https://cloud.umami.is/script.js"
        data-website-id="b5acfa81-7a81-4a46-b56d-cf7454781f12"></script>
```

### Schema.org (index.html)

Lokale Unternehmen mit Adresse, Öffnungszeiten, Servicegebiet (Paderborn, Bad Lippspringe, Bielefeld, Detmold, Gütersloh).

### Farbpalette (CSS Variables)

```css
--bg-dark: #0a0e1a       /* Hauptbackground */
--bg-navy: #0d1527       /* Sections alt */
--cyan: #00d4ff          /* Akzent primär */
--amber: #f5a623         /* Akzent sekundär */
--text-light: #e8ecf4    /* Haupttext */
--text-muted: #8892a8    /* Sekundärtext */
```

---

## Testen

### PageSpeed Insights
[pagespeed.web.dev](https://pagespeed.web.dev/) — Performance, Accessibility, Best Practices, SEO

### Rich Results Test
[search.google.com/test/rich-results](https://search.google.com/test/rich-results) — Schema.org Validierung

### Google Search Console
[search.google.com/search-console](https://search.google.com/search-console) — Indexierung & Crawling

---

## Kontakt

**Daniel Kroh**
Bad Lippspringe, NRW
info@kroh-daniel.de
[LinkedIn](https://www.linkedin.com/in/daniel-kroh-098047333/) · [Instagram](https://www.instagram.com/daniel_kroh_/)
