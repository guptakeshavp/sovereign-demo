# PHOTOGRAPHY_REPORT.md — editorial imagery, logo and three-piece refinement

Date: 23 October 2026. Source images: the six files the client placed in `Soverign/newimage/` (the blazer and burgundy three-piece panels from the original ZIP were not supplied, so they are not used). Copied unchanged to `public/images/sovereign/`.

## A. Image inspection
| File | Pixels | Content | Verdict |
|---|---|---|---|
| 02_trousers.jpg | 1128×1359 | Wide-leg stone trouser, ivory shirt, raking light on a stone wall | Good. Clearly a **wide** leg, so mapped to the Wide trouser, not the Column |
| 03_waistcoat.jpg | 1128×1359 | Stone waistcoat with matching trouser, concrete canopy | Good. Strongest portrait of the set |
| 04_camisole.jpg | 1128×1359 | Ivory silk camisole, black trouser, low angle | Good. Crop at 15% from top keeps the face |
| 05_coordinated_set.jpg | 1140×1344 | Olive blazer, waistcoat and trouser worn together, brutalist facade | Good. All three components visible, so used as the three-piece image |
| 07_lapel_details.jpg | 1128×1077 | Peak lapel and chest pocket in a sand cloth | Good for a 4:5 craft frame |
| 08_fabric_texture.jpg | 1128×1077 | Brown textured cloth, folded | Good for a 4:5 craft frame |

All six are AI-generated concept images, consistent in warmth and light (golden hour, concrete and stone). None has embedded text. At ~1130 px wide they are sharp in half-width frames and product cards; none is large enough for a full-bleed hero, so the existing campaign portrait (`women.jpg`, 1122×1402) remains the hero and the Signature blazer image.

## B. Where each image is used
| Image | Sections |
|---|---|
| 02_trousers | Wide trouser: collection card, product page gallery, homepage featured row |
| 03_waistcoat | Sculpted waistcoat: collection card, product page; homepage featured section (large card) |
| 04_camisole | Silk camisole: collection card, product page, homepage featured row |
| 05_coordinated_set | Three-piece: homepage "The three-piece" feature, collection card, product page |
| 07_lapel_details | Homepage craft row ("The shape"), Story page ("The shape") |
| 08_fabric_texture | Homepage craft row ("The cloth"), Story page ("The cloth") |

Deliberately not used: the two `editorial_with_titles` variants (embedded labels). Retained from before: `women.jpg` (hero, Signature blazer), `flatlay.jpg` (Shop the Look, because it literally shows the three items in that look), `stitch.jpg` (craft row and Story), `studio.jpg` (Story hero). Dropped from the homepage and Story: `cloth.jpg`, `canvas.jpg` (replaced by 08 and 07). Still without photography: the Ease blazer and the Column trouser (illustrated preview).

**Colour honesty.** Where a photograph's colourway is not a selectable option, the product page shows a note under the image (e.g. "Campaign photograph in an olive colourway. Choose from the colours below; the illustration shows your choice."). The waistcoat's default colour was changed to Stone so its photograph and default illustration agree.

## C. Logo refinement
- **Header**: lockup enlarged from 28 px mark + 126 px wordmark to 34 px + 164 px at rest (24 px + 124 px when scrolled), with a wider gap. On phones the lockup is 26 px + 104 px so it clears the menu, saved and bag controls at 360 px.
- **Mobile menu**: now carries mark + wordmark instead of the mark alone.
- **Atelier**: a 22 px lioness sits beside "The Atelier" label on the stage, as the signature of the customising experience.
- **Story**: a new editorial block near the foot of the page sets a 180 px lioness beside a short statement of what she stands for.
- **Footer**: mark (72 px) above the full-width wordmark, then the tape rule.
- **Favicon**: unchanged, `mark.png`.
- All instances use the original `mark.png` and `wordmark.png` from the client's files, embedded as data URIs in `components/logoData.ts`. Nothing was redrawn.

## D. The three-piece
- New homepage section between the featured collection and the Atelier: the coordinated-set photograph at 5:6, eyebrow "The three-piece", headline "One cloth. Three ways to wear it.", a component list (blazer, waistcoat, trouser), CTA **Make it yours** → `/atelier?garment=suit`, and a secondary link **Explore the three-piece** with the price → the product page.
- Collection: the three-piece card now carries the photograph and its "Three-piece" category tab remains.
- Product page: photograph with the campaign note, live illustration in the chosen colour, and the existing "Make it yours in the Atelier" hand-off that pre-selects the suit.
- Atelier: unchanged; three pieces configure independently with shared cloth and colour, compatibility rules intact.
- Shop the Look: unchanged (flat-lay of blazer, waistcoat and camisole).

## E. Visual review
Rendered in Chrome at 1440 px and, through an iframe harness, at 360 px and 390 px. Screenshots in `review/after2/`. Fixes made during review: the header lockup was cramped at 360 px (reduced), and the three compact featured cards squeezed their titles on phones (now a horizontal scroll row).

## F. Technical validation
- `tsc -b`: clean. `vite build`: clean.
- Routes exercised: `/`, `/#/collection`, `/#/product/sovereign-three-piece`, `/#/product/column-trouser`, `/#/atelier?garment=waistcoat`, `/#/atelier?garment=suit`, `/#/story`, mobile harness pages.
- Regression checks: add to bag and bag drawer, wishlist toggle, Atelier step flow for the three-piece, fit journey, footer form.
- Not deployed. The `deploy/` folder has not been updated and nothing was pushed, pending authorisation.
- Limitations: six of seven styles now have photography; the Ease blazer and Column trouser do not. Images are concept renders, not product photography, and are captioned "Campaign" accordingly.
