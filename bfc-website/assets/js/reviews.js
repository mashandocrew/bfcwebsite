/* BFC · MÓDULO 2 — Reseñas
   Fuentes en orden de prioridad:
   1. Google Places API  (cuando esté configurada)
   2. Supabase site_reviews
   3. Reseñas estáticas reales (siempre como respaldo)
*/
(function () {
  'use strict';

  /* ─── CONFIG ────────────────────────────────────
     Completar cuando tengas las credenciales.
     Mientras estén como 'TU_..._AQUI' esas fuentes se ignoran. */
  var SUPABASE_URL        = 'https://kmlobikkamhnzkmbtckg.supabase.co';
  var SUPABASE_KEY        = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbG9iaWtrYW1obnprbWJ0Y2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYyOTQsImV4cCI6MjA5MjQwMjI5NH0.yeN_hygM4q9tZIq4hst6-6SzeAf5mdLnTuWG-eLatts';
  var GOOGLE_PLACES_API_KEY = 'TU_API_KEY_AQUI';   /* ← pegar aquí */
  var GOOGLE_PLACE_ID       = 'TU_PLACE_ID_AQUI';  /* ← pegar aquí */

  var GOOGLE_READY = (
    GOOGLE_PLACES_API_KEY !== 'TU_API_KEY_AQUI' &&
    GOOGLE_PLACE_ID       !== 'TU_PLACE_ID_AQUI'
  );

  /* ─── RESEÑAS ESTÁTICAS REALES ──────────────────
     Siempre visibles. Se reemplazan por Supabase/Google
     cuando esas fuentes devuelven datos. */
  var STATIC_REVIEWS = [
    {
      nombre: 'Francisco Farjo',
      texto:  'Excelente academia, muy buena ubicación y un espacio amplio como pocas academias, además de muy buena predisposición del profesor y un ambiente de compañerismo muy presente la verdad que 10/10.',
      rating: 5, created_at: null, source: 'static'
    },
    {
      nombre: 'Pablo Badui',
      texto:  'Más que una academia una familia de luchadores, desde los nuevos hasta los profesionales entrenando a la par en el mismo tatami. El verdadero espíritu del guerrero.',
      rating: 5, created_at: null, source: 'static'
    },
    {
      nombre: 'Fernando Tabarelli',
      texto:  'Muy profesionales, se preocupan que cada alumno logre lo que se propuso al ingresar. Muy buen ambiente.',
      rating: 5, created_at: null, source: 'static'
    },
    {
      nombre: 'Fernando Vater',
      texto:  'Excelente atención, totalmente limpio y con constantes innovaciones y mejoras, clases personalizadas de alto nivel, el profe Walter Bonati un apasionado y 100% dedicado a sus alumnos.',
      rating: 5, created_at: null, source: 'static'
    }
  ];

  var sb            = null;
  var selectedRating = 0;

  /* ─── INIT ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async function () {
    renderReviews(STATIC_REVIEWS);   /* visible de inmediato */
    initStars();

    if (window.supabase) {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    initForm();

    /* Cargar fuentes dinámicas y actualizar la grilla */
    var reviews = await fetchAllReviews();
    if (reviews.length) renderReviews(reviews);

    /* Si Google está configurado, esperar que cargue el SDK */
    if (GOOGLE_READY) {
      if (window.google && window.google.maps) {
        var gReviews = await fetchGoogleReviews();
        if (gReviews.length) renderReviews(mergeReviews(await fetchSupabaseReviews(), gReviews));
      } else {
        document.addEventListener('bfc:google-ready', async function () {
          var gReviews = await fetchGoogleReviews();
          if (gReviews.length) renderReviews(mergeReviews(await fetchSupabaseReviews(), gReviews));
        }, { once: true });
      }
    }
  });

  /* ─── FETCH COORDINADO ──────────────────────────── */
  async function fetchAllReviews() {
    var sbReviews = await fetchSupabaseReviews();
    return sbReviews.length ? sbReviews : [];
  }

  /* ─── SUPABASE ──────────────────────────────────── */
  async function fetchSupabaseReviews() {
    if (!sb) return [];
    try {
      var res = await sb.from('site_reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeRow);
    } catch (e) {
      console.warn('[BFC:reviews] Supabase:', e.message);
      return [];
    }
  }

  /* ─── GOOGLE PLACES API ─────────────────────────── */
  async function fetchGoogleReviews() {
    if (!GOOGLE_READY) return [];
    if (!window.google || !window.google.maps || !window.google.maps.places) return [];
    return new Promise(function (resolve) {
      var dummy = document.createElement('div');
      var svc   = new google.maps.places.PlacesService(dummy);
      svc.getDetails(
        { placeId: GOOGLE_PLACE_ID, fields: ['reviews', 'rating', 'url'] },
        function (place, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !place.reviews) {
            resolve([]); return;
          }
          /* Guardar la URL del perfil para el botón "Dejar reseña en Google" */
          window._bfcGoogleUrl = place.url || '';
          var reviews = place.reviews.map(function (r) {
            return {
              nombre:     r.author_name,
              texto:      r.text,
              rating:     r.rating,
              created_at: r.time ? new Date(r.time * 1000).toISOString() : null,
              source:     'google',
              photo:      r.profile_photo_url || null
            };
          });
          resolve(reviews);
        }
      );
    });
  }

  /* ─── MERGE: Supabase + Google sin duplicados ───── */
  function mergeReviews(sbArr, gArr) {
    /* Tomar Google como fuente principal, agregar las de Supabase
       que no estén ya (por nombre aproximado) */
    var names = gArr.map(function (r) { return r.nombre.toLowerCase(); });
    var extra  = sbArr.filter(function (r) {
      return !names.includes(r.nombre.toLowerCase());
    });
    return gArr.concat(extra);
  }

  /* ─── NORMALIZAR COLUMNAS ───────────────────────── */
  function normalizeRow(r) {
    return {
      nombre:     r.author_name || r.nombre || r.name  || r.autor  || '—',
      texto:      r.review_text || r.texto  || r.text  || r.review || '',
      rating:     r.rating      || r.stars  || 5,
      created_at: r.created_at  || r.fecha  || null,
      source:     r.source      || 'supabase',
      photo:      r.photo       || null
    };
  }

  /* ─── RENDER ────────────────────────────────────── */
  function renderReviews(reviews) {
    var grid = document.getElementById('revGrid');
    if (!grid) return;
    if (!reviews.length) {
      grid.innerHTML = '<p class="rev-empty">Sé el primero en dejar una reseña.</p>';
      return;
    }
    grid.innerHTML = reviews.map(function (r) {
      var badge = r.source === 'google'
        ? '<span class="rev-badge"><i class="ph-fill ph-google-logo"></i> Google</span>'
        : '';
      var avatar = r.photo
        ? '<img class="rev-avatar" src="' + esc(r.photo) + '" alt="" loading="lazy" />'
        : '<div class="rev-avatar-placeholder"><i class="ph-fill ph-user"></i></div>';
      return '<div class="rev-card reveal">' +
        '<div class="rev-card-head">' + avatar +
        '<div><div class="rev-stars-disp">' + starsHtml(r.rating || 5) + '</div>' + badge + '</div>' +
        '</div>' +
        '<p class="rev-body">&ldquo;' + esc(r.texto) + '&rdquo;</p>' +
        '<div class="rev-footer">' +
        '<span class="rev-author">' + esc(r.nombre) + '</span>' +
        (r.created_at ? '<span class="rev-date">' + fmtDate(r.created_at) + '</span>' : '') +
        '</div></div>';
    }).join('');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    grid.querySelectorAll('.rev-card.reveal').forEach(function (el) { io.observe(el); });
  }

  function starsHtml(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<i class="' + (i <= n ? 'ph-fill' : 'ph') + ' ph-star" aria-hidden="true"></i>';
    }
    return out;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { return ''; }
  }

  /* ─── STAR PICKER ───────────────────────────────── */
  function initStars() {
    var picker = document.getElementById('revStarPicker');
    if (!picker) return;
    var btns = picker.querySelectorAll('.rev-star-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedRating = parseInt(btn.dataset.val, 10);
        updateStarUI(btns, selectedRating);
      });
      btn.addEventListener('mouseenter', function () { updateStarUI(btns, parseInt(btn.dataset.val, 10)); });
      btn.addEventListener('mouseleave', function () { updateStarUI(btns, selectedRating); });
    });
  }

  function updateStarUI(btns, val) {
    btns.forEach(function (b, i) {
      var icon = b.querySelector('i');
      if (icon) icon.className = (i < val ? 'ph-fill' : 'ph') + ' ph-star';
      b.classList.toggle('is-lit', i < val);
    });
  }

  /* ─── FORM SUBMIT ───────────────────────────────── */
  function initForm() {
    var form    = document.getElementById('revForm');
    var submitB = document.getElementById('revSubmitBtn');
    var gBtn    = document.getElementById('revGoogleBtn');
    if (!form || !submitB) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var nombre = document.getElementById('revName').value.trim();
      var texto  = document.getElementById('revText').value.trim();

      if (!nombre || !texto) { showFeedback('Completá tu nombre y reseña.', 'error'); return; }
      if (!selectedRating)   { showFeedback('Elegí una calificación con las estrellas.', 'error'); return; }

      var span = submitB.querySelector('span');
      submitB.disabled = true;
      if (span) span.textContent = 'Enviando…';

      try {
        if (sb) {
          var discEl = document.querySelector('input[name="revDiscipline"]:checked');
          var res = await sb.from('site_reviews').insert({
            author_name: nombre,
            review_text: texto,
            rating:      selectedRating,
            discipline:  discEl ? discEl.value : 'General',
            approved:    true
          });
          if (res.error) throw res.error;
        }
        showFeedback('¡Gracias por tu reseña!', 'success');
        form.reset();
        selectedRating = 0;
        updateStarUI(document.querySelectorAll('#revStarPicker .rev-star-btn'), 0);

        /* Botón Google */
        if (gBtn) {
          var googleUrl = window._bfcGoogleUrl
            || ('https://search.google.com/local/writereview?placeid=' + GOOGLE_PLACE_ID);
          if (GOOGLE_PLACE_ID !== 'TU_PLACE_ID_AQUI') {
            gBtn.href = googleUrl;
            gBtn.hidden = false;
          }
        }

        var fresh = await fetchAllReviews();
        if (fresh.length) renderReviews(fresh);
      } catch (err) {
        console.warn('[BFC:reviews] insert failed', err);
        showFeedback('Error al enviar. Intentá de nuevo.', 'error');
      } finally {
        submitB.disabled = false;
        if (span) span.textContent = 'Enviar reseña';
      }
    });
  }

  function showFeedback(msg, type) {
    var el = document.getElementById('revFeedback');
    if (!el) return;
    el.textContent = msg;
    el.className   = 'form-msg ' + type;
    el.hidden      = false;
    if (type === 'error') setTimeout(function () { el.hidden = true; }, 4000);
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
