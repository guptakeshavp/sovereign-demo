import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '../features/cart/CartContext'
import { useReveal, useScrollTop } from '../lib/motion'
import { inr } from '../lib/format'
import { TapeRule } from '../components/Tape'
import { Mark } from "../components/Logo"

export default function Bag() {
  const cart = useCart()
  const root = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<'bag' | 'checkout' | 'placed'>('bag')
  const [pin, setPin] = useState('')
  useReveal(root, [stage, cart.lines.length]); useScrollTop(stage)
  const tax = Math.round(cart.subtotal * 0.0)  // demo: prices shown tax-inclusive

  if (stage === 'placed') return (
    <div ref={root} className="page surface-dark min-h-screen grid place-items-center">
      <div className="wrap max-w-[640px] text-center py-40">
        <Mark className="rv w-[34px] mx-auto opacity-70" />
        <p className="label copper rv mt-8">Demonstration order</p>
        <h1 className="t-xl rv mt-4" data-delay=".05">Noted, and nothing more.</h1>
        <p className="t-lead opacity-70 rv mt-6" data-delay=".1">No payment was taken and no order exists. In production this is where a UPI or card payment would complete, a confirmation would be sent, and a fitting would be booked for any made-to-measure piece.</p>
        <div className="rv mt-10 flex justify-center gap-4 flex-wrap" data-delay=".15"><Link to="/collection" className="btn btn-solid" onClick={() => cart.clear()}>Back to the collection</Link><Link to="/" className="link" onClick={() => cart.clear()}>Home</Link></div>
      </div>
    </div>
  )

  return (
    <div ref={root} className="page surface-light min-h-screen">
      <section className="wrap pt-28 pb-8" data-hero>
        <p className="label rv opacity-60">{stage === 'bag' ? 'Your bag' : 'Checkout · demonstration'}</p>
        <h1 className="t-xl mt-5" data-lines><span className="rv-line"><span>{stage === 'bag' ? (cart.lines.length ? 'Almost yours.' : 'Your bag is empty.') : 'Where should it go?'}</span></span></h1>
      </section>
      <section className="wrap pb-28 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
        <div>
          {cart.lines.length === 0 && stage === 'bag' && (
            <div className="rv"><p className="t-lead opacity-70 max-w-[480px]">Start with the collection, or build a piece to your own measurements in the Atelier.</p><div className="mt-8 flex gap-4 flex-wrap"><Link to="/collection" className="btn btn-solid">The collection</Link><Link to="/atelier" className="btn">The Atelier</Link></div></div>
          )}
          {stage === 'bag' && cart.lines.map(l => (
            <div key={l.key} className="rv grid grid-cols-[1fr_auto] gap-6 py-6 border-b border-[rgba(22,19,15,.12)] first:border-t">
              <div>
                <p className="text-[15px] font-medium">{l.name}{l.configured && <span className="ml-2 label-s copper">Atelier</span>}</p>
                <p className="text-[13px] opacity-60 mt-1">{[l.colour, l.fabric, l.fit, l.size].filter(Boolean).join(' · ')}</p>
                {l.details && <ul className="mt-2 text-[12.5px] opacity-55 list-none m-0 p-0 grid gap-0.5">{Object.values(l.details).map((d, i) => <li key={i}>{d}</li>)}</ul>}
                <div className="mt-4 flex items-center gap-4">
                  <div className="inline-flex items-center border border-[rgba(22,19,15,.25)]">
                    <button className="w-9 h-9 grid place-items-center" onClick={() => cart.setQty(l.key, l.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                    <span className="num w-7 text-center text-[13px]">{l.qty}</span>
                    <button className="w-9 h-9 grid place-items-center" onClick={() => cart.setQty(l.key, l.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                  </div>
                  <button className="label-s opacity-60 hover:opacity-100" onClick={() => cart.remove(l.key)}>Remove</button>
                </div>
              </div>
              <div className="text-right"><p className="num text-[15px]">{inr(l.unitPrice * l.qty)}</p>{l.qty > 1 && <p className="num text-[12px] opacity-50">{inr(l.unitPrice)} each</p>}</div>
            </div>
          ))}
          {stage === 'checkout' && (
            <form className="rv grid gap-6 max-w-[620px]" onSubmit={e => { e.preventDefault(); setStage('placed') }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="field"><span>First name</span><input required autoComplete="given-name" /></label>
                <label className="field"><span>Last name</span><input required autoComplete="family-name" /></label>
                <label className="field sm:col-span-2"><span>Email</span><input type="email" required autoComplete="email" /></label>
                <label className="field sm:col-span-2"><span>Mobile</span><input inputMode="tel" required autoComplete="tel" placeholder="+91" /></label>
                <label className="field sm:col-span-2"><span>Address</span><input required autoComplete="street-address" /></label>
                <label className="field"><span>City</span><input required autoComplete="address-level2" /></label>
                <label className="field"><span>PIN code</span><input required inputMode="numeric" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} pattern="\d{6}" /></label>
              </div>
              <div>
                <p className="label-s opacity-55 mb-3">Payment, at launch</p>
                <div className="grid sm:grid-cols-3 gap-2">{['UPI', 'Card', 'Net banking'].map((m, i) => <span key={m} className="tile !border-[rgba(22,19,15,.18)]" aria-pressed={i === 0}><b>{m}</b><small>{i === 0 ? 'Preferred in India' : 'Available'}</small></span>)}</div>
                <p className="text-[12px] opacity-50 mt-3">No payment is taken in this demonstration. Integration with a payment gateway is a production step.</p>
              </div>
              <div className="flex gap-4 flex-wrap"><button type="submit" className="btn btn-copper">Place demonstration order</button><button type="button" className="link" onClick={() => setStage('bag')}>Back to the bag</button></div>
            </form>
          )}
        </div>
        {cart.lines.length > 0 && (
          <aside className="rv lg:sticky lg:top-28 border border-[rgba(22,19,15,.15)] p-7" data-delay=".1">
            <h2 className="t-s">Summary</h2>
            <div className="mt-5 grid gap-2 text-[14px]">
              <div className="flex justify-between"><span className="opacity-70">Subtotal · {cart.count} {cart.count === 1 ? 'piece' : 'pieces'}</span><span className="num">{inr(cart.subtotal)}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Taxes</span><span className="num opacity-70">Included</span></div>
              <div className="flex justify-between"><span className="opacity-70">Delivery</span><span className="opacity-70">To be confirmed</span></div>
              <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-[rgba(22,19,15,.12)]"><span className="label-s">Total</span><span className="t-m num">{inr(cart.subtotal + tax)}</span></div>
            </div>
            <TapeRule className="my-6 text-ink" />
            <p className="text-[12.5px] opacity-55">Made-to-measure pieces are confirmed with you before they are made. Lead times, delivery and returns policies await client approval and are not shown.</p>
            {stage === 'bag' && <button className="btn btn-solid w-full mt-6" onClick={() => setStage('checkout')}>Continue to checkout</button>}
          </aside>
        )}
      </section>
    </div>
  )
}
