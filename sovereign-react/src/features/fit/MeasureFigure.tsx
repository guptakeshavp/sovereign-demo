import { cx } from '../../lib/format'

/* A simple, legible croquis with the measuring tape drawn at the active measurement.
   Illustration only: it shows WHERE the tape goes, not a body model. */
export function MeasureFigure({ active, className }: { active: string; className?: string }) {
  const tape = 'var(--color-copper)'
  const line = 'rgba(239,233,224,.55)'
  const band = (y: number, w: number, label?: boolean) => (
    <g>
      <ellipse cx="150" cy={y} rx={w} ry={w * .16} fill="none" stroke={tape} strokeWidth="2.2" />
      <ellipse cx="150" cy={y} rx={w} ry={w * .16} fill="none" stroke={tape} strokeWidth="6" strokeOpacity=".15" />
      {label && [...Array(9)].map((_, i) => <line key={i} x1={150 - w + (i * 2 * w) / 8} y1={y + w * .16 - 3} x2={150 - w + (i * 2 * w) / 8} y2={y + w * .16} stroke={tape} strokeWidth="1" />)}
    </g>
  )
  return (
    <svg viewBox="0 0 300 520" className={cx('overflow-visible', className)} role="img" aria-label={`Where to measure: ${active}`}>
      <g fill="none" stroke={line} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* head + neck */}
        <ellipse cx="150" cy="44" rx="22" ry="28" />
        <path d="M142 72 L140 88 M158 72 L160 88" />
        {/* shoulders + torso */}
        <path d="M100 100 Q150 86 200 100" />
        <path d="M100 100 Q84 140 92 190 Q96 230 90 270 Q86 300 96 330 L204 330 Q214 300 210 270 Q204 230 208 190 Q216 140 200 100" />
        {/* bust hint */}
        <path d="M114 150 Q130 164 148 152 M152 152 Q170 164 186 150" strokeOpacity=".5" />
        {/* arms */}
        <path d="M100 100 Q70 160 68 230 Q66 260 72 300" />
        <path d="M200 100 Q230 160 232 230 Q234 260 228 300" />
        <path d="M92 190 Q82 230 80 270" strokeOpacity=".4" />
        {/* legs */}
        <path d="M96 330 Q94 400 100 470 L104 505 M204 330 Q206 400 200 470 L196 505" />
        <path d="M150 330 L150 350 Q148 420 146 505" />
        <path d="M100 505 L124 505 M176 505 L200 505" />
      </g>
      {/* measurement tapes */}
      {active === 'bust' && band(156, 62, true)}
      {active === 'waist' && band(214, 48, true)}
      {active === 'hip' && band(290, 64, true)}
      {active === 'shoulder' && <g><path d="M100 100 Q150 86 200 100" stroke={tape} strokeWidth="2.4" fill="none" /><circle cx="100" cy="100" r="3" fill={tape} /><circle cx="200" cy="100" r="3" fill={tape} /></g>}
      {active === 'sleeve' && <g><path d="M200 100 Q230 160 232 230 Q234 260 228 300" stroke={tape} strokeWidth="2.4" fill="none" /><circle cx="200" cy="100" r="3" fill={tape} /><circle cx="228" cy="300" r="3" fill={tape} /></g>}
      {active === 'inseam' && <g><path d="M150 352 Q148 420 146 505" stroke={tape} strokeWidth="2.4" fill="none" /><circle cx="150" cy="352" r="3" fill={tape} /><circle cx="146" cy="505" r="3" fill={tape} /></g>}
      {active === 'length' && <g><path d="M172 92 L178 330" stroke={tape} strokeWidth="2.4" fill="none" /><circle cx="172" cy="92" r="3" fill={tape} /><circle cx="178" cy="330" r="3" fill={tape} /></g>}
    </svg>
  )
}
