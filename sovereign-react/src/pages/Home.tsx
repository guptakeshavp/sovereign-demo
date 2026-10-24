import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../lib/motion'
import { Mark } from '../components/Logo'
import { ProductCard } from '../components/ProductCard'
import { CampaignHero } from '../components/CampaignHero'
import { BrandContact } from '../components/BrandContact'
import { productById } from '../data/catalogue'

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  const featured = ['sculpted-waistcoat', 'signature-blazer', 'wide-trouser', 'silk-camisole'].map(id => productById(id)!)

  return (
    <div ref={root} className="page">
      <CampaignHero />

      {/* ───── THE COLLECTION ───── */}
      <section className="section surface-light">
        <div className="wrap">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-x-12 gap-y-12 lg:grid-rows-[auto_1fr]">
            <div className="lg:row-span-2 lg:max-w-[520px]">
              <ProductCard p={featured[0]} delay={0} />
            </div>
            <div className="grid gap-6 lg:pt-10 order-first lg:order-none">
              <h2 className="t-l rv max-w-[12em]">Seven pieces. One wardrobe.</h2>
              <p className="t-lead rv opacity-70 measure" data-delay=".08">Blazers, trousers and layers. Wear them your way.</p>
              <Link to="/collection" className="link rv" data-delay=".12">See the collection</Link>
            </div>
            <div className="flex scroll-x gap-4 -mx-[var(--gutter)] px-[var(--gutter)] sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:gap-5 col-span-full lg:col-span-1 self-end">
              {featured.slice(1).map((p, i) => <div key={p.id} className="min-w-[66%] sm:min-w-0"><ProductCard p={p} delay={.1 + i * .08} compact /></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ───── THE THREE-PIECE ───── */}
      <section className="section surface-espresso relative overflow-hidden">
        <div className="wrap grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-24 items-center">
          <Link to="/product/sovereign-three-piece?colour=charcoal" className="frame aspect-[4/5] lg:aspect-[4/5] rv block group" aria-label="The Sovereign three-piece">
            <img src="./images/professionals-v1/three-piece.jpg" alt="An Indian woman wearing the charcoal three-piece: peak-lapel blazer, waistcoat and straight-leg trousers" width="1672" height="941" loading="lazy" className="object-[60%_50%] transition-transform duration-[1.6s] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
          </Link>
          <div className="lg:py-10">
            <div className="rv flex items-center gap-4 copper"><Mark className="w-8" /><p className="label">The Sovereign three-piece</p></div>
            <h2 className="t-xl rv mt-5" data-delay=".05">One cloth.<br />Three ways to <span className="whitespace-nowrap"><em className="t-i">wear</em> it.</span></h2>
            <p className="t-lead rv mt-7 opacity-75 measure" data-delay=".1">Blazer. Waistcoat. Trouser. A complete suit, or the start of three different looks.</p>
            <div className="rv mt-10 flex flex-wrap items-center gap-8" data-delay=".2">
              <Link to="/product/sovereign-three-piece?colour=charcoal" className="btn btn-copper">Discover the three-piece</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── THE ATELIER ───── */}
      <section className="section surface-dark relative overflow-hidden">
        <div className="wrap grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="frame aspect-[4/5] lg:aspect-[1/1] rv">
            <img src="./images/editorial-v1/conversation.jpg" alt="Two Indian women smiling in conversation, with terracotta tailoring, a Jamun waistcoat and personal accessories" width="1672" height="941" loading="lazy" className="object-[66%_50%]" />
          </div>
          <div>
            <p className="label rv copper">The Sovereign Atelier</p>
            <h2 className="t-l rv mt-5" data-delay=".05">Make it <em className="t-i">yours.</em></h2>
            <p className="t-lead rv mt-7 opacity-75 measure" data-delay=".1">Your cloth. Your cut. Your fit.</p>
            <div className="rv mt-10" data-delay=".15"><Link to="/atelier" className="btn btn-copper">Enter the Atelier</Link></div>
          </div>
        </div>
      </section>
      <BrandContact />
    </div>
  )
}
