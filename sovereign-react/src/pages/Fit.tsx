import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useScrollTop } from '../lib/motion'
import { QUESTIONS, recommend, SIZE_CHART } from '../features/fit/fitData'
import { MeasurementJourney } from '../features/fit/MeasurementJourney'
import { Tape, TapeRule } from '../components/Tape'
import { cx } from '../lib/format'
import { fitById } from '../data/options'
import type { GarmentType } from '../data/types'
import { ArrowLeft } from 'lucide-react'

type Route = 'standard' | 'guided' | 'mtm'

export default function Fit() {
  const root = useRef<HTMLDivElement>(null)
  const [route, setRoute] = useState<Route>('guided')
  useReveal(root, [route])
  useScrollTop(null)
  // transient state only
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [qi, setQi] = useState(0)
  const [garment, setGarment] = useState<GarmentType>('blazer')
  const [vals, setVals] = useState<Record<string, number | ''>>({})
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [hiSize, setHiSize] = useState<string | null>(null)
  const rec = recommend(answers)
  const finished = qi >= QUESTIONS.length

  return (
    <div ref={root} className="page surface-dark min-h-screen">
      <section className="wrap pt-28 pb-10" data-hero>
        <p className="label rv copper">Find your fit</p>
        <h1 className="t-xl mt-5" data-lines><span className="rv-line"><span>Three ways to the</span></span><span className="rv-line"><span>right <em className="t-i">size</em>.</span></span></h1>
        <p className="t-lead rv mt-6 opacity-70 measure" data-delay=".2">A size chart if you know your size. Four questions for general guidance on size and cut. Or take your own measurements, one at a time, for a made-to-measure order. None of these is a guarantee of fit.</p>
        <div className="rv mt-10 grid sm:grid-cols-3 gap-3 max-w-[900px]" data-delay=".3">
          {([['standard', 'Standard sizing', 'Body and garment measurements for UK 6 to 18.'], ['guided', 'Guided fit', 'Four questions. General guidance on size and cut.'], ['mtm', 'Your measurements', 'Up to seven measurements, with the tape shown in the right place.']] as const).map(([id, t, d]) => (
            <button key={id} className="tile" aria-pressed={route === id} onClick={() => setRoute(id)}><b>{t}</b><small>{d}</small></button>
          ))}
        </div>
      </section>

      <section className="wrap pb-28">
        <TapeRule className="mb-14 text-bone" />

        {route === 'standard' && (
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
            <div>
              <h2 className="t-l rv">Standard sizes.</h2>
              <p className="t-lead opacity-70 mt-6 measure rv" data-delay=".1">Measure your body, not your clothes: bust at the fullest point, waist at the narrowest, hip at the fullest. Compare with the chart. Between two sizes? Compare the garment measurements on each product page, or have the piece made to your own measurements.</p>
              <div className="rv mt-8" data-delay=".15"><button className="link" onClick={() => setRoute('mtm')}>Prefer to be measured</button></div>
            </div>
            <div className="rv overflow-x-auto" data-delay=".1">
              <table className="w-full text-[13.5px] num border-collapse">
                <thead><tr className="label-s opacity-55 text-left"><th className="py-3 font-medium">Size</th><th className="py-3 font-medium">Bust (cm)</th><th className="py-3 font-medium">Waist (cm)</th><th className="py-3 font-medium">Hip (cm)</th></tr></thead>
                <tbody>{SIZE_CHART.map(r => <tr key={r.size} onMouseEnter={() => setHiSize(r.size)} onMouseLeave={() => setHiSize(null)} className={cx('border-t border-[rgba(239,233,224,.12)] transition-colors', hiSize === r.size && 'text-copper')}><td className="py-3">{r.size}</td><td>{r.bust}</td><td>{r.waist}</td><td>{r.hip}</td></tr>)}</tbody>
              </table>
              <p className="text-[12px] opacity-45 mt-4">Indicative demo chart, pending sampling and client approval. Garment measurements per size are on each product page.</p>
            </div>
          </div>
        )}

        {route === 'guided' && (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="t-l rv">Guided fit.</h2>
              <p className="t-lead opacity-70 mt-6 measure rv" data-delay=".1">Short on purpose. We ask what helps and nothing else, and we tell you why we ask. The result is general guidance for choosing a standard size, not a made-to-measure recommendation.</p>
            </div>
            <div className="rv" data-delay=".1">
              <Tape length={40} progress={Math.min(1, qi / QUESTIONS.length)} dense className="text-bone opacity-80"
                labels={[...QUESTIONS.map((q, k) => ({ at: k / QUESTIONS.length, text: `Q${k + 1}`, active: k === qi, done: !!answers[q.key], onClick: () => setQi(k) })), { at: 1, text: 'Result', active: finished }]} />
              {!finished ? (
                <div className="mt-10" key={qi}>
                  <p className="label-s opacity-50 num">{qi + 1} of {QUESTIONS.length}</p>
                  <h3 className="t-m mt-3">{QUESTIONS[qi].q}</h3>
                  <p className="mt-2 text-[13px] opacity-50">Why we ask: {QUESTIONS[qi].why}</p>
                  <div className={cx('mt-8 grid gap-2', QUESTIONS[qi].options.length > 4 ? 'grid-cols-3 sm:grid-cols-4' : 'sm:grid-cols-2')}>
                    {QUESTIONS[qi].options.map(o => <button key={o.id} className="tile" aria-pressed={answers[QUESTIONS[qi].key] === o.id} onClick={() => { setAnswers(a => ({ ...a, [QUESTIONS[qi].key]: o.id })); setTimeout(() => setQi(qi + 1), 180) }}><b>{o.name}</b>{o.note && <small>{o.note}</small>}</button>)}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button className="link opacity-70 disabled:opacity-25" disabled={qi === 0} onClick={() => setQi(qi - 1)}><ArrowLeft size={14} />Back</button>
                    <button className="label-s opacity-50 hover:opacity-100" onClick={() => setQi(qi + 1)}>I'm not sure, skip</button>
                  </div>
                </div>
              ) : (
                <div className="mt-10">
                  {rec ? (
                    <>
                      <p className="label-s copper">General fit guidance</p>
                      <h3 className="t-xl mt-3 num">{rec.size}</h3>
                      <p className="t-lead mt-4 opacity-80">in the <b className="font-medium">{fitById(rec.fit).name}</b> fit. {fitById(rec.fit).note}</p>
                      <p className="mt-4 text-[14px] opacity-65 measure">{rec.note}</p>
                      <p className="mt-3 text-[12px] opacity-45 measure">Demonstration heuristic based on your answers. Not a validated sizing system; check the size chart and garment measurements before ordering.</p>
                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link to={`/collection`} className="btn btn-solid">Shop in {rec.size}</Link>
                        <Link to={`/atelier?garment=blazer&fit=${rec.fit}`} className="btn">Build it in the Atelier</Link>
                      </div>
                      <button className="link mt-8 opacity-60" onClick={() => { setAnswers({}); setQi(0) }}>Start over</button>
                    </>
                  ) : (
                    <>
                      <h3 className="t-m">We need your usual size to begin.</h3>
                      <button className="link mt-6" onClick={() => setQi(0)}>Back to the first question</button>
                    </>
                  )}
                  <div className="mt-10 border-t border-[rgba(239,233,224,.15)] pt-5">
                    <p className="label-s opacity-50 mb-3">Your answers</p>
                    <ul className="grid gap-2 text-[13.5px] list-none p-0 m-0">{QUESTIONS.map(q => <li key={q.key} className="flex justify-between gap-4"><span className="opacity-60">{q.q}</span><span>{q.options.find(o => o.id === answers[q.key])?.name ?? 'Skipped'}</span></li>)}</ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {route === 'mtm' && (
          <div>
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 mb-14">
              <div>
                <h2 className="t-l rv">Your measurements.</h2>
                <p className="t-lead opacity-70 mt-6 measure rv" data-delay=".1">One measurement at a time, with the tape shown where it belongs, why it matters and what to avoid. Take what you can; the rest can be confirmed with Sovereign before anything is made. Which garment are you measuring for?</p>
              </div>
              <div className="rv self-end" data-delay=".1">
                <div className="seg max-w-[560px]">{(['blazer', 'trousers', 'waistcoat', 'suit'] as GarmentType[]).map(g => <button key={g} aria-pressed={garment === g} onClick={() => setGarment(g)}>{g === 'suit' ? 'Three-piece' : g}</button>)}</div>
              </div>
            </div>
            <MeasurementJourney key={garment} garment={garment} values={vals} unit={unit} onChange={(k, v) => setVals(s => ({ ...s, [k]: v }))} onUnit={setUnit} />
            <div className="mt-14 border-t border-[rgba(239,233,224,.15)] pt-8 flex flex-wrap items-center justify-between gap-6">
              <p className="t-m">Ready to have it made to these?</p>
              <Link to={`/atelier?garment=${garment}`} className="btn btn-copper">Continue in the Atelier</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
