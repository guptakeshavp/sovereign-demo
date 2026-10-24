import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Native sticky scenes; transform/opacity explain cloth, silhouette and styling. */
export function useStoryMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    // A fresh chapter starts at its opening, including navigation from the footer.
    window.scrollTo({ top: 0, behavior: 'instant' })
    scope.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
    const media = gsap.matchMedia()
    let mounted = true
    let refreshFrame = 0
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => { if (mounted) ScrollTrigger.refresh() })
    }

    media.add({ motion: '(prefers-reduced-motion: no-preference)', small: '(max-width: 639px)', tall: '(min-height: 600px)' }, context => {
      if (!context.conditions?.motion || !context.conditions.tall) return
      const small = !!context.conditions.small
      const material = scope.querySelector<HTMLElement>('.story-material')!
      const wardrobe = scope.querySelector<HTMLElement>('.story-wardrobe')!
      const outfits = [...scope.querySelectorAll<HTMLElement>('.story-outfit')]
      const photos = outfits.map(outfit => outfit.querySelector<HTMLElement>('.story-outfit-media')!)
      const captions = outfits.map(outfit => outfit.querySelector<HTMLElement>('.story-outfit-copy')!)
      const progress = scope.querySelectorAll<HTMLElement>('.story-wardrobe-progress i')
      let current = -1
      const select = (index: number) => {
        if (index === current) return
        current = index
        outfits.forEach((outfit, i) => {
          outfit.setAttribute('aria-hidden', String(i !== index))
          outfit.dataset.active = String(i === index)
        })
        progress.forEach((dot, i) => { dot.dataset.active = String(i === index) })
      }

      scope.classList.add('has-story-motion')
      const animations = gsap.context(() => {
        gsap.fromTo('.story-hero-visual img', { scale: 1.06, transformOrigin: '50% 0%' }, { scale: 1, yPercent: small ? 8 : 14, ease: 'none', scrollTrigger: {
          trigger: '.story-hero', start: 'top top', end: 'bottom top', scrub: .25,
        } })

        // The material scene turns a flat weave into a recognisable garment line.
        gsap.set('.story-material-lapel', { opacity: 0 })
        gsap.set('.story-cut-line', { scaleX: 0, transformOrigin: '0 50%' })
        const cloth = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: material, start: 'top top', end: 'bottom bottom', scrub: .25,
        } })
        cloth.fromTo('.story-material-cloth img', { scale: small ? 1.05 : 1.12 }, { scale: 1, duration: 1 }, 0)
          .to('.story-cut-line', { scaleX: 1, duration: .2, stagger: .07 }, .08)
          .to('.story-material-lapel', { opacity: 1, duration: .42 }, .42)
          .to('.story-cut-guide', { opacity: 0, duration: .2 }, .76)
          .fromTo('.story-material-rule i', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

        // All three frames share the same pose, registration and camera position.
        gsap.set([photos[1], photos[2], captions[1], captions[2]], { opacity: 0 })
        select(0)
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: wardrobe, start: 'top top', end: 'bottom bottom', scrub: .35,
          onUpdate: self => select(self.progress < .32 ? 0 : self.progress < .73 ? 1 : 2),
        } })
          .to(photos[1], { opacity: 1, duration: .16 }, .24)
          .to(captions[0], { opacity: 0, duration: .07 }, .24)
          .to(captions[1], { opacity: 1, duration: .07 }, .33)
          .to(photos[2], { opacity: 1, duration: .16 }, .65)
          .to(captions[1], { opacity: 0, duration: .07 }, .65)
          .to(captions[2], { opacity: 1, duration: .07 }, .74)
          .to({}, { duration: .19 }, .81)

        // The garment recedes and the approved house signature takes its place.
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: '.story-resolution', start: 'top 75%', end: 'top 10%', scrub: .35,
        } })
          .fromTo('.story-resolution-veil', { opacity: .55 }, { opacity: 1, duration: .7 }, 0)
          .fromTo('.story-house-mark', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .7 }, .14)
          .fromTo('.story-house-wordmark', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .7 }, .26)
      }, scope)
      refresh()
      return () => {
        animations.revert()
        scope.classList.remove('has-story-motion')
        outfits.forEach(outfit => { outfit.removeAttribute('aria-hidden'); delete outfit.dataset.active })
        progress.forEach(dot => { delete dot.dataset.active })
      }
    })

    const images = [...scope.querySelectorAll('img')]
    images.forEach(image => image.addEventListener('load', refresh))
    void document.fonts.ready.then(() => { if (mounted) refresh() })
    return () => {
      mounted = false
      cancelAnimationFrame(refreshFrame)
      images.forEach(image => image.removeEventListener('load', refresh))
      media.revert()
    }
  }, [root])
}
