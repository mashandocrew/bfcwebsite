# BFC Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar animaciones premium con anime.js a 6 secciones del sitio BFC, más un fade a negro en la parte inferior del hero video.

**Architecture:** Un archivo nuevo `assets/js/animations.js` (IIFE) maneja todas las animaciones vía `DOMContentLoaded` + `IntersectionObserver`. Las animaciones CSS hardcodeadas del hero se remueven de `main.css` y `animations.css` para que anime.js tome el control. El sistema respeta `prefers-reduced-motion`.

**Tech Stack:** anime.js v4 (CDN IIFE ya cargado en index.html), Vanilla JS ES5-compatible, IntersectionObserver API, MutationObserver API.

---

### Task 1: Hero bottom fade (CSS + HTML)

**Files:**
- Modify: `index.html` (línea 78, dentro de `.hero`)
- Modify: `assets/css/main.css` (después de `.hero-mask`, ~línea 360)

- [ ] **Step 1: Agregar el div de fade en index.html**

En `index.html`, después de la línea `<div class="hero-mask" aria-hidden="true"></div>` (línea 78), agregar:

```html
<div class="hero-fade-bottom" aria-hidden="true"></div>
```

- [ ] **Step 2: Agregar el estilo en main.css**

En `assets/css/main.css`, después del bloque `.hero-mask { ... }` (~línea 360), agregar:

```css
.hero-fade-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 35%;
  background: linear-gradient(to bottom, transparent 0%, var(--bfc-black) 100%);
  pointer-events: none;
  z-index: 2;
}
```

- [ ] **Step 3: Verificar visualmente**

Abrir `index.html` en el navegador. El video del hero debe verse con una transición suave a negro en la parte inferior. El contenido del hero (título, CTAs) debe seguir siendo legible. El video no debe cambiar.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/main.css
git commit -m "feat: add hero bottom fade gradient"
```

---

### Task 2: Remover animaciones CSS del hero que anime.js va a reemplazar

**Files:**
- Modify: `assets/css/main.css` (bloques `.hero-title`, `.hero-sub`, `.hero-ctas`, `.hero-side`, `.hero-location`, `.hero-tag`)

El objetivo es que estos elementos sean visibles sin JS (no `opacity: 0` en CSS), y que anime.js los oculte en JS antes de animarlos. Para eso, en CSS removemos el `opacity: 0` y el `animation:` de cada uno, dejando solo los estilos de layout.

- [ ] **Step 1: Editar `.hero-location` en main.css**

Buscar el bloque `.hero-location` (~línea 373). Remover estas dos líneas:
```css
opacity: 0;
animation: fadeUp 800ms var(--ease-out-expo) 500ms forwards;
```

- [ ] **Step 2: Editar `.hero-tag` en main.css**

Buscar el bloque `.hero-tag` (~línea 385). Remover:
```css
opacity: 0;
animation: fadeUp 800ms var(--ease-out-expo) 1000ms forwards;
```

- [ ] **Step 3: Editar `.hero-title .line > span` en main.css**

Buscar (~línea 418). Reemplazar el bloque completo:
```css
.hero-title .line > span {
  display: block;
  transform: translateY(110%);
  animation: lineReveal 1100ms var(--ease-out-expo) forwards;
}
.hero-title .line:nth-child(1) > span { animation-delay: 1400ms; }
.hero-title .line:nth-child(2) > span { animation-delay: 1600ms; color: var(--bfc-red); }
.hero-title .line:nth-child(3) > span { animation-delay: 1800ms; }
```
Por:
```css
.hero-title .line > span {
  display: block;
}
.hero-title .line:nth-child(2) > span { color: var(--bfc-red); }
```

- [ ] **Step 4: Editar `.hero-sub` en main.css**

Buscar (~línea 426). Remover:
```css
opacity: 0;
animation: fadeUp 900ms var(--ease-out-expo) 2200ms forwards;
```

- [ ] **Step 5: Editar `.hero-ctas` en main.css**

Buscar (~línea 434). Remover:
```css
opacity: 0;
animation: fadeUp 900ms var(--ease-out-expo) 2500ms forwards;
```

- [ ] **Step 6: Editar `.hero-side` en main.css**

Buscar (~línea 440). Remover:
```css
opacity: 0;
animation: fadeUp 900ms var(--ease-out-expo) 2800ms forwards;
```

- [ ] **Step 7: Verificar que el hero es visible sin animación**

Abrir el navegador con JS deshabilitado (DevTools → Settings → Disable JavaScript). El hero debe mostrarse completamente — título, subtítulo, CTAs, hashtag — sin estar oculto.

- [ ] **Step 8: Commit**

```bash
git add assets/css/main.css
git commit -m "refactor: remove hero CSS animations (anime.js will handle)"
```

---

### Task 3: Remover animaciones CSS del bloque Champions que anime.js reemplaza

**Files:**
- Modify: `assets/css/main.css` (bloque `.champions`)

- [ ] **Step 1: Editar `.champions-quote .word`**

Buscar (~línea 670). Reemplazar:
```css
.champions-quote .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
}
.champions.in-view .champions-quote .word {
  animation: fadeUpWord 650ms var(--ease-out-expo) forwards;
}
```
Por:
```css
.champions-quote .word {
  display: inline-block;
}
```

- [ ] **Step 2: Editar `.champions-name`**

Buscar (~línea 678). Reemplazar:
```css
.champions-name {
  margin-top: 3rem;
  display: flex; flex-direction: column; gap: 0.25rem;
  opacity: 0;
}
.champions.in-view .champions-name {
  animation: fadeUp 800ms var(--ease-out-expo) 1.8s forwards;
}
```
Por:
```css
.champions-name {
  margin-top: 3rem;
  display: flex; flex-direction: column; gap: 0.25rem;
}
```

- [ ] **Step 3: Editar `.title-line` animations**

Buscar (~línea 711). Remover estos bloques completos (dejar solo el estilo de layout de `.title-line`):
```css
.champions.in-view .title-line {
  animation: fadeUp 650ms var(--ease-out-expo) forwards;
}
.champions.in-view .title-line:nth-child(1) { animation-delay: 2.1s; }
.champions.in-view .title-line:nth-child(2) { animation-delay: 2.3s; }
.champions.in-view .title-line:nth-child(3) { animation-delay: 2.5s; }
.champions.in-view .title-line:nth-child(4) { animation-delay: 2.7s; }
.champions.in-view .title-line:nth-child(5) { animation-delay: 2.9s; }
```

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.css
git commit -m "refactor: remove champions CSS animations (anime.js will handle)"
```

---

### Task 4: Crear animations.js — estructura base + hero sequence

**Files:**
- Create: `assets/js/animations.js`

- [ ] **Step 1: Crear el archivo con la estructura base y la secuencia del hero**

Crear `assets/js/animations.js` con el siguiente contenido completo:

```js
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
    var sec    = document.querySelector('.disciplines');
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
    var sec      = document.querySelector('.champions');
    var eyebrow  = sec.querySelector('.eyebrow');
    var words    = sec.querySelectorAll('.champions-quote .word');
    var name     = sec.querySelector('.champions-name');
    var titles   = sec.querySelectorAll('.title-line');

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
    var sec       = document.querySelector('.schedule');
    var headEls   = sec.querySelectorAll('.section-head > *');
    var cards     = sec.querySelectorAll('.fight-card');
    var waBtn     = sec.querySelector('[href*="wa.me"]');

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
    var sec      = document.querySelector('.tapa');
    var eyebrow  = sec.querySelector('.eyebrow');
    var title    = sec.querySelector('.tt-title');
    var lead     = sec.querySelector('.tapa-copy > p');
    var stats    = sec.querySelectorAll('.tt-stat');
    var btns     = sec.querySelectorAll('.tapa-ctas .btn');
    var media    = sec.querySelector('.tapa-media');

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
    var sec      = document.querySelector('.community');
    var headEls  = sec.querySelectorAll('.section-head > *');
    var filters  = sec.querySelector('.comm-filters');
    var grid     = document.getElementById('commGrid');

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
        /* subsequent photo loads: just fade in */
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
```

- [ ] **Step 2: Verificar que el archivo existe**

```
ls assets/js/animations.js
```
Debe mostrar el archivo.

- [ ] **Step 3: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat: add animations.js with hero sequence and scroll timelines"
```

---

### Task 5: Registrar animations.js en index.html

**Files:**
- Modify: `index.html` (bloque de scripts al final del body)

- [ ] **Step 1: Agregar el script tag**

En `index.html`, en el bloque de scripts al final del `<body>`, después de `reviews.js`:

```html
<script src="assets/js/reviews.js?v=4"></script>
<script src="assets/js/animations.js?v=1"></script>
```

- [ ] **Step 2: Verificar orden de carga**

El orden final de scripts debe ser:
1. `animejs` (CDN)
2. `supabase-js` (CDN)
3. `i18n.js`
4. `main.js`
5. `leads.js`
6. `community.js`
7. `reviews.js`
8. `animations.js` ← nuevo, al final

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: register animations.js in index.html"
```

---

### Task 6: Verificación final end-to-end

- [ ] **Step 1: Test hero sequence**

Abrir `index.html` en el navegador (o con live server). Al cargar:
- El navbar debe deslizarse desde arriba
- "Bonati" → "Fight" (rojo) → "Club" deben revelarse en secuencia con ~200ms entre cada línea
- El subtítulo debe aparecer con desenfoque suave
- Los botones CTA deben aparecer en stagger
- El hashtag lateral debe aparecer último
- El fade a negro en la parte inferior del video debe ser visible y suave

- [ ] **Step 2: Test secciones de scroll**

Hacer scroll lento por la página y verificar:
- **Academia (S3):** eyebrow → h2 → lead → 3 cards en stagger
- **Champions (S4):** eyebrow → palabras de la quote → nombre → títulos
- **Horarios (S7):** header → cards → slots dentro de cada card como filas
- **Tapa Team (S8):** columna texto en secuencia + imagen desde la derecha simultáneamente
- **Comunidad (S9):** header → fotos con scale+fade cuando carga Supabase

- [ ] **Step 3: Test prefers-reduced-motion**

En DevTools (Chrome): Rendering panel → Emulate CSS prefers-reduced-motion: reduce.
Todos los elementos deben ser visibles inmediatamente sin animación.

- [ ] **Step 4: Test sin JS**

DevTools → Settings → Disable JavaScript.
Todos los elementos del hero y secciones deben ser visibles (no en `opacity: 0`).

- [ ] **Step 5: Test mobile**

Redimensionar a 375px. Verificar que las animaciones no causan overflow horizontal.

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "feat: complete BFC animation system with anime.js"
```
