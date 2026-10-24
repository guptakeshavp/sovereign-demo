import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../features/wishlist/WishlistContext'
import { productById } from '../data/catalogue'
import { ProductCard } from '../components/ProductCard'
import { useReveal, useScrollTop } from '../lib/motion'

export default function Wishlist() {
  const wish = useWishlist()
  const root = useRef<HTMLDivElement>(null)
  const items = wish.ids.map(productById).filter(Boolean) as NonNullable<ReturnType<typeof productById>>[]
  useReveal(root, [items.length]); useScrollTop(null)
  return (
    <div ref={root} className="page surface-light min-h-screen">
      <section className="wrap pt-28 pb-10" data-hero>
        <p className="label rv opacity-60">Saved</p>
        <h1 className="t-xl mt-5" data-lines><span className="rv-line"><span>{items.length ? 'Pieces you are' : 'Nothing saved'}</span></span><span className="rv-line"><span>{items.length ? <>still <em className="t-i">deciding</em> on.</> : <>yet.</>}</span></span></h1>
      </section>
      <section className="wrap pb-28">
        {items.length === 0 ? (
          <div className="max-w-[480px]">
            <p className="t-lead opacity-70">Save a piece from the collection and it will wait here. Saved pieces stay in this browser only.</p>
            <Link to="/collection" className="btn btn-solid mt-8">The collection</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-14 lg:gap-x-8">{items.map((p, i) => <div key={p.id}><ProductCard p={p} delay={i * .08} /><button className="label-s opacity-50 hover:opacity-100 mt-3" onClick={() => wish.remove(p.id)}>Remove</button></div>)}</div>
            <p className="text-[12.5px] opacity-50 mt-14">Saved in this browser only. A customer account would be needed to keep a wishlist across devices.</p>
          </>
        )}
      </section>
    </div>
  )
}
