import type { Colour, Fabric, Fit, Lapel, Choice, GarmentType } from './types'

export const COLOURS: Colour[] = [
  { id: 'charcoal', name: 'Charcoal', hex: '#34302D' },
  { id: 'ink', name: 'Ink', hex: '#1E1C1F' },
  { id: 'dove', name: 'Dove grey', hex: '#9A948C' },
  { id: 'stone', name: 'Stone', hex: '#B9AE9D', light: true },
  { id: 'espresso', name: 'Espresso', hex: '#4A372C' },
  { id: 'midnight', name: 'Midnight', hex: '#252B3B' },
  { id: 'oxblood', name: 'Oxblood', hex: '#5A2A2C' },
  { id: 'ivory', name: 'Ivory', hex: '#E7E0D3', light: true },
  { id: 'mor', name: 'Mor teal', hex: '#17666B' },
  { id: 'gulabi', name: 'Gulabi pink', hex: '#B73364' },
  { id: 'jamun', name: 'Jamun purple', hex: '#65304F' },
  { id: 'kesar', name: 'Kesar ochre', hex: '#B77B22' },
]

export const FABRICS: Fabric[] = [
  { id: 'twill', name: 'Worsted twill', hand: 'Smooth, dry, holds a crease. The house cloth.', weight: 'Mid-weight · placeholder spec', surcharge: 0, texture: 'twill', for: ['blazer', 'trousers', 'waistcoat', 'suit'], demo: true },
  { id: 'hopsack', name: 'Hopsack', hand: 'Open basket weave with more air through it. Travels well.', weight: 'Light-mid · placeholder spec', surcharge: 2500, texture: 'hopsack', for: ['blazer', 'trousers', 'waistcoat', 'suit'], demo: true },
  { id: 'flannel', name: 'Flannel', hand: 'Brushed, soft, matte. For cooler months and evenings.', weight: 'Mid-heavy · placeholder spec', surcharge: 4000, texture: 'flannel', for: ['blazer', 'trousers', 'waistcoat', 'suit'], demo: true },
  { id: 'crepe', name: 'Stretch crepe', hand: 'Fluid, with a little give. Sits closer without pulling.', weight: 'Light · placeholder spec', surcharge: 3000, texture: 'crepe', for: ['blazer', 'trousers', 'suit'], demo: true },
  { id: 'charmeuse', name: 'Silk charmeuse', hand: 'Liquid, with a soft sheen on the face.', weight: 'Light · placeholder spec', surcharge: 0, texture: 'satin', for: ['camisole'], demo: true },
]

export const FITS: Fit[] = [
  { id: 'sculpted', name: 'Sculpted', note: 'Close through the waist, higher armhole, a defined shoulder.', scale: 0.95, for: ['blazer', 'waistcoat', 'suit'] },
  { id: 'signature', name: 'Signature', note: 'The house line. Shaped, never tight. Room for a camisole or a knit.', scale: 1, for: ['blazer', 'waistcoat', 'suit'] },
  { id: 'relaxed', name: 'Relaxed', note: 'Softer shoulder, longer body, made to be worn open.', scale: 1.06, for: ['blazer', 'suit'] },
  { id: 'column', name: 'Column', note: 'Straight from the hip, a narrow full-length leg.', scale: 1, for: ['trousers'] },
  { id: 'wide', name: 'Wide', note: 'High rise, a wide leg that falls from the hip to the floor.', scale: 1.14, for: ['trousers'] },
  { id: 'bias', name: 'Bias', note: 'Cut on the bias so it moves with you.', scale: 1, for: ['camisole'] },
]

export const LAPELS: Lapel[] = [
  { id: 'notch', name: 'Notch', note: 'The quiet classic. Right in any room.' },
  { id: 'peak', name: 'Peak', note: 'Sharper line to the shoulder. More occasion.' },
  { id: 'shawl', name: 'Shawl', note: 'One unbroken curve. For evenings.' },
]

export const CLOSURES: Choice[] = [
  { id: 'sb1', name: 'Single, one button', note: 'A long lapel line. Our signature.' },
  { id: 'sb2', name: 'Single, two buttons', note: 'A touch more coverage.' },
  { id: 'db4', name: 'Double-breasted', note: 'Four buttons, a wider lapel. Relaxed fit recommended.' },
]

export const SLEEVES: Choice[] = [
  { id: 'standard', name: 'Standard', note: 'To the wrist bone.' },
  { id: 'bracelet', name: 'Bracelet', note: 'A little shorter, shows a watch or a cuff.' },
]

export const LENGTHS: Choice[] = [
  { id: 'cropped', name: 'Cropped', note: 'Ends at the high hip. Good with the wide trouser.' },
  { id: 'hip', name: 'Classic', note: 'Covers the hip. The house length.' },
  { id: 'long', name: 'Longline', note: 'Mid-thigh. Worn open.' },
]

export const RISES: Choice[] = [
  { id: 'high', name: 'High rise', note: 'Sits at the natural waist.' },
  { id: 'mid', name: 'Mid rise', note: 'A finger below the natural waist.' },
]
export const BREAKS: Choice[] = [
  { id: 'none', name: 'No break', note: 'Clean at the ankle, for heels or flats.' },
  { id: 'slight', name: 'Slight break', note: 'A soft fold at the shoe.' },
]
export const WAISTCOAT_NECKS: Choice[] = [
  { id: 'classic', name: 'Classic V', note: 'Sits above a blazer.' },
  { id: 'deep', name: 'Deep V', note: 'Worn alone, or under a one-button.' },
]
export const CAMI_NECKS: Choice[] = [
  { id: 'straight', name: 'Straight', note: 'Quiet under a blazer.' },
  { id: 'cowl', name: 'Cowl', note: 'A softer line, worn open.' },
]

export const LININGS: Choice[] = [
  { id: 'copper', name: 'Copper silk' },
  { id: 'slate', name: 'Slate silk' },
  { id: 'ivory', name: 'Ivory silk' },
  { id: 'oxblood', name: 'Oxblood silk' },
]
export const LINING_HEX: Record<string, string> = { copper: '#A5673F', slate: '#5B6472', ivory: '#E8E2D6', oxblood: '#5E2B2B' }

export const SIZES_UK = ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18']

/* Demo pricing rules: deterministic, never random. */
export const PRICING = {
  monogram: 1500,
  madeToMeasure: 6000,   // made-to-measure service, DEMO figure; terms to be confirmed with the client
  liningUpgrade: 0,
}

export const colourById = (id: string) => COLOURS.find(c => c.id === id) ?? COLOURS[0]
export const fabricById = (id: string) => FABRICS.find(f => f.id === id) ?? FABRICS[0]
export const fitById = (id: string) => FITS.find(f => f.id === id) ?? FITS[1]
export const fabricsFor = (t: GarmentType) => FABRICS.filter(f => f.for.includes(t))
export const fitsFor = (t: GarmentType) => FITS.filter(f => f.for.includes(t))
