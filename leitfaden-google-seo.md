# Google SEO-Leitfaden — Checkliste für Projekte & Kunden

> Basierend auf dem offiziellen Google SEO-Startleitfaden, Crawling & Indexierung, Appearance-Guide und Best Practices.
> Stand: April 2026

---

## 1. Technische Grundlagen

### 1.1 Head-Bereich (jede HTML-Seite)

```html
<!-- Sprache setzen -->
<html lang="de">

<!-- Zeichensatz & Viewport -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Einzigartiger Title (max. 60 Zeichen) -->
<title>Hauptkeyword — Markenname | Kurzbeschreibung</title>

<!-- Meta Description (max. 155 Zeichen, mit CTA) -->
<meta name="description" content="Beschreibung mit Hauptkeyword und Handlungsaufforderung.">

<!-- Canonical Tag (auf JEDER Seite) -->
<link rel="canonical" href="https://domain.de/seite.html">

<!-- Favicon-Set -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
<link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
<link rel="manifest" href="/favicon/site.webmanifest">
```

**Warum:** Google zeigt Title und Description als Snippet in den Suchergebnissen. Canonical verhindert Duplicate Content. Favicons erscheinen neben dem Suchergebnis.

### 1.2 robots.txt

Im Root-Verzeichnis anlegen:

```
User-agent: *
Allow: /
Sitemap: https://domain.de/sitemap.xml
```

**Wichtig:**
- CSS und JS niemals blockieren — Google muss die Seite rendern können
- Sensible Bereiche (z.B. `/admin/`) mit `Disallow` ausschließen
- Nach dem Deployment prüfen: `https://domain.de/robots.txt`

### 1.3 XML-Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domain.de/</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Weitere Seiten... -->
</urlset>
```

**Prioritäten-Empfehlung:**
| Seitentyp | Priority | Changefreq |
|-----------|----------|------------|
| Startseite | 1.0 | weekly |
| Leistungen / Services | 0.9 | monthly |
| Über uns / Kontakt | 0.8 | monthly |
| Blog-Beiträge | 0.7 | monthly |
| Termin / Buchung | 0.7 | monthly |
| Impressum / Datenschutz / AGB | 0.3 | yearly |

**Nach Deployment:** Sitemap in Google Search Console einreichen unter *Sitemaps > Neue Sitemap hinzufügen*.

### 1.4 Google Search Console einrichten

1. Property hinzufügen unter [search.google.com/search-console](https://search.google.com/search-console)
2. Verifizierung über DNS-TXT-Record (empfohlen) oder HTML-Meta-Tag
3. Sitemap einreichen
4. Leistungsbericht nach 2–4 Wochen prüfen

---

## 2. Seitenstruktur & URLs

### 2.1 URL-Struktur

**Gut:**
```
/leistungen.html
/kontakt.html
/blog/webdesign-paderborn.html
```

**Schlecht:**
```
/page1.html
/p?id=42
/leistungen/webdesign/unterseite/details/mehr.html
```

**Regeln:**
- Beschreibende Wörter, keine IDs oder Zahlen
- Bindestriche statt Unterstriche
- Kurz halten (max. 3 Verzeichnisebenen)
- Kleinbuchstaben verwenden
- Keine Sonderzeichen oder Umlaute in URLs

### 2.2 Seitenstruktur

Jede Website braucht mindestens:

```
/ (Startseite)
├── /leistungen.html (oder /services.html)
├── /about.html (Über uns / Über mich)
├── /kontakt.html
├── /impressum.html (Pflicht in DE)
├── /datenschutz.html (Pflicht in DE)
└── /agb.html (empfohlen)
```

---

## 3. On-Page SEO

### 3.1 Überschriften-Hierarchie

```html
<h1>Hauptüberschrift mit Keyword (1x pro Seite)</h1>
  <h2>Abschnittsüberschrift</h2>
    <h3>Unterabschnitt</h3>
  <h2>Nächster Abschnitt</h2>
```

**Regeln:**
- Nur **ein `<h1>`** pro Seite
- Logische Hierarchie einhalten (h1 > h2 > h3)
- Hauptkeyword im h1 unterbringen
- Keine Überschriften nur für Styling verwenden

### 3.2 Content-Qualität

**Google bewertet:**
- Einzigartigkeit: Kein kopierter oder generierter Standardtext
- Hilfsbereitschaft: Beantwortet der Inhalt die Frage des Nutzers?
- Vertrauenswürdigkeit: Echte Kontaktdaten, Impressum, Referenzen
- Aktualität: Regelmäßig aktualisierte Inhalte ranken besser

**Checkliste pro Seite:**
- [ ] Einzigartiger, selbst geschriebener Text
- [ ] Hauptkeyword in h1, erstem Absatz und Meta Description
- [ ] Nebenkeywords natürlich im Text verteilt
- [ ] Mindestens 300 Wörter auf Hauptseiten (Leistungen: 800+)
- [ ] Keine Keyword-Stuffing (liest sich natürlich)
- [ ] Klare CTA (Call-to-Action) auf jeder Seite

### 3.3 Interne Verlinkung

```html
<!-- Beschreibender Linktext (gut) -->
<a href="leistungen.html">Webdesign & SEO Leistungen ansehen</a>

<!-- Nichtssagend (schlecht) -->
<a href="leistungen.html">Hier klicken</a>
```

**Regeln:**
- Jede Seite sollte von mindestens 2–3 anderen Seiten verlinkt werden
- Beschreibende Ankertexte mit Keywords verwenden
- Footer-Navigation für wichtige Seiten nutzen
- Interne Links auf den wichtigsten Seiten (Leistungen, Kontakt) priorisieren

### 3.4 Externe Links

- Zu vertrauenswürdigen Quellen verlinken (z.B. offizielle Partnerseiten)
- `target="_blank" rel="noopener"` für externe Links verwenden
- Bei nutzergenierten Inhalten `rel="nofollow"` setzen

---

## 4. Bilder-Optimierung

### 4.1 Technische Anforderungen

```html
<img
  src="bild-beschreibung.jpg"
  alt="Beschreibender Alt-Text mit Keyword"
  width="800"
  height="450"
  loading="lazy"
/>
```

**Jedes Bild braucht:**
- [ ] `alt`-Text: Beschreibt das Bild und enthält Keyword (wenn passend)
- [ ] `width` und `height`: Verhindert Layout-Shift (CLS)
- [ ] `loading="lazy"`: Für Bilder unterhalb des sichtbaren Bereichs
- [ ] Komprimiertes Format: JPG für Fotos, PNG für Grafiken, WebP wenn möglich

### 4.2 Dateinamen

**Gut:** `webdesign-paderborn-portfolio.jpg`
**Schlecht:** `IMG_20260401_123456.jpg`

### 4.3 Komprimierung

Zielgrößen:
| Bildtyp | Maximale Dateigröße |
|---------|-------------------|
| Hero / Banner | 150–200 KB |
| Content-Bild | 80–120 KB |
| Thumbnail | 30–50 KB |
| Logo | 10–30 KB |

**macOS Komprimierung:**
```bash
sips -s format jpeg -s formatOptions 75 input.png --out output_opt.jpg
sips -Z 1200 output_opt.jpg  # Maximale Breite 1200px
```

---

## 5. Structured Data (Schema.org)

### 5.1 Lokales Unternehmen / Dienstleister

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://domain.de/#business",
      "name": "Firmenname — Beschreibung",
      "url": "https://domain.de",
      "logo": "https://domain.de/logo.png",
      "image": "https://domain.de/portrait.jpg",
      "description": "Kurzbeschreibung mit Keywords und Standort.",
      "telephone": "+49...",
      "email": "info@domain.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Straße Nr.",
        "addressLocality": "Stadt",
        "postalCode": "12345",
        "addressRegion": "Bundesland",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.0000,
        "longitude": 8.0000
      },
      "areaServed": [
        { "@type": "City", "name": "Stadt 1" },
        { "@type": "City", "name": "Stadt 2" }
      ],
      "serviceType": ["Dienstleistung 1", "Dienstleistung 2"],
      "priceRange": "€€",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.linkedin.com/in/...",
        "https://www.instagram.com/..."
      ]
    },
    {
      "@type": "Person",
      "@id": "https://domain.de/#person",
      "name": "Vor- und Nachname",
      "jobTitle": "Berufsbezeichnung",
      "url": "https://domain.de",
      "sameAs": ["LinkedIn-URL", "Instagram-URL"]
    },
    {
      "@type": "WebSite",
      "@id": "https://domain.de/#website",
      "name": "Firmenname",
      "url": "https://domain.de",
      "publisher": { "@id": "https://domain.de/#person" }
    }
  ]
}
```

**Nach Implementierung testen:** [Rich Results Test](https://search.google.com/test/rich-results)

### 5.2 Weitere Schema-Typen je nach Projekt

| Branche | Schema-Typ | Effekt |
|---------|------------|--------|
| Restaurant | `Restaurant` + `Menu` | Speisekarte in Suchergebnissen |
| Arztpraxis | `MedicalBusiness` | Öffnungszeiten, Fachgebiet |
| Handwerker | `HomeAndConstructionBusiness` | Servicegebiet, Bewertungen |
| Shop | `Product` + `Offer` | Preis, Verfügbarkeit |
| Blog | `Article` + `BreadcrumbList` | Rich Snippets mit Datum/Autor |
| FAQ-Seite | `FAQPage` | Akkordeon direkt in Google |
| Events | `Event` | Datum, Ort, Ticketpreis |

---

## 6. Performance & Core Web Vitals

### 6.1 Die drei Metriken

| Metrik | Gut | Beschreibung |
|--------|-----|-------------|
| LCP (Largest Contentful Paint) | < 2,5s | Ladezeit des größten sichtbaren Elements |
| INP (Interaction to Next Paint) | < 200ms | Reaktionszeit auf Nutzerinteraktion |
| CLS (Cumulative Layout Shift) | < 0,1 | Visuelle Stabilität (kein Springen) |

### 6.2 Maßnahmen

**LCP verbessern:**
- [ ] Bilder komprimieren (siehe Abschnitt 4)
- [ ] Google Fonts mit `preconnect` laden
- [ ] CSS/JS minimieren
- [ ] Scripts mit `defer` laden
- [ ] Hosting mit CDN verwenden (z.B. Vercel)

**CLS verbessern:**
- [ ] `width` und `height` auf allen `<img>` und `<video>`
- [ ] Web Fonts mit `font-display: swap`
- [ ] Keine dynamisch eingefügten Elemente über bestehendem Content

**INP verbessern:**
- [ ] Keine schweren JS-Berechnungen im Main Thread
- [ ] Event-Handler kurz halten
- [ ] Animationen via CSS/`transform` statt Layout-Triggern

### 6.3 Testen

- [PageSpeed Insights](https://pagespeed.web.dev/) — Detaillierte Analyse
- Chrome DevTools > Lighthouse — Lokaler Test
- Search Console > Core Web Vitals — Felddaten

---

## 7. DSGVO & Rechtliches (Deutschland)

### 7.1 Pflichtseiten

- [ ] **Impressum** — vollständige Anbieterkennzeichnung (§ 5 TMG)
- [ ] **Datenschutzerklärung** — alle Datenverarbeitungen auflisten
- [ ] **AGB** — empfohlen bei Dienstleistungen

### 7.2 Cookie-Banner

- [ ] Cookie-Banner vor Laden von Analytics/Tracking-Scripts
- [ ] Zwei Optionen: „Nur Essenzielle" und „Alle akzeptieren"
- [ ] Consent in `localStorage` speichern
- [ ] Analytics-Scripts erst nach Consent laden (`data-cookie-category="analytics"`)

### 7.3 Analytics

**Empfehlung:** Umami Analytics (selbst gehostet, DSGVO-konform, kein Cookie-Banner nötig für Basis-Tracking)

---

## 8. Google Search Console — Laufende Betreuung

### 8.1 Einrichtung (einmalig)

1. Property anlegen
2. DNS-TXT-Verifizierung (oder HTML-Meta-Tag)
3. Sitemap einreichen
4. 2–4 Wochen auf erste Daten warten

### 8.2 Monatliche Checks

- [ ] **Leistungsbericht** — Klicks, Impressionen, CTR, Position prüfen
- [ ] **Indexierung** — Alle Seiten indexiert? Fehler beheben
- [ ] **Core Web Vitals** — Probleme bei LCP, CLS, INP?
- [ ] **Sicherheitsprobleme** — Warnungen prüfen
- [ ] **Manuelle Maßnahmen** — Spam-Verstöße ausschließen

### 8.3 Bei Traffic-Einbrüchen

1. Zeitraum eingrenzen (wann genau der Rückgang)
2. Prüfen: Betrifft es die ganze Website oder einzelne Seiten?
3. Google Algo-Updates prüfen (Google Search Status Dashboard)
4. Technische Fehler ausschließen (Crawling, Indexierung)
5. Mit Google Trends vergleichen: Branchenweiter Trend oder eigenes Problem?

---

## 9. Checkliste — Neues Projekt aufsetzen

### Vor dem Start
- [ ] Domain registriert und SSL-Zertifikat aktiv (HTTPS)
- [ ] Hosting-Provider gewählt (Empfehlung: Vercel)
- [ ] Keyword-Recherche: 3–5 Hauptkeywords + Lokalbezug identifiziert

### Entwicklung
- [ ] `<html lang="de">` auf allen Seiten
- [ ] Einzigartiger `<title>` pro Seite (mit Keyword)
- [ ] `<meta name="description">` pro Seite (mit CTA)
- [ ] `<link rel="canonical">` pro Seite
- [ ] Nur ein `<h1>` pro Seite mit Hauptkeyword
- [ ] Logische Überschriften-Hierarchie (h1 > h2 > h3)
- [ ] Alle Bilder: `alt`, `width`, `height`, `loading="lazy"`
- [ ] Bilder komprimiert (JPG < 150KB, WebP bevorzugt)
- [ ] Beschreibende Dateinamen für Bilder
- [ ] Scripts mit `defer` laden
- [ ] Google Fonts mit `preconnect`
- [ ] Interne Verlinkung mit beschreibenden Ankertexten
- [ ] Externe Links mit `target="_blank" rel="noopener"`
- [ ] Favicon-Set vollständig
- [ ] Cookie-Banner (DSGVO)
- [ ] Impressum + Datenschutz + AGB

### Vor dem Launch
- [ ] `robots.txt` im Root
- [ ] `sitemap.xml` mit allen Seiten
- [ ] Schema.org JSON-LD im `<head>` der Startseite
- [ ] Rich Results Test bestanden
- [ ] PageSpeed Insights: Alle Metriken grün
- [ ] Mobile Ansicht auf echtem Gerät getestet
- [ ] Alle Links funktionieren (keine 404er)

### Nach dem Launch
- [ ] Google Search Console einrichten
- [ ] Sitemap einreichen
- [ ] Google Business Profil anlegen/aktualisieren
- [ ] Social Media Profile mit Website verlinken
- [ ] Erste Indexierung nach 2–4 Wochen prüfen
- [ ] Monatliche Search Console Checks einplanen

---

## 10. Was Google NICHT bewertet

Laut offiziellem Leitfaden sind folgende Punkte irrelevant oder unwirksam:

| Mythos | Realität |
|--------|---------|
| Meta-Keywords-Tag | Google ignoriert es komplett |
| Keywords im Domainnamen | Kaum Einfluss auf Ranking |
| Keyword-Dichte / Stuffing | Verstößt gegen Spamrichtlinien |
| Minimale / maximale Textlänge | Keine feste Vorgabe |
| Subdomain vs. Unterverzeichnis | Rein geschäftliche Entscheidung |
| Duplicate Content = Strafe | Keine Strafe, nur ineffizient |
| E-E-A-T ist ein Rankingfaktor | Nein, es ist ein Qualitätsrichtlinie |
| Überschriften-Reihenfolge | Semantisch ideal, aber kein Ranking-Signal |

---

> **Quelle:** [Google SEO-Startleitfaden](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=de), [Crawling & Indexierung](https://developers.google.com/search/docs/crawling-indexing?hl=de), [Darstellung in der Suche](https://developers.google.com/search/docs/appearance?hl=de), [Traffic-Debugging](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops?hl=de)
