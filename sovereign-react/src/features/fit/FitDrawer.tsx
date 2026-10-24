import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowLeft } from 'lucide-react'
import type { GarmentType } from '../../data/types'
import { QUESTIONS, recommend, SIZE_CHART } from './fitData'
import { MeasurementJourney } from './MeasurementJourney'
import { fitById } from '../../data/options'
import { cx } from '../../lib/format'

type Tab = 'guided' | 'chart' | 'measure'
const TABS: { id: Tab; name: string }[] = [{ id: 'guided', name: 'Find my size' }, { id: 'chart', name: 'Size chart' }, { id: 'measure', name: 'Measurements' }]

/* Fit guidance as a drawer over the product page. All state is transient. */
export function FitDrawer({ open, onClose, garment, onPickSize, currentSize }:
  { open: boolean; onClose: () => void; garment: GarmentType; onPickSize: (size: string) => void; currentSize: string | null }) {
  const [tab, setTab] = useState<Tab>('guided')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [qi, setQi] = useState(0)
  const [vals, setVals] = useState<Record<string, number | ''>>({})
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const rec = recommend(answers)
  const finished = qi >= QUESTIONS.length

  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  useEffect(() => {
    if (open) { returnTo.current = document.activeElement as HTMLElement; setTimeout(() => closeRef.current?.focus(), 50); document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = ''; returnTo.current?.focus?.() }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return createPortal(
    <>
      <div className={cx('fixed inset-0 z-[70] bg-[rgba(22,19,15,.55)] backdrop-blur-[2px] transition-opacity duration-500', open ? 'opacity-100' : 'opacity-0 pointer-events-none')} onClick={onClose} aria-hidden />
      <aside className={cx('fixed top-0 right-0 bottom-0 z-[80] w-full max-w-[560px] surface-light flex flex-col transition-transform duration-[.6s] ease-[var(--ease-out-soft)]', open ? 'translate-x-0' : 'translate-x-full')}
        role="dialog" aria-modal="true" aria-label="Find your fit" aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="flex items-center justify-between px-7 h-[72px] border-b border-[rgba(22,19,15,.1)]">
          <div className="flex gap-6" role="tablist" aria-label="Fit guidance">
            {TABS.map(t => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cx('label-s h-[72px] border-b-2 transition-colors', tab === t.id ? 'border-copper text-ink' : 'border-transparent opacity-50 hover:opacity-100')}>{t.name}</button>)}
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close"><X size={20} strokeWidth={1.3} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-8">
          {tab === 'guided' && (
            <div>
              <p className="label-s opacity-50">General fit guidance</p>
              <h2 className="t-m mt-2">Four questions. A size to begin with.</h2>
              <p className="mt-3 text-[13.5px] opacity-65 measure">Not a made-to-measure recommendation. A starting point for choosing a standard size, to check against the size chart.</p>
              {!finished ? (
                <div className="mt-8" key={qi}>
                  <p className="label-s opacity-50 num">{qi + 1} of {QUESTIONS.length}</p>
                  <h3 className="t-s mt-2">{QUESTIONS[qi].q}</h3>
                  <p className="mt-1.5 text-[12.5px] opacity-50">Why we ask: {QUESTIONS[qi].why}</p>
                  <div className={cx('mt-5 grid gap-2', QUESTIONS[qi].options.length > 4 ? 'grid-cols-3' : 'grid-cols-2')}>
                    {QUESTIONS[qi].options.map(o => <button key={o.id} className="tile !p-3.5" aria-pressed={answers[QUESTIONS[qi].key] === o.id}
                      onClick={() => { setAnswers(a => ({ ...a, [QUESTIONS[qi].key]: o.id })); setTimeout(() => setQi(qi + 1), 160) }}><b className="text-[13px]">{o.name}</b></button>)}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button className="link opacity-70 disabled:opacity-25" disabled={qi === 0} onClick={() => setQi(qi - 1)}><ArrowLeft size={13} />Back</button>
                    <button className="label-s opacity-50 hover:opacity-100" onClick={() => setQi(qi + 1)}>I'm not sure, skip</button>
                  </div>
                </div>
              ) : rec ? (
                <div className="mt-8 border border-[rgba(22,19,15,.15)] p-6">
                  <p className="label-s copper">A starting point</p>
                  <p className="t-xl num mt-2">{rec.size}</p>
                  <p className="mt-2 text-[14px] opacity-80">in the <b className="font-medium">{fitById(rec.fit).name}</b> fit. {fitById(rec.fit).note}</p>
                  <p className="mt-3 text-[13px] opacity-60 measure">{rec.note}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="btn btn-solid btn-sm" onClick={() => { onPickSize(rec.size); onClose() }}>{currentSize === rec.size ? `${rec.size} is selected` : `Use ${rec.size}`}</button>
                    <button className="btn btn-sm" onClick={() => setTab('chart')}>Check the chart</button>
                  </div>
                  <button className="link mt-6 opacity-60" onClick={() => { setAnswers({}); setQi(0) }}>Start over</button>
                </div>
              ) : (
                <div className="mt-8"><p className="t-s">We need your usual size to begin.</p><button className="link mt-4" onClick={() => setQi(0)}>Back to the first question</button></div>
              )}
            </div>
          )}

          {tab === 'chart' && (
            <div>
              <p className="label-s opacity-50">Standard sizes</p>
              <h2 className="t-m mt-2">Body measurements, in centimetres.</h2>
              <p className="mt-3 text-[13.5px] opacity-65 measure">Bust at the fullest point, waist at the narrowest, hip at the fullest. Tap a row to select that size.</p>
              <table className="w-full text-[13.5px] num border-collapse mt-6">
                <thead><tr className="label-s opacity-55 text-left"><th className="py-2.5 font-medium">Size</th><th className="py-2.5 font-medium">Bust</th><th className="py-2.5 font-medium">Waist</th><th className="py-2.5 font-medium">Hip</th></tr></thead>
                <tbody>{SIZE_CHART.map(r => (
                  <tr key={r.size} className={cx('border-t border-[rgba(22,19,15,.1)] cursor-pointer transition-colors hover:text-copper', currentSize === r.size && 'text-copper')} onClick={() => { onPickSize(r.size); onClose() }}>
                    <td className="py-3"><button className="text-left">{r.size}</button></td><td>{r.bust}</td><td>{r.waist}</td><td>{r.hip}</td>
                  </tr>))}</tbody>
              </table>
              <p className="text-[12px] opacity-45 mt-4">Indicative demo chart, pending sampling and client approval. Garment measurements for this piece are on the product page under Fit and measurements.</p>
            </div>
          )}

          {tab === 'measure' && (
            <div>
              <p className="label-s opacity-50">Your measurements</p>
              <h2 className="t-m mt-2">One at a time, tape shown in place.</h2>
              <p className="mt-3 text-[13.5px] opacity-65 measure">For a made-to-measure order through the Atelier. Nothing you enter here is stored.</p>
              <div className="mt-6">
                <MeasurementJourney garment={garment} values={vals} unit={unit} onChange={(k, v) => setVals(s => ({ ...s, [k]: v }))} onUnit={setUnit} compact />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body,
  )
}
