import { useEffect, useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
/* Resolves when the opening sequence has lifted (immediately if it is not playing). */
export const introDone = () => new Promise<void>(res => {
  if (document.documentElement.dataset.intro !== '1') return res()
  window.addEventListener('sov-intro-done', () => res(), { once: true })
})
if (typeof document !== 'undefined' && reduceMotion()) document.documentElement.classList.add('no-motion')

/* Reveals every .rv / [data-lines] inside `scope` once, as it scrolls into view.
   Hero elements (data-hero) reveal immediately on mount. */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root || reduceMotion()) return
    const ctx = gsap.context(() => {
      const heroTweens: (() => void)[] = []
      gsap.utils.toArray<HTMLElement>('.rv').forEach(el => {
        const hero = el.closest('[data-hero]')
        const run = () => gsap.to(el, {
          opacity: 1, y: 0, duration: .9, ease: 'power3.out',
          delay: parseFloat(el.dataset.delay ?? '0'),
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 90%', once: true },
        })
        if (hero) heroTweens.push(run); else run()
      })
      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach(box => {
        const spans = box.querySelectorAll('.rv-line > span')
        const hero = box.closest('[data-hero]')
        const run = () => gsap.to(spans, {
          y: 0, duration: 1.05, ease: 'power4.out', stagger: .08,
          delay: parseFloat(box.dataset.delay ?? '0'),
          scrollTrigger: hero ? undefined : { trigger: box, start: 'top 88%', once: true },
        })
        if (hero) heroTweens.push(run); else run()
      })
      // hero reveals wait for the opening sequence so they are seen, not hidden behind it
      introDone().then(() => { if (root.isConnected) heroTweens.forEach(fn => fn()) })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
        const amt = parseFloat(el.dataset.parallax ?? '6')
        gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, root)
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => { clearTimeout(t); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* Soft pulse used when a preview changes. */
export function pulse(el: HTMLElement | null) {
  if (!el || reduceMotion()) return
  gsap.fromTo(el, { opacity: .55, y: 5 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out', overwrite: true })
}

export function useScrollTop(dep: unknown) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [dep])
}
