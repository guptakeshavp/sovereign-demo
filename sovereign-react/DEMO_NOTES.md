# DEMO_NOTES.md — what is implemented, what is illustrative, what production needs

> Updated 23 October 2026 after the creative director review pass. See `DESIGN_AUDIT.md` for findings and `CONTENT_REVIEW.md` for the copy verification.

## Later additions (23 Oct 2026)
- **Find Your Fit drawer** on product pages: tabs Find my size / Size chart / Measurements, opened in place and able to set the product's size. The standalone `/fit` page remains for the main navigation. Rendered through a portal above the fixed header; focus moves to Close and returns on close.
- **Opening sequence**: ink screen, lioness mark, copper stitch drawn on the ear (positioned on the artwork's knockout at 49.4% / 10.1%), tape, wordmark wipe, lift. Plays once per browser session (`sessionStorage` key `sov.intro`); skipped under `prefers-reduced-motion`. Hero reveals wait for it.

## Review pass — technical fixes applied
- **Routing**: HashRouter with `base: './'`; deep links (`/#/atelier?garment=suit`, `/#/product/...`, `/#/bag`) and browser refresh verified on the GitHub Pages path `/sovereign-demo/`. No 404 shim needed.
- **Animation safety**: hero image no longer starts at `opacity: 0`; GSAP animates from a dimmed state. All `.rv` reveals resolve to visible under `prefers-reduced-motion` via `html.no-motion`. Reveal durations shortened.
- **Accessibility**: bag drawer is `aria-modal`, moves focus to Close on open and returns it on close, and is `inert` while hidden. All selected states use `aria-pressed`; icon buttons carry labels; skip link present; copper focus ring everywhere.
- **Responsive**: step-tape labels clamp at the edges and collapse to the active label under 640px; Atelier stage gets bottom padding and a smaller garment under 1024px; collection statement precedes the campaign card on mobile.
- **Visual**: procedural cloth grain, shading and shadows in the garment engine; studio-lit card frames; woven fabric swatches; editorial featured composition on the homepage; product stage sized per garment type.
- **Performance**: images are 150–320 KB JPEGs sized to their frames; fonts preconnected with `display=swap`; route-level code splitting (largest chunk 248 KB, 78 KB gzipped); logo PNGs embedded to avoid path issues on any host.
- **Content**: all unverified claims rewritten or bracketed for client approval (see `CONTENT_REVIEW.md`).


## Implemented and working
- **Navigation** across nine routes with hash routing; mobile menu; bag drawer; skip link; reduced-motion support.
- **Collection**: category tabs (URL-synced `?c=`), colour and fit facets, four sorts, result count, empty state, wishlist on hover. Filters operate on the real catalogue data.
- **Product page**: colour, cloth (with surcharge) and fit selection update the illustrative preview and price; size grid with validation; PIN-code field; wishlist; add to bag; per-size garment measurement table with cm/in toggle; "Worn with" module; hand-off to the Atelier carrying colour, cloth and fit.
- **Atelier**: seven steps on the tape (garment → fabric → colour → fit → details → sizing → review). State is a single reducer held at app level, so selections survive navigating away and back. Only applicable option groups appear per garment. Compatibility rules block invalid pairs and explain why (e.g. double-breasted needs Signature or Relaxed fit; shawl lapel is single-breasted only; wide leg is not cut in flannel). Monogram renders on a lining inset. Deterministic pricing: base + named fabric surcharge + monogram ₹1,500 + made-to-measure ₹6,000, with a three-piece set adjustment.
- **Three-piece**: blazer, waistcoat and trousers configured independently with a piece switcher; fabric and colour are shared across the suit; review shows each piece and the full composite preview.
- **Find Your Fit**: standard chart; guided fit (four questions, skip and why-we-ask, review of answers, hedged result with size and fit, deep-link into the Atelier); made to measure (one measurement per screen, croquis showing where the tape goes, cm/in toggle, plausibility validation, slider on a real tape scale, skip-to-fitting). The same journey is embedded in the Atelier's sizing step.
- **Shop the Look**: hotspot image, per-piece size selection, include/exclude, combined price, add all to bag with validation.
- **Wishlist and Bag**: save/remove, quantity, line removal, subtotal; checkout form with PIN and a labelled payment-method display; ends in a "demonstration order" state and clears the bag.

## Illustrative, not final
- **Garment preview** is a parametric SVG illustration. It changes correctly with colour, cloth texture, fit, lapel, closure, sleeve, length, leg and neckline, but it is not a rendering of the finished product and is captioned as such everywhere.
- **Photography**: eight AI-generated images from approach 1 are reused (one campaign portrait, one flat-lay, one atelier interior, five craft details). Six of the seven styles have no photograph yet; their cards and product pages use the illustration. See CREATIVE_DIRECTION.md for the shot list.
- **Product names** ("The Signature blazer" etc.), **prices**, **fabric specs** ("placeholder spec"), **lead times** and **size charts** are demonstration data awaiting client approval. Nothing claims composition, origin, sustainability or construction beyond "made to order in India".
- **Guided fit** uses a simple rule (usual size, nudged by shape and preference). It is labelled "General fit guidance" and "demonstration heuristic, not a validated sizing system". It is not a made-to-measure recommendation.
- **Garment measurement tables** are formula-generated indicative numbers.
- **Delivery estimate** accepts a PIN but returns a fixed message; no serviceability data exists yet.

## Deliberately not built
- Men's storefront or products.
- 3D or body-based try-on.
- Any Shopify, payment, shipping or inventory integration.
- Customer accounts.

## Privacy and data
- Body measurements and guided-fit answers live in React state only. Nothing is written to storage or sent anywhere.
- Bag and wishlist use `localStorage` (keys `sov.bag`, `sov.wishlist`) in this browser only.

## What production would need
1. Commerce backend (Shopify or similar): map `Product` → product/variants, `CartLine.details` → line-item properties for Atelier configurations, and a custom product type for made to measure.
2. Payments: UPI, cards, net banking via a gateway; the checkout UI is already shaped for it.
3. Secure customer profiles for measurements and patterns on file, with consent and retention policy.
4. Fit validation: real graded size charts from sampling; the guided-fit rule replaced by a model trained on fit outcomes; mandatory fitting confirmation for made to measure.
5. Serviceability: PIN-code lookup with lead times and cut-offs; delivery and returns policies (customised items are typically non-returnable; needs legal review).
6. Photography for all seven styles and the Look; replace illustrations with layered product imagery per colour.
7. Content approvals: product names, prices, fabric specifications, construction claims, studio location, alteration terms.
