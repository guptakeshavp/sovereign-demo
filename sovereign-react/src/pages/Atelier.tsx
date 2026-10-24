import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown, Check } from 'lucide-react'
import { useConfigurator } from '../features/configurator/ConfiguratorContext'
import { STEPS, GARMENT_CHOICES, detailGroups, disallowed, fabricsForPiece, fitsForPiece, totalPrice, SIZES, type Piece } from '../features/configurator/model'
import { Garment } from '../features/garment/Garment'
import type { GarmentSpec } from '../features/garment/engine'
import { renderMonogram, isLight } from '../features/garment/engine'
import { COLOURS, colourById, fabricById, fitById, LINING_HEX } from '../data/options'
import { productById } from '../data/catalogue'
import { inr, cx } from '../lib/format'
import { useScrollTop } from '../lib/motion'
import { useCart } from '../features/cart/CartContext'
import { MeasurementJourney } from '../features/fit/MeasurementJourney'
import type { GarmentType } from '../data/types'

const PIECES: { id: Piece; name: string }[] = [{ id: 'blazer', name: 'Blazer' }, { id: 'waistcoat', name: 'Waistcoat' }, { id: 'trousers', name: 'Trousers' }]

export default function Atelier() {
  const { state, dispatch, active } = useConfigurator()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const cart = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const stepMenuRef = useRef<HTMLDetailsElement>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [openDetail, setOpenDetail] = useState<string | null>('lapel')
  const headingRef = useRef<HTMLDivElement>(null)
  const previousStep = useRef(state.step)
  useScrollTop(null)

  // deep-link entry from PDP / home teaser
  useEffect(() => {
    const g = params.get('garment') as GarmentType | null
    if (!g) return
    dispatch({ type: 'garment', garment: g, productId: params.get('product') ?? undefined })
    const c = params.get('colour'); const f = params.get('fabric'); const fit = params.get('fit'); const lapel = params.get('lapel')
    // run after garment is set
    setTimeout(() => {
      if (c) dispatch({ type: 'set', key: 'colour', value: c })
      if (f) dispatch({ type: 'set', key: 'fabric', value: f })
      if (fit) dispatch({ type: 'set', key: 'fit', value: fit })
      if (lapel) dispatch({ type: 'detail', key: 'lapel', value: lapel })
      previousStep.current = 1
      dispatch({ type: 'step', step: 1 })
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setHint(null)
    panelRef.current?.scrollTo({ top: 0 })
    if (previousStep.current !== state.step) {
      previousStep.current = state.step
      headingRef.current?.focus({ preventScroll: true })
      if (window.matchMedia('(max-width: 1023px)').matches && headingRef.current) {
        window.scrollTo({ top: Math.max(0, window.scrollY + headingRef.current.getBoundingClientRect().top - 100), behavior: 'instant' })
      }
    }
  }, [state.step, state.activePiece])

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      const menu = stepMenuRef.current
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      const menu = stepMenuRef.current
      if (event.key === 'Escape' && menu?.open) {
        menu.open = false
        menu.querySelector('summary')?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const step = STEPS[state.step]
  const type: GarmentType | null = active ? productById(active.productId)!.type : state.garment
  const pricing = useMemo(() => totalPrice(state), [state])

  const spec: GarmentSpec | null = useMemo(() => {
    if (!active) return null
    const colour = colourById(active.colour).hex
    const fabric = fabricById(active.fabric).texture
    const d = active.details
    const base: GarmentSpec = { colour, texture: fabric, fitScale: fitById(active.fit).scale, lapel: d.lapel as GarmentSpec['lapel'], closure: d.closure as GarmentSpec['closure'], sleeve: d.sleeve as GarmentSpec['sleeve'], length: d.length as GarmentSpec['length'], leg: d.leg as GarmentSpec['leg'], neck: d.neck as GarmentSpec['neck'], pleat: d.leg === 'column' ? 'single' : 'none' }
    if (state.garment === 'suit' && (state.step === 0 || state.step >= 5)) {
      const b = state.pieces.blazer!, w = state.pieces.waistcoat!, t = state.pieces.trousers!
      return { ...base, colour: colourById(b.colour).hex, fitScale: fitById(b.fit).scale, lapel: b.details.lapel as GarmentSpec['lapel'], closure: b.details.closure as GarmentSpec['closure'], sleeve: b.details.sleeve as GarmentSpec['sleeve'], length: b.details.length as GarmentSpec['length'],
        waistcoatSpec: { neck: w.details.neck as GarmentSpec['neck'], fitScale: fitById(w.fit).scale }, trouserSpec: { leg: t.details.leg as GarmentSpec['leg'], pleat: t.details.leg === 'column' ? 'single' : 'none' } }
    }
    return base
  }, [active, state])
  const previewKind = state.garment === 'suit' && (state.step === 0 || state.step >= 5) ? 'suit' : (type ?? 'blazer')

  const canNext = state.step === 0 ? !!state.garment : state.step === 5 ? sizingComplete(state.sizing, type) : true
  const go = (n: number) => dispatch({ type: 'step', step: n })
  const tryDetail = (key: string, value: string) => { if (!active) return; const why = disallowed(active, key, value); if (why) { setHint(why); return } setHint(null); dispatch({ type: 'detail', key, value }) }
  const trySet = (key: 'fabric' | 'colour' | 'fit', value: string) => { if (!active) return; const why = disallowed(active, key, value); if (why) { setHint(why); return } setHint(null); dispatch({ type: 'set', key, value }) }

  const addToBag = () => {
    const pieces = Object.values(state.pieces).filter(Boolean)
    const sizeLabel = state.sizing.method === 'mtm' ? 'Made to measure' : state.sizing.method === 'guided' ? `Guided · ${state.sizing.size}` : state.sizing.size
    if (state.garment === 'suit') {
      const details: Record<string, string> = {}
      for (const pc of pieces) { const p = productById(pc!.productId)!; details[p.type] = `${p.name}: ${fitById(pc!.fit).name}${Object.values(pc!.details).length ? ', ' + Object.values(pc!.details).map(v => v).join(' ') : ''}` }
      cart.add({ productId: 'sovereign-three-piece', name: 'The Sovereign three-piece', unitPrice: pricing.total, colour: colourById(pieces[0]!.colour).name, fabric: fabricById(pieces[0]!.fabric).name, size: sizeLabel, details, configured: true })
    } else {
      const pc = pieces[0]!; const p = productById(pc.productId)!
      const details: Record<string, string> = {}
      for (const [k, v] of Object.entries(pc.details)) { const g = detailGroups(p.type).find(x => x.key === k); const item = g?.items.find(i => i.id === v); if (g && item) details[k] = `${g.label}: ${item.name}` }
      if (pc.monogram) details.monogram = `Monogram ${pc.monogram}`
      cart.add({ productId: p.id, name: p.name, unitPrice: pricing.total, colour: colourById(pc.colour).name, fabric: fabricById(pc.fabric).name, fit: fitById(pc.fit).name, size: sizeLabel, details, configured: true })
    }
    nav('/bag')
  }

  return (
    <div className="page surface-light atelier-page">
      <div className="atelier-layout">
        {/* ── stage ── */}
        <div className="atelier-preview surface-dark">
          <p className="atelier-preview-title">{state.garment === 'suit' ? 'Your three-piece' : active ? productById(active.productId)!.name : 'The Sovereign Atelier'}</p>
          <div className="atelier-garment">
            {spec && type ? <Garment kind={previewKind} spec={spec} /> : <Garment kind="blazer" spec={{ colour: '#5A534C', texture: 'twill', lapel: 'peak' }} className="opacity-30" />}
          </div>
          {active && active.monogram && (
            <figure className="atelier-monogram">
              <div dangerouslySetInnerHTML={{ __html: renderMonogram(active.monogram, LINING_HEX[active.details.lining ?? 'copper'] ?? '#A5673F') }} />
              <figcaption className="label-s opacity-55 mt-2">Your initials · concept placement</figcaption>
            </figure>
          )}
          {active && (
            <p className="atelier-preview-caption">{colourById(active.colour).name} · {fabricById(active.fabric).name}<span>Illustrative preview</span></p>
          )}
        </div>

        {/* ── panel ── */}
        <div ref={panelRef} className="atelier-panel">
          <div className="atelier-progress">
            <div className="flex items-center justify-between gap-4">
              <p className="label-s opacity-60 num">Step {state.step + 1} of {STEPS.length}</p>
              <details ref={stepMenuRef} className="atelier-step-menu">
                <summary>All steps <ChevronDown size={14} /></summary>
                <nav aria-label="Atelier steps">
                  {STEPS.map((s, i) => <button key={s.id} aria-label={s.name} disabled={i > state.step + 1 || (i > state.step && !canNext)} aria-current={i === state.step ? 'step' : undefined}
                    onClick={e => { go(i); e.currentTarget.closest('details')?.removeAttribute('open') }}><span>{i + 1}. {s.name}</span>{i === state.step && <Check size={14} />}</button>)}
                </nav>
              </details>
            </div>
            <div className="atelier-progress-track" aria-hidden="true"><span style={{ width: `${(state.step + 1) / STEPS.length * 100}%` }} /></div>
          </div>

          <div className="atelier-content">
            <div ref={headingRef} tabIndex={-1} className="atelier-step-content">
            {state.garment === 'suit' && (step.id === 'fit' || step.id === 'details') && (
              <div className="atelier-piece-selector" role="group" aria-label="Piece to customise">
                {PIECES.map(pc => <button key={pc.id} aria-pressed={state.activePiece === pc.id} onClick={() => dispatch({ type: 'piece', piece: pc.id })}>{pc.name}</button>)}
              </div>
            )}
            {/* 01 GARMENT */}
            {step.id === 'garment' && (
              <>
                <h1 className="t-l">Begin with the <em className="t-i">piece</em>.</h1>
                <p className="atelier-intro">We’ll guide you from here.</p>
                <div className="atelier-garment-options mt-7">
                  {GARMENT_CHOICES.map(g => <button key={g.id} className="atelier-choice" aria-pressed={state.garment === g.id} onClick={() => dispatch({ type: 'garment', garment: g.id })}>
                    <div className="atelier-choice-illustration"><Garment kind={g.id} spec={{ colour: '#6B625A', texture: 'twill', lapel: 'peak', pleat: 'single' }} className="w-[80px] [&_svg]:!filter-none" /></div>
                    <span><b>{g.name}</b><small>{g.note}</small></span><span className="atelier-choice-price num">{inr(productById(g.productId)!.price)}</span><Check className="atelier-selected-check" size={16} aria-hidden="true" /></button>)}
                </div>
                {state.garment === 'blazer' && (
                  <div className="mt-6"><p className="label-s opacity-50 mb-3">Which blazer</p><div className="seg max-w-[420px]">
                    {['signature-blazer', 'ease-blazer'].map(id => <button key={id} aria-pressed={active?.productId === id} onClick={() => dispatch({ type: 'garment', garment: 'blazer', productId: id })}>{productById(id)!.name.replace('The ', '')}</button>)}
                  </div></div>
                )}
                {state.garment === 'trousers' && (
                  <div className="mt-6"><p className="label-s opacity-50 mb-3">Which trouser</p><div className="seg max-w-[420px]">
                    {['column-trouser', 'wide-trouser'].map(id => <button key={id} aria-pressed={active?.productId === id} onClick={() => dispatch({ type: 'garment', garment: 'trousers', productId: id })}>{productById(id)!.name.replace('The ', '')}</button>)}
                  </div></div>
                )}
              </>
            )}

            {/* 02 FABRIC */}
            {step.id === 'fabric' && active && type && (
              <>
                <h1 className="t-l">The <em className="t-i">cloth</em>.</h1>
                <p className="atelier-intro">{state.garment === 'suit' ? 'One cloth, shared across all three pieces.' : 'Find your feel.'}</p>
                <div className="grid gap-2 mt-7">
                  {fabricsForPiece(state.garment === 'suit' ? 'suit' : type).map(f => <button key={f.id} className="atelier-choice atelier-fabric-choice" aria-pressed={active.fabric === f.id} onClick={() => trySet('fabric', f.id)}>
                    <Swatch texture={f.texture} colour={colourById(active.colour).hex} />
                    <span className="grid gap-1"><b>{f.name}</b><small>{f.hand}</small></span>
                    <span className="atelier-choice-price num">{f.surcharge ? '+ ' + inr(f.surcharge) : 'Included'}</span><Check className="atelier-selected-check" size={16} aria-hidden="true" />
                  </button>)}
                </div>
              </>
            )}

            {/* 03 COLOUR */}
            {step.id === 'colour' && active && (
              <>
                <h1 className="t-l">The <em className="t-i">colour</em>.</h1>
                <p className="atelier-intro">Choose your shade in {fabricById(active.fabric).name.toLowerCase()}.</p>
                <div className="atelier-colours mt-7">
                  {productById(active.productId)!.colours.map(id => { const c = COLOURS.find(x => x.id === id)!; return (
                    <button key={id} className="atelier-colour" aria-pressed={active.colour === id} onClick={() => trySet('colour', id)}>
                      <span className="atelier-colour-chip" style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.hex}cc)` }} />
                      <b className="text-[13px]">{c.name}</b>
                    </button>) })}
                </div>
              </>
            )}

            {/* 04 FIT */}
            {step.id === 'fit' && active && type && (
              <>
                <h1 className="t-l">The <em className="t-i">cut</em>.</h1>
                <p className="atelier-intro">Choose the silhouette. Size comes later.</p>
                <div className="grid gap-2 mt-7">
                  {fitsForPiece(type).map(f => <button key={f.id} className="atelier-choice atelier-fit-choice" aria-pressed={active.fit === f.id} onClick={() => trySet('fit', f.id)}>
                    <Garment kind={type === 'suit' ? 'blazer' : type} spec={{ colour: colourById(active.colour).hex, texture: 'twill', fitScale: f.scale, lapel: 'peak', leg: f.id === 'wide' ? 'wide' : 'column', neck: 'deep' }} className="w-[64px] [&_svg]:!filter-none" />
                    <span className="grid gap-1"><b>{f.name}</b><small>{f.note}</small></span><Check className="atelier-selected-check" size={16} aria-hidden="true" />
                  </button>)}
                </div>
              </>
            )}

            {/* 05 DETAILS */}
            {step.id === 'details' && active && type && (
              <>
                <h1 className="t-l">The <em className="t-i">details</em>.</h1>
                <p className="atelier-intro">Refine {state.garment === 'suit' ? `the ${state.activePiece}` : 'your piece'}, one detail at a time.</p>
                <div className="atelier-detail-list mt-7">
                  {detailGroups(type).map((g, index) => {
                    const expanded = openDetail === g.key || (openDetail !== null && !detailGroups(type).some(group => group.key === openDetail) && index === 0)
                    const selected = g.items.find(item => item.id === active.details[g.key])
                    return <div key={g.key} className="atelier-detail">
                      <button className="atelier-detail-trigger" aria-expanded={expanded} aria-controls={`detail-${g.key}`} onClick={() => setOpenDetail(expanded ? null : g.key)}>
                        <span>{g.label}</span><span className="atelier-detail-value">{selected?.name}<ChevronDown size={15} /></span>
                      </button>
                      {expanded && <div id={`detail-${g.key}`} className="atelier-detail-options">
                      {g.key === 'lining' ? (
                        <div className="flex gap-3 flex-wrap">{g.items.map(i => <button key={i.id} className="swatch" style={{ background: LINING_HEX[i.id] }} aria-label={i.name} aria-pressed={active.details.lining === i.id} onClick={() => tryDetail('lining', i.id)} />)}<span className="self-center text-[13px] opacity-70 ml-2">{g.items.find(i => i.id === active.details.lining)?.name}</span></div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-2">{g.items.map(i => { const why = disallowed(active, g.key, i.id); return (
                          <button key={i.id} className={cx('tile', why && 'opacity-45')} aria-pressed={active.details[g.key] === i.id} aria-disabled={!!why} onClick={() => tryDetail(g.key, i.id)} title={why ?? undefined}><b>{i.name}</b>{i.note && <small>{i.note}</small>}</button>) })}</div>
                      )}
                      </div>}
                    </div>
                  })}
                  {type !== 'camisole' && (
                    <div className="atelier-detail atelier-monogram-option">
                      <button className="atelier-detail-trigger" aria-expanded={openDetail === 'monogram'} aria-controls="detail-monogram" onClick={() => setOpenDetail(openDetail === 'monogram' ? null : 'monogram')}><span>Personalise with initials</span><span className="atelier-detail-value">{active.monogram || 'Optional'}<ChevronDown size={15} /></span></button>
                      {openDetail === 'monogram' && <div id="detail-monogram" className="atelier-detail-options">
                      <p className="label-s opacity-55 mb-3">Monogram <span className="num ml-2 normal-case tracking-normal">{active.monogram ? '+ ' + inr(1500) : 'Optional'}</span></p>
                      <div className="flex items-center gap-4 border-b border-[rgba(22,19,15,.3)] max-w-[260px]">
                        <input value={active.monogram} onChange={e => dispatch({ type: 'monogram', value: e.target.value })} maxLength={3} placeholder="ABC" aria-label="Your initials" className="flex-1 bg-transparent border-0 outline-0 py-2 font-display text-[32px] tracking-[.3em] uppercase placeholder:opacity-30" />
                        <span className="stitch"><svg viewBox="0 0 12 12"><path d="M1.5 1.5 L10.5 10.5" /><path d="M10.5 1.5 L1.5 10.5" /></svg></span>
                      </div>
                      <p className="text-[12.5px] opacity-50 mt-3">Up to three letters, cross-stitched in copper thread. Placement to be confirmed.</p>
                      </div>}
                    </div>
                  )}
                </div>

              </>
            )}

            {/* 06 SIZING */}
            {step.id === 'sizing' && type && (
              <>
                <h1 className="t-l">Your <em className="t-i">size</em>.</h1>
                <p className="atelier-intro">Choose a standard size, or have it made to your measurements.</p>
                <div className="seg mt-10 max-w-[520px]">
                  {([['standard', 'Standard size'], ['mtm', 'Made to measure']] as const).map(([m, l]) => <button key={m} aria-pressed={state.sizing.method === m} onClick={() => dispatch({ type: 'sizing', method: m })}>{l}</button>)}
                </div>
                {state.sizing.method !== 'mtm' ? (
                  <div className="mt-8">
                    <div className="flex flex-wrap gap-2">{SIZES.map(s => <button key={s} aria-pressed={s === state.sizing.size} onClick={() => dispatch({ type: 'size', size: s })} className={cx('min-w-[62px] h-11 px-3 border text-[12px] tracking-[.08em]', s === state.sizing.size ? 'bg-ink text-bone border-ink' : 'border-[rgba(22,19,15,.25)] hover:border-ink')}>{s}</button>)}</div>
                    <p className="text-[12.5px] opacity-55 mt-4">Not sure? <Link to="/fit" className="underline underline-offset-4">Find your fit</Link> gives you a starting point in four questions.</p>
                  </div>
                ) : (
                  <div className="mt-8">
                    <MeasurementJourney garment={state.garment === 'suit' ? 'suit' : type} values={state.sizing.measurements} unit={state.sizing.unit}
                      onChange={(k, v) => dispatch({ type: 'measure', key: k, value: v })} onUnit={u => dispatch({ type: 'unit', unit: u })} compact />
                    <p className="text-[12.5px] opacity-55 mt-4 num">Made to measure adds {inr(6000)} in this demonstration. The service, and what it includes, is to be confirmed by Sovereign.</p>
                  </div>
                )}
              </>
            )}

            {/* 07 REVIEW */}
            {step.id === 'review' && active && (
              <>
                <h1 className="t-l">Your <em className="t-i">Sovereign</em>.</h1>
                <p className="atelier-intro">A final look at your choices. Everything can still be changed.</p>
                <div className="mt-10 grid gap-6">
                  {(Object.entries(state.pieces) as [Piece, NonNullable<typeof active>][]).map(([k, pc]) => { const p = productById(pc.productId)!; const groups = detailGroups(p.type); return (
                    <div key={k} className="border border-[rgba(22,19,15,.15)] p-5">
                      <div className="flex justify-between items-baseline gap-4"><h3 className="t-s">{p.name}</h3><button className="label-s copper" onClick={() => { dispatch({ type: 'piece', piece: k }); go(1) }}>Edit</button></div>
                      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[13.5px]">
                        <Dt k="Cloth" v={`${fabricById(pc.fabric).name}, ${colourById(pc.colour).name}`} />
                        <Dt k="Fit" v={fitById(pc.fit).name} />
                        {groups.map(g => { const it = g.items.find(i => i.id === pc.details[g.key]); return it ? <Dt key={g.key} k={g.label} v={it.name} /> : null })}
                        {pc.monogram && <Dt k="Monogram" v={pc.monogram} />}
                      </dl>
                    </div>) })}
                  <div className="border border-[rgba(22,19,15,.15)] p-5">
                    <div className="flex justify-between items-baseline gap-4"><h3 className="t-s">Sizing</h3><button className="label-s copper" onClick={() => go(5)}>Edit</button></div>
                    <p className="mt-3 text-[13.5px]">{state.sizing.method === 'mtm' ? `Made to measure · ${Object.values(state.sizing.measurements).filter(v => v !== '').length} measurements entered, to be confirmed with you before making` : `Standard · ${state.sizing.size}`}</p>
                  </div>
                </div>
                <div className="mt-8 border-t border-[rgba(22,19,15,.15)] pt-5 grid gap-2 text-[13.5px]">
                  {pricing.rows.map((r, i) => <div key={i} className="flex justify-between gap-6"><span className="opacity-75">{r.label}</span><span className="num">{r.amount < 0 ? '− ' + inr(-r.amount) : inr(r.amount)}</span></div>)}
                  <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-[rgba(22,19,15,.15)]"><span className="label-s">Your {state.garment === 'suit' ? 'suit' : type}</span><span className="t-m num">{inr(pricing.total)}</span></div>
                  <p className="text-[12px] opacity-50">Demonstration pricing. Taxes and delivery would be shown at checkout.</p>
                </div>
                <div className="mt-8 grid sm:grid-cols-2 gap-3"><button className="btn btn-solid" onClick={addToBag}>Add to bag</button><button className="btn" onClick={() => { dispatch({ type: 'reset' }); nav('/atelier') }}>Start again</button></div>
              </>
            )}

            </div>
            {hint && <p className="mt-6 text-[13px] copper border-l-2 border-copper pl-4" role="status">{hint}</p>}
          </div>

          {/* One consistent action bar, with the price always visible. */}
          {step.id !== 'review' && (
            <div className="atelier-actions">
              <button className="atelier-back" onClick={() => go(state.step - 1)} disabled={state.step === 0} aria-label="Previous step"><ArrowLeft size={16} /></button>
              <div className="atelier-total"><span>Estimated total</span><span className="num">{inr(pricing.total)}</span></div>
              <button className="btn btn-solid" onClick={() => go(state.step + 1)} disabled={!canNext}>{state.step === 5 ? 'Review your piece' : 'Continue'}<ArrowRight size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function sizingComplete(sz: { method: string; size: string; measurements: Record<string, number | ''> }, type: GarmentType | null) {
  if (sz.method !== 'mtm') return !!sz.size
  if (!type) return false
  return true // measurements are optional to proceed; confirmed at the fitting
}
function Dt({ k, v }: { k: string; v: string }) { return <><dt className="opacity-50">{k}</dt><dd className="m-0">{v}</dd></> }
function Swatch({ texture, colour }: { texture: string; colour: string }) {
  const light = isLight(colour)
  const size: Record<string, string> = { twill: '120%', hopsack: '220%', flannel: '170%', crepe: '100%', satin: '100%' }
  return <span className={cx('cloth-swatch block w-14 h-14', light && 'light', texture === 'satin' && 'satin')} style={{ backgroundColor: colour, backgroundSize: size[texture] ?? '140%', filter: texture === 'flannel' ? 'blur(.3px) saturate(.9)' : undefined }} aria-hidden />
}
