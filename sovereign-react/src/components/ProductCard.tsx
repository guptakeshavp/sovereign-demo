import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '../data/types'
import { Garment, specFor } from '../features/garment/Garment'
import { useWishlist } from '../features/wishlist/WishlistContext'
import { inr, cx } from '../lib/format'
import { colourById, fabricById, fitById } from '../data/options'
import { productImage } from '../lib/productImage'
import { DetailsDialog } from './DetailsDialog'
import { useState } from 'react'

export function ProductCard({ p, delay = 0, colour, large = false, compact = false }: { p: Product; delay?: number; colour?: string; large?: boolean; compact?: boolean }) {
  const wish = useWishlist()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const c = hover ?? colour ?? p.defaultColour
  const photo = productImage(p, c)
  return (
    <article className={cx('card rv group relative', large && 'card-large')} data-delay={delay}>
      <button type="button" className="block w-full relative text-left" aria-label={`View details for ${p.name}`} onClick={() => setDetailsOpen(true)}>
        <div className="frame">
          {photo ? <img src={'.' + photo} alt="" loading="lazy" className="object-[50%_15%] transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
                 : <Garment kind={p.type} spec={specFor(p, c)} />}
          {p.isNew && <span className="absolute top-4 left-4 label-s opacity-70">New</span>}
          <span className="product-image-details"><Plus size={13} />Details</span>
        </div>
      </button>
      <button className="save-product absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity" style={{ opacity: wish.has(p.id) ? 1 : undefined }}
        onClick={() => wish.toggle(p.id)} aria-pressed={wish.has(p.id)} aria-label={wish.has(p.id) ? `Remove ${p.name} from saved` : `Save ${p.name}`} >
        <Heart size={16} strokeWidth={1.4} fill={wish.has(p.id) ? 'currentColor' : 'none'} />
      </button>
      <div className="mt-4 flex justify-between items-baseline gap-3">
        <h3 className={cx('font-sans font-medium tracking-[.02em]', compact ? 'text-[12.5px]' : 'text-[13.5px]')}><Link to={`/product/${p.id}?colour=${c}`}>{p.name}</Link></h3>
        <span className={cx('num opacity-70', compact ? 'text-[12px]' : 'text-[13px]')}>{inr(p.price)}</span>
      </div>
      {!photo && !compact && (
        <div className="mt-3 flex gap-2" aria-label="Colours">
          {p.colours.slice(0, 6).map(id => <button key={id} className="swatch-sm" style={{ background: colourById(id).hex, outline: c === id ? '1px solid var(--color-copper)' : undefined, outlineOffset: 2 }}
            onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} onClick={() => setHover(id)} aria-label={colourById(id).name} />)}
        </div>
      )}
      <DetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} title={p.name}>
        <p className="num">{inr(p.price)}</p>
        <p>{p.description}</p>
        <dl className="details-dialog-facts">
          <div><dt>Colour</dt><dd>{colourById(c).name}</dd></div>
          <div><dt>Cloth</dt><dd>{p.fabrics.map(id => fabricById(id).name).join(' · ')}</dd></div>
          <div><dt>Cut</dt><dd>{p.fits.map(id => fitById(id).name).join(' · ')}</dd></div>
          <div><dt>Sizing</dt><dd>{p.sizes.join(' · ')}{p.customisable && '. Made to measure in the Atelier.'}</dd></div>
        </dl>
        <Link to={`/product/${p.id}?colour=${c}`} onClick={() => setDetailsOpen(false)} className="btn btn-solid w-full">Choose your size</Link>
        {p.customisable && <Link to={`/atelier?garment=${p.type}&product=${p.id}&colour=${c}`} onClick={() => setDetailsOpen(false)} className="link mt-6">Make it yours in the Atelier</Link>}
      </DetailsDialog>
    </article>
  )
}
