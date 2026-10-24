/* Sovereign demo data model.
   Everything here is DEMONSTRATION DATA: prices, fabrics and lead times are placeholders
   awaiting client approval. Shaped so a future commerce backend (e.g. Shopify) can map
   products → variants → line items without reworking the UI. */

export type GarmentType = 'blazer' | 'trousers' | 'waistcoat' | 'camisole' | 'suit'
export type Category = 'blazers' | 'trousers' | 'waistcoats' | 'camisoles' | 'suits'

export interface Colour { id: string; name: string; hex: string; light?: boolean }
export interface Fabric {
  id: string; name: string; hand: string; weight: string; surcharge: number
  texture: 'twill' | 'flannel' | 'crepe' | 'hopsack' | 'satin'
  for: GarmentType[]
  demo: true
}
export interface Fit { id: string; name: string; note: string; scale: number; for: GarmentType[] }
export interface Lapel { id: 'notch' | 'peak' | 'shawl'; name: string; note: string }
export interface Choice { id: string; name: string; note?: string; price?: number }

export interface Product {
  id: string
  name: string
  type: GarmentType
  category: Category
  tagline: string
  description: string
  price: number            // base, INR, demo
  colours: string[]        // colour ids
  defaultColour: string
  fabrics: string[]        // fabric ids
  defaultFabric: string
  fits: string[]           // fit ids
  defaultFit: string
  sizes: string[]
  lapel?: Lapel['id']
  buttons?: number
  doubleBreasted?: boolean
  pleat?: 'none' | 'single'
  neck?: 'classic' | 'deep' | 'straight' | 'cowl'
  leg?: 'column' | 'wide'
  images: string[]         // public paths; first is the hero
  colourImages?: Record<string, string> // exact photographed colour → image, never a recoloured filter
  wornWith: string[]       // product ids
  customisable: boolean
  isNew?: boolean
  components?: { blazer: string; waistcoat: string; trousers: string } // for suits
}

export interface Look {
  id: string; name: string; story: string; image: string
  imageAlt: string
  items: { productId: string; colour: string; note: string; hotspot: { x: number; y: number } }[]
}

export interface CartLine {
  key: string
  productId: string
  name: string
  unitPrice: number
  qty: number
  colour: string
  fabric?: string
  fit?: string
  size: string            // 'UK 10' | 'Made to measure' | 'Guided: UK 10'
  details?: Record<string, string>
  configured?: boolean
}
