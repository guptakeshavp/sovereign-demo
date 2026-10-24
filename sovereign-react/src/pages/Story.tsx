import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal, useScrollTop } from '../lib/motion'
import { Mark } from '../components/Logo'
import { Stitch } from '../components/Stitch'
import '../styles/story.css'

const OUTFITS = [
  { image: './images/campaign-v2/suit.jpg', alt: 'An Indian woman wearing a charcoal blazer, waistcoat and straight-leg trousers together', title: 'Together, a statement.', copy: 'Three pieces. One complete silhouette.' },
  { image: './images/story-v1/waistcoat.jpg', alt: 'The same charcoal waistcoat and trousers, worn without the blazer', title: 'A little more freedom.', copy: 'Waistcoat and trouser. A lighter mood.' },
  { image: './images/story-v1/separates.jpg', alt: 'The charcoal blazer and trousers styled with an ivory silk camisole', title: 'The day takes another turn.', copy: 'Add silk. Leave the evening open.' },
]

export default function Story() {
  const root = useRef<HTMLDivElement>(null)
  const wardrobe = useRef<HTMLElement>(null)
  useScrollTop(null)
  useReveal(root)

  useLayoutEffect(() => {
    const scope = root.current
    const scene = wardrobe.current
    if (!scope || !scene) return
    const media = gsap.matchMedia()
    let mounted = true

    // Native scrolling stays in control. Only this wardrobe scene is pinned.
    media.add({ wide: '(min-width: 1024px) and (min-height: 650px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.motion) return
      const wide = context.conditions.wide
      const animations = gsap.context(() => {
        if (wide) {
          gsap.utils.toArray<HTMLElement>('[data-story-drift]', scope).forEach(image => {
            const distance = Number(image.dataset.storyDrift)
            const frame = image.closest('.story-moment') ?? image.closest('figure')!
            gsap.fromTo(frame, { yPercent: 0 }, { yPercent: distance, ease: 'none', scrollTrigger: {
              trigger: frame.parentElement,
              start: 'top bottom', end: 'bottom top', scrub: true,
            } })
          })
          gsap.to('.story-hero-visual', { yPercent: 28, ease: 'none', scrollTrigger: {
            trigger: '.story-hero', start: 'top top', end: 'bottom top', scrub: true,
          } })
          gsap.to('.story-hero-visual img', { scale: 1.035, transformOrigin: '75% 25%', ease: 'none', scrollTrigger: {
            trigger: '.story-hero', start: 'top top', end: 'bottom top', scrub: true,
          } })
          gsap.fromTo('.story-material-main', { clipPath: 'inset(14% 16% 14% 16%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {
            trigger: '.story-material', start: 'top 75%', end: 'center center', scrub: true,
          } })

          gsap.fromTo('.story-material-main img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: {
            trigger: '.story-material-images', start: 'top bottom', end: 'bottom top', scrub: true,
          } })

          scene.classList.add('is-story-pinned')
          const photos = scene.querySelectorAll<HTMLElement>('.story-outfit-media')
          const notes = scene.querySelectorAll<HTMLElement>('.story-outfit-copy')
          gsap.set([photos[1], photos[2]], { clipPath: 'inset(100% 0 0 0)' })
          gsap.set([notes[1], notes[2]], { opacity: .75 })
          const sequence = gsap.timeline({ scrollTrigger: {
            trigger: scene, start: 'top top', end: '+=160%', pin: true, scrub: .5,
            invalidateOnRefresh: true, anticipatePin: 1,
          } })
          sequence.to({}, { duration: .7 })
            .to(photos[1], { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'none' })
            .to(notes[0], { opacity: .75, duration: .3 }, '<')
            .to(notes[1], { opacity: 1, duration: .3 }, '<')
            .to({}, { duration: .6 })
            .to(photos[2], { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'none' })
            .to(notes[1], { opacity: .75, duration: .3 }, '<')
            .to(notes[2], { opacity: 1, duration: .3 }, '<')
            .to({}, { duration: .7 })
        }

        gsap.fromTo('.story-signature-stitch path', { strokeDasharray: 16, strokeDashoffset: 16 }, {
          strokeDashoffset: 0, duration: .5, stagger: .08, ease: 'power2.out',
          scrollTrigger: { trigger: '.story-signature-stitch', start: 'top 88%', once: true },
        })
      }, scope)
      return () => { animations.revert(); scene.classList.remove('is-story-pinned') }
    })

    // Font metrics settle before the pinned scene's final measurements.
    void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh() })
    return () => { mounted = false; media.revert() }
  }, [])

  return (
    <div ref={root} className="story-page">
      <section className="story-hero surface-dark" data-hero aria-labelledby="story-title">
        <picture className="story-hero-visual">
          <source media="(max-width: 639px)" srcSet="./images/campaign-v2/suit.jpg" />
          <img src="./images/story-v1/hero.jpg" alt="An Indian woman in charcoal tailoring, standing with quiet confidence in morning light" width="1672" height="941" fetchPriority="high" />
        </picture>
        <div className="story-hero-shade" />
        <div className="wrap story-hero-copy">
          <p className="label rv">Sovereign · Our story</p>
          <h1 id="story-title" data-lines>
            <span className="rv-line"><span>Before the cut,</span></span>
            <span className="rv-line"><span>there is</span></span>
            <span className="rv-line"><span>a <em>woman.</em></span></span>
          </h1>
          <p className="story-hero-line rv" data-delay=".25">A life, cut on her own terms.</p>
        </div>
      </section>

      <section className="story-opening wrap" aria-labelledby="story-feeling">
        <h2 id="story-feeling" className="story-heading rv">She knows how<br />she wants to <em>feel.</em></h2>
        <div className="story-opening-copy rv" data-delay=".1">
          <p>A new Indian house of women’s tailoring. Shaped around her, from the first choice to the final stitch.</p>
        </div>
      </section>

      <section className="story-moments wrap" aria-labelledby="story-day">
        <h2 id="story-day" className="story-heading rv">A full day.<br />Wholly <em>herself.</em></h2>
        <div className="story-moment-grid">
          <article className="story-moment story-moment-morning">
            <figure className="story-photo rv">
              <img src="./images/story-v1/arrival.jpg" alt="A woman in dove-grey tailoring walking through a sunlit limestone arcade" width="1122" height="1402" loading="lazy" decoding="async" data-story-drift="12" />
            </figure>
            <div className="story-moment-copy rv"><h3>For the first hello.</h3><p>A sharp shoulder. Room to move.</p></div>
          </article>
          <article className="story-moment story-moment-evening">
            <figure className="story-photo rv">
              <img src="./images/story-v1/evening.jpg" alt="A woman in an espresso blazer and ivory silk, seated on a terrace in late afternoon light" width="1122" height="1402" loading="lazy" decoding="async" data-story-drift="-18" />
            </figure>
            <div className="story-moment-copy rv"><h3>For the hours after.</h3><p>Open lapels. Silk. Plans left open.</p></div>
          </article>
        </div>
      </section>

      <section className="story-material" aria-labelledby="story-cloth">
        <div className="wrap">
          <div className="story-material-heading">
            <h2 id="story-cloth" className="story-heading rv">It begins<br />with the <em>cloth.</em></h2>
            <p className="rv">Feel the texture. Follow the line.</p>
          </div>
          <div className="story-material-images">
            <figure className="story-material-main story-photo">
              <img src="./images/campaign-v2/cloth.jpg" alt="Charcoal, stone and dove-grey cloth, with the diagonal twill weave visible in the light" width="1254" height="1254" loading="lazy" decoding="async" data-story-drift="4" />
            </figure>
            <figure className="story-material-detail story-photo rv">
              <img src="./images/campaign-v2/lapel.jpg" alt="A close view of a dove-grey lapel, its seam and woven texture" width="1254" height="1254" loading="lazy" decoding="async" data-story-drift="-24" />
            </figure>
          </div>
          <p className="story-material-end rv">Cloth becomes a line.<br />The line becomes <em>yours.</em></p>
        </div>
      </section>

      <section ref={wardrobe} className="story-wardrobe" aria-labelledby="story-wardrobe-title">
        <div className="wrap story-wardrobe-inner">
          <div className="story-wardrobe-heading">
            <h2 id="story-wardrobe-title" className="story-heading">One cloth.<br />A week of <em>possibilities.</em></h2>
            <p>Together, or entirely your own way.</p>
          </div>
          <div className="story-outfits">
            {OUTFITS.map(outfit => <article key={outfit.image} className="story-outfit">
              <figure className="story-outfit-media"><img src={outfit.image} alt={outfit.alt} width="1122" height="1402" loading="lazy" decoding="async" /></figure>
              <div className="story-outfit-copy"><h3>{outfit.title}</h3><p>{outfit.copy}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="story-lioness surface-dark" aria-labelledby="story-lioness-title">
        <div className="wrap">
          <Mark className="story-lioness-mark rv" />
          <h2 id="story-lioness-title" className="story-heading rv"><span>Certain.</span> <span>Unhurried.</span> <em>Sovereign.</em></h2>
          <div className="story-signature rv">
            <Stitch size={24} className="story-signature-stitch" />
            <p>The lioness. A mark of self-possession. The cross stitch, our signature.</p>
          </div>
        </div>
      </section>

      <section className="story-closing surface-dark" aria-labelledby="story-invitation">
        <div className="wrap story-closing-grid">
          <div className="story-closing-copy">
            <h2 id="story-invitation" className="story-heading rv">The next piece<br />is <em>yours.</em></h2>
            <p className="rv">Your colour. Your cut. Your next chapter.</p>
            <div className="story-closing-actions rv"><Link to="/collection" className="btn btn-solid">Explore the collection</Link><Link to="/atelier" className="link">Make it yours</Link></div>
          </div>
          <figure className="story-closing-photo story-photo rv"><img src="./images/campaign-v2/look.jpg" alt="An Indian woman wearing dove-grey tailoring and ivory silk in a sunlit colonnade" width="1122" height="1402" loading="lazy" decoding="async" data-story-drift="9" /></figure>
        </div>
      </section>
    </div>
  )
}
