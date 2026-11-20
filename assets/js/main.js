/* =====================================================
   BFC — MAIN.JS
   Navbar, reveals, counters, champion quote, mobile menu
   ===================================================== */

(function() {
  'use strict';

  // ---------- NAVBAR scroll state ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Menu (hamburger + Clases dropdown) ----------
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (nav && toggle && menu) {
    const setMenu = (open) => {
      nav.classList.toggle('menu-open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));

    menu.querySelectorAll('.nav-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = document.getElementById(btn.getAttribute('aria-controls'));
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (list) list.hidden = !open;
      });
    });

    menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', e => {
      if (nav.classList.contains('menu-open') && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
  }

  document.querySelectorAll('.nav-dd').forEach(dd => {
    const btn = dd.querySelector('.nav-dd-btn');
    if (!btn) return;
    const setDd = (open) => {
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', () => setDd(!dd.classList.contains('open')));
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) setDd(false); });
    dd.addEventListener('keydown', e => { if (e.key === 'Escape') { setDd(false); btn.focus(); } });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) setDd(false); });
    dd.addEventListener('click', e => { if (e.target.closest('a')) setDd(false); });
  });

  // ---------- REVEAL on scroll ----------
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' })
    : null;
  document.querySelectorAll('.reveal, .reveal-x, .champions').forEach(el => {
    if (io) io.observe(el); else el.classList.add('in-view');
  });

  // ---------- HISTORIA FOTO reveal ----------
  const historiaFoto = document.querySelector('.historia-foto-hidden');
  if (historiaFoto) {
    const fotoIO = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('historia-foto-hidden');
              entry.target.classList.add('historia-foto-visible');
              fotoIO.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 })
      : null;
    if (fotoIO) fotoIO.observe(historiaFoto); else historiaFoto.classList.add('historia-foto-visible');
  }

  // ---------- GALLERY SWIPE HINT ----------
  const galleryGrid = document.getElementById('galleryGrid');
  const swipeHint = document.getElementById('gallerySwipeHint');
  if (galleryGrid && swipeHint) {
    galleryGrid.addEventListener('touchstart', function hideHint() {
      swipeHint.classList.add('hidden');
      galleryGrid.removeEventListener('touchstart', hideHint);
    }, { passive: true });
  }

  // ---------- COUNTERS ----------
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const runCounter = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target).toLocaleString('es-AR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterIO = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.55 })
    : null;
  document.querySelectorAll('.count').forEach(el => {
    if (counterIO) counterIO.observe(el); else runCounter(el);
  });

  // ---------- CHAMPION QUOTE word reveal ----------
  const mountChampionQuote = () => {
    const el = document.querySelector('[data-champions-quote]');
    if (!el) return;
    const dict = (window.BFC && window.BFC.i18n && window.BFC.i18n.dict) || null;
    const lang = (dict && (document.documentElement.dataset.lang || 'es')) || 'es';
    const html = dict ? dict[lang].champions.quote : 'Un campeón sudamericano <b>da clases acá.</b>';

    // Split into tokens preserving <b>…</b>
    const wrapper = document.createElement('span');
    wrapper.innerHTML = html;
    const out = [];
    wrapper.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(t => {
          if (t.trim()) out.push(`<span class="word">${t}</span>`);
          else out.push(t);
        });
      } else if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        const inside = node.textContent.split(/(\s+)/).map(t => t.trim()
          ? `<span class="word">${t}</span>`
          : t).join('');
        out.push(`<${tag}>${inside}</${tag}>`);
      }
    });
    el.innerHTML = out.join(' ');
    // stagger via inline delay
    el.querySelectorAll('.word').forEach((w, i) => {
      w.style.animationDelay = (0.12 * i + 0.2) + 's';
    });
  };
  mountChampionQuote();
  document.addEventListener('bfc:lang', mountChampionQuote);

  // ---------- CONTACT FORM → WhatsApp ----------
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name     = (form.elements.name?.value     || '').trim();
      const age      = (form.elements.age?.value      || '').trim();
      const modality = (form.elements.modality?.value || '').trim();
      const timeSlot = (form.elements.timeSlot?.value || '').trim();

      if (!name || !age) {
        form.querySelectorAll('[required]').forEach(f => {
          if (!f.value.trim()) f.style.borderBottomColor = 'var(--bfc-red)';
        });
        const fb = document.getElementById('cfFeedback');
        if (fb) { fb.textContent = 'Completá tu nombre y edad para continuar.'; fb.hidden = false; }
        return;
      }

      const parts = [`Hola! Me llamo ${name}, tengo ${age} años.`];
      if (modality) parts.push(`Me interesa: ${modality}.`);
      if (timeSlot) parts.push(`Prefiero horario de ${timeSlot}.`);
      parts.push('¿Pueden darme información sobre las clases?');

      const waNumber = modality === 'MMA / Wrestling' ? '5492614671743' : '5492615710531';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(parts.join(' '))}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- Smooth anchor scroll respecting nav height ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---------- Hero video robustness ----------
  // Some browsers block autoplay on hidden tabs; ensure it plays when visible.
  // El src lo asigna el script de index.html; sin src (ahorro de datos, 2G,
  // movimiento reducido) queda el póster y no hay nada que reproducir.
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && heroVideo.getAttribute('src')) {
    const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };
    tryPlay();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    heroVideo.addEventListener('canplay', tryPlay);
    // Tap to play fallback (iOS Low Power Mode)
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }

  // ---------- Marquee (banda roja) ----------
  // Se mueve por JS (requestAnimationFrame) y no por animación CSS: en algunos
  // iPhone la animación CSS quedaba congelada. Mitad de velocidad con reduced-motion.
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && window.requestAnimationFrame) {
    marqueeTrack.classList.add('is-js');
    const slow = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const period = slow ? 90 : 45; // segundos por ciclo completo
    let loopW = 0, x = 0, last = 0, visible = true;
    const measure = () => {
      const items = marqueeTrack.children;
      // El contenido está duplicado: el ciclo termina donde empieza la segunda mitad
      loopW = items.length >= 2 ? items[items.length / 2 | 0].offsetLeft - items[0].offsetLeft : 0;
    };
    const tick = (t) => {
      if (!loopW) measure();
      if (last && visible && loopW) {
        x -= (Math.min(t - last, 100) / 1000) * (loopW / period);
        if (x <= -loopW) x += loopW;
        marqueeTrack.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      last = t;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener('resize', () => { loopW = 0; }, { passive: true });
    document.addEventListener('bfc:lang', () => { loopW = 0; x = 0; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; })
        .observe(marqueeTrack.parentElement);
    }
  }

  // ---------- Respect prefers-reduced-motion ----------
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video').forEach(v => v.pause());
  }
})();

/* ---------- Fondos diferidos [data-bg] ----------
   <div data-bg="assets/images/foto" data-bg-ext="jpg">: el fondo se descarga recién cuando
   el bloque se acerca a la pantalla, en AVIF o WebP si el navegador los soporta
   y en la variante de 640 px en pantallas chicas. */
(function () {
  'use strict';
  var els = document.querySelectorAll('[data-bg]');
  if (!els.length) return;

  var small = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  var imageSetOk = window.CSS && CSS.supports &&
    CSS.supports('background-image', 'image-set(url("a.avif") type("image/avif"))');

  function apply(el) {
    var base = el.getAttribute('data-bg') + (small ? '-640' : '');
    var ext  = el.getAttribute('data-bg-ext') || 'jpg';
    var fallback = el.getAttribute('data-bg') + '.' + ext;   /* original, siempre existe */
    el.style.backgroundImage = "url('" + fallback + "')";
    if (imageSetOk) {
      el.style.backgroundImage =
        "image-set(url('" + base + ".avif') type('image/avif'), url('" + base + ".webp') type('image/webp'), url('" + fallback + "') type('image/" + (ext === 'jpg' ? 'jpeg' : ext) + "'))";
    }
    el.removeAttribute('data-bg');
  }

  if (!('IntersectionObserver' in window)) { els.forEach(apply); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { apply(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '300px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
