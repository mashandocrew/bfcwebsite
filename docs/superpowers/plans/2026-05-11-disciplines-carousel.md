# Disciplines Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the disciplines section from a static 3-column grid into a 3-up carousel (center + 2 sides) with infinite loop, drag/click/arrows/keyboard navigation.

**Architecture:** CSS owns the visual states (`.is-prev`/`.is-active`/`.is-next`); a small IIFE controller (`carousel.js`) reassigns those classes on user interaction. Pointer Events unify mouse + touch + pen. The entry animation in `animations.js` runs first, then the controller takes over via a custom event.

**Tech Stack:** Vanilla JS (ES5-compatible style, no bundler), CSS3 transforms/transitions, Pointer Events API. No new dependencies.

**Testing approach:** This is a static site with no test framework. Each task verifies via (a) opening `index.html` in a browser and exercising the feature, and (b) grep/file checks for code-level invariants. Commit after each verified task.

---

### Task 1: Refactor disciplines HTML structure

**Files:**
- Modify: `index.html:145-188` (the `<section class="section disciplines">` block)

**Why:** The current `<a class="disc-card">` interferes with pointer drag (browser starts native link-drag). We need `<article>` containers with the link moved to an internal `.disc-link`. Also adds the carousel wrapper, track, and arrow buttons.

- [ ] **Step 1: Open and locate the section**

Read: `index.html` lines 145–188. Confirm the section structure matches the current source.

- [ ] **Step 2: Replace the disciplines section markup**

Use Edit to replace the entire `<section class="section disciplines" id="academy">…</section>` block with:

```html
<section class="section disciplines" id="academy">
  <div class="container">
    <header class="section-head reveal">
      <span class="eyebrow"><span data-i18n="disc.eyebrow">01 — Disciplinas</span></span>
      <h2 class="hl" data-i18n-html="disc.title">Arte marcial. <b>Mentalidad de guerra.</b></h2>
      <p data-i18n="disc.lead">Cuatro disciplinas, una sola filosofía: disciplina, respeto y voluntad para competir al más alto nivel.</p>
    </header>

    <div class="disc-carousel reveal" data-disc-carousel>
      <div class="disc-track">
        <article class="disc-card" data-disc-index="0">
          <div class="disc-bg" style="background-image:url('assets/images/gimnasio-1.webp');"></div>
          <div class="disc-num">/ 01</div>
          <div>
            <div class="eyebrow" data-i18n="disc.k1.kicker">Stand-up striking</div>
            <h3 class="disc-title" data-i18n="disc.k1.name">K1 Kickboxing</h3>
            <p class="disc-desc" data-i18n="disc.k1.desc">Técnica de golpeo japonés que combina boxeo con patadas. Ritmo, explosividad y precisión.</p>
            <a href="#schedule" class="disc-link" tabindex="-1"><span data-i18n="disc.k1.cta">Conocer la clase</span> <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </article>

        <article class="disc-card" data-disc-index="1">
          <div class="disc-bg" style="background-image:url('assets/images/gimnasio-2.webp');"></div>
          <div class="disc-num">/ 02</div>
          <div>
            <div class="eyebrow" data-i18n="disc.mt.kicker">The art of eight limbs</div>
            <h3 class="disc-title" data-i18n="disc.mt.name">Muay Thai</h3>
            <p class="disc-desc" data-i18n="disc.mt.desc">Boxeo tailandés: puños, codos, rodillas y patadas. La disciplina más completa de pie.</p>
            <a href="#schedule" class="disc-link" tabindex="-1"><span data-i18n="disc.mt.cta">Conocer la clase</span> <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </article>

        <article class="disc-card gold" data-disc-index="2">
          <div class="disc-bg" style="background-image:url('assets/images/tapa-team.jpg');"></div>
          <div class="disc-num">/ 03</div>
          <div>
            <div class="eyebrow gold" data-i18n="disc.mma.kicker">Tapa Team</div>
            <h3 class="disc-title" data-i18n="disc.mma.name">MMA &amp; Wrestling</h3>
            <p class="disc-desc" data-i18n="disc.mma.desc">Artes marciales mixtas y lucha. El futuro del combate completo en Mendoza.</p>
            <a href="#tapa" class="disc-link" tabindex="-1"><span data-i18n="disc.mma.cta">Ver Tapa Team</span> <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </article>
      </div>

      <button class="disc-arrow disc-arrow-prev" type="button" aria-label="Modalidad anterior">
        <i class="ph ph-caret-left" aria-hidden="true"></i>
      </button>
      <button class="disc-arrow disc-arrow-next" type="button" aria-label="Modalidad siguiente">
        <i class="ph ph-caret-right" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in browser**

Open `index.html` in a browser. Scroll to S3. Expected: the three cards are visible but overlapping/broken visually (the CSS still expects `.disc-grid`). Texts and images should render correctly. Arrows should render as caret icons. **This visual breakage is expected** — CSS comes in Task 2.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "refactor: disciplines section to carousel HTML structure"
```

---

### Task 2: Add carousel CSS

**Files:**
- Modify: `assets/css/main.css:549-624` (replace `.disc-grid` and `.disc-card` structural rules)
- Modify: `assets/css/main.css:1465-1472` (remove mobile stacking of `.disc-grid` / `.disc-card`)

**Why:** The carousel needs absolute positioning for cards and a state-based transform system. We preserve internal styles (`.disc-bg`, `.disc-num`, `.disc-title`, etc.) and only swap the layout-level rules.

- [ ] **Step 1: Replace the disciplines layout block**

In `assets/css/main.css`, find this block starting at line 549:

```css
.disc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: var(--border-hair);
}
.disc-card {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 2.25rem 2rem;
  border-right: var(--border-hair);
  color: var(--bfc-bone);
  isolation: isolate;
  cursor: pointer;
  transition: background var(--dur-base) var(--ease-out-expo);
}
.disc-card:last-child { border-right: 0; }
```

Replace it with:

```css
/* Carousel container */
.disc-carousel {
  position: relative;
  height: 560px;
  margin-top: 2.5rem;
  overflow: hidden;
  perspective: 1200px;
  user-select: none;
  touch-action: pan-y;
}
.disc-track {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Card base */
.disc-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(420px, 80vw);
  height: 100%;
  margin-left: calc(min(420px, 80vw) * -0.5);
  border: var(--border-hair);
  background: var(--bfc-black);
  overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 2.25rem 2rem;
  color: var(--bfc-bone);
  isolation: isolate;
  cursor: pointer;
  opacity: 0;
  transform: translateX(0) scale(0.75);
  filter: blur(4px);
  transition:
    transform 600ms cubic-bezier(.2,.7,.2,1),
    opacity 500ms ease,
    filter 500ms ease;
  will-change: transform, opacity, filter;
}

/* Position states */
.disc-card.is-prev {
  transform: translateX(-55%) scale(0.75);
  opacity: 0.5;
  filter: blur(4px);
  z-index: 1;
}
.disc-card.is-active {
  transform: translateX(0) scale(1);
  opacity: 1;
  filter: blur(0);
  z-index: 3;
  cursor: grab;
}
.disc-card.is-active:active { cursor: grabbing; }
.disc-card.is-next {
  transform: translateX(55%) scale(0.75);
  opacity: 0.5;
  filter: blur(4px);
  z-index: 1;
}

/* During drag — disable transitions to follow finger */
.disc-carousel.is-dragging .disc-card { transition: none; }

/* Arrow buttons */
.disc-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: var(--border-hair);
  background: rgba(10,10,10,0.6);
  color: var(--bfc-bone);
  font-size: 1.4rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 5;
  transition: background 200ms ease, border-color 200ms ease;
}
.disc-arrow:hover { background: rgba(200,16,46,0.2); border-color: var(--bfc-red); }
.disc-arrow:focus-visible { outline: 2px solid var(--bfc-red); outline-offset: 2px; }
.disc-arrow-prev { left: 1rem; }
.disc-arrow-next { right: 1rem; }
```

Keep the rules that follow this block unchanged (`.disc-bg`, `.disc-card::before`, `.disc-card::after`, `.disc-card.gold::after`, `.disc-num`, `.disc-title`, `.disc-desc`, `.disc-link`, `.disc-card:hover ...`). They continue to work because `.disc-card` still exists.

- [ ] **Step 2: Remove the old mobile stacking rules**

In `assets/css/main.css`, find lines ~1465–1472 inside `@media (max-width: 1024px)`:

```css
  .disc-grid { grid-template-columns: 1fr; }
  .reviews-grid { grid-template-columns: repeat(2, 1fr); }
  .disc-card {
    border-right: 0;
    border-bottom: var(--border-hair);
    min-height: 380px;
  }
  .disc-card:last-child { border-bottom: 0; }
  .disc-bg { background-size: cover; background-position: center; }
```

Replace with (keep the `.reviews-grid` and `.disc-bg` lines, drop the rest):

```css
  .reviews-grid { grid-template-columns: repeat(2, 1fr); }
  .disc-bg { background-size: cover; background-position: center; }
```

- [ ] **Step 3: Add the mobile carousel overrides**

In `assets/css/main.css`, inside the same `@media (max-width: 1024px)` block (after the line you just edited), add:

```css
  .disc-carousel { height: 460px; }
  .disc-card { width: min(320px, 75vw); margin-left: calc(min(320px, 75vw) * -0.5); }
  .disc-card.is-prev  { transform: translateX(-65%) scale(0.7); }
  .disc-card.is-next  { transform: translateX(65%)  scale(0.7); }
  .disc-arrow { width: 40px; height: 40px; }
```

- [ ] **Step 4: Update the very-small breakpoint**

Find this at line ~1552 inside `@media (max-width: 400px)`:

```css
  .disc-card { min-height: 300px; }
```

Replace with:

```css
  .disc-carousel { height: 420px; }
  .disc-card { width: 78vw; margin-left: -39vw; }
  .disc-arrow-prev { left: 0.25rem; }
  .disc-arrow-next { right: 0.25rem; }
```

- [ ] **Step 5: Add reduced-motion handling**

At the end of `assets/css/main.css` (after the existing `@media (prefers-reduced-motion: reduce)` block on line ~1557), append:

```css
@media (prefers-reduced-motion: reduce) {
  .disc-card { transition: opacity 200ms ease; filter: none !important; }
  .disc-card.is-prev, .disc-card.is-next { filter: none !important; }
}
```

- [ ] **Step 6: Verify in browser**

Reload `index.html`. Scroll to S3. Expected: all three cards are stacked at the center with `opacity: 0` — they are invisible because the JS hasn't run yet to assign `is-prev`/`is-active`/`is-next`. **This is expected.** As a sanity check, in DevTools manually add `class="disc-card is-active"` to the first article and `class="disc-card is-prev"`/`is-next` to the others. The 3-up layout should appear correctly (center crisp, sides blurred and faded).

- [ ] **Step 7: Commit**

```bash
git add assets/css/main.css
git commit -m "feat: carousel CSS for disciplines section"
```

---

### Task 3: Create the carousel controller

**Files:**
- Create: `assets/js/carousel.js`

**Why:** All interaction logic lives here. The file is self-contained, uses Pointer Events, and only manipulates CSS classes + one transient inline `transform` during drag.

- [ ] **Step 1: Write the file**

Create `assets/js/carousel.js` with this exact content:

```js
/* =====================================================
   BFC — CAROUSEL.JS
   Disciplines 3-up carousel · Pointer Events
   ===================================================== */
(function () {
  'use strict';

  var DRAG_THRESHOLD_PX = 80;
  var CLICK_THRESHOLD_PX = 8;

  function init(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll('.disc-card'));
    if (cards.length < 2) return;

    var active = 0;
    var n = cards.length;
    var startX = 0, currentX = 0, dragging = false, didDrag = false;

    function indexOfPos(pos) {
      return ((active + pos) % n + n) % n;
    }

    function apply() {
      cards.forEach(function (c, i) {
        c.classList.remove('is-prev', 'is-active', 'is-next');
        c.style.transform = '';
        if (i === active)              c.classList.add('is-active');
        else if (i === indexOfPos(-1)) c.classList.add('is-prev');
        else if (i === indexOfPos(1))  c.classList.add('is-next');
        var link = c.querySelector('.disc-link');
        if (link) link.setAttribute('tabindex', i === active ? '0' : '-1');
      });
    }

    function goTo(delta) {
      active = ((active + delta) % n + n) % n;
      apply();
    }

    function onPointerDown(e) {
      if (e.target.closest('.disc-arrow')) return;
      dragging = true; didDrag = false;
      startX = e.clientX; currentX = e.clientX;
      root.classList.add('is-dragging');
      try { root.setPointerCapture(e.pointerId); } catch (err) {}
    }
    function onPointerMove(e) {
      if (!dragging) return;
      currentX = e.clientX;
      var dx = currentX - startX;
      if (Math.abs(dx) > CLICK_THRESHOLD_PX) didDrag = true;
      cards[active].style.transform = 'translateX(' + dx + 'px) scale(1)';
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      var dx = currentX - startX;
      if (dx <= -DRAG_THRESHOLD_PX) goTo(1);
      else if (dx >= DRAG_THRESHOLD_PX) goTo(-1);
      else apply();
    }

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);

    cards.forEach(function (c) {
      c.addEventListener('click', function (ev) {
        if (didDrag) { ev.preventDefault(); return; }
        if (c.classList.contains('is-prev'))      { ev.preventDefault(); goTo(-1); }
        else if (c.classList.contains('is-next')) { ev.preventDefault(); goTo(1); }
      });
    });

    var prevBtn = root.querySelector('.disc-arrow-prev');
    var nextBtn = root.querySelector('.disc-arrow-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(1); });

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(1); }
    });

    function start() { apply(); }

    // Wait for the entry animation to complete (fired by animations.js).
    // Fallback: start anyway after 2000ms in case the event never arrives.
    var started = false;
    function once() { if (!started) { started = true; start(); } }
    root.addEventListener('disc:ready', once);
    setTimeout(once, 2000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var roots = document.querySelectorAll('[data-disc-carousel]');
    Array.prototype.forEach.call(roots, init);
  });
})();
```

- [ ] **Step 2: Verify the file syntax**

Run in a browser console after loading the page (or use `node -c assets/js/carousel.js` if Node is available). Expected: no syntax errors. With Bash:

```bash
node -c "C:/Users/Daniel/Desktop/I.A/BFC/bfc-website/assets/js/carousel.js"
```

Expected: no output (success). If Node is not installed, skip — the next task wires it into the page and we'll see errors in DevTools.

- [ ] **Step 3: Commit**

```bash
git add assets/js/carousel.js
git commit -m "feat: carousel controller with pointer drag, arrows, keyboard"
```

---

### Task 4: Wire the controller into the page

**Files:**
- Modify: `index.html` (script tag near the end of body)
- Modify: `assets/js/animations.js:112-134` (fire the `disc:ready` event after the entry timeline)

**Why:** The page needs to load `carousel.js`, and the controller needs to know when the entry animation finishes so it doesn't fight with anime.js inline styles.

- [ ] **Step 1: Add the script tag**

In `index.html`, find the line:

```html
<script src="assets/js/animations.js?v=1"></script>
```

Add immediately after it:

```html
<script src="assets/js/carousel.js?v=1"></script>
```

- [ ] **Step 2: Update `academyTimeline()` to dispatch the ready event**

In `assets/js/animations.js`, find the `academyTimeline` function (around line 112). The current `try` block ends with:

```js
      tl.add(cards,   { translateY: [60, 0],  scale: [0.96, 1], opacity: [0, 1], duration: 800, delay: a.stagger(120) }, 400);
    } catch (e) {
```

Replace those two lines with:

```js
      tl.add(cards,   { translateY: [60, 0],  scale: [0.96, 1], opacity: [0, 1], duration: 800, delay: a.stagger(120) }, 400);
      tl.call(function () {
        // Clean inline transform that anime.js leaves on the cards, then
        // hand off to the carousel controller.
        Array.prototype.forEach.call(cards, function (c) {
          c.style.transform = '';
          c.style.opacity = '';
        });
        var root = sec.querySelector('[data-disc-carousel]');
        if (root) root.dispatchEvent(new CustomEvent('disc:ready'));
      });
    } catch (e) {
```

Also update the `reducedMotion` early-return inside `academyTimeline` so the carousel still starts. Find:

```js
    if (reducedMotion) {
      showAll([eyebrow, h2, lead].concat(Array.prototype.slice.call(cards)));
      return;
    }
```

Replace with:

```js
    if (reducedMotion) {
      showAll([eyebrow, h2, lead].concat(Array.prototype.slice.call(cards)));
      var rootRM = sec.querySelector('[data-disc-carousel]');
      if (rootRM) rootRM.dispatchEvent(new CustomEvent('disc:ready'));
      return;
    }
```

- [ ] **Step 3: Verify the script order with grep**

```bash
grep -n "src=\"assets/js/" "C:/Users/Daniel/Desktop/I.A/BFC/bfc-website/index.html"
```

Expected output: `animations.js` appears before `carousel.js`.

- [ ] **Step 4: Verify in browser — full flow**

Reload `index.html`. Scroll to S3. Verify:

1. The section header animates in (eyebrow / h2 / lead).
2. The three cards animate in with translateY + scale + stagger.
3. After the entry finishes (~1.3s after cards start), cards snap into the carousel layout: K1 at center, MMA-side cards blurred at the sides.
4. Click the right card → it rotates to center. Click again → loops.
5. Click and drag the center card horizontally with the mouse. Drag >80px right → previous; left → next.
6. Click the ‹ and › arrow buttons → navigate.
7. Click on the center card's CTA text "Conocer la clase" → navigates to `#schedule`.
8. Tab into the carousel, press → and ← → navigates.
9. Resize the window below 1024px. The carousel should still work with tighter peek.

If any of those fail, fix and re-verify before committing.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/animations.js
git commit -m "feat: wire carousel controller and coordinate with entry animation"
```

---

### Task 5: Final smoke check across the site

**Files:** none modified — verification only.

- [ ] **Step 1: Hard reload and click through every section**

Open `index.html` with cache disabled (DevTools → Network → Disable cache, or Ctrl+Shift+R). Walk through every section top to bottom. Verify:

- Hero animation still runs.
- Counters, History, Professors render normally.
- Champions quote animates.
- Schedule (S7), Tapa (S8), Community (S9) animations still work.
- The disciplines carousel works as specified.

- [ ] **Step 2: Check console**

Open DevTools console. Expected: no errors. Warnings about missing fonts/images are pre-existing and acceptable.

- [ ] **Step 3: Test prefers-reduced-motion**

In Chrome DevTools: ⋮ → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload. Expected: section reveals are instant (no transforms/blurs), but the carousel still works — center card is sharp, sides are still visible but without blur.

- [ ] **Step 4: Test on a narrow viewport**

In DevTools device toolbar, set to iPhone SE (375px). Reload. Verify the carousel is usable: peek is visible, swipe rotates cards.

- [ ] **Step 5: No commit needed**

This task is verification-only. If issues were found, go back to the relevant task above and fix them with a new commit.

---

## Out of scope

- Three.js particles (separate spec).
- Bidirectional scroll-driven reveals (separate spec).
- Adding more than 3 disciplines (the controller supports `n >= 2` cards but the visual states are only defined for prev/active/next; with 4+ cards the rest would be invisible at `opacity: 0`).
- Auto-rotate / autoplay.
- Indicator dots.

---

## Self-review notes

- **Spec coverage:** Each spec section has a task. HTML refactor → Task 1. CSS states/breakpoints/reduced-motion → Task 2. JS controller (drag, click, arrows, keyboard, loop) → Task 3. Coordination with entry animation + script load → Task 4. Acceptance criteria walkthrough → Task 5.
- **No placeholders:** Every code block is complete. File paths are absolute or repo-relative.
- **Identifiers consistent:** `data-disc-carousel`, `[data-disc-index]`, `.is-prev/.is-active/.is-next`, `disc:ready`, `DRAG_THRESHOLD_PX`, `CLICK_THRESHOLD_PX` are used consistently across HTML, CSS, and JS.
