# DESIGN_SYSTEM.md — Sovereign, approach 2

Tokens live in `src/styles/global.css` under `@theme` (Tailwind v4) and are the only source of colour and type. Components use Tailwind utilities for layout and a small set of named classes for editorial type and controls.

## Colour tokens
| Token | Hex | Use |
|---|---|---|
| `ink` | #16130F | Dark ground; nav text on light surfaces |
| `espresso` | #2A211B | Secondary dark ground |
| `umber` | #3D322A | Frame fallback, stage highlight |
| `clay` | #8C7B6B | Muted text on dark |
| `stone` | #B5A897 | Mid grey |
| `linen` | #E6DED2 | Commerce surface |
| `bone` | #EFE9E0 | Light ground; text on dark |
| `chalk` | #F5F1EA | Lightest surface |
| `copper` | #B5744A | Accent: signature word, active states, tape fill, primary CTA |
| `copper-deep` | #8E5733 | Hover/pressed copper |
| `thread` | #D08D5E | Monogram stitch; error text on dark |

Rules: one copper element per viewport where possible. Never copper text on linen below 14px (contrast). Muted text is the ground's foreground at 55–75% opacity, never a separate grey.

Surfaces: `.surface-dark` (ink), `.surface-espresso`, `.surface-light` (bone), `.surface-linen`. Each sets `color-scheme` so native controls match.

## Typography
- Display: **Cormorant Garamond** 300/400/500 + italics. Classes `.t-display` (clamp 52–136px, lh .92), `.t-xl` (42–92), `.t-l` (34–62), `.t-m` (26–40), `.t-s` (21–26).
- Text/UI: **Instrument Sans** 400/500. Body 15px/1.6. `.t-lead` 16–19px. `.label` 11px/.2em uppercase 500. `.label-s` 10px/.18em.
- Italic emphasis (`.t-i` or `<em>`) marks the one turning word in a headline. Never two per headline.
- Numbers: `.num` (tabular). Prices via `inr()` → `₹42,000` with Indian grouping, no paise.

## Spacing and layout
- `--gutter: clamp(20px, 4.5vw, 64px)`; `--max: 1520px`; `.wrap` = `min(100% − 2·gutter, max)`.
- `.section` = clamp(88px, 11vw, 168px) vertical; `.section-tight` = clamp(56px, 7vw, 108px).
- Grids: editorial 1.35fr 1fr 1fr 1fr for the featured row; 2-col on tablet, 1-col under 640px via Tailwind breakpoints. Collection staggers the middle column by 56px on desktop only.
- Radii: 0 everywhere except swatches (circles). Borders: 1px at 12–25% of the foreground.

## Signature components
- **Tape** (`components/Tape.tsx`): SVG ticks; props `length`, `progress`, `labels`, `dense`, `start`. `TapeRule` is a 100-unit dense rule. Used for scroll cue, section rule, step progress, and as the scale under the measurement slider.
- **Stitch** (`components/Stitch.tsx`): the copper ×. Allowed only where it is embroidery (mark, lining, monogram). Never as a bullet, tick or marker.
- **Garment** (`features/garment`): SVG garment engine. Props are the full `GarmentSpec` (colour, texture, lapel, closure, fit scale, sleeve, length, leg, neck). Always captioned "Illustrative preview" where it stands in for a product.
- **MeasureFigure**: line croquis showing where the tape goes for the active measurement.

## Controls
- `.btn` outline / `.btn-solid` / `.btn-copper`, 52px tall, 11.5px tracked uppercase; a copper fill rises on hover. `.btn-sm` 42px.
- `.link`: tracked uppercase with hairline underline.
- `.swatch` 40px circle; selected state is a copper ring at −5px, never a tick.
- `.seg` segmented control; `.tile` option tile with bold name + small note; `aria-pressed` drives all selected styling.
- `.field` label + 46px input; `.field-err` in thread colour.
- `.tape-range` native range input restyled as a 2px copper needle over the tape.

## Motion
- GSAP only via `lib/motion.ts`: `useReveal(scope)` animates `.rv` and `[data-lines]` once on scroll (power3.out, 1.1s), `[data-parallax]` scrubs ±amount%. `pulse(el)` for preview changes.
- Hero children sit in `[data-hero]` and reveal on mount, not on scroll.
- `prefers-reduced-motion` adds `html.no-motion`, which sets all reveal states to final and disables the page-in animation.

## Accessibility floor
- All selected states via `aria-pressed`; all icon-only buttons have `aria-label`.
- Visible focus: 1.5px copper outline, 4px offset.
- Skip link to `#main`. Mobile menu traps scroll and closes on route change. Bag drawer closes on Escape.
- Contrast: bone on ink 14.5:1; ink on bone 14.5:1; copper on ink 5.0:1 (labels ≥ 10px bold). Muted text never drops below 55% opacity on body sizes.
