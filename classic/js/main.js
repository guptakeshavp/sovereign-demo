/* SOVEREIGN — shared behaviour: smooth scroll, curtain, reveals, nav, stitches */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  if (reduce || !hasGsap) document.documentElement.classList.add('no-motion');
  if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---- cross stitch injection ---- */
  const STITCH = '<svg viewBox="0 0 12 12" aria-hidden="true"><path class="s1" d="M1.5 1.5 L10.5 10.5"/><path class="s2" d="M10.5 1.5 L1.5 10.5"/></svg>';
  document.querySelectorAll('.stitch').forEach(el => { if (!el.children.length) el.innerHTML = STITCH; });

  /* ---- smooth scroll ---- */
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  window.__lenis = lenis;

  /* ---- nav ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', (window.scrollY || 0) > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // mark current page
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const [page, q] = (a.getAttribute('href') || '').split('?');
    if (page !== here) return;
    if (q && q !== location.search.slice(1)) return;   // e.g. ?for=women only matches that filter
    if (!q && here === 'collection.html' && location.search) return;
    a.setAttribute('aria-current', 'page');
  });

  /* ---- curtain: intro on first view, then page transitions ---- */
  const curtain = document.querySelector('.curtain');
  const seen = sessionStorage.getItem('sov-seen');
  function openCurtain() {
    if (!curtain) return Promise.resolve();
    if (reduce || !hasGsap) { curtain.style.display = 'none'; return Promise.resolve(); }
    const wm = curtain.querySelector('.wordmark');
    const mk = curtain.querySelector('.mark');
    const tl = gsap.timeline();
    if (!seen) {
      sessionStorage.setItem('sov-seen', '1');
      tl.fromTo(mk, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .9, ease: 'power2.out' })
        .fromTo(wm, { opacity: 0, scaleX: .92 }, { opacity: 1, scaleX: 1, duration: 1.2, ease: 'power3.out' }, '-=.5')
        .to({}, { duration: .5 });
    } else {
      gsap.set([mk, wm], { opacity: 1 });
      tl.to({}, { duration: .15 });
    }
    tl.to([mk, wm], { opacity: 0, duration: .35, ease: 'power1.in' })
      .to(curtain, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=.1')
      .add(() => { curtain.classList.add('out'); curtain.style.display = 'none'; });
    return new Promise(res => tl.eventCallback('onComplete', res));
  }
  function closeCurtain(href) {
    if (!curtain || reduce || !hasGsap) { location.href = href; return; }
    curtain.style.display = 'grid'; curtain.classList.remove('out');
    gsap.set(curtain.querySelectorAll('.mark,.wordmark'), { opacity: 0 });
    gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: .8, ease: 'expo.inOut', onComplete: () => { location.href = href; } });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || /^(https?:|mailto:|tel:)/.test(href)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); closeCurtain(href);
  });
  window.addEventListener('pageshow', e => { if (e.persisted && curtain) { curtain.style.display = 'none'; } });

  /* ---- reveals ---- */
  function reveals() {
    if (reduce || !hasGsap) return;
    gsap.utils.toArray('.rv').forEach(el => {
      const inHero = !!el.closest('.hero, .story-hero, .pdp-stage, .coll-head');
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 92%', once: true },
      });
    });
    // grouped line reveals: a container with .rv-line children animates them in sequence
    gsap.utils.toArray('[data-lines]').forEach(box => {
      const spans = box.querySelectorAll('.rv-line > span');
      const inHero = !!box.closest('.hero, .story-hero, .pdp-stage, .coll-head');
      gsap.to(spans, {
        y: 0, duration: 1.3, ease: 'power4.out', stagger: .09,
        scrollTrigger: inHero ? undefined : { trigger: box, start: 'top 90%', once: true },
      });
    });
    // stitches draw themselves
    gsap.utils.toArray('.stitch').forEach(st => {
      const p = st.querySelectorAll('path');
      if (!p.length) return;
      gsap.set(p, { strokeDasharray: 14, strokeDashoffset: 14 });
      gsap.to(p, { strokeDashoffset: 0, duration: .5, stagger: .18, ease: 'power2.out',
        scrollTrigger: { trigger: st, start: 'top 92%', once: true } });
    });
    // parallax frames
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax || 8);
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // thread lines grow in
    gsap.utils.toArray('.thread').forEach(t => {
      gsap.fromTo(t, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: t, start: 'top 92%', once: true } });
    });
  }

  /* ---- hero intro (page-specific hook) ---- */
  window.SOV = { reduce, hasGsap, lenis, onReady: [] };
  window.addEventListener('load', async () => {
    await openCurtain();
    reveals();
    window.SOV.onReady.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
    if (hasGsap && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  /* ---- bag (demo only) ---- */
  const count = document.querySelector('.bag-count');
  const n = parseInt(sessionStorage.getItem('sov-bag') || '0', 10);
  if (count) count.textContent = n;
  window.SOV.addToBag = () => {
    const v = parseInt(sessionStorage.getItem('sov-bag') || '0', 10) + 1;
    sessionStorage.setItem('sov-bag', v);
    if (count) { count.textContent = v; if (hasGsap) gsap.fromTo(count, { scale: 1.4 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.5)' }); }
  };
})();
