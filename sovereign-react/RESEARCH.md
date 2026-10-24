# RESEARCH.md — Reference study for Sovereign (approach 2)

Date: 23 October 2026. Method: three parallel research passes over the brief's reference list. WebFetch was rate-limited or blocked on most hosts, so pages were pulled as raw HTML (homepage, one collection page, one product page each) and parsed for navigation, type, colour, pricing, product-card and PDP structure. Nothing was rendered in a browser, so hover and motion behaviour is inferred from markup only and marked as such. **Verified** means seen in fetched content. **Hypothesis** means inferred. Blocked sites are listed with no invented observations.

## Access summary

| Site | Status |
|---|---|
| Max Mara | 403 on .com, in., gb. — nothing observed |
| Ralph Lauren | Bot wall (PerimeterX) — nothing observed |
| The Fold London | Full access |
| Argent | Full access (curl) |
| ME+EM | Full access |
| WARDROBE.NYC | Home is JS-only; collection + PDP readable |
| SAND by Shirin | Full access (curl) |
| QUA, SALT Attire, Andamen | Full access (curl) |
| Bombay Shirt Company | Nav/footer only; PDP, fit guide and configurator are client-rendered |
| Sumissura, Hockerty | 403 everywhere; first-party search snippets only |
| Indochino | Home only; guide and guarantee pages 404/redirect |
| Suitsupply Custom Made | App shell only (default jacket image references) |
| Nike By You | Landing + catalogue; builder not inspected |
| Proper Cloth Smart Sizes | Partially rendered: labels and copy real, computed values absent |

## Priority A — Women's luxury fashion and tailoring

### The Fold London — verified
- Uppercase mega-menu with a **fabric-led sub-nav** (Cashmere, Silk, Tweed, Crepe) and a Petite edit.
- Home order: hero → category tiles → campaign film → occasion edit → mix-and-match offer → brand statement → service strip (Try Before You Buy, Virtual Styling, Shipping, Returns).
- Type: Freight serif display + Founders Grotesk UI. Palette: greys on white with one teal accent.
- Listing: name + price, swatches, second image on hover (class evidence), quick view.
- PDP: structured attributes in cm (lining, fit type, length, sleeve), "Model is wearing UK 8, 178 cm", Try Before You Buy, accordions, one outfit cross-sell row.
- **Learn:** fabric as a navigation axis; per-garment cm data with model stats; services shown as modules. **Don't copy:** fonts, teal, "Clever Crepe" naming.

### Argent — verified
- Fit vocabulary used as **filter facets**: Classic / Oversized / Fitted / Cropped for blazers; Wide Leg / Slim / Pleated / Flare for pants.
- Very tall cards (aspect ≈ 0.57), one card per colourway, hover second image, quick-add.
- PDP: fabric in the product name ("Peak Lapel Blazer in Seasonless Wool"), accordions incl. Sizing & Fit with inch/cm toggle, one "Style With" module, sticky buy bar, appointment CTA.
- Palette: warm off-white #F5F4EE + black. Type: Mabry Pro + Lyon Text.
- **Learn:** fit as facet; fabric in the name; one styling module. **Don't copy:** fonts, podcast content, workplace voice.

### ME+EM — verified
- Mega-menu of "edits" (Suits + Tailoring, AM-PM, Workwear) and silhouette sub-categories (Wide-Leg, Barrel-Leg).
- 5:7 cards with inline quick-add including **length variants** (6S / 6R / 6L). An editorial tile sits inside the product grid.
- PDP architecture: tabs **Fit / Fabric / Forever**; "Wear With" as a full outfit of seven items; model data; video in gallery.
- Single typeface (Suisse Intl); off-white + ink navy.
- **Learn:** Fit/Fabric as PDP spine; length variants; editorial card inside the grid. **Don't copy:** edit names, founder copy, single-typeface system.

### WARDROBE.NYC — partly verified
- Flat all-caps category nav. Geo-detected India shows "IN / INR" with raw conversions ("Rs. 357,000") and a first-visit destination modal.
- PDP has the clearest **per-size garment measurement table** (½ bust, ½ waist, length, sleeve) with inch/cm toggle. No cross-sell.
- **Learn:** garment measurements per size; ask destination early. **Don't copy:** bare currency conversions; all-caps-only system.

### SAND by Shirin — verified (founders' reference)
- Native INR ("₹ 16,990"), made-in-India provenance as story, mega-menu **by fabric and by colour**.
- Home is a **narrative scroll**: story in sequential headings, the season's palette shown as its own section, "where it was drawn", a nine-frame lookbook, then products. Copy device "turn the page".
- PDP offers "Adjust dress length" at purchase (altered items non-returnable) — a direct precedent for customisation at checkout. Three overlapping cross-sell modules.
- Type: IM Fell old-style serif + Jost + a script. Earth palette.
- **Learn:** ₹ with Indian grouping and round prices; a palette-as-story section; alteration offered inline; storytelling pacing. **Don't copy:** fonts, fable copy, Himalayan imagery, stacked cross-sell.

### Max Mara, Ralph Lauren — not observed
Both fully blocked. Their influence on this work is limited to the brief's own description (restraint, negative space, campaign-led storytelling). No observations are claimed.

## Priority C — Indian benchmarks

### QUA — verified
- PDP carries an inline **"Get this piece tailor made"** form (shoulder, bust, bicep, sleeve, waist, hip, knee, each with "How to measure") plus a stylist-session fallback and a Delhi-NCR **home trial** gated by PIN code.
- "Customised and altered products are ineligible for return." Prices "₹ 3,495"; sale badges lead the homepage.
- **Learn:** made-to-measure as an inline PDP mode; honest alteration/returns rule. **Don't copy:** sale-first homepage, inconsistent decimals.

### SALT Attire — verified
- The most explicit Indian commerce signals: "Inclusive of all taxes.", "COD available", UPI/Paytm in FAQ, "Estimated delivery in India: 2–4 days", Inch/CM + UK/EU size chart, virtual and in-store appointment links.
- **Learn:** tax-inclusive line; delivery estimate on the PDP; appointment links. **Don't copy:** discount marquee, % badges, review counters.

### Bombay Shirt Company — nav/meta only
- Nav splits **Ready to Wear vs Made to Measure**. Homepage sells "5 details that make a great shirt" and a preset-then-customise flow ("start with a preset, then make the collar, cuffs, buttons your own"). Serif (EB Garamond) + sans (AF Neue Berlin).
- **Learn:** RTW vs MTM as a first-class split; craft-education module; preset-then-adjust. Configurator itself was not observable.

### Andamen — verified
- Every price reads "₹ 4,599 MRP incl. taxes". PDP: **PIN-code delivery check with an order cut-off**, a "Find my size" quiz (height, weight, build, fit preference) that says "This is a suggestion", garment-vs-body chart with Inch/CM toggle, WhatsApp with service hours.
- **Learn:** PIN check with cut-off; size quiz that hedges; body-vs-garment chart. **Don't copy:** coupon blocks, "for 1 unit" boilerplate.

## Priority D — Customisation and fit

### Proper Cloth Smart Sizes — verified (strongest source)
- One question per screen, Prev/Next, "n / total", persistent US/Metric toggle.
- Most questions carry **"I'm not sure, skip"** and **"Why do we ask?"**. Body-shape questions use illustrated silhouettes with words, not numbers.
- A **Review your answers** step before the reveal. Output framed as something you "fine-tune later".
- Gates the result behind account creation; asks an ethnicity question. Promises "Perfect fit guaranteed".
- **Learn:** ask what she already knows before anything that needs a tape; skip + why; review before reveal; hedge the output. **Don't copy:** account gate, ethnicity, 21 questions, the guarantee wording.

### Sumissura — first-party snippets only
- Four steps: fabric → design → measurements → receive. Dual measurement path ("let our algorithm do it, or measure at home"). Alteration partner network as the fit hedge.
- **Learn:** two measurement doors side by side. UI unverified.

### Hockerty — secondary only
- Virtual try-on on an approximated body; fabric tiers by mill. "Perfect fit guarantee" reportedly carries a 30-day window and photo verification — a promise/process gap to avoid.

### Indochino — home only
- Three fit routes presented as equal doors (home guide, swatch kit, showroom). Alteration reimbursement caps published in support. Promo-led homepage.
- **Learn:** parallel fit routes; numeric terms beat adjectives.

### Suitsupply Custom Made — shell only
- HTML exposes a default jacket image: evidence of **layered 2D imagery on a base**, the cheapest credible preview pattern. Reviewers describe it as built so you cannot produce a bad combination; small flat surcharges.

### Nike By You — landing + secondary
- Options grouped by region with curated palettes that cannot clash; preview is the hero; a shareable finished snapshot. Free-roam tapping does not suit tailoring's decision order.

## The 5–7 references that shaped this build, and why
1. **Proper Cloth** — the guided-fit pattern (skip, why-we-ask, review, hedged result). Implemented in Find Your Fit.
2. **Suitsupply / Nike By You** — preview-as-hero, constrained options, flat named surcharges. Implemented in the Atelier.
3. **WARDROBE.NYC + The Fold** — per-size garment measurements with unit toggle and model stats. Implemented on the product page.
4. **Argent + ME+EM** — fit as a filter facet; one outfit module; Fit/Fabric as PDP spine. Implemented in Collection and PDP.
5. **SAND by Shirin** — INR formatting, made-in-India as story, narrative pacing on the homepage. Implemented in home structure and pricing.
6. **Andamen + SALT** — PIN-code delivery check, tax-inclusive line, UPI/COD expectations. Implemented on PDP and checkout.
7. **QUA** — inline made-to-measure beside standard sizes; honest customised-returns rule. Implemented in the Atelier sizing step and demo notes.

## What is technically feasible in this React demo
- Layered/parametric 2D garment preview: yes (SVG engine, recolour and re-cut live).
- Deterministic pricing with named surcharges: yes.
- Question-led fit with skip/why/review: yes.
- Per-size measurement tables with cm/in toggle: yes (indicative data).
- Hover second image: only where photography exists (one campaign image today).
- 3D or body-based try-on: no, and not promised.
