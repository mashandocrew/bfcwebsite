# Disciplines Carousel — Design Spec
**Fecha:** 2026-05-11
**Estado:** Aprobado

---

## Resumen

Convertir la sección 3 (Academia / Disciplinas) de un grid de 3 columnas estático a un carrusel con una card central en foco y dos laterales reducidas, desenfocadas y con menor opacidad. Loop infinito. Navegación por drag con mouse, click en cards laterales, flechas y teclado. Mismo comportamiento en móvil (3-up reducido con peek). El resto del sitio no cambia.

---

## Principios

- **Pointer Events** unifica mouse, touch y pen — un solo handler.
- **CSS hace la animación**, JS solo cambia clases (`is-prev`, `is-active`, `is-next`). El drag suspende temporalmente la transición para seguir al dedo.
- **Loop infinito sin clonar nodos** — solo hay 3 cards, las clases se reasignan cíclicamente.
- **No rompe accesibilidad**: keyboard, ARIA labels, foco visible, `prefers-reduced-motion` desactiva las transiciones.
- **Coordinado con la animación de entrada existente** — el carrusel solo se "arma" cuando el academyTimeline termina su reveal.

---

## Estructura HTML

Cambio en `index.html` — la `<a>` actual no permite drag confiable, así que cada card pasa a `<article>` y el link va al CTA interno:

```html
<section class="section disciplines" id="academy">
  <div class="container">
    <header class="section-head reveal">…</header>

    <div class="disc-carousel reveal" data-disc-carousel>
      <div class="disc-track">
        <article class="disc-card" data-disc-index="0">
          <div class="disc-bg" style="background-image:url('assets/images/gimnasio-1.webp');"></div>
          <div class="disc-num">/ 01</div>
          <div>
            <div class="eyebrow" data-i18n="disc.k1.kicker">Stand-up striking</div>
            <h3 class="disc-title" data-i18n="disc.k1.name">K1 Kickboxing</h3>
            <p class="disc-desc" data-i18n="disc.k1.desc">…</p>
            <a href="#schedule" class="disc-link" tabindex="-1">
              <span data-i18n="disc.k1.cta">Conocer la clase</span>
              <i class="ph ph-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </article>

        <article class="disc-card" data-disc-index="1">…Muay Thai…</article>
        <article class="disc-card gold" data-disc-index="2">…MMA & Wrestling…</article>
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

Notas:
- `tabindex="-1"` en `.disc-link` mientras la card no es la activa (JS lo gestiona) para que el tab no salte a links escondidos.
- `data-disc-index` se conserva como identidad del card; el carrusel asigna `.is-prev/.is-active/.is-next` según el índice activo.

---

## CSS

Reemplazar las reglas actuales de `.disc-grid` y de `.disc-card` (estructura), conservando los estilos internos (`.disc-num`, `.disc-bg`, `.disc-title`, `.disc-desc`, `.disc-link`, `::before`, `::after`).

```css
/* Contenedor */
.disc-carousel {
  position: relative;
  height: 560px;             /* desktop */
  margin-top: 2.5rem;
  overflow: hidden;          /* las laterales asoman pero no desbordan la sección */
  perspective: 1200px;
  user-select: none;
  touch-action: pan-y;       /* permite scroll vertical pero captura horizontal */
}

.disc-track {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Card base — todas absolutas, centradas */
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
  cursor: pointer;
  opacity: 0;                /* arranca invisible; las clases is-* las muestran */
  transform: translateX(0) scale(0.75);
  filter: blur(4px);
  transition:
    transform 600ms cubic-bezier(.2,.7,.2,1),
    opacity 500ms ease,
    filter 500ms ease;
  will-change: transform, opacity, filter;
}

/* Posiciones */
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

/* Mientras se arrastra, suspendemos la transición */
.disc-carousel.is-dragging .disc-card {
  transition: none;
}

/* Flechas */
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

/* Móvil — peek más cerrado, altura menor */
@media (max-width: 800px) {
  .disc-carousel { height: 460px; }
  .disc-card { width: min(320px, 75vw); margin-left: calc(min(320px, 75vw) * -0.5); }
  .disc-card.is-prev  { transform: translateX(-65%) scale(0.7); }
  .disc-card.is-next  { transform: translateX(65%)  scale(0.7); }
  .disc-arrow { width: 40px; height: 40px; }
}

@media (max-width: 480px) {
  .disc-carousel { height: 420px; }
  .disc-card { width: 78vw; margin-left: -39vw; }
  .disc-arrow-prev { left: 0.25rem; }
  .disc-arrow-next { right: 0.25rem; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .disc-card { transition: opacity 200ms ease; filter: none; }
  .disc-card.is-prev, .disc-card.is-next { filter: none; }
}
```

**Reglas existentes a remover** del bloque actual de `.disc-grid`/`.disc-card`:
- `.disc-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; ... }`
- `.disc-card { min-height: 520px; border-right: ...; }` (lo reemplazamos arriba)
- `.disc-card:last-child { border-right: 0; }` (ya no aplica)
- En el bloque `@media (max-width: 1024px)`: las reglas que apilan cards verticalmente (`border-bottom`, `border-right: 0`, `min-height: 400px`) — ya no aplicamos stack.

**Reglas existentes a conservar:**
- `.disc-bg`, `.disc-card::before`, `.disc-card::after` (overlays)
- `.disc-card.gold::after` (variante MMA dorada)
- `.disc-num`, `.disc-title`, `.disc-desc`, `.disc-link` (contenido interno)
- Los `:hover` internos (`.disc-card:hover .disc-bg`, `.disc-card:hover .disc-link`) siguen funcionando.

---

## Controlador JS — `assets/js/carousel.js`

Nuevo archivo IIFE. Cargado en `index.html` después de `animations.js`.

```js
(function () {
  'use strict';

  var DRAG_THRESHOLD_PX = 80;   // distancia mínima para considerar swipe
  var CLICK_THRESHOLD_PX = 8;   // movimiento máximo para que sea click, no drag

  function init(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll('.disc-card'));
    if (cards.length < 2) return;

    var active = 0;                    // índice activo
    var n = cards.length;
    var startX = 0, currentX = 0, dragging = false, didDrag = false;

    function indexOfPos(pos /* -1 prev, 0 active, 1 next */) {
      return ((active + pos) % n + n) % n;
    }

    function apply() {
      cards.forEach(function (c, i) {
        c.classList.remove('is-prev', 'is-active', 'is-next');
        c.style.transform = '';        // limpia translate de drag en vivo
        if (i === active)            c.classList.add('is-active');
        else if (i === indexOfPos(-1)) c.classList.add('is-prev');
        else if (i === indexOfPos(1))  c.classList.add('is-next');
        // links: solo el activo es tabulable
        var link = c.querySelector('.disc-link');
        if (link) link.setAttribute('tabindex', i === active ? '0' : '-1');
      });
    }

    function goTo(delta) {
      active = ((active + delta) % n + n) % n;
      apply();
    }

    // Pointer drag
    function onPointerDown(e) {
      // ignorar clicks en flechas
      if (e.target.closest('.disc-arrow')) return;
      dragging = true; didDrag = false;
      startX = e.clientX; currentX = e.clientX;
      root.classList.add('is-dragging');
      root.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e) {
      if (!dragging) return;
      currentX = e.clientX;
      var dx = currentX - startX;
      if (Math.abs(dx) > CLICK_THRESHOLD_PX) didDrag = true;
      // mover solo la card activa visualmente
      var activeEl = cards[active];
      activeEl.style.transform = 'translateX(' + dx + 'px) scale(1)';
    }
    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      var dx = currentX - startX;
      if (dx <= -DRAG_THRESHOLD_PX) goTo(1);
      else if (dx >= DRAG_THRESHOLD_PX) goTo(-1);
      else apply();                    // snap back
    }

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);

    // Click en lateral
    cards.forEach(function (c, i) {
      c.addEventListener('click', function (ev) {
        if (didDrag) { ev.preventDefault(); return; }
        if (c.classList.contains('is-prev'))  { ev.preventDefault(); goTo(-1); }
        else if (c.classList.contains('is-next')) { ev.preventDefault(); goTo(1); }
        // si es active, dejamos pasar el click al .disc-link (link interno)
      });
    });

    // Flechas
    var prevBtn = root.querySelector('.disc-arrow-prev');
    var nextBtn = root.querySelector('.disc-arrow-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(1); });

    // Keyboard
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(1); }
    });

    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var roots = document.querySelectorAll('[data-disc-carousel]');
    Array.prototype.forEach.call(roots, init);
  });
})();
```

---

## Coordinación con la animación de entrada

`animations.js` ya anima la entrada de las cards (translateY 60px + scale + stagger). Cambio mínimo en `academyTimeline()`:

- Las cards arrancan con `opacity: 0` desde `initAcademyState()` (ya pasa hoy).
- El timeline anima `translateY/scale/opacity` como ahora.
- Al final del timeline (`onComplete`), removemos las inline-styles de transform que dejó anime.js para que las clases CSS (`is-prev`, `is-active`, `is-next`) tomen control sin pelearse.
- El carrusel se inicializa al DOMContentLoaded, pero las clases `is-*` se aplican en ese mismo momento. Para que la entrada vertical funcione, **agregamos al `init`** del carrusel un check: si la card tiene `opacity: 0` inline (puesta por `initAcademyState`), esperamos a que el timeline termine — `apply()` se llama después del `onComplete` del timeline.

Implementación práctica: expongo `window.__bfcCarouselReady = function(){ ... }` desde carousel.js o, más simple, en `academyTimeline()` después del `tl.add(cards, ...)` agrego `tl.call(function(){ root.dispatchEvent(new CustomEvent('disc:ready')); })` y carousel.js escucha ese evento antes de llamar `apply()` la primera vez. Si por algún motivo el evento no llega en 2000ms, el carrusel se inicializa igual (fallback timeout).

---

## Carga del script

En `index.html`, agregar después de `animations.js`:

```html
<script src="assets/js/carousel.js?v=1"></script>
```

---

## Lo que NO cambia

- El resto de las secciones del sitio.
- Los textos, imágenes y links de las 3 modalidades.
- Las animaciones de entrada de otras secciones.
- El comportamiento de la página sin JS: las 3 cards quedan apiladas verticalmente (fallback CSS — agregamos `.no-js .disc-carousel { display: block; height: auto; } .no-js .disc-card { position: static; opacity: 1; transform: none; filter: none; margin: 0 auto 1rem; }` si decidimos soportar no-JS; si no, los `<article>` quedan visibles aunque solapados — pero el sitio ya depende de JS para Supabase/i18n, así que no es un requisito fuerte).

---

## Criterios de aceptación

- [ ] Al entrar a la sección, las 3 cards aparecen con la animación actual y luego una queda al centro grande, las otras dos a los costados reducidas y borrosas.
- [ ] Click en una card lateral la rota al centro con transición suave.
- [ ] Drag con mouse de la card central rota next/prev si supera 80px; vuelve si no.
- [ ] Las flechas ‹ › navegan prev/next.
- [ ] Las teclas ← → navegan cuando el carrusel tiene foco.
- [ ] En móvil, swipe horizontal rota el carrusel; scroll vertical sigue funcionando.
- [ ] La card activa conserva su link a `#schedule` o `#tapa`.
- [ ] El loop es infinito: avanzar 3 veces vuelve al estado inicial.
- [ ] `prefers-reduced-motion`: sin transiciones de scale/blur, solo opacity rápida.
- [ ] Keyboard: tab solo entra al link de la card activa, no a links escondidos.
