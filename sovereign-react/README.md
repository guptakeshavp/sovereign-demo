# Sovereign — React demo

A women-first luxury tailoring flagship for Sovereign: homepage, collection, product page, the Atelier garment customiser, Find Your Fit, Shop the Look, Our Story, wishlist and a demonstration bag/checkout.

## Run
```
cd sovereign-react
npm install
npm run dev        # http://localhost:5180/
```
Hash routing is used so the built site works from any folder or hosted path (`/#/atelier`).

## Build
```
npm run build      # → dist/
npm run preview    # serves dist/ on http://localhost:4180/
```
`vite.config.ts` sets `base: './'` so `dist/` can be dropped onto any static host.

## Stack
React 19 · Vite 8 · TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`) · React Router (HashRouter) · GSAP + ScrollTrigger · Lucide icons. No backend, no Shopify, no payments.

## Where things live
```
src/
  data/           types.ts · options.ts (colours, fabrics, fits, details, pricing rules) · catalogue.ts (7 styles, 1 look)
  features/
    garment/      engine.ts (SVG garment illustration) · Garment.tsx
    configurator/ model.ts (steps, option groups, compatibility rules, pricing) · ConfiguratorContext.tsx (reducer)
    fit/          fitData.ts (measurements, guided questions, size chart) · MeasurementJourney.tsx · MeasureFigure.tsx
    cart/         CartContext.tsx (localStorage)
    wishlist/     WishlistContext.tsx (localStorage)
  components/     Nav · Footer · Tape · Stitch · Logo · ProductCard · BagDrawer
  pages/          Home · Collection · Product · Atelier · Fit · Look · Story · Wishlist · Bag
  styles/global.css   design tokens (@theme) and named classes
  lib/            format.ts (₹, cm/in) · motion.ts (GSAP hooks) · storage.ts
public/           images/ (AI-generated demo photography) · logo/ · fonts/
```

## Documents
- `RESEARCH.md` — what was inspected on the reference sites, what was learned, what was blocked
- `CREATIVE_DIRECTION.md` — the chosen territory, signature device, type, colour, photography, motion
- `DESIGN_SYSTEM.md` — tokens, components, controls, accessibility floor
- `DEMO_NOTES.md` — what is real, what is illustrative, what production needs

## Notes for the Monday call
- Everything priced, specified or promised is demonstration data and is labelled so in the UI.
- Customer measurements never leave the page. Bag and wishlist use this browser's localStorage only.
- The checkout ends in a clearly labelled demonstration state; nothing is charged or sent.

## Live demo
- React demo: https://guptakeshavp.github.io/sovereign-demo/

The public repo `guptakeshavp/sovereign-demo` now also stores this editable project in `sovereign-react/`. The repository root contains the separately published React site.

Source commits do not update the published application files. Publishing the latest design is a separate, manual step after approval: build this project, then update the published files while retaining `sovereign-react/` and Git metadata. No automatic source-build workflow is configured in this repository.

Dependencies, build output, local review screenshots/backups and environment files are excluded from source control. Install dependencies from the committed lockfile with `npm ci`.

### Current source state

The campaign retains the café conversation image alongside the earlier women-only charcoal and stone scenes. Product imagery defaults to neutral colours. Product names/prices remain visible; fuller information opens in Details. The customiser, fit journeys, wishlist and demonstration bag remain available. Homepage contact details are explicit placeholders.

## Review pass (23 Oct 2026)
`DESIGN_AUDIT.md` lists findings by severity and what was changed; `CONTENT_REVIEW.md` classifies every brand claim; `review/before` and `review/after` hold the screenshots used for the visual review.
