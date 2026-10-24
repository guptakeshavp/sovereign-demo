import { cx } from '../lib/format'

/* The tailor's tape: Sovereign's signature device.
   Ticks every unit, taller every 5, numbered every 10. Used as scroll cue, section rule,
   step progress and measurement scale. `progress` 0..1 fills the tape in copper. */
export function Tape({ length = 60, progress, labels, className, dense = false, start = 0 }:
  { length?: number; progress?: number; labels?: { at: number; text: string; active?: boolean; done?: boolean; onClick?: () => void }[]; className?: string; dense?: boolean; start?: number }) {
  const unit = dense ? 6 : 10
  const w = length * unit
  const ticks = Array.from({ length: length + 1 }, (_, i) => i)
  return (
    <div className={cx('tape relative select-none', className)} aria-hidden={!labels}>
      <svg viewBox={`0 -2 ${w} 30`} preserveAspectRatio="none" className="w-full h-[30px] overflow-visible">
        <line x1="0" y1="0" x2={w} y2="0" stroke="currentColor" strokeOpacity=".35" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
        {progress !== undefined && <line x1="0" y1="0" x2={w * progress} y2="0" stroke="var(--color-copper)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />}
        {ticks.map(i => {
          const h = i % 10 === 0 ? 14 : i % 5 === 0 ? 9 : 5
          const passed = progress !== undefined && i / length <= progress + 0.0001
          return <line key={i} x1={i * unit} y1="0" x2={i * unit} y2={h} stroke={passed ? 'var(--color-copper)' : 'currentColor'} strokeOpacity={passed ? 1 : .55} strokeWidth=".8" vectorEffect="non-scaling-stroke" />
        })}
        {!dense && ticks.filter(i => i % 10 === 0).map(i => (
          <text key={'n' + i} x={i * unit + 3} y="25" fontSize="7" fill="currentColor" fillOpacity=".5" fontFamily="var(--font-sans)" letterSpacing=".5">{start + i}</text>
        ))}
      </svg>
      {labels && (
        <div className="relative mt-3 h-6">
          {labels.map(l => (
            <button key={l.text} type="button" onClick={l.onClick} disabled={!l.onClick}
              className={cx('absolute label-s whitespace-nowrap transition-opacity', !l.active && 'max-sm:hidden', l.at <= 0.001 ? '' : l.at >= 0.999 ? '-translate-x-full' : '-translate-x-1/2', l.active ? 'opacity-100 copper' : l.done ? 'opacity-80' : 'opacity-45', l.onClick && 'hover:opacity-100 cursor-pointer')}
              style={{ left: `${l.at * 100}%` }} aria-current={l.active ? 'step' : undefined}>{l.text}</button>
          ))}
        </div>
      )}
    </div>
  )
}

/* Thin horizontal rule drawn as a tape, for section breaks. */
export function TapeRule({ className }: { className?: string }) {
  return <Tape length={100} dense className={cx('opacity-70', className)} />
}
