/* =====================================================
   BFC — ANIMATIONS.JS
   anime.js v4 · Hero sequence + scroll reveals
   ===================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── HELPER: observe section once ─────────────────── */
  function observeSection(el, callback, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { callback(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          io.unobserve(el);
          callback();
        }
      });
    }, { threshold: threshold || 0.15, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
  }

  /* ─── HELPER: instant show (reduced-motion fallback) ── */
  function showAll(targets) {
    var els = typeof targets === 'string'
      ? document.querySelectorAll(targets)
      : targets;
    Array.prototype.forEach.call(els, function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  /* ─── S1: HERO SEQUENCE ─────────────────────────────── */
  function heroSequence() {
    var a = window.anime;
    if (!a) return;

    var nav        = document.getElementById('nav');
    var line1      = document.querySelector('.hero-title .line:nth-child(1) > span');
    var line2      = document.querySelector('.hero-title .line:nth-child(2) > span');
    var line3      = document.querySelector('.hero-title .line:nth-child(3) > span');
    var heroSub    = document.querySelector('.hero-sub');
    var heroBtns   = document.querySelectorAll('.hero-ctas .btn');
    var heroSide   = document.querySelector('.hero-side');

    var els = [nav, line1, line2, line3, heroSub, heroSide];
    Array.prototype.forEach.call(heroBtns, function (b) { els.push(b); });

    if (reducedMotion) { showAll(els); return; }

    /* Set initial state */
    if (nav)     { nav.style.opacity = '0'; nav.style.transform = 'translateY(-100%)'; }
    if (line1)   { line1.style.transform = 'translateY(110%)'; }
    if (line2)   { line2.style.transform = 'translateY(110%)'; }
    if (line3)   { line3.style.transform = 'translateY(110%)'; }
    if (heroSub) { heroSub.style.opacity = '0'; heroSub.style.transform = 'translateY(20px)'; heroSub.style.filter = 'blur(8px)'; }
    Array.prototype.forEach.call(heroBtns, function (b) { b.style.opacity = '0'; b.style.transform = 'translateY(16px)'; });
    if (heroSide) { heroSide.style.opacity = '0'; heroSide.style.transform = 'translateY(10px)'; }

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });

    tl.add({ targets: nav, translateY: ['-100%', '0'], opacity: [0, 1], duration: 600 }, 0);
    tl.add({ targets: line1, translateY: ['110%', '0'], duration: 900 }, 200);
    tl.add({ targets: line2, translateY: ['110%', '0'], duration: 900 }, 400);
    tl.add({ targets: line3, translateY: ['110%', '0'], duration: 900 }, 600);
    tl.add({
      targets: heroSub,
      translateY: [20, 0],
      opacity: [0, 1],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: 800
    }, 900);
    tl.add({
      targets: heroBtns,
      translateY: [16, 0],
      opacity: [0, 1],
      duration: 700,
      delay: a.stagger(120)
    }, 1100);
    tl.add({
      targets: heroSide,
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 700
    }, 1400);
  }

  /* ─── INIT ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    heroSequence();
    initScrollAnimations();
  });

  function initScrollAnimations() {
    observeSection(document.querySelector('.disciplines'), academyTimeline, 0.15);
    observeSection(document.querySelector('.champions'),   championsTimeline, 0.2);
    observeSection(document.querySelector('.schedule'),    scheduleTimeline, 0.1);
    observeSection(document.querySelector('.tapa'),        tapaTimeline, 0.15);
    observeSection(document.querySelector('.community'),   communityTimeline, 0.1);
  }

  /* ─── S3: ACADEMIA ──────────────────────────────────── */
  function academyTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.disciplines');
    var eyebrow = sec.querySelector('.section-head .eyebrow');
    var h2      = sec.querySelector('.section-head h2');
    var lead    = sec.querySelector('.section-head p');
    var cards   = sec.querySelectorAll('.disc-card');

    if (reducedMotion) { showAll([eyebrow, h2, lead].concat(Array.prototype.slice.call(cards))); return; }

    if (eyebrow) { eyebrow.style.opacity = '0'; eyebrow.style.transform = 'translateX(-10px)'; }
    if (h2)      { h2.style.opacity = '0'; h2.style.transform = 'translateY(40px)'; }
    if (lead)    { lead.style.opacity = '0'; lead.style.transform = 'translateY(20px)'; }
    Array.prototype.forEach.call(cards, function (c) { c.style.opacity = '0'; c.style.transform = 'translateY(60px) scale(0.96)'; });

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
    tl.add({ targets: eyebrow, translateX: [-10, 0], opacity: [0, 1], duration: 700 }, 0);
    tl.add({ targets: h2,      translateY: [40, 0],  opacity: [0, 1], duration: 800 }, 100);
    tl.add({ targets: lead,    translateY: [20, 0],  opacity: [0, 1], duration: 700 }, 250);
    tl.add({
      targets: cards,
      translateY: [60, 0],
      scale: [0.96, 1],
      opacity: [0, 1],
      duration: 800,
      delay: a.stagger(120)
    }, 400);
  }

  /* ─── S4: CHAMPIONS ─────────────────────────────────── */
  function championsTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.champions');
    var eyebrow = sec.querySelector('.eyebrow');
    var words   = sec.querySelectorAll('.champions-quote .word');
    var name    = sec.querySelector('.champions-name');
    var titles  = sec.querySelectorAll('.title-line');

    if (reducedMotion) {
      showAll([eyebrow, name].concat(
        Array.prototype.slice.call(words),
        Array.prototype.slice.call(titles)
      ));
      return;
    }

    if (eyebrow) { eyebrow.style.opacity = '0'; eyebrow.style.transform = 'translateY(16px)'; }
    Array.prototype.forEach.call(words, function (w) { w.style.opacity = '0'; w.style.transform = 'translateY(20px)'; w.style.filter = 'blur(6px)'; });
    if (name)    { name.style.opacity = '0'; name.style.transform = 'translateY(16px)'; }
    Array.prototype.forEach.call(titles, function (t) { t.style.opacity = '0'; t.style.transform = 'translateY(12px)'; });

    var wordDuration = words.length ? (words.length * 80 + 650) : 0;

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
    tl.add({ targets: eyebrow, translateY: [16, 0], opacity: [0, 1], duration: 600 }, 0);
    tl.add({
      targets: words,
      translateY: [20, 0],
      opacity: [0, 1],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: 650,
      delay: a.stagger(80)
    }, 150);
    tl.add({ targets: name, translateY: [16, 0], opacity: [0, 1], duration: 700 }, 150 + wordDuration);
    tl.add({
      targets: titles,
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 600,
      delay: a.stagger(100)
    }, 150 + wordDuration + 200);
  }

  /* ─── S7: HORARIOS ──────────────────────────────────── */
  function scheduleTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.schedule');
    var headEls = sec.querySelectorAll('.section-head > *');
    var cards   = sec.querySelectorAll('.fight-card');
    var waBtn   = sec.querySelector('[href*="wa.me"]');

    if (reducedMotion) {
      showAll(Array.prototype.slice.call(headEls)
        .concat(Array.prototype.slice.call(cards))
        .concat(waBtn ? [waBtn] : []));
      return;
    }

    Array.prototype.forEach.call(headEls, function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });
    Array.prototype.forEach.call(cards, function (c) { c.style.opacity = '0'; c.style.transform = 'translateY(50px)'; });
    if (waBtn) { waBtn.style.opacity = '0'; waBtn.style.transform = 'translateY(12px)'; }

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
    tl.add({ targets: headEls, translateY: [20, 0], opacity: [0, 1], duration: 700, delay: a.stagger(100) }, 0);
    tl.add({ targets: cards,   translateY: [50, 0], opacity: [0, 1], duration: 800, delay: a.stagger(150) }, 300);

    /* Stagger fc-slots inside each card */
    Array.prototype.forEach.call(cards, function (card, ci) {
      var slots = card.querySelectorAll('.fc-slot, .fc-slot-sep');
      Array.prototype.forEach.call(slots, function (s) { s.style.opacity = '0'; s.style.transform = 'translateX(-8px)'; });
      tl.add({
        targets: slots,
        translateX: [-8, 0],
        opacity: [0, 1],
        duration: 500,
        delay: a.stagger(60)
      }, 300 + 150 * (ci + 1) + 200);
    });

    if (waBtn) {
      tl.add({ targets: waBtn, translateY: [12, 0], opacity: [0, 1], duration: 600 }, 1000);
    }
  }

  /* ─── S8: TAPA TEAM ─────────────────────────────────── */
  function tapaTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.tapa');
    var eyebrow = sec.querySelector('.eyebrow');
    var title   = sec.querySelector('.tt-title');
    var lead    = sec.querySelector('.tapa-copy > p');
    var stats   = sec.querySelectorAll('.tt-stat');
    var btns    = sec.querySelectorAll('.tapa-ctas .btn');
    var media   = sec.querySelector('.tapa-media');

    var copyEls = [eyebrow, title, lead].filter(Boolean);
    var all = copyEls.concat(Array.prototype.slice.call(stats)).concat(Array.prototype.slice.call(btns)).concat(media ? [media] : []);

    if (reducedMotion) { showAll(all); return; }

    copyEls.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });
    Array.prototype.forEach.call(stats, function (s) { s.style.opacity = '0'; s.style.transform = 'translateY(16px)'; });
    Array.prototype.forEach.call(btns, function (b) { b.style.opacity = '0'; b.style.transform = 'translateY(12px)'; });
    if (media) { media.style.opacity = '0'; media.style.transform = 'translateX(60px)'; }

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
    tl.add({ targets: eyebrow, translateY: [20, 0], opacity: [0, 1], duration: 600 }, 0);
    tl.add({ targets: title,   translateY: [50, 0], opacity: [0, 1], duration: 800 }, 120);
    tl.add({ targets: lead,    translateY: [20, 0], opacity: [0, 1], duration: 700 }, 260);
    tl.add({ targets: stats,   translateY: [16, 0], opacity: [0, 1], duration: 600, delay: a.stagger(100) }, 380);
    tl.add({ targets: btns,    translateY: [12, 0], opacity: [0, 1], duration: 600, delay: a.stagger(100) }, 600);
    tl.add({ targets: media,   translateX: [60, 0], opacity: [0, 1], duration: 1000 }, 0);
  }

  /* ─── S9: COMUNIDAD ─────────────────────────────────── */
  function communityTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.community');
    var headEls = sec.querySelectorAll('.section-head > *');
    var filters = sec.querySelector('.comm-filters');
    var grid    = document.getElementById('commGrid');

    if (reducedMotion) {
      showAll(Array.prototype.slice.call(headEls).concat(filters ? [filters] : []));
      return;
    }

    Array.prototype.forEach.call(headEls, function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });
    if (filters) { filters.style.opacity = '0'; filters.style.transform = 'translateY(12px)'; }

    var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
    tl.add({ targets: headEls, translateY: [20, 0], opacity: [0, 1], duration: 700, delay: a.stagger(100) }, 0);
    if (filters) {
      tl.add({ targets: filters, translateY: [12, 0], opacity: [0, 1], duration: 600 }, 300);
    }

    /* MutationObserver: animate photos as Supabase inserts them */
    if (!grid) return;
    var animated = false;
    var mo = new MutationObserver(function (mutations) {
      var newItems = [];
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList.contains('comm-item')) {
            newItems.push(node);
          }
        });
      });
      if (!newItems.length) return;
      if (animated) {
        Array.prototype.forEach.call(newItems, function (item) { item.style.opacity = '0'; item.style.transform = 'scale(0.9)'; });
        a.animate(newItems, { opacity: [0, 1], scale: [0.9, 1], duration: 400, easing: 'easeOutExpo', delay: a.stagger(40) });
      } else {
        animated = true;
        Array.prototype.forEach.call(newItems, function (item) { item.style.opacity = '0'; item.style.transform = 'scale(0.9)'; });
        a.animate(newItems, { opacity: [0, 1], scale: [0.9, 1], duration: 500, easing: 'easeOutExpo', delay: a.stagger(50, { start: 300 }) });
      }
    });
    mo.observe(grid, { childList: true });
  }

})();
