/* =====================================================
   BFC — Eventos de conversión para GA4
   Mide clics a WhatsApp, Instagram y Google Maps en todo el sitio.
   Delegado en document: también cubre links que agrega JS (tienda, formularios).
   ===================================================== */
(function () {
  'use strict';

  function lineFor(href) {
    if (href.indexOf('5492615710531') !== -1) return 'k1_muay_thai';
    if (href.indexOf('5492614671743') !== -1) return 'mma_wrestling';
    return 'otra';
  }

  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    params.page_path = location.pathname;
    params.transport_type = 'beacon';
    window.gtag('event', name, params);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href || '';
    var label = (a.textContent || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);

    var dlg = document.getElementById('waDialog');
    if (a.hasAttribute('data-wa-choose') && dlg && typeof dlg.showModal === 'function') {
      /* Abre el selector de línea (wa-chooser.js); el clic real a WhatsApp se mide en la opción elegida */
      send('whatsapp_chooser_open', { link_text: label });
    } else if (/wa\.me\/|api\.whatsapp\.com/.test(href)) {
      send('whatsapp_click', { linea: lineFor(href), link_text: label });
    } else if (/instagram\.com/.test(href)) {
      send('instagram_click', { link_url: href, link_text: label });
    } else if (/maps\.google\.|google\.com\/maps/.test(href)) {
      send('maps_click', { link_text: label });
    }
  }, true);

  /* El formulario de contacto abre WhatsApp con window.open (no es un clic en <a>) */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.id !== 'contactForm') return;
    var name = f.elements.name && f.elements.name.value.trim();
    var age  = f.elements.age && f.elements.age.value.trim();
    if (!name || !age) return; /* main.js no abre WhatsApp si faltan datos */
    var mod = f.elements.modality && f.elements.modality.value;
    send('whatsapp_click', { linea: mod === 'MMA / Wrestling' ? 'mma_wrestling' : 'k1_muay_thai', link_text: 'formulario de contacto' });
  }, true);
})();
