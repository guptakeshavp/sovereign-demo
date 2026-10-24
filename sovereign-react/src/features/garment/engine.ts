/* Sovereign garment illustration engine.
   Draws recolourable, re-cuttable front-view garments as SVG strings in a 300 × 420 box.
   This is an ILLUSTRATIVE preview, not a rendering of the finished product. */

export interface GarmentSpec {
  colour: string
  texture?: 'twill' | 'flannel' | 'crepe' | 'hopsack' | 'satin'
  lapel?: 'notch' | 'peak' | 'shawl'
  closure?: 'sb1' | 'sb2' | 'db4'
  fitScale?: number
  sleeve?: 'standard' | 'bracelet'
  length?: 'cropped' | 'hip' | 'long'
  pleat?: 'none' | 'single'
  leg?: 'column' | 'wide'
  neck?: 'classic' | 'deep' | 'straight' | 'cowl'
  strap?: 'fine' | 'wide'
  lining?: string
  waistcoatColour?: string
  trouserColour?: string
  waistcoatSpec?: Partial<GarmentSpec>
  trouserSpec?: Partial<GarmentSpec>
}
export type GarmentKind = 'blazer' | 'trousers' | 'waistcoat' | 'camisole' | 'suit'

const W = 300
type Cmd = [string, ...number[]]

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(c => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))
  return '#' + ch.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
}
export function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) > 150
}
function P(cmds: Cmd[], mirror = false) {
  return cmds.map(c => {
    const [k, ...nums] = c
    if (k === 'Z') return 'Z'
    return k + nums.map((v, i) => +((i % 2 === 0 && mirror) ? W - v : v).toFixed(1)).join(' ')
  }).join(' ')
}

let uid = 0
function defs(id: number, colour: string, texture: GarmentSpec['texture']) {
  const light = isLight(colour)
  const line = light ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.045)'
  // cloth grain: procedural noise, darkens slightly so it reads on light and dark cloth alike
  const grain = (bf: number, alpha: number, blur = 0) => `
    <filter id="gr-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${bf}" numOctaves="2" seed="7" result="n"/>
      ${blur ? `<feGaussianBlur in="n" stdDeviation="${blur}" result="n"/>` : ''}
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${alpha / 3} ${alpha / 3} ${alpha / 3} 0 -${alpha * .32}"/>
    </filter>`
  let weave = ''
  let gr = grain(.95, .42)
  switch (texture) {
    case 'flannel': gr = grain(.6, .55, .5); break
    case 'hopsack':
      gr = grain(.8, .36)
      weave = `<pattern id="wv-${id}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="${line}"/><rect x="3" y="3" width="3" height="3" fill="${line}"/></pattern>`; break
    case 'crepe':
      gr = grain(1.3, .4)
      weave = `<pattern id="wv-${id}" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5 Q1.75 1 3.5 3.5 T7 3.5" stroke="${line}" stroke-width=".8" fill="none"/></pattern>`; break
    case 'satin':
      gr = grain(.4, .14)
      weave = `<pattern id="wv-${id}" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,.14)" stroke-width="1"/></pattern>`; break
    default:
      weave = `<pattern id="wv-${id}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${line}" stroke-width="1.2"/></pattern>`
  }
  return `<defs>${gr}${weave}
    <pattern id="tx-${id}" width="96" height="96" patternUnits="userSpaceOnUse">
      <rect width="96" height="96" filter="url(#gr-${id})"/>
      ${weave ? `<rect width="96" height="96" fill="url(#wv-${id})"/>` : ''}
    </pattern>
    <linearGradient id="sh-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#000" stop-opacity="0"/>
      <stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/>
    </linearGradient>
    <linearGradient id="sv-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${light ? .18 : .09}"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".16"/>
    </linearGradient>
    <filter id="bl-${id}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="bs-${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>`
}

/* ---------- BLAZER ---------- */
function blazer(o: GarmentSpec, id: number, offset = 0) {
  const c = o.colour, dark = shade(c, -0.2), darker = shade(c, -0.34)
  const seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4)
  const s = o.fitScale ?? 1
  const horn = isLight(c) ? '#7A6A5C' : '#1A1715'
  const db = o.closure === 'db4'
  const nBtn = db ? 2 : o.closure === 'sb2' ? 2 : 1
  const stance = db ? 190 : nBtn === 1 ? 218 : 198
  const btnGap = 42
  const hem = o.length === 'cropped' ? 292 : o.length === 'long' ? 372 : 336
  const sleeveEnd = o.sleeve === 'bracelet' ? 244 : 266
  const inner = '#EDE8E0'
  const bodyL: Cmd[] = [['M',150,72],['Q',110,66,70,80],['L',90,134],['Q',78,230,88,hem - 2],['Q',150,hem + 14,212,hem - 2],['Q',222,230,210,134],['L',230,80],['Q',190,66,150,72],['Z']]
  const sleeveL: Cmd[] = [['M',70,80],['Q',46,170,44,sleeveEnd],['L',78,sleeveEnd + 4],['Q',84,196,90,134],['Z']]
  const sleeveR: Cmd[] = [['M',230,80],['Q',254,170,256,sleeveEnd],['L',222,sleeveEnd + 4],['Q',216,196,210,134],['Z']]
  const vee: Cmd[] = [['M',150,stance + 4],['L',132,76],['L',150,70],['L',168,76],['Z']]
  let lapelL: Cmd[], collarL: Cmd[] | null
  const spread = db ? 14 : 0
  if (o.lapel === 'peak') {
    lapelL = [['M',150,stance],['L',96 - spread,82],['L',128 - spread / 2,90],['L',134,76],['Z']]
    collarL = [['M',150,62],['L',116,66],['L',128 - spread / 2,90],['L',134,76],['L',150,70],['Z']]
  } else if (o.lapel === 'shawl') {
    lapelL = [['M',150,stance],['C',116,170,100,120,108,66],['Q',128,60,150,58],['L',150,66],['Q',140,68,134,76],['Z']]
    collarL = null
  } else {
    lapelL = [['M',150,stance],['L',104 - spread,100],['L',124 - spread / 2,86],['L',134,76],['Z']]
    collarL = [['M',150,62],['L',112,66],['L',124 - spread / 2,86],['L',134,76],['L',150,70],['Z']]
  }
  const cuff = (mirror: boolean) => [0,1,2].map(i => { const x = mirror ? 300 - (50 + i * 8) : 50 + i * 8; return `<circle cx="${x}" cy="${sleeveEnd - 10 + i * 1.2}" r="2.4" fill="${horn}" opacity=".9"/>` }).join('')
  const btn = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="5" fill="${horn}" stroke="${shade(horn,.3)}" stroke-width=".8"/><path d="M${x-2} ${y-2} l4 4 M${x+2} ${y-2} l-4 4" stroke="${shade(horn,.5)}" stroke-width=".8" fill="none"/>`
  const btns = db
    ? [0,1].flatMap(i => [btn(132, stance + i * btnGap), btn(168, stance + i * btnGap)]).join('')
    : Array.from({ length: nBtn }, (_, i) => btn(150, stance + i * btnGap)).join('')
  const frontEdge = db
    ? `<path d="M168 ${stance - 30} L172 ${hem - 6}" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>`
    : `<path d="M150 ${stance + 8} L150 ${stance + (nBtn-1)*btnGap + 28} Q152 ${hem - 8} 176 ${hem}" stroke="${seam}" stroke-width="1.1" fill="none" opacity=".7"/>`
  return `<g transform="translate(0 ${offset})"><g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
    <path d="${P(sleeveL)}" fill="${dark}"/><path d="${P(sleeveR)}" fill="${dark}"/>
    <path d="${P(sleeveL)} ${P(sleeveR)}" fill="url(#tx-${id})"/>
    <path d="M48 ${sleeveEnd - 12} Q62 ${sleeveEnd - 8} 78 ${sleeveEnd - 8}" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M252 ${sleeveEnd - 12} Q238 ${sleeveEnd - 8} 222 ${sleeveEnd - 8}" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
    ${cuff(false)}${cuff(true)}
    <path d="${P(bodyL)}" fill="${c}"/><path d="${P(bodyL)}" fill="url(#tx-${id})"/><path d="${P(bodyL)}" fill="url(#sh-${id})"/><path d="${P(bodyL)}" fill="url(#sv-${id})"/>
    <path d="M118 184 L112 ${hem - 10} M182 184 L188 ${hem - 10}" stroke="${seam}" stroke-width=".9" fill="none" opacity=".55"/>
    ${frontEdge}
    <path d="M168 160 L206 158 L205 165 L169 167 Z" fill="${darker}" opacity=".9"/>
    <path d="M90 ${hem - 70} L140 ${hem - 70} L138 ${hem - 57} L92 ${hem - 57} Z" fill="${dark}"/>
    <path d="M160 ${hem - 70} L210 ${hem - 70} L208 ${hem - 57} L162 ${hem - 57} Z" fill="${dark}"/>
    <path d="${P(vee)}" fill="${inner}"/>
    <path d="M150 ${stance} L150 84" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
    <g transform="translate(2 3)" filter="url(#bs-${id})" opacity=".35"><path d="${P(lapelL)}" fill="#000"/><path d="${P(lapelL, true)}" fill="#000"/></g>
    <path d="${P(lapelL)}" fill="${dark}"/><path d="${P(lapelL, true)}" fill="${dark}"/>
    ${collarL ? `<path d="${P(collarL)}" fill="${darker}"/><path d="${P(collarL, true)}" fill="${darker}"/>` : ''}
    <path d="${P(lapelL)} ${P(lapelL, true)}" fill="url(#tx-${id})"/>
    <path d="M${112 - spread} ${stance - 62} l5 -4" stroke="${seam}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
    ${btns}
  </g></g>`
}

/* ---------- TROUSERS ---------- */
function trousers(o: GarmentSpec, id: number, offset = 0, scale = 1) {
  const c = o.colour, dark = shade(c, -0.2), seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4)
  const light = isLight(c) ? shade(c, .3) : shade(c, .12)
  const wide = o.leg === 'wide'
  const hemL = wide ? [68, 134] : [78, 124]
  const hemR = wide ? [166, 232] : [176, 222]
  const legL: Cmd[] = [['M',94,52],['L',150,52],['L',150,142],['L',hemL[1],402],['L',hemL[0],402],['L',86,160],['Z']]
  const legR: Cmd[] = [['M',206,52],['L',150,52],['L',150,142],['L',hemR[0],402],['L',hemR[1],402],['L',214,160],['Z']]
  const pleats = o.pleat === 'single' ? `<path d="M118 54 L112 140 M182 54 L188 140" stroke="${seam}" stroke-width="1" fill="none" opacity=".7"/>` : ''
  return `<g transform="translate(0 ${offset}) scale(${scale})"><g transform="translate(150 0) scale(${o.fitScale ?? 1} 1) translate(-150 0)">
    <path d="${P(legL)}" fill="${c}"/><path d="${P(legR)}" fill="${c}"/>
    <path d="${P(legL)} ${P(legR)}" fill="url(#tx-${id})"/><path d="${P(legL)} ${P(legR)}" fill="url(#sh-${id})"/><path d="${P(legL)} ${P(legR)}" fill="url(#sv-${id})"/>
    <path d="M118 166 L${(hemL[0]+hemL[1])/2} 396 M182 166 L${(hemR[0]+hemR[1])/2} 396" stroke="${light}" stroke-width="1.1" fill="none" opacity=".5"/>
    <path d="M150 54 L150 138 M150 60 Q160 90 152 136" stroke="${seam}" stroke-width="1" fill="none" opacity=".7"/>
    ${pleats}
    <path d="M92 30 L208 30 L206 54 L94 54 Z" fill="${dark}"/><path d="M92 30 L208 30 L206 54 L94 54 Z" fill="url(#tx-${id})"/>
    <path d="M94 40 L206 40" stroke="${seam}" stroke-width=".8" opacity=".5"/>
    <path d="M94 58 Q100 90 108 110 M206 58 Q200 90 192 110" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M${hemL[0]+2} 392 L${hemL[1]-2} 392 M${hemR[0]+2} 392 L${hemR[1]-2} 392" stroke="${seam}" stroke-width=".8" opacity=".5"/>
  </g></g>`
}

/* ---------- WAISTCOAT ---------- */
function waistcoat(o: GarmentSpec, id: number, offset = 0) {
  const c = o.colour, darker = shade(c, -0.34), seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4)
  const horn = isLight(c) ? '#7A6A5C' : '#1A1715'
  const vDepth = o.neck === 'deep' ? 210 : 176
  const front: Cmd[] = [['M',118,62],['L',98,70],['Q',100,120,104,138],['L',98,300],['L',132,312],['L',150,324],['L',150,vDepth],['Z']]
  const back: Cmd[] = [['M',118,62],['L',182,62],['L',182,70],['L',118,70],['Z']]
  const nB = 5
  const btns = Array.from({ length: nB }, (_, i) => `<circle cx="150" cy="${vDepth + 8 + i * ((300 - vDepth) / nB)}" r="4.2" fill="${horn}" stroke="${shade(horn,.3)}" stroke-width=".7"/>`).join('')
  const satin = `<path d="M120 72 L180 72 L186 300 L150 322 L114 300 Z" fill="${shade(c,.15)}" opacity=".9"/>`
  return `<g transform="translate(0 ${offset})"><g transform="translate(150 0) scale(${o.fitScale ?? 1} 1) translate(-150 0)">
    ${satin}
    <path d="${P(front)}" fill="${c}"/><path d="${P(front, true)}" fill="${c}"/>
    <path d="${P(front)} ${P(front,true)}" fill="url(#tx-${id})"/><path d="${P(front)} ${P(front,true)}" fill="url(#sh-${id})"/><path d="${P(front)} ${P(front,true)}" fill="url(#sv-${id})"/>
    <path d="${P(back)}" fill="${darker}"/>
    <path d="M106 228 L136 226 L136 232 L106 234 Z" fill="${darker}"/><path d="M164 226 L194 228 L194 234 L164 232 Z" fill="${darker}"/>
    <path d="M122 150 L118 300 M178 150 L182 300" stroke="${seam}" stroke-width=".9" fill="none" opacity=".5"/>
    <path d="M150 ${vDepth} L150 324" stroke="${seam}" stroke-width="1" opacity=".8"/>
    ${btns}
  </g></g>`
}

/* ---------- CAMISOLE ---------- */
function camisole(o: GarmentSpec, id: number, offset = 0) {
  const c = o.colour, dark = shade(c, -0.18), light = isLight(c) ? shade(c, .45) : shade(c, .22)
  const cowl = o.neck === 'cowl'
  const top: Cmd[] = cowl ? [['M',108,88],['Q',150,122,192,88]] : [['M',108,88],['L',192,88]]
  const body: Cmd[] = [...top, ['L',204,160],['L',200,302],['L',100,302],['L',96,160],['Z']]
  const strapW = o.strap === 'wide' ? 7 : 2.4
  return `<g transform="translate(0 ${offset})"><g transform="translate(150 0) scale(${o.fitScale ?? 1} 1) translate(-150 0)">
    <path d="M110 34 L113 88 M190 34 L187 88" stroke="${dark}" stroke-width="${strapW}" stroke-linecap="round" fill="none"/>
    <path d="${P(body)}" fill="${c}"/><path d="${P(body)}" fill="url(#tx-${id})"/><path d="${P(body)}" fill="url(#sh-${id})"/><path d="${P(body)}" fill="url(#sv-${id})"/>
    <path d="M116 100 Q120 200 112 296" stroke="${light}" stroke-width="12" fill="none" opacity=".35" stroke-linecap="round"/>
    <path d="M170 110 Q176 200 172 290" stroke="${light}" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>
    ${cowl ? `<path d="M112 92 Q150 128 188 92" stroke="${light}" stroke-width="1.4" fill="none" opacity=".6"/><path d="M122 96 Q150 118 178 96" stroke="${dark}" stroke-width="1" fill="none" opacity=".4"/>`
           : `<path d="M108 88 L192 88" stroke="${light}" stroke-width="1.2" opacity=".6"/>`}
    <path d="M100 298 L200 298" stroke="${dark}" stroke-width=".8" opacity=".5"/>
  </g></g>`
}

/* ---------- SUIT (three-piece composite) ---------- */
function suit(o: GarmentSpec, id: number) {
  const trs: GarmentSpec = { ...o, ...(o.trouserSpec ?? {}), colour: o.trouserColour ?? o.colour, fitScale: 1 }
  const wc: GarmentSpec = { ...o, ...(o.waistcoatSpec ?? {}), colour: o.waistcoatColour ?? o.colour, neck: o.waistcoatSpec?.neck ?? 'deep' }
  return `<g transform="translate(43 150) scale(.715)">${trousers(trs, id, 0)}</g>
    <g transform="translate(45 -2) scale(.70)">${waistcoat(wc, id, 52)}</g>
    <g transform="translate(45 -2) scale(.70)">${blazer(o, id, 0)}</g>`
}

const DRAW: Record<GarmentKind, (o: GarmentSpec, id: number) => string> = {
  blazer: (o, id) => blazer(o, id, 0), trousers: (o, id) => trousers(o, id, 0), waistcoat: (o, id) => waistcoat(o, id, 0),
  camisole: (o, id) => camisole(o, id, 0), suit,
}

export function renderGarment(kind: GarmentKind, spec: GarmentSpec) {
  const id = ++uid
  const o: GarmentSpec = { lapel: 'peak', closure: 'sb1', fitScale: 1, length: 'hip', sleeve: 'standard', texture: 'twill', ...spec }
  const floorY = kind === 'camisole' ? 318 : kind === 'waistcoat' ? 338 : kind === 'blazer' ? (o.length === 'cropped' ? 310 : o.length === 'long' ? 390 : 352) : 412
  const floor = `<ellipse cx="150" cy="${floorY}" rx="${kind === 'trousers' ? 78 : 96}" ry="7" fill="#000" opacity=".28" filter="url(#bl-${id})"/>`
  return `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrative garment preview">${defs(id, o.colour, o.texture)}${floor}${DRAW[kind](o, id)}</svg>`
}

/* Monogram inset: cross-stitched initials on the lining. */
export function renderMonogram(initials: string, lining: string, thread = '#D08D5E') {
  const txt = (initials || 'S').toUpperCase().slice(0, 3)
  const l = lining
  return `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monogram preview">
    <defs><linearGradient id="lin-${txt}" x1="0" x2="1"><stop offset="0" stop-color="${shade(l,.18)}"/><stop offset=".5" stop-color="${l}"/><stop offset="1" stop-color="${shade(l,-.2)}"/></linearGradient>
    <pattern id="silk-${txt}" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,.12)" stroke-width="1"/></pattern></defs>
    <rect width="300" height="180" fill="url(#lin-${txt})"/><rect width="300" height="180" fill="url(#silk-${txt})"/>
    <path d="M60 40 L240 40 L240 50 L60 50 Z" fill="${shade(l,-.3)}"/>
    <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6" fill="none" stroke="${thread}" stroke-width="2.2" stroke-dasharray="2.4 1.6" stroke-linejoin="round">${txt}</text>
    <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6" fill="${thread}" opacity=".5">${txt}</text>
    <g stroke="${thread}" stroke-width="2" stroke-linecap="round" opacity=".9"><path d="M232 128 l7 7 M239 128 l-7 7"/></g>
  </svg>`
}
