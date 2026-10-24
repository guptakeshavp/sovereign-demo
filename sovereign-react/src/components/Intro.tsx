import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Mark, Wordmark } from './Logo'
import { reduceMotion } from '../lib/motion'

/* Opening sequence: ink screen, the lioness settles in, the copper stitch draws on her ear,
   the tape runs, the wordmark wipes in, the screen lifts. Plays once per session. */
export const INTRO_KEY = 'sov.intro'
export function introPending() {
  try { return !reduceMotion() && !sessionStorage.getItem(INTRO_KEY) } catch { return false }
}

export function Intro() {
  const [show, setShow] = useState(introPending)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!show) { window.dispatchEvent(new Event('sov-intro-done')); return }
    document.documentElement.dataset.intro = '1'
    window.scrollTo(0, 0)
    const block = (e: Event) => e.preventDefault()
    const keys = (e: KeyboardEvent) => { if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) e.preventDefault() }
    window.addEventListener('wheel', block, { passive: false }); window.addEventListener('touchmove', block, { passive: false }); window.addEventListener('keydown', keys)
    const unlock = () => { window.removeEventListener('wheel', block); window.removeEventListener('touchmove', block); window.removeEventListener('keydown', keys) }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => {
        try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* ignore */ }
        unlock()
        setShow(false)
      } })
      tl.fromTo('.in-mark', { opacity: 0, scale: 1.08, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 1.1 })
        .fromTo('.in-tape', { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power2.inOut' }, '-=.45')
        .fromTo('.in-word', { clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power2.inOut' }, '-=.7')
        .to({}, { duration: .45 })
        .to('.in-lockup', { opacity: 0, y: -14, duration: .4, ease: 'power1.in' })
        .to('.in-screen', { yPercent: -100, duration: 1, ease: 'expo.inOut', onStart: () => {
          delete document.documentElement.dataset.intro
          window.dispatchEvent(new Event('sov-intro-done'))
        } }, '-=.15')
    }, root)
    return () => { ctx.revert(); unlock() }
  }, [show])
  if (!show) return null
  return (
    <div ref={root} className="fixed inset-0 z-[200]" aria-hidden="true">
      <div className="in-screen absolute inset-0 bg-ink grid place-items-center will-change-transform">
        <div className="in-lockup grid place-items-center gap-9">
          <div className="in-mark relative w-[96px] sm:w-[120px] text-bone opacity-0">
            <Mark className="w-full" />
          </div>
          <div className="in-tape h-px w-[160px] sm:w-[220px] origin-left bg-[repeating-linear-gradient(90deg,var(--color-copper)_0_6px,transparent_6px_10px)] opacity-80" />
          <Wordmark className="in-word w-[220px] sm:w-[300px] text-bone opacity-0" />
        </div>
      </div>
    </div>
  )
}
