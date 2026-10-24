import { BRAND } from '../data/brand'
import '../styles/details.css'

export function BrandContact() {
  return <section className="brand-contact" aria-labelledby="brand-contact-title">
    <div className="wrap brand-contact-grid">
      <div><h2 id="brand-contact-title">Let’s make<br />it <em>personal.</em></h2><p>A piece, a fitting, a conversation. Begin with the house.</p><small>Demo studio and contact details. Appointments and contact channels are not live yet.</small></div>
      <dl>
        <div><dt>Headquarters</dt><dd>{BRAND.headquarters}<br />{BRAND.studio}</dd></div>
        <div><dt>Telephone</dt><dd>{BRAND.phone}<br /><small>Placeholder number</small></dd></div>
        <div><dt>Email</dt><dd>{BRAND.email}</dd></div>
        <div><dt>Website</dt><dd><a href={BRAND.website} target="_blank" rel="noreferrer" className="underline underline-offset-4">{BRAND.websiteLabel}</a><small>guptakeshavp.github.io/sovereign-demo</small></dd></div>
      </dl>
    </div>
  </section>
}
