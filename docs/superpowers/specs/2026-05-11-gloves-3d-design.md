# 3D Gloves Section — Design Spec
**Fecha:** 2026-05-11
**Estado:** Aprobado

---

## Resumen

Agregar una sección nueva entre Champions (S4) y Schedule (S7) que muestra los guantes de boxeo (`assets/models/boxing_gloves.glb`) en una escena Three.js. Canvas a la izquierda, texto a la derecha. Iluminación dominante rojo tenue + key light blanca para definir contorno. Reacciona al mouse (tilt) y al scroll (parallax). En móvil, stack vertical con canvas arriba. El hero no se modifica.

---

## Principios

- **No tocar el hero.**
- **Sin número** en el eyebrow (no rompe la numeración existente de las otras secciones).
- **Performance primero:** render loop solo activo dentro del viewport. DPR clampado a 2. Fallback a imagen estática si falla WebGL o el modelo.
- **Sin frameworks adicionales:** three.js vía importmap CDN. No bundler. Mismo estilo del resto del sitio.
- **Reduced motion:** sin rotación autopilot ni parallax — el modelo se ve estático.

---

## Estructura HTML

Insertar **entre** `</section>` de Champions y `<section class="section history" id="history">`:

```html
<!-- =========================
     GLOVES 3D
     ========================= -->
<section class="section gloves" id="gloves">
  <div class="container">
    <div class="gloves-grid">
      <div class="gloves-canvas-wrap reveal" data-gloves-canvas>
        <canvas class="gloves-canvas" aria-hidden="true"></canvas>
      </div>
      <div class="gloves-copy reveal">
        <span class="eyebrow"><span data-i18n="gloves.eyebrow">Forjados en el ring</span></span>
        <h2 class="hl" data-i18n="gloves.title">Cada golpe cuenta.</h2>
        <p data-i18n="gloves.desc">Disciplina, técnica y voluntad. Cada entrenamiento te acerca al próximo combate.</p>
      </div>
    </div>
  </div>
</section>
```

Sin fallback de imagen: si WebGL falla o el modelo no carga, `gloves3d.js` oculta el contenedor entero (`.gloves-canvas-wrap`) y el grid colapsa a una sola columna con solo el texto. Sin pixeles rotos.

---

## CSS

Agregar al final de `assets/css/main.css` (antes del bloque `@media (prefers-reduced-motion: reduce)` final, o en cualquier lugar de la zona de secciones):

```css
/* ---------- GLOVES 3D ---------- */
.gloves {
  background: var(--bfc-black);
  position: relative;
  overflow: hidden;
}
.gloves-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 70vh;
}
.gloves-canvas-wrap {
  position: relative;
  width: 100%;
  height: 520px;
  border: var(--border-hair);
  background: radial-gradient(ellipse at center, rgba(40,0,8,0.4) 0%, rgba(10,10,10,1) 70%);
  overflow: hidden;
}
.gloves-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.gloves-canvas-wrap.is-hidden { display: none; }
.gloves-grid.is-text-only { grid-template-columns: 1fr; }
.gloves-copy .eyebrow { margin-bottom: 1rem; }
.gloves-copy .hl {
  font-family: var(--ff-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: var(--bfc-bone);
  text-transform: uppercase;
}
.gloves-copy p {
  margin-top: 1.2rem;
  max-width: 42ch;
  color: var(--bfc-bone-dim);
  font-size: var(--fs-md);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .gloves-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    min-height: 0;
  }
  .gloves-canvas-wrap { height: 60vh; min-height: 380px; }
}

@media (max-width: 640px) {
  .gloves-canvas-wrap { height: 50vh; min-height: 320px; }
  .gloves-copy .hl { font-size: clamp(2rem, 9vw, 3rem); }
}

@media (prefers-reduced-motion: reduce) {
  /* JS detecta esto y desactiva loop / mouse / parallax — sin reglas extra acá */
}
```

---

## JS — `assets/js/gloves3d.js` (módulo ES)

Importa three.js desde un importmap declarado en `index.html`. Estructura:

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  'use strict';
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wrap = document.querySelector('[data-gloves-canvas]');
  if (!wrap) return;
  const canvas = wrap.querySelector('.gloves-canvas');

  function hideCanvas() {
    wrap.classList.add('is-hidden');
    const grid = wrap.closest('.gloves-grid');
    if (grid) grid.classList.add('is-text-only');
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    hideCanvas();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4);

  // Luz ambiental roja tenue (ambiance dominante)
  scene.add(new THREE.AmbientLight(0x4a0a14, 1.2));

  // Direccional roja desde arriba — refuerza el rojo dominante
  const redKey = new THREE.DirectionalLight(0xc8102e, 1.4);
  redKey.position.set(2, 3, 2);
  scene.add(redKey);

  // Key light blanca lateral — define el contorno del modelo
  const whiteRim = new THREE.DirectionalLight(0xffffff, 0.6);
  whiteRim.position.set(-3, 1, 1.5);
  scene.add(whiteRim);

  // Modelo
  const group = new THREE.Group();
  scene.add(group);

  const loader = new GLTFLoader();
  let modelLoaded = false;
  loader.load(
    'assets/models/boxing_gloves.glb',
    (gltf) => {
      const model = gltf.scene;
      // Centro y escala automáticos
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.6 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      group.add(model);
      modelLoaded = true;
    },
    undefined,
    (err) => {
      console.warn('Gloves model failed to load', err);
      hideCanvas();
    }
  );

  // Resize (debounced via rAF)
  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  let resizePending = false;
  window.addEventListener('resize', () => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => { resize(); resizePending = false; });
  });

  // Mouse tilt
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;  // -1..1
    target.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  });
  wrap.addEventListener('mouseleave', () => { target.x = 0; target.y = 0; });

  // Scroll parallax (0 al entrar, 1 al salir por arriba)
  let scrollProgress = 0;
  function updateScrollProgress() {
    const r = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 cuando wrap top está en la base del viewport, 1 cuando wrap bottom está en la cima
    scrollProgress = 1 - Math.min(1, Math.max(0, (r.bottom) / (vh + r.height)));
  }

  // Render loop con on/off por viewport
  let running = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!running) { running = true; tick(); }
      } else {
        running = false;
      }
    });
  }, { threshold: 0 });
  io.observe(wrap);

  let autoY = 0;
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);

    if (modelLoaded) {
      if (!reducedMotion) {
        // Autopilot suave en Y
        autoY += 0.003;
        // Lerp del tilt hacia el target
        current.x += (target.y * 0.25 - current.x) * 0.08;
        current.y += (target.x * 0.35 - current.y) * 0.08;
        group.rotation.x = current.x;
        group.rotation.y = autoY + current.y;

        // Parallax con scroll
        updateScrollProgress();
        group.position.y = (0.5 - scrollProgress) * 0.4;
        camera.position.z = 4 - (0.5 - scrollProgress) * 0.5;
      }
    }
    renderer.render(scene, camera);
  }
})();
```

---

## importmap en `index.html`

Antes del primer `<script>` del sitio (puede ir en `<head>` o al principio del `<body>`):

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"
  }
}
</script>
```

Y antes de `</body>`, después de los otros `<script>`:

```html
<script type="module" src="assets/js/gloves3d.js?v=1"></script>
```

Nota: `type="module"` permite usar `import`. No interfiere con los otros scripts vanilla (IIFE) — corren todos.

---

## Integración con animations.js

Agregar en `animations.js` un `glovesTimeline()` análogo a los demás:

- `initGlovesState()` esconde `.gloves-copy .eyebrow`, `.gloves-copy h2`, `.gloves-copy p` con translateY 20–40px.
- `glovesTimeline()` los anima con fadeUp + stagger (eyebrow → h2 → p).
- `observeSection(document.querySelector('.gloves'), glovesTimeline, 0.15)` al final del DOMContentLoaded.

El canvas no se anima por anime.js — three.js arranca solo cuando el `IntersectionObserver` interno se dispara.

---

## Reduced motion

- El módulo lee `prefers-reduced-motion` al inicializar.
- Si está activo: NO autopilot, NO mouse tilt, NO parallax. Solo `renderer.render` una vez (frame estático con el modelo centrado).
- Implementación: dentro de `tick`, el bloque condicional `if (!reducedMotion) { ... }` salta toda la actualización de transform. El `renderer.render` se sigue llamando.
- Mejora: si reducedMotion, podemos hacer un solo render al cargar el modelo y matar el loop:
  ```js
  if (reducedMotion) { renderer.render(scene, camera); return; }
  ```
  Esto ahorra CPU en accesibilidad.

---

## Fallback

Sin fallback de imagen. Si WebGL no inicializa o el GLB no carga, el JS oculta `.gloves-canvas-wrap` (display: none) y agrega `.is-text-only` al grid para que colapse a una sola columna. La sección queda solo con el texto, sin pixeles rotos.

---

## Lo que NO cambia

- Hero, ninguna otra sección.
- Carrusel de modalidades.
- Lógica de Supabase, i18n, leads.
- Las otras animaciones (hero, academy, champions, schedule, tapa, community).
- El video del hero.

---

## Criterios de aceptación

- [ ] Aparece una sección nueva entre Champions y Historia con título "Cada golpe cuenta" y canvas con guantes 3D a la izquierda.
- [ ] El modelo carga, queda centrado y escalado a la altura del canvas.
- [ ] Mouse sobre el canvas: los guantes hacen tilt suave hacia el cursor.
- [ ] Sin mouse: los guantes rotan lento en Y.
- [ ] Al scrollear por la sección, hay un parallax sutil (modelo sube/baja, cámara acerca/aleja).
- [ ] Cuando la sección no está en viewport, no se renderea (no CPU spin).
- [ ] En móvil (<1024px) el layout es vertical: canvas arriba, texto abajo.
- [ ] `prefers-reduced-motion`: el modelo se ve estático, sin animación.
- [ ] Si WebGL no carga o el GLB falla, el canvas-wrap se oculta y la sección queda solo con texto a una columna (sin pixeles rotos).
- [ ] El hero, el carrusel y las otras secciones siguen funcionando igual.
