import { Link } from 'react-router-dom'
import { X, Minus, Plus } from 'lucide-react'
import { useCart } from '../features/cart/CartContext'
import { inr, cx } from '../lib/format'
import { useEffect, useRef } from 'react'

export function BagDrawer() {
  const cart = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') cart.setOpen(false) }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [cart])
  useEffect(() => {
    if (cart.open) { returnTo.current = document.activeElement as HTMLElement; setTimeout(() => closeRef.current?.focus(), 50) }
    else returnTo.current?.focus?.()
  }, [cart.open])
  return (
    <>
      <div className={cx('fixed inset-0 z-[70] bg-[rgba(22,19,15,.55)] transition-opacity duration-500', cart.open ? 'opacity-100' : 'opacity-0 pointer-events-none')} onClick={() => cart.setOpen(false)} aria-hidden />
      <aside className={cx('fixed top-0 right-0 bottom-0 z-[80] w-full max-w-[460px] surface-light flex flex-col transition-transform duration-[.6s] ease-[var(--ease-out-soft)]', cart.open ? 'translate-x-0' : 'translate-x-full')}
        role="dialog" aria-modal="true" aria-label="Your bag" aria-hidden={!cart.open} inert={!cart.open ? true : undefined}>
        <div className="flex items-center justify-between px-7 h-[84px] border-b border-[rgba(22,19,15,.1)]">
          <h2 className="t-s">Your bag <span className="num text-[13px] font-sans opacity-60 ml-2">{cart.count}</span></h2>
          <button ref={closeRef} onClick={() => cart.setOpen(false)} aria-label="Close bag"><X size={20} strokeWidth={1.3} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6 grid gap-6 content-start">
          {cart.lines.length === 0 && (
            <div className="py-10">
              <p className="t-m">Nothing in your bag yet.</p>
              <p className="mt-3 text-[14px] opacity-60">Start with the collection, or build a piece to your own measurements in the Atelier.</p>
              <div className="mt-6 flex gap-5"><Link to="/collection" className="link" onClick={() => cart.setOpen(false)}>Collection</Link><Link to="/atelier" className="link" onClick={() => cart.setOpen(false)}>Atelier</Link></div>
            </div>
          )}
          {cart.lines.map(l => (
            <div key={l.key} className="grid grid-cols-[1fr_auto] gap-4 pb-6 border-b border-[rgba(22,19,15,.1)]">
              <div>
                <p className="text-[14px] font-medium">{l.name}{l.configured && <span className="ml-2 label-s copper">Atelier</span>}</p>
                <p className="text-[12.5px] opacity-60 mt-1">{[l.colour, l.fabric, l.fit, l.size].filter(Boolean).join(' · ')}</p>
                {l.details && Object.keys(l.details).length > 0 && <p className="text-[12px] opacity-50 mt-1">{Object.values(l.details).join(' · ')}</p>}
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center border border-[rgba(22,19,15,.25)]">
                    <button className="w-9 h-9 grid place-items-center" onClick={() => cart.setQty(l.key, l.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                    <span className="num w-7 text-center text-[13px]">{l.qty}</span>
                    <button className="w-9 h-9 grid place-items-center" onClick={() => cart.setQty(l.key, l.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                  </div>
                  <button className="label-s opacity-60 hover:opacity-100" onClick={() => cart.remove(l.key)}>Remove</button>
                </div>
              </div>
              <span className="num text-[14px]">{inr(l.unitPrice * l.qty)}</span>
            </div>
          ))}
        </div>
        {cart.lines.length > 0 && (
          <div className="px-7 py-6 border-t border-[rgba(22,19,15,.1)]">
            <div className="flex justify-between text-[14px]"><span>Subtotal</span><span className="num">{inr(cart.subtotal)}</span></div>
            <p className="text-[12px] opacity-55 mt-1">Delivery and taxes shown at checkout. Demonstration pricing.</p>
            <Link to="/bag" className="btn btn-solid w-full mt-5" onClick={() => cart.setOpen(false)}>Review and check out</Link>
          </div>
        )}
      </aside>
    </>
  )
}
