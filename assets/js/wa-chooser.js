/* =====================================================
   BFC — Selector de línea de WhatsApp
   Los botones genéricos (data-wa-choose) abren un diálogo para elegir
   K1 / Muay Thai (Walter) o MMA / Wrestling (Tapa Team).
   Sin soporte de <dialog>, el enlace sigue yendo a la línea de K1.
   ===================================================== */
(function () {
  'use strict';
  var dialog = document.getElementById('waDialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  document.addEventListener('click', function (e) {
    var opener = e.target.closest && e.target.closest('[data-wa-choose]');
    if (!opener) return;
    e.preventDefault();
    dialog.showModal();
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.closest('[data-wa-close]')) {
      dialog.close();
    } else if (e.target.closest('.wa-option')) {
      setTimeout(function () { dialog.close(); }, 150);
    }
  });
})();
