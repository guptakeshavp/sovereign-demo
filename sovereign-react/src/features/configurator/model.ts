/* Declarative configurator model. Options that do not apply to a garment are simply absent,
   so the UI never shows them and the reducer never records them. */
import { PRICING, fabricById, fabricsFor, fitsFor, LAPELS, CLOSURES, SLEEVES, LENGTHS, RISES, BREAKS, WAISTCOAT_NECKS, LININGS, SIZES_UK, colourById } from '../../data/options'
import type { GarmentType, Choice } from '../../data/types'
import { PRODUCTS, productById } from '../../data/catalogue'

export type Piece = 'blazer' | 'waistcoat' | 'trousers'
export type SizingMethod = 'standard' | 'guided' | 'mtm'

export interface PieceConfig {
  productId: string
  fabric: string
  colour: string
  fit: string
  details: Record<string, string>   // lapel, closure, sleeve, length, rise, break, neck, lining
  monogram: string
}
export interface Sizing {
  method: SizingMethod
  size: string                       // for standard / guided result
  measurements: Record<string, number | ''>  // TRANSIENT ONLY
  unit: 'cm' | 'in'
}
export interface ConfigState {
  garment: GarmentType | null         // 'suit' means three pieces
  pieces: Partial<Record<Piece, PieceConfig>>
  activePiece: Piece
  sizing: Sizing
  step: number
}

export const STEPS = [
  { id: 'garment', name: 'Garment' },
  { id: 'fabric', name: 'Fabric' },
  { id: 'colour', name: 'Colour' },
  { id: 'fit', name: 'Fit' },
  { id: 'details', name: 'Details' },
  { id: 'sizing', name: 'Sizing' },
  { id: 'review', name: 'Review' },
] as const

export const GARMENT_CHOICES: { id: GarmentType; name: string; note: string; productId: string }[] = [
  { id: 'blazer', name: 'Blazer', note: 'Start with the piece the house is built on.', productId: 'signature-blazer' },
  { id: 'trousers', name: 'Trousers', note: 'Column or wide. High rise either way.', productId: 'column-trouser' },
  { id: 'waistcoat', name: 'Waistcoat', note: 'Worn alone, or as the third piece.', productId: 'sculpted-waistcoat' },
  { id: 'suit', name: 'Three-piece suit', note: 'Blazer, waistcoat and trouser. Build each piece.', productId: 'sovereign-three-piece' },
]

export const PIECE_PRODUCT: Record<Piece, string> = { blazer: 'signature-blazer', waistcoat: 'sculpted-waistcoat', trousers: 'column-trouser' }

export function defaultPiece(productId: string): PieceConfig {
  const p = productById(productId)!
  const details: Record<string, string> = {}
  if (p.type === 'blazer') Object.assign(details, { lapel: p.lapel ?? 'peak', closure: p.doubleBreasted ? 'db4' : 'sb1', sleeve: 'standard', length: 'hip', lining: 'copper' })
  if (p.type === 'trousers') Object.assign(details, { rise: 'high', break: 'none', leg: p.leg ?? 'column' })
  if (p.type === 'waistcoat') Object.assign(details, { neck: p.neck ?? 'deep', lining: 'copper' })
  return { productId, fabric: p.defaultFabric, colour: p.defaultColour, fit: p.defaultFit, details, monogram: '' }
}

/* Detail groups that apply to a piece type. Order matters: it is the order shown. */
export function detailGroups(type: GarmentType): { key: string; label: string; items: Choice[] }[] {
  if (type === 'blazer') return [
    { key: 'lapel', label: 'Lapel', items: LAPELS },
    { key: 'closure', label: 'Closure', items: CLOSURES },
    { key: 'sleeve', label: 'Sleeve', items: SLEEVES },
    { key: 'length', label: 'Length', items: LENGTHS },
    { key: 'lining', label: 'Lining', items: LININGS },
  ]
  if (type === 'trousers') return [
    { key: 'leg', label: 'Leg', items: [{ id: 'column', name: 'Column', note: 'Straight and narrow.' }, { id: 'wide', name: 'Wide', note: 'Falls from the hip.' }] },
    { key: 'rise', label: 'Rise', items: RISES },
    { key: 'break', label: 'Break', items: BREAKS },
  ]
  if (type === 'waistcoat') return [
    { key: 'neck', label: 'Neckline', items: WAISTCOAT_NECKS },
    { key: 'lining', label: 'Lining', items: LININGS },
  ]
  return []
}

/* Compatibility rules (demo). Returns a reason if a choice is disallowed given the current piece. */
export function disallowed(piece: PieceConfig, key: string, value: string): string | null {
  if (key === 'closure' && value === 'db4' && piece.fit === 'sculpted') return 'Double-breasted is cut on the Signature or Relaxed fit.'
  if (key === 'fit' && value === 'sculpted' && piece.details.closure === 'db4') return 'Choose a single-breasted closure for the Sculpted fit.'
  if (key === 'lapel' && value === 'shawl' && piece.details.closure === 'db4') return 'A shawl lapel is single-breasted only.'
  if (key === 'closure' && value === 'db4' && piece.details.lapel === 'shawl') return 'A shawl lapel is single-breasted only.'
  if (key === 'fit' && value === 'wide' && piece.fabric === 'flannel') return 'The wide leg is cut in twill or crepe so it falls cleanly.'
  if (key === 'fabric' && value === 'flannel' && piece.details.leg === 'wide') return 'The wide leg is cut in twill or crepe.'
  return null
}

export const fabricsForPiece = (type: GarmentType) => fabricsFor(type === 'suit' ? 'blazer' : type)
export const fitsForPiece = (type: GarmentType) => fitsFor(type)

/* Deterministic pricing. */
export function piecePrice(piece: PieceConfig) {
  const p = productById(piece.productId)!
  const fabric = fabricById(piece.fabric)
  return { base: p.price, fabric: fabric.surcharge, monogram: piece.monogram ? PRICING.monogram : 0 }
}
export function totalPrice(state: ConfigState) {
  const pieces = Object.values(state.pieces).filter(Boolean) as PieceConfig[]
  const rows: { label: string; amount: number }[] = []
  for (const pc of pieces) {
    const p = productById(pc.productId)!
    const pr = piecePrice(pc)
    rows.push({ label: `${p.name} · ${colourById(pc.colour).name}`, amount: pr.base })
    if (pr.fabric) rows.push({ label: `${fabricById(pc.fabric).name}`, amount: pr.fabric })
    if (pr.monogram) rows.push({ label: `Monogram ${pc.monogram}`, amount: pr.monogram })
  }
  if (state.garment === 'suit' && pieces.length === 3) {
    // set price: the three-piece is offered below the sum of its parts (demo rule)
    const suit = productById('sovereign-three-piece')!
    const parts = pieces.reduce((s, pc) => s + piecePrice(pc).base, 0)
    rows.push({ label: 'Three-piece set adjustment', amount: suit.price - parts })
  }
  if (state.sizing.method === 'mtm') rows.push({ label: 'Made to measure, with fitting', amount: PRICING.madeToMeasure })
  return { rows, total: rows.reduce((s, r) => s + r.amount, 0) }
}

export const SIZES = SIZES_UK
export const ALL_PRODUCTS = PRODUCTS
