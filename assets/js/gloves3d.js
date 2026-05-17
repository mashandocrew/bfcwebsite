/* =====================================================
   BFC — GLOVES3D.JS
   Three.js scene: boxing_gloves.glb como fondo de sección.
   Rotación en Y impulsada por scroll (arriba/abajo).
   ===================================================== */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  'use strict';

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wrap = document.querySelector('[data-gloves-canvas]');
  if (!wrap) return;
  const canvas = wrap.querySelector('.gloves-canvas');
  if (!canvas) return;

  function hideCanvas() {
    wrap.classList.add('is-hidden');
  }

  // ── Renderer ──────────────────────────────────────────
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    hideCanvas();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ── Escena ────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 3.8);

  // Iluminación dramática: ambiente rojo tenue + key roja + rim blanco
  scene.add(new THREE.AmbientLight(0x3a0508, 2.0));

  const redKey = new THREE.DirectionalLight(0xc8102e, 2.5);
  redKey.position.set(2, 3, 2);
  scene.add(redKey);

  const whiteRim = new THREE.DirectionalLight(0xffffff, 0.6);
  whiteRim.position.set(-3, 1, 1);
  scene.add(whiteRim);

  const redFill = new THREE.DirectionalLight(0x6b0000, 0.9);
  redFill.position.set(0, -2, -2);
  scene.add(redFill);

  // ── Grupo del modelo ──────────────────────────────────
  const group = new THREE.Group();
  scene.add(group);

  // ── Carga del .glb ────────────────────────────────────
  let modelLoaded = false;
  const loader = new GLTFLoader();
  loader.load(
    'assets/models/boxing_gloves.glb',
    function (gltf) {
      const model = gltf.scene;

      // Centrar y escalar el modelo para que llene bien el frame
      const box    = new THREE.Box3().setFromObject(model);
      const size   = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale  = 2.4 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      group.add(model);
      modelLoaded = true;
      renderer.render(scene, camera);
    },
    undefined,
    function (err) {
      console.warn('[BFC] boxing_gloves.glb no pudo cargarse:', err);
      hideCanvas();
    }
  );

  // ── Resize ────────────────────────────────────────────
  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  let resizePending = false;
  window.addEventListener('resize', function () {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(function () { resize(); resizePending = false; });
  }, { passive: true });

  // ── Scroll-driven rotation ────────────────────────────
  // scrollVelocity acumula el delta de scroll y decae por fricción cada frame.
  // Scroll hacia abajo → velocidad positiva (gira a la derecha).
  // Scroll hacia arriba → velocidad negativa (gira a la izquierda).
  let lastScrollY    = window.scrollY;
  let scrollVelocity = 0;
  let autoAngle      = 0;

  window.addEventListener('scroll', function () {
    const current = window.scrollY;
    scrollVelocity += (current - lastScrollY) * 0.004;
    lastScrollY = current;
  }, { passive: true });

  // ── Intersection Observer: pausar render fuera de pantalla ──
  let running = false;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!running && !reducedMotion) { running = true; tick(); }
      } else {
        running = false;
      }
    });
  }, { threshold: 0 });
  io.observe(wrap);

  // ── Loop de render ────────────────────────────────────
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);

    if (modelLoaded) {
      // Fricción: la velocidad de scroll decae ~12% por frame
      scrollVelocity *= 0.88;

      // Auto-rotación base + impulso del scroll
      autoAngle      += 0.003 + scrollVelocity;
      group.rotation.y = autoAngle;

      // Leve tilt en X según posición dentro del viewport (paralaje suave)
      const rect     = wrap.getBoundingClientRect();
      const vh       = window.innerHeight;
      const progress = 1 - Math.min(1, Math.max(0, rect.bottom / (vh + rect.height)));
      group.rotation.x = (progress - 0.5) * 0.25;
    }

    renderer.render(scene, camera);
  }

  // Para prefers-reduced-motion: renderizar un frame estático al cargar el modelo
  if (reducedMotion) {
    const waitId = setInterval(function () {
      if (!modelLoaded) return;
      clearInterval(waitId);
      resize();
      renderer.render(scene, camera);
    }, 100);
    setTimeout(function () { clearInterval(waitId); }, 6000);
  }

})();
