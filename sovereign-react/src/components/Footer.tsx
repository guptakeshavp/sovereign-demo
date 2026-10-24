import { Link } from 'react-router-dom'
import { Mark, Wordmark } from './Logo'
import { TapeRule } from './Tape'
import { useState } from 'react'

export function Footer() {
  const [done, setDone] = useState(false)
  return (
    <footer className="surface-dark pt-14 pb-8">
      <div className="wrap">
        <div className="grid place-items-center gap-6 mb-10">
          <Mark className="w-[48px] opacity-90" />
          <Wordmark className="w-full max-w-[560px] opacity-90" />
        </div>
        <TapeRule className="mb-10" />
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h4 className="label mb-4 opacity-70">Be first.</h4>
            <p className="measure muted text-[14px]">A note when the first collection opens.</p>
            <form className="flex max-w-[380px] mt-5 border-b border-[rgba(239,233,224,.35)]" onSubmit={e => { e.preventDefault(); setDone(true) }}>
              <input type="email" required placeholder="Your email address" aria-label="Email address" className="min-w-0 flex-1 bg-transparent border-0 outline-0 py-3 placeholder:opacity-50" />
              <button type="submit" className="label-s">{done ? 'Noted' : 'Notify me'}</button>
            </form>
          </div>
          <FootCol title="Explore" links={[['Collection', '/collection'], ['Atelier', '/atelier'], ['The look', '/look'], ['Story', '/story']]} />
          <FootCol title="Your Sovereign" links={[['Size & fit', '/fit'], ['Saved pieces', '/wishlist']]} />
        </div>
        <div className="mt-10 flex flex-col md:flex-row justify-between gap-3 label-s opacity-50">
          <span>© Sovereign · Women's tailoring · Launching in India</span>
          <span>Demonstration build · prices and specifications are placeholders</span>
        </div>
      </div>
    </footer>
  )
}
function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="label mb-4 opacity-70">{title}</h4>
      <ul className="grid gap-2.5 text-[14px] list-none m-0 p-0">
        {links.map(([t, to]) => <li key={t}><Link to={to} className="hover:text-copper transition-colors">{t}</Link></li>)}
      </ul>
    </div>
  )
}
