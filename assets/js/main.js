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

  // ---------- Mobile menu ----------
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  }

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
    const html = dict ? dict[lang].champions.quote : 'En Bonati Fight Club formamos <b>campeones para la vida.</b>';

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
      const name = form.name.value.trim();
      const msg  = form.msg.value.trim();
      if (!name || !msg) {
        form.querySelectorAll('[required]').forEach(f => {
          if (!f.value.trim()) f.style.borderBottomColor = 'var(--bfc-red)';
        });
        return;
      }
      const txt = `Hola! Soy ${name}. ${msg}`;
      const url = `https://wa.me/5492615710531?text=${encodeURIComponent(txt)}`;
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
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };
    tryPlay();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    heroVideo.addEventListener('canplay', tryPlay);
    // Tap to play fallback (iOS Low Power Mode)
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }

  // ---------- Respect prefers-reduced-motion ----------
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video').forEach(v => v.pause());
  }
})();
