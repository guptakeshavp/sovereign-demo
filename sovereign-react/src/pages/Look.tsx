import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LOOKS, productById } from '../data/catalogue'
import { colourById, SIZES_UK } from '../data/options'
import { Garment, specFor } from '../features/garment/Garment'
import { useCart } from '../features/cart/CartContext'
import { useReveal, useScrollTop } from '../lib/motion'
import { inr, cx } from '../lib/format'

export default function Look() {
  const look = LOOKS[0]
  const root = useRef<HTMLDivElement>(null)
  useReveal(root); useScrollTop(null)
  const cart = useCart()
  const [active, setActive] = useState(0)
  const [sizes, setSizes] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<Record<string, boolean>>(Object.fromEntries(look.items.map(i => [i.productId, true])))
  const [err, setErr] = useState<string | null>(null)
  const items = look.items.map(it => ({ ...it, p: productById(it.productId)! }))
  const total = items.filter(i => picked[i.productId]).reduce((s, i) => s + i.p.price, 0)

  const addAll = () => {
    const chosen = items.filter(i => picked[i.productId])
    const missing = chosen.find(i => !sizes[i.productId])
    if (missing) { setErr(`Choose a size for ${missing.p.name}.`); setActive(items.indexOf(missing)); return }
    setErr(null)
    chosen.forEach(i => cart.add({ productId: i.p.id, name: i.p.name, unitPrice: i.p.price, colour: colourById(i.colour).name, size: sizes[i.productId] }))
  }

  return (
    <div ref={root} className="page surface-linen min-h-screen">
      <section className="wrap pt-28 pb-8 grid lg:grid-cols-[1fr_auto] items-end gap-6" data-hero>
        <div>
          <p className="label rv opacity-60">Women · The complete look</p>
          <h1 className="t-xl mt-5" data-lines><span className="rv-line"><span>{look.name}.</span></span></h1>
        </div>
        <p className="t-lead rv opacity-70 max-w-[440px]" data-delay=".2">{look.story}</p>
      </section>

      <section className="wrap pb-28 grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="frame aspect-[4/5] rv lg:sticky lg:top-24">
          <img src={'.' + look.image} alt={look.imageAlt} width="1122" height="1402" className="object-top" fetchPriority="high" />
          {items.map((it, i) => (
            <button key={it.productId} onClick={() => setActive(i)} aria-label={`${it.p.name}`} aria-pressed={active === i}
              className={cx('absolute w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border grid place-items-center transition-all duration-500', active === i ? 'border-copper bg-copper/90 scale-110' : 'border-bone/80 bg-ink/30 hover:bg-ink/50')} style={{ left: `${it.hotspot.x}%`, top: `${it.hotspot.y}%` }}>
              <span className={cx('w-1.5 h-1.5 rounded-full', active === i ? 'bg-ink' : 'bg-bone')} />
            </button>
          ))}
        </div>

        <div>
          <p className="label-s opacity-60 mb-5">Choose your pieces and sizes</p>
          <ul className="list-none m-0 p-0 grid gap-px bg-[rgba(22,19,15,.12)] border border-[rgba(22,19,15,.12)]">
            {items.map((it, i) => (
              <li key={it.productId} className="bg-linen">
                <button className="w-full text-left p-5 flex items-center gap-5" onClick={() => setActive(active === i ? -1 : i)} aria-expanded={active === i}>
                  <span className="w-14 shrink-0"><Garment kind={it.p.type} spec={specFor(it.p, it.colour)} className="[&_svg]:!filter-none" /></span>
                  <span className="flex-1"><b className="font-medium text-[14px] block">{it.p.name}</b><small className="opacity-60 text-[12.5px]">{colourById(it.colour).name} · {it.note}</small></span>
                  <span className="num text-[14px]">{inr(it.p.price)}</span>
                </button>
                {active === i && (
                  <div className="px-5 pb-6 grid gap-5">
                    <div>
                      <p className="label-s opacity-55 mb-3">Size</p>
                      <div className="flex flex-wrap gap-2">{SIZES_UK.map(s => <button key={s} aria-pressed={sizes[it.productId] === s} onClick={() => { setSizes(x => ({ ...x, [it.productId]: s })); setErr(null) }}
                        className={cx('min-w-[56px] h-10 px-2.5 border text-[11.5px] tracking-[.08em]', sizes[it.productId] === s ? 'bg-ink text-bone border-ink' : 'border-[rgba(22,19,15,.25)] hover:border-ink')}>{s}</button>)}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <label className="flex items-center gap-3 text-[13px] cursor-pointer"><input type="checkbox" checked={!!picked[it.productId]} onChange={e => setPicked(p => ({ ...p, [it.productId]: e.target.checked }))} className="accent-[#B5744A]" />Include in the look</label>
                      <Link to={`/product/${it.p.id}?colour=${it.colour}`} className="link">View the piece</Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-baseline"><span className="label-s opacity-60">{Object.values(picked).filter(Boolean).length} pieces together</span><span className="t-m num">{inr(total)}</span></div>
          {err && <p className="field-err mt-3">{err}</p>}
          <button className="btn btn-solid w-full mt-5" onClick={addAll} disabled={total === 0}>Add selected pieces</button>
          <p className="text-[12px] opacity-50 mt-3">Prefer made to measure? Visit the Atelier.</p>
        </div>
      </section>


    </div>
  )
}
