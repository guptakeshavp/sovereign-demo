/* SOVEREIGN — product customiser */
(function () {
  const G = window.Garments;
  const $ = s => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const product = G.CATALOGUE.find(p => p.id === params.get('style')) || G.CATALOGUE.find(p => p.id === 'regent-blazer');
  const PRICES = { mono: 1500, mtm: 6000 };
  const SIZES = product.for === 'women' ? ['6','8','10','12','14','16'] : ['36','38','40','42','44','46'];

  const CLOTH = {
    blazer: 'Super 120s worsted wool, 280g, from a northern Italian mill. Soft hand, dry finish, holds a crease without shine.',
    suit: 'Super 120s worsted wool, 280g, from a northern Italian mill. All three pieces are cut from the same bolt so the colour matches in every light.',
    trousers: 'Super 120s worsted wool, 280g, half-lined to the knee. Curtain waistband with a split back seam for alteration.',
    waistcoat: 'Worsted wool front, satin-faced back with an adjustable strap. Lined in the silk of your choice.',
    camisole: 'Silk charmeuse, 19 momme, bias cut so it moves with you. French seams throughout.',
  };
  const MAKE = {
    blazer: 'Half-canvassed with a hand-padded lapel. Hand-set sleeve heads, functioning cuff buttons, pick-stitched edges. One copper cross stitch inside the left cuff.',
    suit: 'Half-canvassed blazer with a hand-padded lapel, six-button waistcoat, flat-front trouser. One copper cross stitch inside each piece.',
    trousers: 'Curtain waistband, hand-finished hem, extended tab closure with a horn button. One copper cross stitch inside the waistband.',
    waistcoat: 'Six horn buttons, two welt pockets, pointed hem. One copper cross stitch inside the back strap.',
    camisole: 'Bias cut, French seams, adjustable straps. One copper cross stitch at the inside hem.',
  };

  // state
  const S = {
    colour: params.get('colour') || product.colour,
    lapel: params.get('lapel') || product.lapel || 'notch',
    buttons: String(product.buttons || 2),
    fit: product.fit || 'classic',
    lining: 'copper',
    mono: (params.get('mono') || '').toUpperCase().slice(0, 3),
    monoPlace: 'pocket',
    pleat: product.pleat || 'none',
    neck: product.neck || (product.type === 'camisole' ? 'straight' : 'classic'),
    strap: 'fine', back: 'satin',
    sizing: 'standard', size: SIZES[2],
    mtm: { chest: '', waist: '', sleeve: '', height: '' },
  };

  // option schema per garment
  const OPTS = [];
  const add = o => OPTS.push(o);
  add({ key: 'colour', label: 'Cloth', kind: 'swatch', items: G.COLOURS });
  if (['blazer', 'suit'].includes(product.type)) {
    add({ key: 'lapel', label: 'Lapel', kind: 'seg', items: G.LAPELS });
    add({ key: 'buttons', label: 'Buttons', kind: 'seg', items: G.BUTTONS });
  }
  if (product.type === 'trousers') add({ key: 'pleat', label: 'Front', kind: 'seg', items: [{ id: 'none', name: 'Flat', note: 'Clean and modern.' }, { id: 'single', name: 'Single pleat', note: 'A little ease through the hip.' }, { id: 'double', name: 'Double pleat', note: 'Generous. Very good with a waistcoat.' }] });
  if (product.type === 'waistcoat') {
    add({ key: 'neck', label: 'Neckline', kind: 'seg', items: [{ id: 'classic', name: 'Classic V', note: 'Sits above a two-button jacket.' }, { id: 'deep', name: 'Deep V', note: 'For wearing alone, or under a one-button.' }] });
    add({ key: 'back', label: 'Back', kind: 'seg', items: [{ id: 'satin', name: 'Satin', note: 'Traditional, with an adjustable strap.' }, { id: 'self', name: 'Self cloth', note: 'Matches the front, for wearing without a jacket.' }] });
  }
  if (product.type === 'camisole') {
    add({ key: 'neck', label: 'Neckline', kind: 'seg', items: [{ id: 'straight', name: 'Straight', note: 'Quiet under a blazer.' }, { id: 'cowl', name: 'Cowl', note: 'A softer line, worn open.' }] });
    add({ key: 'strap', label: 'Strap', kind: 'seg', items: [{ id: 'fine', name: 'Fine', note: '' }, { id: 'wide', name: 'Wide', note: '' }] });
  }
  if (product.type !== 'camisole') add({ key: 'fit', label: 'Fit', kind: 'seg', items: G.FITS });
  if (['blazer', 'suit', 'waistcoat'].includes(product.type)) add({ key: 'lining', label: 'Lining', kind: 'swatch', items: G.LININGS });
  if (product.type !== 'camisole') add({ key: 'mono', label: 'Monogram', kind: 'mono' });
  add({ key: 'sizing', label: 'Size', kind: 'size' });

  const stitchSVG = '<svg viewBox="0 0 12 12"><path d="M1.5 1.5 L10.5 10.5"/><path d="M10.5 1.5 L1.5 10.5"/></svg>';
  const nameOf = (items, id) => (items.find(i => i.id === id) || {}).name || '';
  const noteOf = (items, id) => (items.find(i => i.id === id) || {}).note || '';

  function renderOptions() {
    $('#options').innerHTML = OPTS.map(o => {
      if (o.kind === 'swatch') return `
        <div class="opt-group" data-key="${o.key}">
          <div class="eyebrow"><span>${o.label}</span><b>${nameOf(o.items, S[o.key])}</b></div>
          <div class="swatches">${o.items.map(c => `<button class="swatch ${['ivory','dove'].includes(c.id) ? 'light' : ''}" style="background:${c.hex}" data-id="${c.id}" aria-label="${c.name}" aria-pressed="${c.id === S[o.key]}"></button>`).join('')}</div>
        </div>`;
      if (o.kind === 'seg') return `
        <div class="opt-group" data-key="${o.key}">
          <div class="eyebrow"><span>${o.label}</span></div>
          <div class="seg">${o.items.map(i => `<button data-id="${i.id}" aria-pressed="${i.id === S[o.key]}">${i.name}</button>`).join('')}</div>
          <p class="opt-note">${noteOf(o.items, S[o.key])}</p>
        </div>`;
      if (o.kind === 'mono') return `
        <div class="opt-group" data-key="mono">
          <div class="eyebrow"><span>Monogram</span><b>${S.mono ? '+ ' + G.money(PRICES.mono) : 'Optional'}</b></div>
          <div class="mono-input"><input id="mono-in" maxlength="3" value="${S.mono}" placeholder="ABC" aria-label="Your initials"><span class="stitch">${stitchSVG}</span></div>
          ${product.type !== 'trousers' ? `<div class="seg" style="margin-top:16px;max-width:320px" data-sub="monoPlace">
            <button data-id="pocket" aria-pressed="${S.monoPlace==='pocket'}">Chest pocket</button><button data-id="cuff" aria-pressed="${S.monoPlace==='cuff'}">Inside cuff</button></div>` : ''}
        </div>`;
      if (o.kind === 'size') return `
        <div class="opt-group" data-key="sizing">
          <div class="eyebrow"><span>Size</span><b>${S.sizing === 'mtm' ? '+ ' + G.money(PRICES.mtm) : 'Included'}</b></div>
          <div class="seg" data-sub="sizing"><button data-id="standard" aria-pressed="${S.sizing==='standard'}">Standard sizes</button><button data-id="mtm" aria-pressed="${S.sizing==='mtm'}">Made to measure</button></div>
          ${S.sizing === 'standard' ? `<div class="size-grid" style="margin-top:16px" data-sub="size">${SIZES.map(s => `<button data-id="${s}" aria-pressed="${s === S.size}">${s}</button>`).join('')}</div>
            <p class="opt-note">${product.for === 'women' ? 'UK sizing.' : 'Chest, in inches.'} Unsure? Choose made to measure and we take it from there.</p>`
          : `<div class="mtm">
              <label>Chest (cm)<input data-m="chest" inputmode="decimal" value="${S.mtm.chest}" placeholder="96"></label>
              <label>Waist (cm)<input data-m="waist" inputmode="decimal" value="${S.mtm.waist}" placeholder="82"></label>
              <label>Sleeve (cm)<input data-m="sleeve" inputmode="decimal" value="${S.mtm.sleeve}" placeholder="64"></label>
              <label>Height (cm)<input data-m="height" inputmode="decimal" value="${S.mtm.height}" placeholder="178"></label>
            </div><p class="opt-note">Rough numbers are fine. We confirm every measurement at your fitting.</p>`}
        </div>`;
      return '';
    }).join('');
  }

  function renderStage(pulse) {
    const o = {
      colour: G.colourHex(S.colour), lapel: S.lapel, buttons: parseInt(S.buttons, 10), fitScale: G.fitScale(S.fit),
      pleat: S.pleat, neck: S.neck, strap: S.strap, back: S.back,
    };
    $('#stage').innerHTML = G.render(product.type, o);
    const parts = [nameOf(G.COLOURS, S.colour)];
    if (['blazer','suit'].includes(product.type)) parts.push(nameOf(G.LAPELS, S.lapel) + ' lapel', S.buttons + '-button');
    if (product.type !== 'camisole') parts.push(nameOf(G.FITS, S.fit).toLowerCase() + ' fit');
    $('#stage-desc').textContent = parts.join(' · ');
    const mono = $('#mono');
    if (S.mono && product.type !== 'camisole') {
      const lin = (G.LININGS.find(l => l.id === S.lining) || G.LININGS[0]).hex;
      $('#mono-art').innerHTML = G.monogram(S.mono, product.type === 'trousers' ? G.shade(G.colourHex(S.colour), .1) : lin);
      $('#mono-cap').textContent = product.type === 'trousers' ? 'Your initials, inside the waistband' : S.monoPlace === 'cuff' ? 'Your initials, inside the left cuff' : 'Your initials, inside the chest pocket';
      mono.classList.add('show');
    } else mono.classList.remove('show');
    if (pulse && window.SOV.hasGsap && !window.SOV.reduce) gsap.fromTo('#stage', { opacity: .55, y: 6 }, { opacity: 1, y: 0, duration: .55, ease: 'power2.out' });
  }

  function renderSummary() {
    const rows = [[product.name + ' · ' + nameOf(G.COLOURS, S.colour), G.money(product.price)]];
    if (S.mono && product.type !== 'camisole') rows.push(['Monogram ' + S.mono, G.money(PRICES.mono)]);
    if (S.sizing === 'mtm') rows.push(['Made to measure, with fitting', G.money(PRICES.mtm)]);
    else rows.push(['Size ' + S.size, 'Included']);
    const total = product.price + (S.mono && product.type !== 'camisole' ? PRICES.mono : 0) + (S.sizing === 'mtm' ? PRICES.mtm : 0);
    $('#summary').innerHTML = rows.map(r => `<div><span>${r[0]}</span><span>${r[1]}</span></div>`).join('') + `<div class="tot"><span>Your ${product.type === 'suit' ? 'suit' : product.type}</span><span>${G.money(total)}</span></div>`;
  }

  function all(pulse) { renderOptions(); renderStage(pulse); renderSummary(); }

  // head
  $('#p-for').textContent = product.for + ' · ' + (product.type === 'suit' ? 'three-piece' : product.type);
  $('#p-name').textContent = product.name;
  $('#p-price').textContent = 'From ' + G.money(product.price);
  $('#p-note').textContent = product.note;
  $('#d-cloth').textContent = CLOTH[product.type];
  $('#d-make').textContent = MAKE[product.type];
  document.title = product.name + ' — Sovereign';

  // events (delegated)
  $('#options').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const group = b.closest('[data-key]'); const sub = b.closest('[data-sub]');
    const key = sub ? sub.dataset.sub : group.dataset.key;
    S[key] = b.dataset.id;
    all(true);
  });
  $('#options').addEventListener('input', e => {
    if (e.target.id === 'mono-in') {
      const v = e.target.value.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3);
      S.mono = v; e.target.value = v;
      renderStage(false); renderSummary();
      const b = e.target.closest('.opt-group').querySelector('.eyebrow b'); b.textContent = v ? '+ ' + G.money(PRICES.mono) : 'Optional';
    } else if (e.target.dataset.m) S.mtm[e.target.dataset.m] = e.target.value;
  });
  $('#add').addEventListener('click', () => {
    window.SOV.addToBag();
    const b = $('#add'); b.textContent = 'Added to bag'; setTimeout(() => b.textContent = 'Add to bag', 1800);
  });

  // related
  const rel = G.CATALOGUE.filter(p => p.for === product.for && p.id !== product.id).slice(0, 3);
  $('#related').innerHTML = rel.map((p, i) => `
    <a class="card rv" data-delay="${i*.1}" href="product.html?style=${p.id}">
      <div class="frame" style="background:var(--ash)"><div class="garment">${G.renderProduct(p)}</div></div>
      <div class="card-meta"><h3>${p.name}</h3><span class="price">From ${G.money(p.price)}</span></div>
    </a>`).join('');

  all(false);
})();
