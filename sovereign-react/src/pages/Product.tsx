import { useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom'
import { Heart, ChevronDown, Plus } from 'lucide-react'
import { productById } from '../data/catalogue'
import { COLOURS, colourById, fabricById, fitById, SIZES_UK } from '../data/options'
import { Garment, specFor } from '../features/garment/Garment'
import { useCart } from '../features/cart/CartContext'
import { useWishlist } from '../features/wishlist/WishlistContext'
import { useReveal, useScrollTop } from '../lib/motion'
import { inr, cx } from '../lib/format'
import { ProductCard } from '../components/ProductCard'
import { SIZE_CHART } from '../features/fit/fitData'
import { FitDrawer } from '../features/fit/FitDrawer'
import { DetailsDialog } from '../components/DetailsDialog'
import { productImage, photographedColours } from '../lib/productImage'
import type { Product as ProductData } from '../data/types'

/* Indicative garment measurements per size, cm, flat. DEMO. */
const GARMENT_MEASURES: Record<string, (i: number) => Record<string, number>> = {
  blazer: i => ({ 'Half bust': 46 + i * 2.5, 'Half waist': 40 + i * 2.5, 'Length': 64 + i * .6, 'Sleeve': 59 + i * .4 }),
  trousers: i => ({ 'Half waist': 33 + i * 2.5, 'Half hip': 46 + i * 2.5, 'Rise': 30 + i * .5, 'Inseam': 76 }),
  waistcoat: i => ({ 'Half bust': 43 + i * 2.5, 'Half waist': 38 + i * 2.5, 'Length': 54 + i * .5 }),
  camisole: i => ({ 'Half bust': 42 + i * 2.5, 'Length': 52 + i * .5 }),
  suit: i => ({ 'Half bust': 46 + i * 2.5, 'Half waist': 40 + i * 2.5, 'Jacket length': 64 + i * .6, 'Inseam': 76 }),
}

export default function Product() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const p = productById(id ?? '')
  return p ? <ProductView key={`${p.id}:${params.get('colour') ?? ''}`} p={p} /> : <Navigate to="/collection" replace />
}

function ProductView({ p }: { p: ProductData }) {
  const [params] = useSearchParams()
  const requestedColour = params.get('colour') ?? ''
  const root = useRef<HTMLDivElement>(null)
  const [colour, setColour] = useState(p.colours.includes(requestedColour) && productImage(p, requestedColour) ? requestedColour : p.defaultColour)
  const [fabric, setFabric] = useState(p.defaultFabric)
  const [fit, setFit] = useState(p.defaultFit)
  const [size, setSize] = useState<string | null>(null)
  const [sizeErr, setSizeErr] = useState(false)
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [added, setAdded] = useState(false)
  const [fitOpen, setFitOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [pin, setPin] = useState('')
  const cart = useCart(); const wish = useWishlist()
  useScrollTop(p.id)
  useReveal(root, [p.id])
  const spec = useMemo(() => specFor(p, colour, fabric, fit), [p, colour, fabric, fit])
  const photo = productImage(p, colour)
  const photoColours = photographedColours(p)
  const shownColours = photoColours.length ? photoColours : p.colours

  const price = p.price + fabricById(fabric).surcharge
  const related = p.wornWith.map(productById).filter(Boolean) as NonNullable<ReturnType<typeof productById>>[]
  const cvt = (cm: number) => unit === 'cm' ? cm.toFixed(cm % 1 ? 1 : 0) : (cm / 2.54).toFixed(1)
  const add = () => {
    if (!size) { setSizeErr(true); return }
    cart.add({ productId: p.id, name: p.name, unitPrice: price, colour: colourById(colour).name, fabric: fabricById(fabric).name, fit: fitById(fit).name, size })
    setAdded(true); setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div ref={root} className="page surface-light">
      <div className="grid lg:grid-cols-[1.15fr_1fr] min-h-screen">
        {/* stage */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen grid grid-rows-[1fr_auto] bg-[radial-gradient(70%_60%_at_50%_40%,#EFE9E0_0%,#E6DED2_55%,#DCD2C4_100%)]" data-hero>
          <div className="relative grid place-items-center pt-28 pb-10 px-8 min-h-[70svh]">
            <div className="product-photograph relative rv">
              {photo ? <div className="frame aspect-[4/5]"><img src={'.' + photo} alt={`${p.name} in ${colourById(colour).name}`} className="object-[50%_15%]" /></div>
                : <Garment kind={p.type} spec={spec} />}
              <button type="button" className="product-image-details" onClick={() => setDetailsOpen(true)}><Plus size={13} />Details</button>
            </div>
          </div>
        </div>

        {/* panel */}
        <div className="px-6 md:px-14 lg:px-20 pt-16 lg:pt-36 pb-20">
          <p className="label opacity-55 rv">{p.category === 'suits' ? 'Three-piece' : p.category} · {p.customisable ? 'Customisable in the Atelier' : 'Ready to wear'}</p>
          <h1 className="t-l mt-3 rv" data-delay=".05">{p.name}</h1>
          <p className="num mt-3 text-[15px] rv" data-delay=".1">{inr(price)} <span className="opacity-50 text-[12px] ml-1">incl. of taxes · demo</span></p>
          <button type="button" className="product-quick-details mt-5 rv" data-delay=".15" onClick={() => setDetailsOpen(true)}><Plus size={13} />Details &amp; care</button>

          <div className="mt-10 grid gap-8 rv" data-delay=".2">
            <Opt label="Colour" value={colourById(colour).name}>
              <div className="flex gap-3 flex-wrap">{shownColours.map(c => { const col = COLOURS.find(x => x.id === c)!; return <button key={c} className="swatch" style={{ background: col.hex }} aria-label={col.name} aria-pressed={c === colour} onClick={() => setColour(c)} /> })}</div>
            </Opt>
            <Opt label="Size" value={size ?? 'Choose a size'} action={<button className="label-s copper" onClick={() => setFitOpen(true)}>Find your fit</button>}>
              <div className="flex flex-wrap gap-2">{SIZES_UK.map(s => <button key={s} aria-pressed={s === size} onClick={() => { setSize(s); setSizeErr(false) }}
                className={cx('min-w-[62px] h-11 px-3 border text-[12px] tracking-[.08em] transition-colors', s === size ? 'bg-ink text-bone border-ink' : sizeErr ? 'border-copper' : 'border-[rgba(22,19,15,.25)] hover:border-ink')}>{s}</button>)}</div>
              {sizeErr && <p className="field-err mt-3">Choose a size, or <button className="underline underline-offset-4" onClick={() => setFitOpen(true)}>find your fit</button> for a starting point.</p>}
              <p className="text-[12.5px] opacity-55 mt-3">UK sizing. Between sizes, or unsure? Made to measure is available in the Atelier.</p>
            </Opt>
            {(p.fabrics.length > 1 || p.fits.length > 1) && <details className="border-t border-[rgba(22,19,15,.12)] pt-4">
              <summary className="label-s cursor-pointer">Refine cloth &amp; cut</summary>
              <div className="grid gap-7 mt-6">
            {p.fabrics.length > 1 && (
              <Opt label="Cloth" value={fabricById(fabric).name}>
                <div className="grid sm:grid-cols-2 gap-2">{p.fabrics.map(f => { const fb = fabricById(f); return (
                  <button key={f} className="tile !border-[rgba(22,19,15,.18)] aria-pressed:!border-copper" aria-pressed={f === fabric} onClick={() => setFabric(f)}>
                    <span className="flex justify-between gap-3"><b>{fb.name}</b><span className="num text-[12px] opacity-60">{fb.surcharge ? '+ ' + inr(fb.surcharge) : 'Included'}</span></span><small>{fb.hand}</small>
                  </button>) })}</div>
              </Opt>
            )}
            {p.fits.length > 1 && (
              <Opt label="Fit" value={fitById(fit).name} hint={fitById(fit).note}>
                <div className="seg max-w-[420px]">{p.fits.map(f => <button key={f} aria-pressed={f === fit} onClick={() => setFit(f)}>{fitById(f).name}</button>)}</div>
              </Opt>
            )}
              </div>
            </details>}
          </div>

          <div className="mt-10 grid sm:grid-cols-[1fr_auto] gap-3 rv" data-delay=".25">
            <button className="btn btn-solid" onClick={add}>{added ? 'Added to bag' : 'Add to bag'}</button>
            <button className="btn" onClick={() => wish.toggle(p.id)} aria-pressed={wish.has(p.id)}><Heart size={14} strokeWidth={1.5} fill={wish.has(p.id) ? 'currentColor' : 'none'} />{wish.has(p.id) ? 'Saved' : 'Save'}</button>
          </div>
          {p.customisable && <Link to={`/atelier?garment=${p.type}&product=${p.id}&colour=${colour}&fabric=${fabric}&fit=${fit}`} className="link mt-6 rv" data-delay=".3">More colours in the Atelier</Link>}

          {/* delivery */}
          <div className="mt-10 border-t border-[rgba(22,19,15,.12)] pt-6 grid gap-4 text-[13.5px] rv" data-delay=".3">
            <div className="flex items-end gap-3 flex-wrap">
              <label className="field flex-1 min-w-[180px]"><span>Delivery estimate · PIN code</span><input inputMode="numeric" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} placeholder="400001" className="!h-11" /></label>
              <span className="pb-3 opacity-60 text-[12.5px]">{pin.length === 6 ? 'Delivery timing for this PIN code will be confirmed at launch.' : 'Enter a 6-digit PIN code.'}</span>
            </div>
            <p className="opacity-60 text-[12.5px]">UPI, cards and net banking will be accepted at launch. Delivery and returns policies await client approval.</p>
          </div>


        </div>
      </div>

      <FitDrawer open={fitOpen} onClose={() => setFitOpen(false)} garment={p.type} currentSize={size} onPickSize={s => { setSize(s); setSizeErr(false) }} />

      <DetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} title={p.name}>
        <p>{p.description}</p>
        <dl className="details-dialog-facts">
          <div><dt>Selected colour</dt><dd>{colourById(colour).name}</dd></div>
          <div><dt>Cloth &amp; cut</dt><dd>{fabricById(fabric).name} · {fitById(fit).name}</dd></div>
          <div><dt>Care</dt><dd>Care instructions will be confirmed for the selected cloth before launch.</dd></div>
        </dl>
          <div className="mt-7 border-t border-[rgba(22,19,15,.12)]">
            <Row title="Fit and measurements" open>
              <div className="flex justify-between items-center mb-4">
                <p className="text-[12.5px] opacity-60">Garment measured flat, {unit}. Indicative demo figures, pending sampling.</p>
                <div className="seg !w-auto text-[10px]"><button aria-pressed={unit === 'cm'} onClick={() => setUnit('cm')} className="!min-h-8 !px-3">cm</button><button aria-pressed={unit === 'in'} onClick={() => setUnit('in')} className="!min-h-8 !px-3">in</button></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px] num border-collapse">
                  <thead><tr className="label-s opacity-55 text-left"><th className="py-2 font-medium">Size</th>{Object.keys(GARMENT_MEASURES[p.type](0)).map(k => <th key={k} className="py-2 font-medium">{k}</th>)}</tr></thead>
                  <tbody>{SIZES_UK.map((s, i) => <tr key={s} className={cx('border-t border-[rgba(22,19,15,.08)]', s === size && 'text-copper')}><td className="py-2">{s}</td>{Object.values(GARMENT_MEASURES[p.type](i)).map((v, k) => <td key={k} className="py-2">{cvt(v)}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className="text-[12px] opacity-50 mt-4">Body size guide: {SIZE_CHART[2].size} fits a bust of {SIZE_CHART[2].bust} cm. <button className="underline underline-offset-4" onClick={() => { setDetailsOpen(false); setFitOpen(true) }}>Open fit guide</button>.</p>
            </Row>
            <Row title="Cloth"><p>{fabricById(fabric).hand} {fabricById(fabric).weight}. <span className="opacity-60">Composition and origin will be confirmed with the first collection.</span></p></Row>
            <Row title="Making"><p>Designed in India for the first Sovereign collection. <span className="opacity-60">Construction, manufacture and finishing details are being finalised before launch.</span></p></Row>
          </div>
      </DetailsDialog>

      {related.length > 0 && (
        <section className="section-tight bg-linen">
          <div className="wrap">
            <div className="flex justify-between items-end mb-10"><h2 className="t-m rv">Worn with</h2><Link to="/look" className="link rv">The complete look</Link></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">{related.slice(0, 3).map((r, i) => <ProductCard key={r.id} p={r} delay={i * .08} />)}</div>
          </div>
        </section>
      )}
    </div>
  )
}

function Opt({ label, value, hint, action, children }: { label: string; value: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-3.5"><p className="label-s opacity-55">{label} <span className="opacity-100 text-ink ml-2 normal-case tracking-normal text-[13px] font-normal">{value}</span></p>{action}</div>
      {children}
      {hint && <p className="mt-3 font-display italic text-[17px] opacity-70">{hint}</p>}
    </div>
  )
}
function Row({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="border-b border-[rgba(22,19,15,.12)] group">
      <summary className="flex justify-between items-center py-5 label-s"><span>{title}</span><ChevronDown size={14} className="transition-transform group-open:rotate-180" /></summary>
      <div className="pb-6 text-[14px] opacity-80 measure">{children}</div>
    </details>
  )
}
