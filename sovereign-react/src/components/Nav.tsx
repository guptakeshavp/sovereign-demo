import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { Mark, Wordmark } from './Logo'
import { useCart } from '../features/cart/CartContext'
import { cx } from '../lib/format'

const LINKS = [
  { to: '/collection', label: 'Collection' },
  { to: '/atelier', label: 'Atelier' },
  { to: '/look', label: 'The look' },
  { to: '/story', label: 'Story' },
]

export function Nav({ light, solid = false }: { light: boolean; solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const cart = useCart()
  const loc = useLocation()
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  const onLight = light || scrolled
  return (
    <>
      <header className={cx('fixed inset-x-0 top-0 z-50 transition-[background,color,height,box-shadow] duration-500',
        scrolled ? 'h-[66px] backdrop-blur-md' : 'h-[84px]',
        scrolled ? 'bg-[rgba(239,233,224,.88)] text-ink shadow-[0_1px_0_rgba(22,19,15,.1)]' : light ? 'text-ink' : 'text-bone', solid && !scrolled && 'bg-bone')}>
        <div className="wrap h-full grid grid-cols-[1fr_auto_1fr] items-center">
          <nav className="hidden lg:flex gap-8" aria-label="Primary">
            {LINKS.map(l => <NavLink key={l.to} to={l.to} className="nav-link">{l.label}</NavLink>)}
          </nav>
          <button className="lg:hidden justify-self-start flex items-center gap-2 label-s" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} strokeWidth={1.4} /></button>
          <Link to="/" className="flex items-center gap-4 max-sm:gap-2.5" aria-label="Sovereign home">
            <Mark className={cx('transition-all duration-500', scrolled ? 'w-[24px]' : 'w-[34px] max-sm:w-[26px]')} />
            <Wordmark className={cx('transition-all duration-500', scrolled ? 'w-[124px] max-sm:w-[112px]' : 'w-[164px] max-sm:w-[128px]')} />
          </Link>
          <div className="flex justify-end items-center gap-6 max-sm:gap-4">
            <button className="nav-link flex items-center gap-2" onClick={() => cart.setOpen(true)} aria-label={`Bag, ${cart.count} items`}>
              <ShoppingBag size={16} strokeWidth={1.4} /><span className="hidden sm:inline">Bag</span>
              <span className="num inline-grid place-items-center min-w-[18px] h-[18px] text-[10px] border border-current rounded-full tracking-normal">{cart.count}</span>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div className={cx('fixed inset-0 z-[60] surface-dark transition-opacity duration-500', open ? 'opacity-100' : 'opacity-0 pointer-events-none')} aria-hidden={!open}>
        <div className="wrap h-[84px] flex items-center justify-between">
          <span className="flex items-center gap-4"><Mark className="w-[32px]" /><Wordmark className="w-[140px]" /></span>
          <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} strokeWidth={1.3} /></button>
        </div>
        <nav className="wrap mt-10 grid gap-6" aria-label="Mobile">
          {LINKS.map((l, i) => <NavLink key={l.to} to={l.to} className="t-l" style={{ transitionDelay: `${i * 40}ms` }}>{l.label}</NavLink>)}
        </nav>
        <p className="wrap absolute bottom-8 label-s opacity-50">Women's tailoring · Launching in India · Demo</p>
      </div>
      <div aria-hidden className={cx('transition-opacity', onLight ? '' : '')} />
    </>
  )
}
