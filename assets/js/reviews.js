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

  /* ─── SEED REVIEWS ─────────────────────────────────
     Inserta las reseñas fundacionales si aún no existen. */
  var SEED_REVIEWS = [
    { author_name: 'Francisco Farjo',    discipline: 'General', rating: 5, review_text: 'Excelente academia, muy buena ubicación y un espacio amplio como pocas academias, además de muy buena predisposición del profesor y un ambiente de compañerismo muy presente la verdad que 10/10.', approved: true },
    { author_name: 'Pablo Badui',        discipline: 'General', rating: 5, review_text: 'Más que una academia una familia de luchadores, desde los nuevos hasta los profesionales entrenando a la par en el mismo tatami. El verdadero espíritu del guerrero.',                         approved: true },
    { author_name: 'Fernando Tabarelli', discipline: 'General', rating: 5, review_text: 'Muy profesionales, se preocupan que cada alumno logre lo que se propuso al ingresar. Muy buen ambiente.',                                                                                     approved: true },
    { author_name: 'Fernando Vater',     discipline: 'General', rating: 5, review_text: 'Excelente atención, totalmente limpio y con constantes innovaciones y mejoras, clases personalizadas de alto nivel, el profe Walter Bonati un apasionado y 100% dedicado a sus alumnos.',     approved: true }
  ];

  async function seedInitialReviews() {
    if (!sb) return;
    for (var i = 0; i < SEED_REVIEWS.length; i++) {
      var review = SEED_REVIEWS[i];
      try {
        var check = await sb.from('site_reviews').select('id').eq('author_name', review.author_name).limit(1);
        if (!check.data || check.data.length === 0) {
          await sb.from('site_reviews').insert(review);
        }
      } catch (e) {
        console.warn('[BFC:reviews] seed error', e.message);
      }
    }
  }

  /* ─── INIT ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async function () {
    renderReviews(STATIC_REVIEWS);   /* visible de inmediato */
    initStars();

    if (window.supabase) {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    initForm();

    await seedInitialReviews();

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
      photo:      r.photo       || null,
      disciplina: r.discipline  || r.disciplina || ''
    };
  }

  /* ─── RENDER ────────────────────────────────────── */
  function renderReviews(reviews) {
    var grid = document.getElementById('reviews-grid');
    if (!grid) return;
    if (!reviews.length) {
      grid.innerHTML = '<div class="rev-empty" style="grid-column:1/-1">Sé el primero en dejar una reseña.</div>';
      return;
    }
    grid.innerHTML = reviews.map(function (r, idx) {
      var initial  = r.nombre ? r.nombre.charAt(0).toUpperCase() : '?';
      var googleBadge = r.source === 'google'
        ? '<div class="review-source-badge"><svg viewBox="0 0 24 24" width="14" height="14" fill="none">' +
          '<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>' +
          '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
          '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>' +
          '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>' +
          '</svg>Google</div>'
        : '';
      var discipline = (r.disciplina && r.disciplina !== 'General')
        ? '<span class="review-author-discipline">' + esc(r.disciplina) + '</span>'
        : '';
      var stars = Array.from({length: r.rating || 5}, function () { return '<span>★</span>'; }).join('') +
        Array.from({length: 5 - (r.rating || 5)}, function () { return '<span style="color:rgba(255,255,255,0.15)">★</span>'; }).join('');
      return '<div class="review-card" style="animation:fadeInUp 0.5s ease both;animation-delay:' + (idx * 0.08) + 's">' +
        '<div class="review-stars">' + stars + '</div>' +
        '<p class="review-text">' + esc(r.texto) + '</p>' +
        '<div class="review-footer">' +
        '<div class="review-avatar">' + initial + '</div>' +
        '<div class="review-author-info">' +
        '<span class="review-author-name">' + esc(r.nombre) + '</span>' +
        discipline +
        '</div>' +
        googleBadge +
        '</div></div>';
    }).join('');
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
