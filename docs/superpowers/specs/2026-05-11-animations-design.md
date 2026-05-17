# BFC Animations — Design Spec
**Fecha:** 2026-05-11  
**Estado:** Aprobado

---

## Resumen

Agregar un sistema de animaciones premium a 6 secciones del sitio Bonati Fight Club usando anime.js v4 (ya instalado vía CDN). El sistema vive en un archivo nuevo `assets/js/animations.js`, respeta los colores y fuentes del design system existente, y se desactiva limpiamente con `prefers-reduced-motion`.

---

## Principios de diseño

- **Sutil y elegante** — sin partículas, sin glitch. Entradas suaves con easing expo.
- **Timeless premium** — estilo editorial/Apple: elementos que revelan al hacer scroll, stagger cuidadoso.
- **Easing estándar:** `easeOutExpo` para todas las entradas. `spring` solo para badges/scale.
- **Stagger:** 80–120ms entre elementos del mismo grupo. 50ms para grids de fotos.
- **Duración base:** 800–1000ms por elemento individual.
- **prefers-reduced-motion:** si activo, elementos aparecen sin transición (opacity seteada a 1 instantáneo).
- **Sin JS = sin romper:** los elementos arrancan visibles en CSS; anime.js los oculta (`opacity: 0`) al init antes de animarlos. Si JS falla, el contenido sigue visible.

---

## Archivo nuevo: `assets/js/animations.js`

IIFE autoejecutado, cargado después de `main.js` en `index.html`.

Estructura interna:

```
animations.js
├── prefersReducedMotion check
├── heroSequence()          — timeline de entrada al cargar (DOMContentLoaded)
├── initScrollAnimations()  — IntersectionObserver para S3, S4, S7, S8, S9
│   ├── academyTimeline()
│   ├── championsTimeline()
│   ├── scheduleTimeline()
│   ├── tapaTimeline()
│   └── communityTimeline()
└── observeSection(el, callback)  — helper: dispara callback una vez al entrar en viewport
```

---

## Hero bottom fade (CSS only)

**Elemento nuevo:** `<div class="hero-fade-bottom" aria-hidden="true">` dentro de `.hero`, después de `.hero-mask`.

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

Se superpone sobre `.hero-mask` (z-index 1) para una fusión más contundente hacia la sección de contadores.

---

## Sección 1 — Hero

**Trigger:** `DOMContentLoaded` (sin IntersectionObserver, es la primera sección).

**CSS a cambiar:**  
Deshabilitar las `animation` CSS hardcodeadas en `.hero-title .line > span`, `.hero-sub`, `.hero-ctas`, `.hero-side`, `.hero-location`, `.hero-tag`. Reemplazarlas por `opacity: 0` inicial vía JS.

**Timeline:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.nav` | `translateY(-100% → 0)`, `opacity 0→1`, dur 600ms |
| 200ms  | `.hero-title .line:nth-child(1) > span` | `translateY(110% → 0)`, dur 900ms |
| 400ms  | `.hero-title .line:nth-child(2) > span` | ídem, color ya es `var(--bfc-red)` via CSS |
| 600ms  | `.hero-title .line:nth-child(3) > span` | ídem |
| 900ms  | `.hero-sub` | `translateY(20px → 0)`, `opacity 0→1`, `blur 8px→0`, dur 800ms |
| 1100ms | `.hero-ctas .btn` | stagger 120ms, `translateY(16px → 0)`, `opacity 0→1` |
| 1400ms | `.hero-side` | `opacity 0→1`, `translateY(10px → 0)` |

---

## Sección 3 — Academia (Disciplinas)

**Trigger:** IntersectionObserver en `section.disciplines`, threshold 0.15.

**Timeline:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.eyebrow` (header) | `opacity 0→1`, `translateX(-10px → 0)` |
| 100ms  | `h2.hl` | `translateY(40px → 0)`, `opacity 0→1` |
| 250ms  | `p` (lead) | `translateY(20px → 0)`, `opacity 0→1` |
| 400ms  | `.disc-card` × 3 | stagger 120ms, `translateY(60px → 0)`, `scale 0.96→1`, `opacity 0→1` |

---

## Sección 4 — Champions

**Trigger:** IntersectionObserver en `section.champions`, threshold 0.2.

**Timeline:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.eyebrow` | `opacity 0→1`, `translateY(16px → 0)` |
| 150ms  | `.word` spans de la quote | stagger 80ms por palabra, `translateY(20px → 0)`, `blur 6px→0`, `opacity 0→1` |
| auto   | `.champions-name` | `opacity 0→1`, `translateY(16px → 0)` después de última palabra |
| +200ms | `.titles` items | stagger 100ms, `scale 0→1`, easing `spring(1, 80, 10, 0)` |

> La lógica word-by-word existente en `main.js` (mountChampionQuote) produce los `.word` spans. `animations.js` los anima con anime.js en lugar de CSS `animation-delay` inline.

---

## Sección 7 — Horarios

**Trigger:** IntersectionObserver en `section.schedule`, threshold 0.1.

**Timeline:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.section-head` children | stagger 100ms (`eyebrow`, `h2`, `p`) |
| 300ms  | `.fight-card` × 2 | stagger 150ms, `translateY(50px → 0)`, `opacity 0→1` |
| dentro de cada card | `.fc-slot` items | stagger 60ms dentro de cada card, `translateX(-8px → 0)`, `opacity 0→1` — efecto "filas de tabla cargando" |
| final  | botón WhatsApp | `opacity 0→1`, `translateY(12px → 0)` |

---

## Sección 8 — Tapa Team

**Trigger:** IntersectionObserver en `section.tapa`, threshold 0.15.

**Columna izquierda (`.tapa-copy`) y derecha (`.tapa-media`) corren en paralelo:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.eyebrow.gold` | `opacity 0→1`, `translateY(16px → 0)` |
| 120ms  | `.tt-title` | `translateY(50px → 0)`, `opacity 0→1` |
| 260ms  | `p` (lead) | `translateY(20px → 0)`, `opacity 0→1` |
| 380ms  | `.tt-stat` × 3 | stagger 100ms, `translateY(16px → 0)`, `opacity 0→1` |
| 600ms  | `.tapa-ctas .btn` | stagger 100ms, `translateY(12px → 0)`, `opacity 0→1` |
| 0ms    | `.tapa-media` | `translateX(60px → 0)`, `opacity 0→1`, dur 1000ms |

---

## Sección 9 — Comunidad

**Trigger:** IntersectionObserver en `section.community`, threshold 0.1.

**Timeline:**

| Delay  | Elemento | Animación |
|--------|----------|-----------|
| 0ms    | `.section-head` children | stagger 100ms |
| 300ms  | `.comm-grid` items (fotos) | stagger 50ms, `scale 0.9→1`, `opacity 0→1`, dur 500ms |
| final  | `.comm-filters`, botones | `opacity 0→1`, `translateY(12px → 0)` |

> Las fotos se cargan dinámicamente desde Supabase (insertadas por `renderGrid()` en `community.js` sin evento custom). `animations.js` usa un `MutationObserver` sobre `#commGrid` para detectar cuando se insertan los `.comm-item` y animarlos con stagger. El IntersectionObserver del header de la sección se dispara normalmente.

---

## Cambios en archivos existentes

| Archivo | Cambio |
|---------|--------|
| `index.html` | Agregar `<div class="hero-fade-bottom">` en `.hero`; agregar `<script src="assets/js/animations.js?v=1">` después de `reviews.js` |
| `assets/css/main.css` | Agregar `.hero-fade-bottom` styles; **no remover** los `@keyframes` existentes (otros elementos los usan) |
| `assets/css/animations.css` | Comentar/remover `animation:` de `.hero-title .line > span`, `.hero-sub`, `.hero-ctas`, `.hero-side` — anime.js los reemplaza |
| `assets/js/animations.js` | **Nuevo archivo** |

---

## Lo que NO cambia

- Colores: `#0A0A0A`, `#C8102E`, `#D4A017`, `#F5F0E8`
- Tipografías: Bebas Neue + Outfit
- Video del hero: sin cambios
- Lógica de negocio: WhatsApp, Supabase, i18n — intactos
- Secciones 2 (Counters), 5 (Historia), 6 (Profesores), 10 (Reseñas), 11 (Contacto) — sin animaciones nuevas

---

## Criterios de aceptación

- [ ] Al cargar la página, el hero se anima en secuencia sin saltos
- [ ] El hero tiene fade a negro en la parte inferior
- [ ] Cada sección animada revela sus elementos al hacer scroll con stagger visible
- [ ] Sin JS o con reduced-motion, todo el contenido es visible
- [ ] No hay elementos que queden en `opacity: 0` si la animación falla
- [ ] El video del hero sigue igual
