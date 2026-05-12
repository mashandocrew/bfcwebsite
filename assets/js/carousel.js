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
