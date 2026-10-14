# GEO Audit Report: kroh-daniel.de

**Audit-Datum:** 14.10.2026
**URL:** https://kroh-daniel.de
**Geschäftstyp:** Agency/Services (Einzelunternehmer, lokal OWL + remote)
**Analysierte Seiten:** 13 (9 indexierbare Seiten, 3 Demo-Kopien, Visitenkarte)

---

## Executive Summary

**GEO-Score vorher: ~51/100 (Poor), nach Umsetzung: ~64/100 (Fair)**

Die Grundlage war solide: statisches HTML (kein JS-Rendering-Problem), alle Crawler erlaubt, eine llms.txt und eine FAQ mit klaren Antworten. Drei Schwächen haben KI-Systeme aber aktiv in die Irre geführt: Die Canonicals zeigten auf umgeleitete URLs, für Crawler ohne JavaScript stand im Impressum eine Platzhalter-Adresse, und interne Dokumente wie die README mit der alten „Webdesign“-Positionierung waren öffentlich abrufbar. Diese technischen Punkte sind jetzt behoben. Der größte verbleibende Hebel ist die **Markenautorität außerhalb der Website**.

### Score-Aufschlüsselung

| Kategorie | Vorher | Nachher | Gewicht | Gewichtet (nachher) |
|---|---|---|---|---|
| AI Citability | 55 | 70 | 25 % | 17,5 |
| Brand Authority | 30 | 30 | 20 % | 6,0 |
| Content E-E-A-T | 60 | 68 | 20 % | 13,6 |
| Technical GEO | 62 | 88 | 15 % | 13,2 |
| Schema & Structured Data | 60 | 88 | 10 % | 8,8 |
| Platform Optimization | 40 | 50 | 10 % | 5,0 |
| **Gesamt** | **~51** | | | **~64** |

*Die Scores sind Einschätzungen nach der Methodik des Audit-Skills und keine gemessenen Werte von KI-Plattformen.*

---

## Kritisch: behoben

1. **Falsche Adresse für KI-Crawler.** Impressum und Datenschutz enthielten im HTML „Musterstraße 1, 33100 Paderborn“ und „DE [wird nachgetragen]“. Die echten Daten wurden erst per JavaScript (`js/config.js`) eingesetzt. GPTBot, ClaudeBot und PerplexityBot führen kein JS aus. → Echte Anschrift jetzt statisch im HTML, Schema enthält dieselbe Adresse (NAP-Konsistenz).
2. **Canonicals auf Weiterleitungen.** `cleanUrls: true` leitet `/about.html` per 308 auf `/about` um, Canonical, `og:url`, Sitemap, Schema und llms.txt zeigten aber auf `.html`. → Überall auf Clean URLs umgestellt.

## Hoch: behoben

3. **Interne Dateien öffentlich.** `README.md` (alte Positionierung „Webdesign, SEO & KI“), `leitfaden-google-seo.md` und `agent-config/hormozi-audit-agent.md` lieferten HTTP 200. → `.vercelignore` angelegt.
4. **Entität aufgespalten.** Die Startseite nutzte `#person`, die About-Seite `about.html#person`. Für KI waren das zwei verschiedene Daniel Krohs. → Eine einzige Person- und eine Business-Entität, auf allen Seiten referenziert.
5. **Kein FAQPage-Schema auf der Startseite**, obwohl dort 6 FAQs stehen. → Ergänzt, jetzt 7 Fragen.
6. **Demo-Kopien der Kundenseiten indexierbar** (Duplicate Content gegenüber den Live-Seiten der Kunden). → `noindex, follow`.

## Mittel: behoben

7. Keine Markdown-Fassungen → `index.md`, `about.md`, `leistungen.md`, `demo.md`, `kontakt.md` plus `llms-full.txt` (alles in einer Datei). Jede HTML-Seite verweist per `<link rel="alternate" type="text/markdown">` darauf, jede `.md` hat per HTTP-Header einen Canonical auf die HTML-Seite (kein Duplicate Content).
8. llms.txt erweitert: Preise, Projektdauer, Referenzprojekte, Werdegang, Links auf alle Markdown-Fassungen.
9. robots.txt: KI-Crawler (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended u. a.) ausdrücklich erlaubt, Verweis auf llms.txt und llms-full.txt.
10. Schema ausgebaut: 4 einzelne `Service`-Einträge + Prozess-Audit als `Offer` (0 €), `OfferCatalog`, `ProfilePage`, `CollectionPage` mit den 3 Referenzprojekten, `BreadcrumbList`, `ContactPoint`, `knowsAbout`, `alumniOf`, `hasCredential`, GitHub in `sameAs`.
11. Demo-Übersicht hatte weder Canonical noch OG-Tags und fehlte in der Sitemap → ergänzt.
12. FAQ-Frage im Du-Ton („Wie unterscheidest du dich…“) → Sie-Form. Neue FAQ zu Zielgruppe und Region (für Anfragen wie „Software-Entwickler Paderborn Mittelstand“).

## Niedrig: behoben

13. Security-Header ergänzt (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
14. Impressum: TMG → DDG, RStV → MStV (Gesetzesänderung seit Mai 2024).
15. Sitemap: `lastmod` aktualisiert, `/demo` aufgenommen.

---

## Runde 2: Optimierungen auf Basis der Recherche

**Was die Forschung und Praxis 2026 zeigen:**

- Die GEO-Studie (KDD 2024, [GEO-optim/GEO](https://github.com/GEO-optim/GEO)) nennt **Quellenangaben, Zitate und Statistiken** als wirksamste Content-Methoden, mit bis zu 40 % mehr Sichtbarkeit, vor allem für kleinere Seiten.
- **llms.txt hat wenig Wirkung:** Laut [Ahrefs-Analyse von 137.000 Domains](https://ahrefs.com/blog/llmstxt-study/) erhalten 97 % der llms.txt-Dateien keinen einzigen Abruf, und PerplexityBot las sie in einem 12-Wochen-Test kein einziges Mal. Sie schadet nicht, ist aber kein Hebel.
- **Entscheidend für ChatGPT-Suche ist `OAI-SearchBot`** (nicht GPTBot, der dient dem Training). Er ist erlaubt.
- **Lokale Anbieter:** Ein großer Teil der KI-Zitate stammt laut Branchenanalysen aus Google Business Profile und Verzeichnissen, nicht von der eigenen Website. Diese Zahlen sind nicht unabhängig geprüft.
- Werbliche Sprache senkt die Zitierwahrscheinlichkeit, direkte Antworten von 40–60 Wörtern am Seitenanfang, Tabellen und eigenständige Absätze erhöhen sie.

**Umgesetzt:**

16. Startseite: neuer sichtbarer Block **„Auf einen Blick“** mit einer direkten Antwort (ca. 55 Wörter, nennt Name, Rolle, Ort, Leistungen), einer Faktenliste und zwei belegten Statistiken (KfW 30 %, Bitkom 36 %) mit verlinkter Quelle und sichtbarem Stand-Datum.
17. Leistungsseite: **Richtwert-Tabelle** (Vorhaben, Investition, Dauer). Preise und Dauer standen vorher nur in einer aufklappbaren FAQ auf der Startseite.
18. Alle indexierbaren Seiten: `max-snippet:-1, max-image-preview:large` (KI-Übersichten dürfen längere Auszüge zeigen), `author`-Meta, Twitter Cards.
19. Schema: `citation` auf die beiden Studien, `priceRange` mit konkretem Wert.
20. IndexNow-Schlüsseldatei (`d230e982552943f8bb2e2b0d5e10be80.txt`) für Bing, das ChatGPT-Suche und Copilot speist.
21. Markdown-Fassungen und llms-full.txt um Statistiken und Tabelle ergänzt.

**Nach dem Deployment einmal ausführen (IndexNow-Ping an Bing):**

```bash
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d '{
  "host": "kroh-daniel.de",
  "key": "d230e982552943f8bb2e2b0d5e10be80",
  "keyLocation": "https://kroh-daniel.de/d230e982552943f8bb2e2b0d5e10be80.txt",
  "urlList": ["https://kroh-daniel.de/", "https://kroh-daniel.de/about", "https://kroh-daniel.de/leistungen", "https://kroh-daniel.de/demo", "https://kroh-daniel.de/kontakt", "https://kroh-daniel.de/termin"]
}'
```

**Nützliche Open-Source-Tools:**

- [geo-optimizer-skill](https://github.com/Auriti-Labs/geo-optimizer-skill): Audit-CLI mit Score, `uvx --from geo-optimizer-skill geo audit --url https://kroh-daniel.de`. Eignet sich auch für Kundenaudits.
- [awesome-open-geo](https://github.com/cloudapp-dev/awesome-open-geo): kuratierte Liste freier GEO-Tools.

**Geschätzter Score nach Runde 2: ~67/100** (Citability 76, E-E-A-T 71, Technical 90, Schema 90, Brand Authority unverändert 30).

---

## Offene Punkte (erfordern Sie selbst)

### Brand Authority (größter Hebel, 20 % Gewicht)

KI-Systeme empfehlen Anbieter, die sie auf **mehreren unabhängigen Quellen** wiederfinden. Bisher vorhanden: LinkedIn, GitHub, Instagram, 3 Backlinks von Kundenseiten („Entwickelt von kroh-daniel.de“).

- [ ] **Google Business Profile** anlegen oder vervollständigen (Kategorie „Softwareentwickler“, gleiche Adresse und Telefonnummer wie im Impressum). Die Kunden um Google-Bewertungen bitten. Das speist Gemini und Google AI Overviews direkt.
- [ ] **LinkedIn-Profil** abgleichen: Headline „Software-Architekt & Prozess-Optimierer, Mittelstand OWL“, Website-Link, gleiche Formulierungen wie auf der Website.
- [ ] **Bing Places + Bing Webmaster Tools** einrichten. ChatGPT-Suche und Copilot greifen auf den Bing-Index zurück. Sitemap dort einreichen.
- [ ] Einträge in regionalen Verzeichnissen und Netzwerken: IHK Ostwestfalen, OWL-Netzwerke (z. B. Gründerzentren, Technologie-Netzwerke), Gelbe Seiten, 11880. NAP dabei exakt gleich halten.
- [ ] Die Kundenseiten könnten statt „kroh-daniel.de“ den Ankertext „Daniel Kroh — Software-Architekt, Paderborn“ verwenden.

### Content / Citability

- [ ] **Fallstudien mit Zahlen**: Pro Referenzprojekt eine eigene Seite (z. B. `/projekte/erholungs-apartments`) mit Ausgangslage, Lösung und messbarem Ergebnis („10 Std./Woche gespart“). Solche Seiten werden von KI-Systemen am häufigsten zitiert.
- [ ] **2–4 Fachartikel** zu Fragen, die Mittelständler an ChatGPT stellen, z. B. „Was kostet individuelle Software für KMU?“, „Excel-Prozesse automatisieren: wann lohnt es sich?“, „KI im Mittelstand: 5 realistische Anwendungsfälle“. Jeweils mit `Article`-Schema und Autor.
- [ ] Optional: In den HTML-Seiten selbst einen kurzen „Auf einen Blick“-Block mit Fakten (wie in `index.md`). Das erfordert eine Design-Entscheidung.
- [ ] Interne Links nutzen noch `about.html` usw., jeder Klick erzeugt einen 308-Sprung. Funktioniert, sauberer wären `/about`-Links (dann lokal mit `vercel dev` testen).

### Rechtliches

- [ ] USt-ID: Aktuell steht „Noch nicht vorhanden“. Sobald vorhanden, in `js/config.js` **und** in `impressum.html` eintragen. Als Kleinunternehmer ggf. einen Hinweis nach § 19 UStG ergänzen.

---

## 30-Tage-Plan

### Woche 1: Deployment & Grundlagen
- [ ] Änderungen deployen, danach `https://kroh-daniel.de/llms-full.txt`, `/index.md` und `/README.md` (muss 404 liefern) prüfen
- [ ] Google Search Console + Bing Webmaster Tools: Sitemap neu einreichen
- [ ] Schema mit https://validator.schema.org prüfen

### Woche 2: Entitäten-Konsistenz
- [ ] Google Business Profile + Bing Places
- [ ] LinkedIn-Profil abgleichen, 2–3 Google-Bewertungen anfragen

### Woche 3: Fallstudien
- [ ] Erste Fallstudie mit konkreten Zahlen veröffentlichen (Markdown-Fassung + llms.txt ergänzen)

### Woche 4: Fachartikel & Messung
- [ ] Erster Fachartikel
- [ ] Test: In ChatGPT, Perplexity, Gemini und Claude fragen „Software-Entwickler für Prozessautomatisierung in Paderborn“ und dokumentieren, ob und wie die Website genannt wird (Baseline für den nächsten Audit)

---

## Anhang: Analysierte Seiten

| URL | Status | Änderungen |
|---|---|---|
| `/` | indexiert | Schema-Graph neu, FAQPage, FAQ +1, Markdown-Alternate |
| `/about` | indexiert | ProfilePage + einheitliche Person, Canonical |
| `/leistungen` | indexiert | 5 Services + OfferCatalog + FAQPage, Canonical |
| `/demo` | indexiert | Canonical, OG, CollectionPage mit Projekten |
| `/kontakt` | indexiert | ContactPage + Breadcrumb, Canonical |
| `/termin` | indexiert | WebPage + ReserveAction, Canonical |
| `/impressum` | indexiert | echte Adresse statisch, DDG/MStV |
| `/datenschutz` | indexiert | echte Adresse statisch |
| `/agb` | indexiert | Canonical |
| `/aesthera-demo`, `/erholungs-demo`, `/helfende-demo` | jetzt noindex | Duplicate der Kundenseiten |
| `/visitenkarte`, `/visitenkarte-print` | noindex | unverändert |
