/* SOVEREIGN — garment illustration engine
   Renders recolourable front-view garments as inline SVG.
   Every garment is drawn in a 300 × 420 box. */
window.Garments = (function () {
  const W = 300;

  const COLOURS = [
    { id: 'charcoal', name: 'Charcoal',     hex: '#2F2D2B' },
    { id: 'graphite', name: 'Graphite',     hex: '#4E4B48' },
    { id: 'dove',     name: 'Dove grey',    hex: '#948F89' },
    { id: 'copper',   name: 'Copper brown', hex: '#6F4B33' },
    { id: 'midnight', name: 'Midnight',     hex: '#242B3A' },
    { id: 'ivory',    name: 'Ivory',        hex: '#E2DCD0' },
  ];
  const LININGS = [
    { id: 'copper', name: 'Copper silk', hex: '#A5673F' },
    { id: 'slate',  name: 'Slate silk',  hex: '#5B6472' },
    { id: 'ivory',  name: 'Ivory silk',  hex: '#E8E2D6' },
    { id: 'oxblood',name: 'Oxblood silk',hex: '#5E2B2B' },
  ];
  const LAPELS = [
    { id: 'notch', name: 'Notch', note: 'The classic. Quietly correct in every room.' },
    { id: 'peak',  name: 'Peak',  note: 'Sharper shoulders, a touch more occasion.' },
    { id: 'shawl', name: 'Shawl', note: 'One unbroken curve. For evenings.' },
  ];
  const FITS = [
    { id: 'tailored', name: 'Tailored', scale: 0.95, note: 'Close to the body, higher armhole.' },
    { id: 'classic',  name: 'Classic',  scale: 1.00, note: 'Our house cut. Room to move, never loose.' },
    { id: 'relaxed',  name: 'Relaxed',  scale: 1.06, note: 'Softer shoulder, a longer line.' },
  ];
  const BUTTONS = [
    { id: '1', name: 'One', n: 1 },
    { id: '2', name: 'Two', n: 2 },
    { id: '3', name: 'Three', n: 3 },
  ];

  /* ---------- colour helpers ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [n >> 16, (n >> 8) & 255, n & 255].map(c =>
      Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt));
    return '#' + ch.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }
  function isLight(hex) {
    const n = parseInt(hex.slice(1), 16);
    const l = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
    return l > 150;
  }

  /* ---------- path helpers ---------- */
  // cmds: array of [letter, ...numbers]; mirror flips x around the centre line.
  function path(cmds, mirror) {
    return cmds.map(c => {
      const [k, ...nums] = c;
      if (k === 'Z') return 'Z';
      const out = nums.map((v, i) => (i % 2 === 0 && mirror) ? (W - v) : v);
      return k + out.map(v => +v.toFixed(1)).join(' ');
    }).join(' ');
  }
  const P = (cmds, m) => path(cmds, m);

  let uid = 0;
  function defs(id, colour) {
    const lineCol = isLight(colour) ? 'rgba(0,0,0,.035)' : 'rgba(255,255,255,.025)';
    return `
      <defs>
        <pattern id="tw-${id}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="${lineCol}" stroke-width="1.2"/>
        </pattern>
        <linearGradient id="sh-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity=".16"/>
          <stop offset=".25" stop-color="#000" stop-opacity="0"/>
          <stop offset=".75" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".14"/>
        </linearGradient>
      </defs>`;
  }
  function svgOpen(cls) {
    return `<svg class="garment-svg ${cls || ''}" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img">`;
  }

  /* ---------- BLAZER ---------- */
  function blazer(o, id, offset) {
    const c = o.colour, dark = shade(c, -0.2), darker = shade(c, -0.34), seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4);
    const s = o.fitScale || 1;
    const nBtn = o.buttons || 2;
    const stance = nBtn === 1 ? 216 : nBtn === 3 ? 178 : 196;
    const btnGap = 44;
    const horn = isLight(c) ? '#7A6A5C' : '#1A1715';

    const inner = o.inner || '#EDE8E0';
    const body = [['M',150,72],['Q',110,66,70,80],['L',90,134],['Q',78,230,88,334],['Q',150,350,212,334],['Q',222,230,210,134],['L',230,80],['Q',190,66,150,72],['Z']];
    const sleeveL = [['M',70,80],['Q',46,170,44,264],['L',78,268],['Q',84,196,90,134],['Z']];
    const sleeveR = [['M',230,80],['Q',254,170,256,264],['L',222,268],['Q',216,196,210,134],['Z']];
    // the V: shirt showing between the lapels
    const vee = [['M',150,stance + 4],['L',132,76],['L',150,70],['L',168,76],['Z']];

    let lapelL, collarL;
    if (o.lapel === 'peak') {
      lapelL = [['M',150,stance],['L',96,82],['L',128,90],['L',134,76],['Z']];
      collarL = [['M',150,62],['L',116,66],['L',128,90],['L',134,76],['L',150,70],['Z']];
    } else if (o.lapel === 'shawl') {
      lapelL = [['M',150,stance],['C',116,170,100,120,108,66],['Q',128,60,150,58],['L',150,66],['Q',140,68,134,76],['Z']];
      collarL = null;
    } else {
      lapelL = [['M',150,stance],['L',104,100],['L',124,86],['L',134,76],['Z']];
      collarL = [['M',150,62],['L',112,66],['L',124,86],['L',134,76],['L',150,70],['Z']];
    }
    const lapelR = lapelL, collarR = collarL;

    // sleeve cuff buttons
    const cuffBtns = (mirror) => [0,1,2].map(i => {
      const x = mirror ? 300 - (50 + i * 8) : 50 + i * 8;
      return `<circle cx="${x}" cy="${256 + i * 1.2}" r="2.4" fill="${horn}" opacity=".9"/>`;
    }).join('');

    const btns = Array.from({ length: nBtn }, (_, i) =>
      `<circle cx="150" cy="${stance + i * btnGap}" r="5.2" fill="${horn}" stroke="${shade(horn, .3)}" stroke-width=".8"/>
       <path d="M148 ${stance + i*btnGap - 2} l4 4 M152 ${stance + i*btnGap - 2} l-4 4" stroke="${shade(horn,.5)}" stroke-width=".8" fill="none"/>`
    ).join('');

    return `
      <g transform="translate(0 ${offset || 0})">
      <g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
        <path d="${P(sleeveL)}" fill="${dark}"/>
        <path d="${P(sleeveR)}" fill="${dark}"/>
        <path d="${P(sleeveL)} ${P(sleeveR)}" fill="url(#tw-${id})"/>
        <path d="M48 254 Q62 258 78 258" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
        <path d="M252 254 Q238 258 222 258" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
        ${cuffBtns(false)}${cuffBtns(true)}

        <path d="${P(body)}" fill="${c}"/>
        <path d="${P(body)}" fill="url(#tw-${id})"/>
        <path d="${P(body)}" fill="url(#sh-${id})"/>
        <!-- darts & seams -->
        <path d="M118 184 L112 326 M182 184 L188 326" stroke="${seam}" stroke-width=".9" fill="none" opacity=".55"/>
        <!-- front edge of overlapping panel -->
        <path d="M150 ${stance + 8} L150 ${stance + (nBtn-1)*btnGap + 28} Q152 330 176 338" stroke="${seam}" stroke-width="1.1" fill="none" opacity=".7"/>
        <!-- breast pocket (wearer's left) -->
        <path d="M168 160 L206 158 L205 165 L169 167 Z" fill="${darker}" opacity=".9"/>
        <!-- hip pocket flaps -->
        <path d="M90 264 L140 264 L138 277 L92 277 Z" fill="${dark}"/>
        <path d="M160 264 L210 264 L208 277 L162 277 Z" fill="${dark}"/>
        <!-- shirt in the V -->
        <path d="${P(vee)}" fill="${inner}"/>
        <path d="M150 ${stance} L150 84" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
        <!-- lapels -->
        <path d="${P(lapelL)}" fill="${dark}"/>
        <path d="${P(lapelR, true)}" fill="${dark}"/>
        ${collarL ? `<path d="${P(collarL)}" fill="${darker}"/><path d="${P(collarR, true)}" fill="${darker}"/>` : ''}
        <path d="${P(lapelL)} ${P(lapelR,true)}" fill="url(#tw-${id})"/>
        <!-- lapel buttonhole (left lapel) -->
        <path d="M112 ${stance - 62} l5 -4" stroke="${o.boutonniere ? '#C9865A' : seam}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
        ${btns}
      </g>
      </g>`;
  }

  /* ---------- TROUSERS ---------- */
  function trousers(o, id, offset, scale) {
    const c = o.colour, dark = shade(c, -0.2), seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4);
    const light = isLight(c) ? shade(c, .3) : shade(c, .12);
    const s = o.fitScale || 1;
    const legL = [['M',94,52],['L',150,52],['L',150,142],['L',124,402],['L',78,402],['L',86,160],['Z']];
    const legR = [['M',206,52],['L',150,52],['L',150,142],['L',176,402],['L',222,402],['L',214,160],['Z']];
    const pleats = o.pleat === 'single' ? `<path d="M118 54 L112 140 M182 54 L188 140" stroke="${seam}" stroke-width="1" fill="none" opacity=".7"/>` :
                   o.pleat === 'double' ? `<path d="M118 54 L112 140 M130 54 L126 120 M182 54 L188 140 M170 54 L174 120" stroke="${seam}" stroke-width="1" fill="none" opacity=".7"/>` : '';
    return `
      <g transform="translate(0 ${offset || 0}) scale(${scale || 1})">
      <g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
        <path d="${P(legL)}" fill="${c}"/>
        <path d="${P(legR)}" fill="${c}"/>
        <path d="${P(legL)} ${P(legR)}" fill="url(#tw-${id})"/>
        <path d="${P(legL)} ${P(legR)}" fill="url(#sh-${id})"/>
        <!-- creases -->
        <path d="M118 166 L101 396 M182 166 L199 396" stroke="${light}" stroke-width="1.1" fill="none" opacity=".5"/>
        <!-- fly -->
        <path d="M150 54 L150 138 M150 60 Q160 90 152 136" stroke="${seam}" stroke-width="1" fill="none" opacity=".7"/>
        ${pleats}
        <!-- waistband -->
        <path d="M92 30 L208 30 L206 54 L94 54 Z" fill="${dark}"/>
        <path d="M92 30 L208 30 L206 54 L94 54 Z" fill="url(#tw-${id})"/>
        <path d="M94 40 L206 40" stroke="${seam}" stroke-width=".8" opacity=".5"/>
        <!-- belt loops -->
        ${[104,128,172,196].map(x => `<rect x="${x-2}" y="30" width="4" height="24" fill="${shade(c,-.3)}"/>`).join('')}
        <!-- side pockets -->
        <path d="M94 58 Q100 90 108 110 M206 58 Q200 90 192 110" stroke="${seam}" stroke-width="1" fill="none" opacity=".6"/>
        <!-- hem -->
        <path d="M80 392 L123 392 M177 392 L220 392" stroke="${seam}" stroke-width=".8" opacity=".5"/>
      </g>
      </g>`;
  }

  /* ---------- WAISTCOAT ---------- */
  function waistcoat(o, id, offset) {
    const c = o.colour, dark = shade(c, -0.2), darker = shade(c, -0.34), seam = isLight(c) ? shade(c, -0.22) : shade(c, -0.4);
    const s = o.fitScale || 1;
    const horn = isLight(c) ? '#7A6A5C' : '#1A1715';
    const vDepth = o.neck === 'deep' ? 210 : 176;
    const front = [['M',118,62],['L',98,70],['Q',100,120,104,138],['L',98,300],['L',132,312],['L',150,324],['L',150,vDepth],['Z']];
    const back = [['M',118,62],['L',182,62],['L',182,70],['L',118,70],['Z']];
    const nB = o.buttons || 5;
    const btns = Array.from({ length: nB }, (_, i) => {
      const y = vDepth + 8 + i * ((300 - vDepth) / nB);
      return `<circle cx="150" cy="${y}" r="4.2" fill="${horn}" stroke="${shade(horn,.3)}" stroke-width=".7"/>`;
    }).join('');
    const back2 = o.back === 'satin' ? `<path d="M120 72 L180 72 L186 300 L150 322 L114 300 Z" fill="${shade(c,.15)}" opacity=".9"/>` : '';
    return `
      <g transform="translate(0 ${offset || 0})">
      <g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
        ${back2}
        <path d="${P(front)}" fill="${c}"/>
        <path d="${P(front, true)}" fill="${c}"/>
        <path d="${P(front)} ${P(front,true)}" fill="url(#tw-${id})"/>
        <path d="${P(front)} ${P(front,true)}" fill="url(#sh-${id})"/>
        <path d="${P(back)}" fill="${darker}"/>
        <!-- welt pockets -->
        <path d="M106 228 L136 226 L136 232 L106 234 Z" fill="${darker}"/>
        <path d="M164 226 L194 228 L194 234 L164 232 Z" fill="${darker}"/>
        <!-- darts -->
        <path d="M122 150 L118 300 M178 150 L182 300" stroke="${seam}" stroke-width=".9" fill="none" opacity=".5"/>
        <!-- front edge -->
        <path d="M150 ${vDepth} L150 324" stroke="${seam}" stroke-width="1" opacity=".8"/>
        ${btns}
      </g>
      </g>`;
  }

  /* ---------- CAMISOLE ---------- */
  function camisole(o, id, offset) {
    const c = o.colour, dark = shade(c, -0.18), light = isLight(c) ? shade(c, .45) : shade(c, .22);
    const s = o.fitScale || 1;
    const cowl = o.neck === 'cowl';
    const bodyTop = cowl ? [['M',108,88],['Q',150,122,192,88]] : [['M',108,88],['L',192,88]];
    const body = [...bodyTop, ['L',204,160],['L',200,302],['L',100,302],['L',96,160],['Z']];
    const strapW = o.strap === 'wide' ? 7 : 2.4;
    return `
      <g transform="translate(0 ${offset || 0})">
      <g transform="translate(150 0) scale(${s} 1) translate(-150 0)">
        <path d="M110 34 L113 88 M190 34 L187 88" stroke="${dark}" stroke-width="${strapW}" stroke-linecap="round" fill="none"/>
        <path d="${P(body)}" fill="${c}"/>
        <path d="${P(body)}" fill="url(#sh-${id})"/>
        <!-- silk sheen -->
        <path d="M116 100 Q120 200 112 296" stroke="${light}" stroke-width="12" fill="none" opacity=".35" stroke-linecap="round"/>
        <path d="M170 110 Q176 200 172 290" stroke="${light}" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>
        ${cowl ? `<path d="M112 92 Q150 128 188 92" stroke="${light}" stroke-width="1.4" fill="none" opacity=".6"/>
                  <path d="M122 96 Q150 118 178 96" stroke="${dark}" stroke-width="1" fill="none" opacity=".4"/>` :
                 `<path d="M108 88 L192 88" stroke="${light}" stroke-width="1.2" opacity=".6"/>`}
        <path d="M100 298 L200 298" stroke="${dark}" stroke-width=".8" opacity=".5"/>
      </g>
      </g>`;
  }

  /* ---------- SUIT (three-piece composite) ---------- */
  function suit(o, id) {
    const trs = Object.assign({}, o, { fitScale: 1 });
    return `
      <g transform="translate(43 150) scale(.715)">${trousers(trs, id, 0)}</g>
      <g transform="translate(45 -2) scale(.70)">${waistcoat(Object.assign({}, o, { colour: o.waistcoatColour || o.colour, buttons: 5 }), id, 52)}</g>
      <g transform="translate(45 -2) scale(.70)">${blazer(o, id, 0)}</g>`;
  }

  const DRAW = { blazer, trousers, waistcoat, camisole, suit };

  function render(type, opts, cls) {
    const id = ++uid;
    const o = Object.assign({ colour: COLOURS[0].hex, lapel: 'notch', fitScale: 1, buttons: 2 }, opts || {});
    const fn = DRAW[type] || blazer;
    return `${svgOpen(cls)}${defs(id, o.colour)}${fn(o, id, 0)}</svg>`;
  }

  /* ---------- monogram inset: cross-stitched initials on the lining ---------- */
  function monogram(initials, lining, thread) {
    const txt = (initials || '').toUpperCase().slice(0, 3) || 'S';
    const t = thread || '#C9865A';
    const l = lining || '#A5673F';
    return `
      <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" class="mono-svg">
        <defs>
          <linearGradient id="lin" x1="0" x2="1"><stop offset="0" stop-color="${shade(l,.18)}"/><stop offset=".5" stop-color="${l}"/><stop offset="1" stop-color="${shade(l,-.2)}"/></linearGradient>
          <pattern id="silk" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,.12)" stroke-width="1"/></pattern>
        </defs>
        <rect width="300" height="180" fill="url(#lin)"/>
        <rect width="300" height="180" fill="url(#silk)"/>
        <!-- pocket welt -->
        <path d="M60 40 L240 40 L240 50 L60 50 Z" fill="${shade(l,-.3)}"/>
        <path d="M60 40 L240 40 M60 50 L240 50" stroke="${shade(l,.35)}" stroke-width=".6" stroke-dasharray="3 2" opacity=".7"/>
        <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6"
              fill="none" stroke="${t}" stroke-width="2.2" stroke-dasharray="2.4 1.6" stroke-linejoin="round">${txt}</text>
        <text x="150" y="128" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="56" font-weight="500" letter-spacing="6"
              fill="${t}" opacity=".5">${txt}</text>
        <g stroke="${t}" stroke-width="2" stroke-linecap="round" opacity=".9">
          <path d="M232 128 l7 7 M239 128 l-7 7"/>
        </g>
      </svg>`;
  }

  /* ---------- catalogue ---------- */
  const CURRENCY = '₹';
  const money = n => CURRENCY + n.toLocaleString('en-IN');
  const CATALOGUE = [
    { id: 'marlowe-blazer', type: 'blazer', for: 'women', name: 'The Marlowe blazer', price: 42000, colour: 'dove', lapel: 'peak', buttons: 1, fit: 'tailored', note: 'A single button, a longer lapel line. Cut for a woman who closes the room.' },
    { id: 'hale-trouser', type: 'trousers', for: 'women', name: 'The Hale trouser', price: 18500, colour: 'dove', pleat: 'single', note: 'High-rise, single pleat, a leg that falls straight from the hip.' },
    { id: 'lenox-waistcoat', type: 'waistcoat', for: 'women', name: 'The Lenox waistcoat', price: 16500, colour: 'charcoal', neck: 'deep', note: 'Worn alone or under the Marlowe. Five horn buttons, satin back.' },
    { id: 'aster-camisole', type: 'camisole', for: 'women', name: 'The Aster camisole', price: 9800, colour: 'ivory', neck: 'cowl', note: 'Silk charmeuse, cowl neck. The quiet layer under everything.' },
    { id: 'marlowe-suit', type: 'suit', for: 'women', name: 'The Marlowe three-piece', price: 72000, colour: 'charcoal', lapel: 'peak', buttons: 1, fit: 'tailored', note: 'Blazer, waistcoat and trouser, each cut to you. The complete argument.' },
    { id: 'regent-blazer', type: 'blazer', for: 'men', name: 'The Regent blazer', price: 45000, colour: 'charcoal', lapel: 'notch', buttons: 2, fit: 'classic', note: 'Half-canvassed, hand-set sleeve head, two buttons. The one you reach for.' },
    { id: 'carlton-trouser', type: 'trousers', for: 'men', name: 'The Carlton trouser', price: 19500, colour: 'charcoal', pleat: 'none', note: 'Flat front, mid-rise, a clean break on the shoe.' },
    { id: 'ascot-waistcoat', type: 'waistcoat', for: 'men', name: 'The Ascot waistcoat', price: 17500, colour: 'graphite', neck: 'classic', note: 'Six buttons, two welt pockets, adjustable back strap.' },
    { id: 'regent-suit', type: 'suit', for: 'men', name: 'The Regent three-piece', price: 78000, colour: 'midnight', lapel: 'notch', buttons: 2, fit: 'classic', note: 'Three pieces, one cloth, your measurements. Made for the day it matters.' },
  ];
  const colourHex = id => (COLOURS.find(c => c.id === id) || COLOURS[0]).hex;
  const fitScale = id => (FITS.find(f => f.id === id) || FITS[1]).scale;

  function renderProduct(p, overrides, cls) {
    const o = Object.assign({
      colour: colourHex(p.colour), lapel: p.lapel, buttons: p.buttons, fitScale: fitScale(p.fit),
      pleat: p.pleat, neck: p.neck,
    }, overrides || {});
    return render(p.type, o, cls);
  }

  return { COLOURS, LININGS, LAPELS, FITS, BUTTONS, CATALOGUE, CURRENCY, money, render, renderProduct, monogram, shade, colourHex, fitScale };
})();
