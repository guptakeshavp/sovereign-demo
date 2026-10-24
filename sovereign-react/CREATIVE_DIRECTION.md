# CREATIVE_DIRECTION.md — Sovereign, approach 2

## The question we designed against
*How do we make a woman feel that a Sovereign suit was designed for the person she is becoming?*
We did not turn it into copy. We turned it into a structure: every page moves from **what the house has decided** (silhouette, cloth, a point of view) to **what she decides** (colour, cut, details, measurements). The site is a sequence of decisions handed over, not a catalogue.

## Three territories explored

**1. Quiet Authority (rejected as the lead).** Max Mara-adjacent: white, product-first, restraint as the whole message. Correct, but it is what approach 1 already does, and on its own it does not carry "made for you".

**2. The Art of Presence (rejected).** Campaign-led, full-bleed, cinematic. Strong desire, weak on the two things the founders asked for: customisation and fit. Risks becoming a mood film with a shop attached.

**3. The Modern Atelier at dusk (chosen).** The cutting room, late in the day. Warm blacks and espresso, concrete greys, linen, one copper thread. The garment is always on a lit stage; the tools of the trade (tape, chalk, stitch) become the interface. It is editorial enough to create desire and literal enough to make customising and measuring feel like craft rather than a form.

## The direction in one line
**Tailoring, handed over.** Sovereign decides the silhouette; she decides everything else, and the website makes those decisions feel like being measured by someone who knows what they are doing.

## Signature device: the tailor's tape
One element the site is remembered by. A thin measuring tape, drawn in SVG with ticks every unit, taller every five, numbered every ten.
- On the homepage it is the **scroll cue**, filling in copper as you move.
- Between sections it is the **rule**.
- In the Atelier it is the **step progress**: seven decisions as marks along one tape.
- In Find Your Fit it is the **input**: the measurement slider sits on a tape with the real centimetre scale.
The device encodes something true (sequence, measure) and belongs to the subject. It is not decoration.

The copper **cross stitch** stays where it is literally embroidery: the lioness's ear, the inside of the lining, the monogram. It is never a bullet, a tick or a marker (it reads as "unavailable" when it is).

## Why it is not the generic luxury site
- Not pastel or feminine; the master brand stays neutral enough for menswear later. Femininity comes from the photography and the garments, not the palette.
- Not black-and-gold. Copper is thread, not gilt, and it appears in three places per page at most.
- Not a stack of beige sections. Surfaces alternate ink / linen / espresso / bone with intent: dark where the garment is the hero (hero, Atelier, Fit), light where she is comparing and buying (Collection, PDP, Look, Bag).
- Not oversized-serif-everything. Cormorant is reserved for statements and names; Instrument Sans carries every control, price and label.
- Not Shopify-shaped. The collection is a 1.35:1:1:1 editorial grid with a staggered middle column; the PDP stage is sticky and shows the campaign image beside the live illustration.

## Typography
- **Display:** Cormorant Garamond (the wordmark's own family, so the brand stays whole). Weights 300–500, italics used for the one word in a headline that carries the turn ("occasion", "decision", "kept").
- **Text and UI:** Instrument Sans 400/500. Labels at 10–11px, tracked .18–.22em, uppercase. Prices tabular.
- Scale: display clamp(52px, 8.6vw, 136px) at line-height .92; headings .96–1.08; body 15px/1.6.

## Colour
| Token | Hex | Role |
|---|---|---|
| ink | #16130F | Primary dark ground, nav text on light |
| espresso | #2A211B | Secondary dark ground (craft section) |
| umber | #3D322A | Frame fallback, stage highlight |
| clay | #8C7B6B | Muted on dark |
| stone | #B5A897 | Mid grey, concrete |
| linen | #E6DED2 | Commerce surface (PDP stage, Look) |
| bone | #EFE9E0 | Light ground, text on dark |
| chalk | #F5F1EA | Lightest |
| copper | #B5744A | The thread. Signature word, active state, tape fill |
| thread | #D08D5E | Monogram stitch, error text on dark |

## Photography direction
What exists today: one campaign portrait (woman, dove peak-lapel suit, dusk light), a flat-lay of blazer/waistcoat/camisole on linen, an atelier interior, and four craft close-ups. All AI-generated for the demo; all consistent (warm grey backdrop, raking window light, charcoal and copper palette).

What to commission (see PHOTOGRAPHY.md in the repo root for prompt style):
- Each of the seven styles on a woman, three-quarter, cropped mid-thigh, same backdrop and light.
- Movement: a blazer worn open with jeans; a waistcoat alone; the wide trouser walking.
- An evening frame: the Ease blazer over a camisole at a dinner table, candle-warm.
- Detail: lapel roll, cuff buttons, lining with the stitch, the monogram.
- Avoid offices, laptops, handshakes, glass towers.

## Motion
GSAP, used in five places only: hero image settle and line reveal; scroll-in reveals (one easing, one duration); preview pulse on change in the Atelier; step crossfade; a subtle parallax on the story hero. Reduced-motion disables all of it. Nothing animates that a customer is trying to read or click.

## Voice
Short declaratives. Specific nouns. No "elevate", "curated", "effortless". We say what we have not confirmed ("specifications are placeholders", "policies await approval") rather than inventing it. Buttons say what happens: "Add to bag", "Continue in the Atelier", "Place demonstration order".
