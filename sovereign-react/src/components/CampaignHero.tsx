import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Pause, Play, Plus } from 'lucide-react'
import { cx } from '../lib/format'
import '../styles/campaign.css'
import { CAMPAIGN } from '../data/campaign'
import { DetailsDialog } from './DetailsDialog'

export function CampaignHero() {
  const root = useRef<HTMLElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const playing = !paused && !reduced && !interacting && visible && pageVisible && !detailsOpen
  const scene = CAMPAIGN[active]
  const move = (direction: number) => setActive(index => (index + direction + CAMPAIGN.length) % CAMPAIGN.length)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduced(preference.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    updatePreference()
    updateVisibility()
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    if (root.current) observer.observe(root.current)
    return () => {
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setActive(index => (index + 1) % CAMPAIGN.length), scene.duration)
    return () => window.clearTimeout(timer)
  }, [playing, active, scene.duration])

  return (
    <section ref={root} className={cx('campaign-hero', playing && 'is-playing', reduced && 'is-reduced', `campaign-atmosphere-${scene.atmosphere}`)} aria-label="Sovereign campaign" aria-roledescription="carousel" data-hero
      onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}>
      <div className="campaign-media" onPointerDown={event => { if (event.pointerType !== 'mouse') pointerStart.current = { x: event.clientX, y: event.clientY } }}
        onPointerCancel={() => { pointerStart.current = null }}
        onPointerUp={event => {
          if (pointerStart.current === null) return
          const distance = event.clientX - pointerStart.current.x
          const vertical = event.clientY - pointerStart.current.y
          pointerStart.current = null
          if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(vertical) * 1.2) { setPaused(true); move(distance < 0 ? 1 : -1) }
        }}>
        {CAMPAIGN.map((item, index) => <div key={item.id} className={cx('campaign-frame', active === index && 'is-active')} aria-hidden={active !== index}>
          <img src={item.image} alt={item.alt} width="1672" height="941" fetchPriority={index === 0 ? 'high' : 'low'} style={{ objectPosition: `${item.position} 50%`, transformOrigin: `${item.position} 50%` }} />
        </div>)}
      </div>
      <div className="campaign-shade" />
      <div className="wrap campaign-copy">
        <h1 key={scene.id}>{scene.title[0]}<br /><em>{scene.title[1]}</em></h1>
        <div className="campaign-bottom">
          <div className="campaign-links"><Link to={scene.to} className="link">{scene.cta}</Link><button type="button" className="campaign-details" onClick={() => setDetailsOpen(true)}><Plus size={13} />Details</button></div>
          <div className="campaign-controls" aria-label="Campaign controls">
            <span className="campaign-count num" aria-live={playing ? 'off' : 'polite'}><span className="sr-only">Image </span>{String(active + 1).padStart(2, '0')} / {String(CAMPAIGN.length).padStart(2, '0')}</span>
            {!reduced && <button type="button" onClick={() => { setPaused(value => !value); setInteracting(false) }} aria-label={paused ? 'Play campaign' : 'Pause campaign'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
            <button type="button" onClick={() => { setPaused(true); move(-1) }} aria-label="Previous campaign image"><ArrowLeft size={16} /></button>
            <button type="button" onClick={() => { setPaused(true); move(1) }} aria-label="Next campaign image"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
      <DetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} title={scene.title.join(' ')}>
        <p>{scene.copy}</p>
        <dl className="details-dialog-facts"><div><dt>Setting</dt><dd>{scene.setting}</dd></div><div><dt>Styling</dt><dd>{scene.styling}</dd></div></dl>
        <Link to={scene.to} className="btn btn-solid w-full" onClick={() => setDetailsOpen(false)}>{scene.cta}</Link>
        <p className="text-[12px] opacity-60 mt-6">AI-created editorial imagery for this demonstration collection.</p>
      </DetailsDialog>
    </section>
  )
}
