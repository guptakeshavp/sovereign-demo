import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/catalogue'
import { COLOURS, FITS } from '../data/options'
import { ProductCard } from '../components/ProductCard'
import { useReveal } from '../lib/motion'
import { TapeRule } from '../components/Tape'
import { cx } from '../lib/format'
import { SlidersHorizontal, X } from 'lucide-react'
import { productImage } from '../lib/productImage'

type Sort = 'featured' | 'low' | 'high' | 'new'

export default function Collection() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('c') ?? 'all'
  const [colour, setColour] = useState<string | null>(null)
  const [fit, setFit] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  const list = useMemo(() => {
    let l = PRODUCTS.filter(p => cat === 'all' || p.category === cat || (cat === 'waistcoats' && p.category === 'camisoles'))
    if (colour) l = l.filter(p => !!productImage(p, colour))
    if (fit) l = l.filter(p => p.fits.includes(fit))
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'new') l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
    return l
  }, [cat, colour, fit, sort])
  useReveal(root, [list])

  const fitsShown = FITS.filter(f => f.id !== 'bias')
  const photographedPalette = COLOURS.filter(c => PRODUCTS.some(p => !!productImage(p, c.id)))
  const active = [colour && COLOURS.find(c => c.id === colour)!.name, fit && FITS.find(f => f.id === fit)!.name].filter(Boolean) as string[]
  const refinementCount = active.length + Number(sort !== 'featured')

  return (
    <div ref={root} className="page surface-light min-h-screen">
      <section className="wrap pt-28 pb-8" data-hero>
        <p className="label rv opacity-60">Women · The first collection</p>
        <h1 className="t-xl mt-5" data-lines><span className="rv-line"><span>Seven styles,</span></span><span className="rv-line"><span>cut to <em className="t-i">you</em>.</span></span></h1>
        <p className="t-lead rv mt-6 opacity-70 measure" data-delay=".2">Your colour. Your cut. Standard sizes or made to measure.</p>
      </section>

      <div className="wrap sticky top-[66px] z-30 surface-light py-4 border-y border-[rgba(22,19,15,.1)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex gap-6 scroll-x -mx-1 px-1" aria-label="Category">
            {CATEGORIES.map(c => <button key={c.id} onClick={() => setParams(c.id === 'all' ? {} : { c: c.id })} aria-pressed={cat === c.id}
              className={cx('label-s pb-1 border-b transition-colors whitespace-nowrap', cat === c.id ? 'border-copper text-ink' : 'border-transparent opacity-55 hover:opacity-100')}>{c.name}</button>)}
          </nav>
          <div className="flex items-center gap-5">
            <button className="label-s flex items-center gap-2" onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen} aria-controls="collection-refinements"><SlidersHorizontal size={14} strokeWidth={1.5} />Refine{refinementCount ? ` · ${refinementCount}` : ''}</button>
          </div>
        </div>
        {filtersOpen && (
          <div id="collection-refinements" className="grid md:grid-cols-[auto_1fr] gap-x-16 gap-y-6 pt-6 pb-2">
            <div>
              <p className="label-s opacity-55 mb-3">Colour</p>
              <div className="flex gap-2.5 flex-wrap">{photographedPalette.map(c => <button key={c.id} className="swatch !w-7 !h-7" style={{ background: c.hex }} aria-label={c.name} aria-pressed={colour === c.id} onClick={() => setColour(colour === c.id ? null : c.id)} />)}</div>
            </div>
            <div>
              <p className="label-s opacity-55 mb-3">Fit</p>
              <div className="flex gap-2 flex-wrap">{fitsShown.map(f => <button key={f.id} aria-pressed={fit === f.id} onClick={() => setFit(fit === f.id ? null : f.id)}
                className={cx('label-s px-3.5 h-9 border transition-colors', fit === f.id ? 'bg-ink text-bone border-ink' : 'border-[rgba(22,19,15,.25)] hover:border-ink')}>{f.name}</button>)}</div>
            </div>
            <div className="md:col-span-2">
              <label className="label-s flex items-center gap-2">Sort
                <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="bg-transparent border-0 label-s outline-0 cursor-pointer">
                  <option value="featured">Featured</option><option value="new">New</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option>
                </select>
              </label>
            </div>
            {active.length > 0 && <button className="label-s flex items-center gap-2 opacity-60 hover:opacity-100 md:col-span-2" onClick={() => { setColour(null); setFit(null) }}><X size={12} />Clear {active.join(', ')}</button>}
          </div>
        )}
      </div>

      <section className="wrap pt-14 pb-24">
        <p className="label-s opacity-50 mb-8 num">{list.length} {list.length === 1 ? 'style' : 'styles'}</p>
        {list.length === 0 ? (
          <div className="py-20 max-w-[480px]">
            <p className="t-m">No pieces match just yet.</p>
            <p className="mt-3 opacity-60 text-[14px]">Try another colour or fit.</p>
            <button className="link mt-6" onClick={() => { setColour(null); setFit(null) }}>Clear the filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-14 lg:gap-x-8">
            {list.map((p, i) => <div key={p.id} className={cx(i % 3 === 1 && 'lg:translate-y-14')}><ProductCard p={p} delay={(i % 3) * .08} colour={colour ?? undefined} /></div>)}
          </div>
        )}
        <TapeRule className="mt-28 mb-10 text-ink" />
        <div className="grid md:grid-cols-2 gap-10">
          <h2 className="t-m rv">Every style is a starting point.</h2>
          <p className="t-lead rv opacity-70" data-delay=".1">Choose a standard size, or make it yours in the Atelier. Fittings and lead times confirmed before launch.</p>
        </div>
      </section>
    </div>
  )
}
