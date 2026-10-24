import type { Product } from '../data/types'

/** Never retain a different colour's photograph beside a selected swatch. */
export function productImage(product: Product, colour = product.defaultColour) {
  return product.colourImages?.[colour] ?? (colour === product.defaultColour ? product.images[0] : undefined)
}

export function photographedColours(product: Product) {
  return product.colours.filter(colour => !!productImage(product, colour))
}
