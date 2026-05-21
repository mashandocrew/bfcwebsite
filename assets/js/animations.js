/* =====================================================
   BFC — ANIMATIONS.JS
   anime.js v4 · Hero sequence + scroll reveals
   API v4: tl.add(targets, params, position)
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
    }, { threshold: threshold || 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
  }

  /* ─── HELPER: show all instantly ───────────────────── */
  function showAll(els) {
    Array.prototype.forEach.call(els, function (el) {
      if (!el) return;
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }

  /* ─── HELPER: hide element (initial state) ─────────── */
  function hide(el, transform) {
    if (!el) return;
    el.style.opacity = '0';
    if (transform) el.style.transform = transform;
  }

  /* ─── S1: HERO — set initial state early ───────────── */
  function initHeroState() {
    var a = window.anime;
    if (!a || reducedMotion) return;

    var nav    = document.getElementById('nav');
    var sub    = document.querySelector('.hero-sub');
    var btns   = document.querySelectorAll('.hero-ctas .btn');
    var side   = document.querySelector('.hero-side');

    hide(nav,   'translateY(-100%)');
    if (sub)  { sub.style.opacity = '0';  sub.style.transform = 'translateY(20px)';  sub.style.filter = 'blur(8px)'; }
    Array.prototype.forEach.call(btns, function (b) { hide(b, 'translateY(16px)'); });
    hide(side, 'translateY(10px)');
  }

  /* ─── S1: HERO — run timeline ───────────────────────── */
  function heroSequence() {
    var a = window.anime;
    if (!a) return;

    var nav    = document.getElementById('nav');
    var sub    = document.querySelector('.hero-sub');
    var btns   = document.querySelectorAll('.hero-ctas .btn');
    var side   = document.querySelector('.hero-side');

    if (reducedMotion) {
      showAll([nav, sub, side].concat(Array.prototype.slice.call(btns)));
      return;
    }

    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(nav,  { translateY: ['-100%', '0'], opacity: [0, 1], duration: 600 }, 0);
      tl.add(sub,  { translateY: [20, 0], opacity: [0, 1], filter: ['blur(8px)', 'blur(0px)'], duration: 800 }, 900);
      tl.add(btns, { translateY: [16, 0], opacity: [0, 1], duration: 700, delay: a.stagger(120) }, 1100);
      tl.add(side, { translateY: [10, 0], opacity: [0, 1], duration: 700 }, 1400);
    } catch (e) {
      showAll([nav, sub, side].concat(Array.prototype.slice.call(btns)));
    }
  }

  /* ─── S3: ACADEMIA ──────────────────────────────────── */
  function initAcademyState() {
    var a = window.anime;
    if (!a || reducedMotion) return;
    var sec = document.querySelector('.disciplines');
    if (!sec) return;
    hide(sec.querySelector('.section-head .eyebrow'), 'translateX(-10px)');
    hide(sec.querySelector('.section-head h2'),       'translateY(40px)');
    hide(sec.querySelector('.section-head p'),        'translateY(20px)');
    Array.prototype.forEach.call(sec.querySelectorAll('.disc-card'), function (c) {
      hide(c, 'translateY(60px) scale(0.96)');
    });
  }

  function academyTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.disciplines');
    var eyebrow = sec.querySelector('.section-head .eyebrow');
    var h2      = sec.querySelector('.section-head h2');
    var lead    = sec.querySelector('.section-head p');
    var cards   = sec.querySelectorAll('.disc-card');

    if (reducedMotion) {
      showAll([eyebrow, h2, lead].concat(Array.prototype.slice.call(cards)));
      var rootRM = sec.querySelector('[data-disc-carousel]');
      if (rootRM) rootRM.dispatchEvent(new CustomEvent('disc:ready'));
      return;
    }
    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(eyebrow, { translateX: [-10, 0], opacity: [0, 1], duration: 700 }, 0);
      tl.add(h2,      { translateY: [40, 0],  opacity: [0, 1], duration: 800 }, 100);
      tl.add(lead,    { translateY: [20, 0],  opacity: [0, 1], duration: 700 }, 250);
      tl.add(cards,   { translateY: [60, 0],  scale: [0.96, 1], opacity: [0, 1], duration: 800, delay: a.stagger(120) }, 400);
      tl.call(function () {
        Array.prototype.forEach.call(cards, function (c) {
          c.style.transform = '';
          c.style.opacity = '';
        });
        var root = sec.querySelector('[data-disc-carousel]');
        if (root) root.dispatchEvent(new CustomEvent('disc:ready'));
      });
    } catch (e) {
      showAll([eyebrow, h2, lead].concat(Array.prototype.slice.call(cards)));
    }
  }

  /* ─── S4: CHAMPIONS ─────────────────────────────────── */
  function initChampionsState() {
    var a = window.anime;
    if (!a || reducedMotion) return;
    var sec = document.querySelector('.champions');
    if (!sec) return;
    hide(sec.querySelector('.eyebrow'), 'translateY(16px)');
    Array.prototype.forEach.call(sec.querySelectorAll('.champions-quote .word'), function (w) {
      w.style.opacity = '0'; w.style.transform = 'translateY(20px)'; w.style.filter = 'blur(6px)';
    });
    hide(sec.querySelector('.champions-name'), 'translateY(16px)');
    Array.prototype.forEach.call(sec.querySelectorAll('.title-line'), function (t) {
      hide(t, 'translateY(12px)');
    });
  }

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
    var wordDuration = words.length ? (words.length * 80 + 650) : 0;
    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(eyebrow, { translateY: [16, 0], opacity: [0, 1], duration: 600 }, 0);
      tl.add(words,   { translateY: [20, 0], opacity: [0, 1], filter: ['blur(6px)', 'blur(0px)'], duration: 650, delay: a.stagger(80) }, 150);
      tl.add(name,    { translateY: [16, 0], opacity: [0, 1], duration: 700 }, 150 + wordDuration);
      tl.add(titles,  { translateY: [12, 0], opacity: [0, 1], duration: 600, delay: a.stagger(100) }, 150 + wordDuration + 200);
    } catch (e) {
      showAll([eyebrow, name].concat(Array.prototype.slice.call(words), Array.prototype.slice.call(titles)));
    }
  }

  /* ─── S7: HORARIOS ──────────────────────────────────── */
  function initScheduleState() {
    var a = window.anime;
    if (!a || reducedMotion) return;
    var sec = document.querySelector('.schedule');
    if (!sec) return;
    Array.prototype.forEach.call(sec.querySelectorAll('.section-head > *'), function (el) { hide(el, 'translateY(20px)'); });
    Array.prototype.forEach.call(sec.querySelectorAll('.fight-card'), function (c) { hide(c, 'translateY(50px)'); });
    Array.prototype.forEach.call(sec.querySelectorAll('.fc-slot, .fc-slot-sep'), function (s) { hide(s, 'translateX(-8px)'); });
    var waBtn = sec.querySelector('[href*="wa.me"]');
    if (waBtn) hide(waBtn, 'translateY(12px)');
  }

  function scheduleTimeline() {
    var a = window.anime;
    if (!a) return;
    var sec     = document.querySelector('.schedule');
    var headEls = sec.querySelectorAll('.section-head > *');
    var cards   = sec.querySelectorAll('.fight-card');
    var waBtn   = sec.querySelector('[href*="wa.me"]');

    if (reducedMotion) {
      showAll(Array.prototype.slice.call(headEls).concat(Array.prototype.slice.call(cards)).concat(waBtn ? [waBtn] : []));
      Array.prototype.forEach.call(sec.querySelectorAll('.fc-slot, .fc-slot-sep'), function (s) { showAll([s]); });
      return;
    }
    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(headEls, { translateY: [20, 0], opacity: [0, 1], duration: 700, delay: a.stagger(100) }, 0);
      tl.add(cards,   { translateY: [50, 0], opacity: [0, 1], duration: 800, delay: a.stagger(150) }, 300);
      Array.prototype.forEach.call(cards, function (card, ci) {
        var slots = card.querySelectorAll('.fc-slot, .fc-slot-sep');
        tl.add(slots, { translateX: [-8, 0], opacity: [0, 1], duration: 500, delay: a.stagger(60) }, 300 + 150 * (ci + 1) + 200);
      });
      if (waBtn) tl.add(waBtn, { translateY: [12, 0], opacity: [0, 1], duration: 600 }, 1000);
    } catch (e) {
      showAll(Array.prototype.slice.call(headEls).concat(Array.prototype.slice.call(cards)).concat(waBtn ? [waBtn] : []));
      Array.prototype.forEach.call(sec.querySelectorAll('.fc-slot, .fc-slot-sep'), function (s) { showAll([s]); });
    }
  }

  /* ─── S8: TAPA TEAM ─────────────────────────────────── */
  function initTapaState() {
    var a = window.anime;
    if (!a || reducedMotion) return;
    var sec = document.querySelector('.tapa');
    if (!sec) return;
    hide(sec.querySelector('.eyebrow'),     'translateY(20px)');
    hide(sec.querySelector('.tt-title'),    'translateY(50px)');
    hide(sec.querySelector('.tapa-copy > p'), 'translateY(20px)');
    Array.prototype.forEach.call(sec.querySelectorAll('.tt-stat'), function (s) { hide(s, 'translateY(16px)'); });
    Array.prototype.forEach.call(sec.querySelectorAll('.tapa-ctas .btn'), function (b) { hide(b, 'translateY(12px)'); });
    hide(sec.querySelector('.tapa-media'), 'translateX(60px)');
  }

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

    if (reducedMotion) {
      showAll([eyebrow, title, lead, media].concat(Array.prototype.slice.call(stats)).concat(Array.prototype.slice.call(btns)));
      return;
    }
    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(eyebrow, { translateY: [20, 0], opacity: [0, 1], duration: 600 }, 0);
      tl.add(title,   { translateY: [50, 0], opacity: [0, 1], duration: 800 }, 120);
      tl.add(lead,    { translateY: [20, 0], opacity: [0, 1], duration: 700 }, 260);
      tl.add(stats,   { translateY: [16, 0], opacity: [0, 1], duration: 600, delay: a.stagger(100) }, 380);
      tl.add(btns,    { translateY: [12, 0], opacity: [0, 1], duration: 600, delay: a.stagger(100) }, 600);
      if (media) tl.add(media, { translateX: [60, 0], opacity: [0, 1], duration: 1000 }, 0);
    } catch (e) {
      showAll([eyebrow, title, lead, media].concat(Array.prototype.slice.call(stats)).concat(Array.prototype.slice.call(btns)));
    }
  }

  /* ─── S9: COMUNIDAD ─────────────────────────────────── */
  function initCommunityState() {
    var a = window.anime;
    if (!a || reducedMotion) return;
    var sec = document.querySelector('.community');
    if (!sec) return;
    Array.prototype.forEach.call(sec.querySelectorAll('.section-head > *'), function (el) { hide(el, 'translateY(20px)'); });
    var filters = sec.querySelector('.comm-filters');
    if (filters) hide(filters, 'translateY(12px)');
  }

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
    try {
      var tl = a.createTimeline({ defaults: { easing: 'easeOutExpo' } });
      tl.add(headEls, { translateY: [20, 0], opacity: [0, 1], duration: 700, delay: a.stagger(100) }, 0);
      if (filters) tl.add(filters, { translateY: [12, 0], opacity: [0, 1], duration: 600 }, 300);
    } catch (e) {
      showAll(Array.prototype.slice.call(headEls).concat(filters ? [filters] : []));
    }

    if (!grid) return;
    var animated = false;
    var mo = new MutationObserver(function (mutations) {
      var newItems = [];
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList.contains('comm-item')) newItems.push(node);
        });
      });
      if (!newItems.length) return;
      Array.prototype.forEach.call(newItems, function (item) { item.style.opacity = '0'; item.style.transform = 'scale(0.9)'; });
      var startDelay = animated ? 0 : 300;
      animated = true;
      try {
        a.animate(newItems, { opacity: [0, 1], scale: [0.9, 1], duration: 500, easing: 'easeOutExpo', delay: a.stagger(50, { start: startDelay }) });
      } catch (e) {
        showAll(newItems);
      }
    });
    mo.observe(grid, { childList: true });
  }

  /* ─── MAIN INIT ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    /* 1. Set ALL initial hidden states immediately (before any observer fires) */
    initHeroState();
    initAcademyState();
    initChampionsState();
    initScheduleState();
    initTapaState();
    initCommunityState();

    /* 2. Run hero immediately */
    heroSequence();

    /* 3. Wire up scroll observers */
    observeSection(document.querySelector('.disciplines'), academyTimeline,  0.12);
    observeSection(document.querySelector('.champions'),   championsTimeline, 0.15);
    observeSection(document.querySelector('.schedule'),    scheduleTimeline,  0.10);
    observeSection(document.querySelector('.tapa'),        tapaTimeline,      0.12);
    observeSection(document.querySelector('.community'),   communityTimeline, 0.10);
  });

})();
