import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Mark, Wordmark } from '../components/Logo'
import { useStoryMotion } from '../features/story/useStoryMotion'
import '../styles/story.css'

const OUTFITS = [
  { image: './images/campaign-v2/suit.jpg', alt: 'An Indian woman in a charcoal blazer, waistcoat and straight-leg trousers', title: 'The complete suit.', copy: 'A little presence goes a long way.' },
  { image: './images/story-v1/waistcoat.jpg', alt: 'The same woman, pose and charcoal trousers, wearing the waistcoat without the blazer', title: 'A lighter mood.', copy: 'Leave a layer. Keep your own line.' },
  { image: './images/story-v1/separates.jpg', alt: 'The same woman in the charcoal blazer and trousers with an ivory silk camisole', title: 'The evening, open.', copy: 'A change of plans. A touch of silk.' },
]

function Chapter({ children }: { children: React.ReactNode }) {
  return <p className="story-chapter"><span>{children}</span></p>
}

export default function Story() {
  const root = useRef<HTMLDivElement>(null)
  useStoryMotion(root)

  return (
    <div ref={root} className="page story-page">
      <section className="story-hero" data-story-scene="presence" aria-labelledby="story-title">
        <figure className="story-hero-visual">
          <img src="./images/campaign-v2/suit.jpg" alt="An Indian woman in charcoal tailoring, standing in warm morning light" width="1122" height="1402" fetchPriority="high" />
        </figure>
        <div className="story-hero-shade" />
        <div className="wrap story-hero-copy">
          <Chapter>The woman</Chapter>
          <h1 id="story-title" tabIndex={-1}>Her own<br /><em>measure.</em></h1>
          <p id="story-feeling">An Indian house of tailoring.<br />Shaped around the woman within.</p>
        </div>
        <div className="wrap story-hero-foot"><span>Sovereign · Our story</span><span className="story-scroll-cue">Scroll to unfold <ArrowDown size={14} strokeWidth={1.2} /></span></div>
      </section>

      <section className="story-material story-sequence" data-story-scene="cloth" aria-labelledby="story-cloth">
        <div className="story-stage story-material-stage">
          <div className="story-material-visuals">
            <figure className="story-material-cloth"><img src="./images/campaign-v2/cloth.jpg" alt="The fine diagonal weave of charcoal, stone and dove-grey cloth" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
            <figure className="story-material-lapel"><img src="./images/campaign-v2/lapel.jpg" alt="The cloth shaped into a defined shoulder and peak lapel" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
            <svg className="story-cut-guide" viewBox="0 0 1254 1254" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g transform="translate(680 80) rotate(17)"><rect className="story-cut-line" width="540" height="1.5" /></g>
              <g transform="translate(800 258) rotate(118)"><rect className="story-cut-line" width="650" height="1.5" /></g>
              <g transform="translate(490 830) rotate(-119)"><rect className="story-cut-line" width="410" height="1.5" /></g>
            </svg>
            <div className="story-material-shade" />
          </div>
          <div className="wrap story-material-copy">
            <Chapter>The line</Chapter>
            <h2 id="story-cloth">A line of<br /><em>her own.</em></h2>
            <p>Cloth. A line.<br />A shape that feels like you.</p>
          </div>
          <div className="story-material-index" aria-hidden="true"><span>Cloth</span><span className="story-material-rule"><i /></span><span>Silhouette</span></div>
        </div>
      </section>

      <section className="story-wardrobe story-sequence" data-story-scene="possibility" aria-labelledby="story-wardrobe-title">
        <div className="story-stage story-wardrobe-stage">
          <div className="wrap story-wardrobe-heading">
            <Chapter>Possibility</Chapter>
            <h2 id="story-wardrobe-title">One suit.<br /><em>Many ways{' '}<br />to be.</em></h2>
            <p id="story-day">A whole day. Wholly yourself.</p>
          </div>
          <div className="story-outfits">
            {OUTFITS.map((outfit, index) => <article key={outfit.image} className="story-outfit">
              <figure className="story-outfit-media"><img src={outfit.image} alt={outfit.alt} width="1122" height="1402" loading="lazy" decoding="async" /></figure>
              <div className="story-outfit-copy"><span className="story-outfit-number num">0{index + 1}</span><div><h3>{outfit.title}</h3><p>{outfit.copy}</p></div></div>
            </article>)}
          </div>
          <div className="story-wardrobe-progress" aria-hidden="true"><span>One wardrobe</span><div><i /><i /><i /></div></div>
        </div>
      </section>

      <section className="story-resolution" data-story-scene="sovereign" aria-labelledby="story-lioness-title">
        <figure className="story-resolution-photo" aria-hidden="true"><img src="./images/story-v1/separates.jpg" alt="" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
        <div className="story-resolution-veil" />
        <div className="wrap story-resolution-content">
          <Chapter>In her own right</Chapter>
          <h2 id="story-lioness-title" className="sr-only">Sovereign. Her own measure.</h2>
          <div className="story-house-signature"><Mark className="story-house-mark" /><Wordmark className="story-house-wordmark" /></div>
          <p id="story-invitation">The freedom to choose.<br />The confidence to be.</p>
          <Link to="/atelier" className="story-invitation">Make it yours <ArrowUpRight size={17} strokeWidth={1.2} /></Link>
        </div>
      </section>
    </div>
  )
}
