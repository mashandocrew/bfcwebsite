/* =====================================================
   BFC — GLOVES3D.JS  v3
   Modelo embebido como base64 en gloves-model.js.
   Sin XHR, funciona con file:// sin servidor.
   ===================================================== */
(function () {
  'use strict';

  var T = window.THREE;
  if (!T)               { console.warn('BFC: three.js no cargó');    return; }
  if (!T.GLTFLoader)    { console.warn('BFC: GLTFLoader no cargó');  return; }
  if (!window.BFC_GLOVES_GLB) { console.warn('BFC: gloves-model.js no cargó'); return; }

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.querySelector('[data-gloves-canvas]');
  if (!canvas) return;
  var section = canvas.closest('.gloves');
  if (!section) return;

  function hideCanvas() {
    canvas.classList.add('is-hidden');
    var ov = section.querySelector('.gloves-overlay');
    if (ov) ov.style.display = 'none';
  }

  /* -------- Renderer -------- */
  var renderer;
  try {
    renderer = new T.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) { hideCanvas(); return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding      = T.sRGBEncoding;
  renderer.toneMapping         = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  /* -------- Scene + Camera -------- */
  var scene  = new T.Scene();
  var camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
  var CAM    = { x: -0.4, y: 0.15, z: 5.0 };
  camera.position.set(CAM.x, CAM.y, CAM.z);
  camera.lookAt(0.6, 0, 0);

  /* -------- Lights -------- */
  scene.add(new T.AmbientLight(0x100308, 2.5));

  var redKey = new T.DirectionalLight(0xff2040, 4.0);
  redKey.position.set(4, 3, 3);
  scene.add(redKey);

  var rimLight = new T.DirectionalLight(0xffe0cc, 1.0);
  rimLight.position.set(-5, 2, -2);
  scene.add(rimLight);

  var fillLow = new T.DirectionalLight(0x8e0c20, 1.4);
  fillLow.position.set(0, -4, 2);
  scene.add(fillLow);

  var accent = new T.PointLight(0xe61b3a, 22, 14, 2);
  accent.position.set(2.5, 0.5, 1.5);
  scene.add(accent);

  /* -------- Model group (desplazado a la derecha) -------- */
  var group = new T.Group();
  group.position.set(1.2, -0.1, 0);
  scene.add(group);

  var modelLoaded = false;

  /* Convierte base64 → ArrayBuffer sin XHR */
  function b64ToBuffer(b64) {
    var bin = atob(b64);
    var buf = new ArrayBuffer(bin.length);
    var u8  = new Uint8Array(buf);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return buf;
  }

  var loader = new T.GLTFLoader();
  var glbBuffer = b64ToBuffer(window.BFC_GLOVES_GLB);

  loader.parse(
    glbBuffer,
    '',
    function (gltf) {
      var model = gltf.scene;

      /* Afinar materiales PBR */
      model.traverse(function (obj) {
        if (!obj.isMesh) return;
        var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(function (m) {
          if (!m) return;
          if ('roughness' in m) m.roughness = Math.max(0.3, Math.min(0.7, m.roughness != null ? m.roughness : 0.55));
          if ('metalness' in m) m.metalness = Math.min(0.15, m.metalness != null ? m.metalness : 0);
          m.needsUpdate = true;
        });
      });

      /* Auto-fit → escala 3.4 */
      var box3 = new T.Box3().setFromObject(model);
      var sz   = new T.Vector3(); box3.getSize(sz);
      var ct   = new T.Vector3(); box3.getCenter(ct);
      var sc   = 3.4 / Math.max(sz.x, sz.y, sz.z);
      model.scale.setScalar(sc);
      model.position.sub(ct.multiplyScalar(sc));

      group.add(model);
      modelLoaded = true;
      renderer.render(scene, camera);
    },
    function (err) {
      console.warn('BFC: parse GLB falló:', err);
      hideCanvas();
    }
  );

  /* -------- Resize -------- */
  function resize() {
    var w = section.clientWidth;
    var h = section.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  var rPend = false;
  window.addEventListener('resize', function () {
    if (rPend) return;
    rPend = true;
    requestAnimationFrame(function () { resize(); rPend = false; });
  });

  /* -------- Scroll → rotación Y -------- */
  var targetRotY  = 0;
  var currentRotY = 0;
  var lastSY = window.scrollY;

  window.addEventListener('scroll', function () {
    var sy = window.scrollY;
    targetRotY += (sy - lastSY) * 0.0045;
    lastSY = sy;
  }, { passive: true });

  /* -------- Mouse parallax -------- */
  var mTX = 0, mTY = 0, mCX = 0, mCY = 0;

  window.addEventListener('mousemove', function (e) {
    var r = section.getBoundingClientRect();
    if (e.clientY < r.top - 200 || e.clientY > r.bottom + 200) return;
    mTX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    mTY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  }, { passive: true });

  section.addEventListener('mouseleave', function () { mTX = 0; mTY = 0; });

  /* -------- IntersectionObserver → gate del loop -------- */
  var running = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var was = running;
      running = en.isIntersecting;
      if (running && !was && !reducedMotion) tick();
    });
  }, { threshold: 0 });
  io.observe(canvas);

  var clock  = 0;
  var baseRY = -0.35;

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    clock += 0.01;

    currentRotY += (targetRotY - currentRotY) * 0.07;
    mCX += (mTX - mCX) * 0.06;
    mCY += (mTY - mCY) * 0.06;

    if (modelLoaded) {
      group.rotation.y = baseRY + currentRotY + mCX * 0.25;
      group.rotation.x = Math.sin(clock * 0.8) * 0.05 + mCY * -0.18;
      group.position.y = -0.1 + Math.sin(clock * 0.9) * 0.05;
    }

    camera.position.x = CAM.x + mCX * 0.25;
    camera.position.y = CAM.y - mCY * 0.18;
    camera.lookAt(0.6, 0, 0);

    renderer.render(scene, camera);
  }

  /* Frame estático si reduce-motion */
  if (reducedMotion) {
    var chk = setInterval(function () {
      if (modelLoaded) { renderer.render(scene, camera); clearInterval(chk); }
    }, 100);
  }
})();
