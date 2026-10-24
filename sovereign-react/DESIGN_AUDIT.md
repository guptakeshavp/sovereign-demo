# DESIGN_AUDIT.md — creative director review of the Sovereign React prototype

Reviewed 23 October 2026 against the live build at https://guptakeshavp.github.io/sovereign-demo/ and the source in `sovereign-react/`. Method: read every component, ran the app locally, inspected desktop (1440) and mobile (390 and 360, via an iframe harness because the browser window would not resize below its minimum) in Chrome, and walked every interaction. Reference principles from `RESEARCH.md` were used as the benchmark; Max Mara, Ralph Lauren, Sumissura and Hockerty remain inaccessible and no observations about them are claimed.

## What was already strong
- A coherent dusk-lit direction with one signature device (the tape) that encodes real information: scroll position, step progress, measurement scale.
- Type pairing (Cormorant display, Instrument Sans UI) is consistent and the italic-turn headline device is used sparingly.
- The Atelier's architecture is sound: declarative option groups per garment, compatibility rules with explanations, state held at app level so steps are reversible, deterministic pricing with named surcharges, and a three-piece mode with independent pieces.
- Find Your Fit already followed the Proper Cloth pattern (skip, why-we-ask, review, hedged result) and kept measurements transient.
- Hash routing with a relative base makes deep links and refreshes work under `/sovereign-demo/` without a 404 shim.
- INR formatting, PIN-code field, tax-inclusive line and payment-method display match the Indian commerce conventions observed in research.

## Findings and severity

### P0 — Critical
| # | Finding | Where | Action |
|---|---|---|---|
| 1 | Copy asserted unverified operational facts: made in India, cut after order, a hand-placed copper stitch in every garment, fittings included, patterns kept on file, mill and workshop references, horn buttons, silk lining. | Home, Story, Collection, Product, Atelier, Bag, Footer, Nav, catalogue data | **Fixed.** Rewritten or replaced with bracketed placeholders. Full table in `CONTENT_REVIEW.md`. |
| 2 | Guided fit result read as a recommendation ("A starting point ... confirmed at a fitting"). | Fit page, fitData | **Fixed.** Labelled "General fit guidance", with an explicit "demonstration heuristic, not a validated sizing system" line. Route renamed from "Made to measure" to "Your measurements". |
| 3 | Hero photograph started at `opacity: 0` and depended on GSAP to appear. | Home | **Fixed.** Image is visible by default; GSAP now animates *from* a dimmed state. Reduced-motion users see the image immediately. |
| 4 | Headline line-reveals can be caught mid-animation in a screenshot (lines clipped). | Home, Collection, Fit, Story | **Partly fixed.** Durations shortened (1.05s, stagger .08). The reveal itself is kept because it is the hero's one orchestrated moment; `html.no-motion` renders final state. |

### P1 — High impact
| # | Finding | Where | Action |
|---|---|---|---|
| 5 | Garment illustrations read as flat technical diagrams: uniform fill, hairline pattern, no depth, no contact shadow. | `features/garment/engine.ts`, every card, PDP stage, Atelier | **Fixed.** Procedural cloth grain per fabric (twill, hopsack, flannel, crepe, satin), vertical light-to-shadow gradient, soft lapel drop shadow, blurred floor shadow. Still captioned "Illustrative preview". |
| 6 | Illustrated product cards sat on a flat linen rectangle; photograph cards and illustration cards did not feel like one shoot. | `ProductCard`, global.css | **Fixed.** Card frames now carry a soft radial studio light; drop shadows reduced to match. |
| 7 | Featured collection on the homepage was a conventional four-up grid. | Home | **Fixed.** Editorial composition: campaign portrait left, statement and link top right, three small illustrated plates bottom right. |
| 8 | Fabric step showed plain grey discs; cloth could not be told apart. | Atelier | **Fixed.** Woven texture swatches tinted with the chosen colour, scaled per weave; satin shows a sheen instead. |
| 9 | No distinction between ready-to-wear and customisable garments. | Cards, PDP | **Fixed.** Every card and PDP carries "Customisable in the Atelier" or "Ready to wear". |
| 10 | Measurement guidance explained *where* but not *why*, *how to hold* or *what goes wrong*. | `MeasurementJourney`, `fitData` | **Fixed.** Each step now has Why it matters, Hold it, Avoid and Tip, plus the croquis. |
| 11 | Trouser preview on the PDP was oversized and sat on a flat ground. | Product | **Fixed.** Stage has studio light; trousers capped at 380px, other garments at 460px. |
| 12 | Bag drawer did not manage focus; keyboard users stayed behind the overlay. | `BagDrawer` | **Fixed.** Focus moves to Close on open, returns on close; `aria-modal`, `inert` when hidden. |
| 13 | Atelier step tape on mobile: first and last labels overflowed the viewport; stage caption overlapped the garment. | `Tape`, Atelier | **Fixed earlier in this session.** Edge labels clamp; stage gets bottom padding and a smaller garment under 1024px. |

### P2 — Polish
| # | Finding | Action |
|---|---|---|
| 14 | Option tiles had no pressed feedback. | Added subtle scale on `:active` and eased transitions; light-surface variants defined. |
| 15 | Atelier homepage invitation read like a feature description. | Headline now "Come in. The piece is yours to decide." with a copper "Enter the Atelier" button. |
| 16 | Reveal timing felt a touch slow across long pages. | 1.1s → 0.9s for blocks. |
| 17 | Step tape in the Atelier showed centimetre numbers that meant nothing for steps. | Dense tape without numbers. |

## What remains unresolved
- **Photography.** One campaign portrait, one flat-lay and six craft/atelier images carry the whole site. Six of seven styles have no photograph; their cards and product pages use the illustration. Shot list in `CREATIVE_DIRECTION.md`. This is the single largest gap between the prototype and a luxury benchmark.
- **Garment illustration** is better but still an illustration; a layered photographic configurator per colour is a production task once samples exist.
- **Thumbnail gallery** on the product page is not built because there is one image per product.
- **Hash routing** works under the GitHub Pages path but means page URLs are not shareable from the artifact viewer and show `#/` in the address bar; a path-based router would need a 404 redirect shim on Pages.
- **Lint**: the scaffold ships `oxlint`; it is not configured for React hooks rules. Type-check and build are the gates used.
- Size and garment tables are formula-generated indicative figures.

## Preserved deliberately
The tape device, the colour system, the type scale, the Atelier reducer and compatibility rules, the fit journeys, cart/wishlist behaviour, the stitch-only-where-literal rule, and the hash-routing strategy.
