import type { Product, Look } from './types'

/* Seven representative women's styles. Names are working names, not approved. */
const BASE_PRODUCTS: Product[] = [
  {
    id: 'signature-blazer', name: 'The Signature blazer', type: 'blazer', category: 'blazers',
    tagline: 'One button. A long lapel. The piece the house is built on.',
    description: 'A single-breasted blazer with a peak lapel and a single button set low, so the lapel runs long and the waist reads clean. Shaped through the body with a defined shoulder. Worn closed to a meeting and open over a camisole after it.',
    price: 42000, colours: ['charcoal', 'dove', 'ink', 'espresso', 'stone', 'midnight'], defaultColour: 'dove',
    fabrics: ['twill', 'hopsack', 'flannel', 'crepe'], defaultFabric: 'twill',
    fits: ['sculpted', 'signature', 'relaxed'], defaultFit: 'signature',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    lapel: 'peak', buttons: 1, images: ['/images/campaign-v2/blazer.jpg'], wornWith: ['column-trouser', 'silk-camisole', 'sculpted-waistcoat'], customisable: true, isNew: true,
  },
  {
    id: 'ease-blazer', name: 'The Ease blazer', type: 'blazer', category: 'blazers',
    tagline: 'Double-breasted, soft-shouldered, made to be worn open.',
    description: 'A relaxed double-breasted blazer with a lower button stance and a softer shoulder. Longer through the body. The one for jeans and an evening, as much as for a boardroom.',
    price: 46000, colours: ['charcoal', 'ink', 'stone', 'espresso', 'oxblood'], defaultColour: 'charcoal',
    fabrics: ['twill', 'hopsack', 'flannel'], defaultFabric: 'hopsack',
    fits: ['signature', 'relaxed'], defaultFit: 'relaxed',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    lapel: 'peak', buttons: 4, doubleBreasted: true, images: [], wornWith: ['wide-trouser', 'silk-camisole'], customisable: true,
  },
  {
    id: 'column-trouser', name: 'The Column trouser', type: 'trousers', category: 'trousers',
    tagline: 'High rise, straight leg, no break.',
    description: 'A high-rise trouser with a single pleat and a narrow, straight leg that finishes clean at the ankle. The natural partner to the Signature blazer, and the quietest thing in the room on its own.',
    price: 18500, colours: ['charcoal', 'dove', 'ink', 'espresso', 'stone', 'midnight'], defaultColour: 'dove',
    fabrics: ['twill', 'hopsack', 'flannel', 'crepe'], defaultFabric: 'twill',
    fits: ['column'], defaultFit: 'column',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    pleat: 'single', leg: 'column', images: [], wornWith: ['signature-blazer', 'silk-camisole'], customisable: true,
  },
  {
    id: 'wide-trouser', name: 'The Wide trouser', type: 'trousers', category: 'trousers',
    tagline: 'A wide leg that falls from the hip to the floor.',
    description: 'A high-rise, wide-leg trouser with a flat front and a long, unbroken line. Cut to be worn with a heel or a flat, and with the cropped length of the Signature blazer.',
    price: 19500, colours: ['charcoal', 'ink', 'stone', 'ivory', 'espresso'], defaultColour: 'stone',
    fabrics: ['twill', 'crepe', 'flannel'], defaultFabric: 'crepe',
    fits: ['wide'], defaultFit: 'wide',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    pleat: 'none', leg: 'wide', images: ['/images/campaign-v2/trousers.jpg'], wornWith: ['ease-blazer', 'sculpted-waistcoat'], customisable: true, isNew: true,
  },
  {
    id: 'sculpted-waistcoat', name: 'The Sculpted waistcoat', type: 'waistcoat', category: 'waistcoats',
    tagline: 'Five buttons, a pointed hem, worn alone or under.',
    description: 'A shaped waistcoat with a deep V, five buttons and welt pockets. Fully lined. Worn alone with the Column trouser it is a complete look; under the Signature blazer it is a three-piece.',
    price: 16500, colours: ['stone', 'charcoal', 'dove', 'ink', 'espresso', 'oxblood'], defaultColour: 'stone',
    fabrics: ['twill', 'hopsack', 'flannel'], defaultFabric: 'twill',
    fits: ['sculpted', 'signature'], defaultFit: 'sculpted',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    neck: 'deep', buttons: 5, images: ['/images/campaign-v2/waistcoat.jpg'], wornWith: ['column-trouser', 'wide-trouser', 'signature-blazer'], customisable: true,
  },
  {
    id: 'silk-camisole', name: 'The Silk camisole', type: 'camisole', category: 'camisoles',
    tagline: 'The quiet layer under everything.',
    description: 'A bias-cut camisole in silk charmeuse with fine straps and a straight or cowl neck. Made to sit under a blazer without a line, and to be seen when the blazer comes off.',
    price: 9800, colours: ['ivory', 'stone', 'ink', 'oxblood'], defaultColour: 'ivory',
    fabrics: ['charmeuse'], defaultFabric: 'charmeuse',
    fits: ['bias'], defaultFit: 'bias',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    neck: 'cowl', images: ['/images/campaign-v2/camisole.jpg'], wornWith: ['signature-blazer', 'column-trouser'], customisable: false,
  },
  {
    id: 'sovereign-three-piece', name: 'The Sovereign three-piece', type: 'suit', category: 'suits',
    tagline: 'Blazer, waistcoat and trouser. One cloth, three ways to wear it.',
    description: 'The Signature blazer, the Sculpted waistcoat and the Column trouser, cut from one cloth so the colour holds in every light. Order it as a set, or build each piece to your own cut in the Atelier.',
    price: 72000, colours: ['charcoal', 'dove', 'ink', 'espresso', 'midnight'], defaultColour: 'charcoal',
    fabrics: ['twill', 'hopsack', 'flannel', 'crepe'], defaultFabric: 'twill',
    fits: ['sculpted', 'signature', 'relaxed'], defaultFit: 'signature',
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
    lapel: 'peak', buttons: 1, images: ['/images/campaign-v2/suit.jpg'], wornWith: ['silk-camisole'], customisable: true,
    components: { blazer: 'signature-blazer', waistcoat: 'sculpted-waistcoat', trousers: 'column-trouser' },
  },
]

// Keep the earlier neutral photography; retain the Atelier's wider custom palette.
export const PRODUCTS: Product[] = BASE_PRODUCTS.map(product => ({
  ...product,
  colourImages: product.images[0] ? { [product.defaultColour]: product.images[0] } : {},
  colours: [...new Set([...product.colours, ...(product.customisable ? ['mor', 'gulabi', 'jamun', 'kesar'] : [])])],
}))

export const LOOKS: Look[] = [
  {
    id: 'the-first-day', name: 'On her terms', image: '/images/campaign-v2/look.jpg',
    imageAlt: 'A woman wearing a dove-grey blazer and straight-leg trousers with an ivory silk camisole',
    story: 'Dove-grey tailoring. Ivory silk. From the first meeting to the last reservation.',
    items: [
      { productId: 'signature-blazer', colour: 'dove', note: 'Worn open over silk', hotspot: { x: 66, y: 37 } },
      { productId: 'silk-camisole', colour: 'ivory', note: 'A soft cowl beneath the lapel', hotspot: { x: 50, y: 25 } },
      { productId: 'column-trouser', colour: 'dove', note: 'A clean, straight line', hotspot: { x: 55, y: 68 } },
    ],
  },
]

export const productById = (id: string) => PRODUCTS.find(p => p.id === id)
export const CATEGORIES: { id: Product['category'] | 'all'; name: string }[] = [
  { id: 'all', name: 'All' }, { id: 'blazers', name: 'Blazers' }, { id: 'trousers', name: 'Trousers' },
  { id: 'waistcoats', name: 'Waistcoats' }, { id: 'camisoles', name: 'Camisoles' }, { id: 'suits', name: 'Three-piece' },
]
