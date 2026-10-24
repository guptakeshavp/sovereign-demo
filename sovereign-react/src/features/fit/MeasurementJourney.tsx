import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { GarmentType } from '../../data/types'
import { measuresFor } from './fitData'
import { MeasureFigure } from './MeasureFigure'
import { Tape } from '../../components/Tape'
import { cx, cmToIn, inToCm } from '../../lib/format'

/* One measurement per screen. Values live in the parent's TRANSIENT state (never persisted). */
export function MeasurementJourney({ garment, values, unit, onChange, onUnit, compact = false }:
  { garment: GarmentType; values: Record<string, number | ''>; unit: 'cm' | 'in'; onChange: (k: string, v: number | '') => void; onUnit: (u: 'cm' | 'in') => void; compact?: boolean }) {
  const steps = measuresFor(garment)
  const [i, setI] = useState(0)
  const m = steps[Math.min(i, steps.length - 1)]
  const cm = values[m.key]
  const shown = cm === '' || cm === undefined ? '' : unit === 'cm' ? cm : cmToIn(cm)
  const min = unit === 'cm' ? m.min : cmToIn(m.min), max = unit === 'cm' ? m.max : cmToIn(m.max)
  const err = shown !== '' && (Number(shown) < min || Number(shown) > max) ? `That looks outside the usual range (${min} to ${max} ${unit}). Check the tape and try again.` : null
  const done = steps.filter(s => values[s.key] !== '' && values[s.key] !== undefined).length
  const set = (v: string) => { if (v === '') return onChange(m.key, ''); const n = parseFloat(v); if (Number.isNaN(n)) return; onChange(m.key, unit === 'cm' ? n : inToCm(n)) }
  const sliderVal = shown === '' ? (min + max) / 2 : Number(shown)

  return (
    <div className={cx('grid gap-8', !compact && 'lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-start')}>
      <div className={cx('stage aspect-[4/5] max-h-[420px]', compact && 'hidden sm:grid max-h-[300px]')}>
        <MeasureFigure active={m.key} className="w-[52%]" />
        <span className="absolute top-4 left-4 label-s opacity-55">Where the tape goes</span>
      </div>
      <div>
        <Tape length={50} progress={(i) / Math.max(1, steps.length - 1)} dense className="opacity-80"
          labels={steps.map((s, k) => ({ at: k / Math.max(1, steps.length - 1), text: s.name, active: k === i, done: values[s.key] !== '' && values[s.key] !== undefined, onClick: () => setI(k) }))} />
        <div className="mt-10 flex justify-between items-baseline gap-4">
          <p className="label-s opacity-50 num">{i + 1} of {steps.length} · {done} taken</p>
          <div className="seg text-[10px]"><button aria-pressed={unit === 'cm'} onClick={() => onUnit('cm')} className="!min-h-8 !px-3">cm</button><button aria-pressed={unit === 'in'} onClick={() => onUnit('in')} className="!min-h-8 !px-3">in</button></div>
        </div>
        <h3 className="t-m mt-3">{m.name}</h3>
        <p className="mt-2 text-[13px] opacity-55">Why it matters: {m.why}</p>
        <p className="t-lead opacity-80 mt-4 measure">{m.how}</p>
        <dl className="mt-5 grid gap-2.5 text-[13.5px] measure">
          <div className="grid grid-cols-[88px_1fr] gap-3"><dt className="label-s opacity-50 pt-0.5">Hold it</dt><dd className="m-0 opacity-85">{m.hold}</dd></div>
          <div className="grid grid-cols-[88px_1fr] gap-3"><dt className="label-s opacity-50 pt-0.5">Avoid</dt><dd className="m-0 opacity-85">{m.mistake}</dd></div>
          <div className="grid grid-cols-[88px_1fr] gap-3"><dt className="label-s opacity-50 pt-0.5">Tip</dt><dd className="m-0 opacity-85">{m.tip}</dd></div>
        </dl>

        <div className="mt-8">
          <div className="flex items-end gap-5">
            <label className="field w-[140px]"><span>{m.name} ({unit})</span><input inputMode="decimal" value={shown} onChange={e => set(e.target.value)} placeholder={String(Math.round((min + max) / 2))} aria-invalid={!!err} className="num text-[22px] font-display !h-14" /></label>
            <div className="flex-1 pb-1">
              <input type="range" className="tape-range" min={min} max={max} step={unit === 'cm' ? 0.5 : 0.25} value={sliderVal} onChange={e => set(e.target.value)} aria-label={`${m.name} in ${unit}`} />
              <Tape length={Math.round(max - min)} start={Math.round(min)} dense className="-mt-4 opacity-70" />
            </div>
          </div>
          {err && <p className="field-err mt-3">{err}</p>}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button className="link opacity-70 disabled:opacity-25" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={14} />Back</button>
          <div className="flex gap-3">
            <button className="label-s opacity-50 hover:opacity-100" onClick={() => { onChange(m.key, ''); if (i < steps.length - 1) setI(i + 1) }}>Skip this one</button>
            {i < steps.length - 1 ? <button className="btn btn-sm btn-solid" onClick={() => setI(i + 1)} disabled={!!err}>Next<ArrowRight size={13} /></button>
              : <span className="btn btn-sm btn-copper pointer-events-none"><Check size={13} />{done === steps.length ? 'All taken' : `${done} of ${steps.length} taken`}</span>}
          </div>
        </div>
        <p className="mt-6 text-[12px] opacity-45">These are your own measurements, kept on this page only; nothing is stored or sent in this demonstration. A validated made-to-measure process, and how Sovereign confirms measurements before making, is still to be defined.</p>
      </div>
    </div>
  )
}
