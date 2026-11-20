/* BFC · MÓDULO 2 — Reseñas
   Fuentes en orden de prioridad:
   1. Google Places API  (cuando esté configurada)
   2. Supabase site_reviews (vía el cliente compartido BFC_API, paginado de a PAGE_SIZE)
   3. Reseñas estáticas reales (ya vienen en el HTML; quedan si la API falla)

   Rendimiento:
   - La consulta sale recién cuando la sección está cerca de la pantalla.
   - Sin "semilla" desde el navegador: las reseñas fundacionales se cargan una sola vez
     con _tools/supabase-setup.sql (antes eran 4 consultas extra en cada visita).
   - Al enviar una reseña la interfaz responde al instante (optimistic UI) y se revierte si falla.
*/
(function () {
  'use strict';

  /* ─── CONFIG ────────────────────────────────────
     Completar cuando tengas las credenciales.
     Mientras estén como 'TU_..._AQUI' esas fuentes se ignoran. */
  var GOOGLE_PLACES_API_KEY = 'TU_API_KEY_AQUI';   /* ← pegar aquí */
  var GOOGLE_PLACE_ID       = 'ChIJsTGJ7q8JfpYRN69N1LdLXHo';  /* ← pegar aquí */

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

  var api            = window.BFC_API || null;
  var selectedRating = 0;
  var PAGE_SIZE      = 6;
  var loaded         = [];     /* reseñas de Supabase ya cargadas */
  var nextOffset     = 0;
  var hasMore        = false;
  var loadingMore    = false;

  /* ─── INIT ──────────────────────────────────────── */
  /* Las reseñas estáticas ya están en el HTML (rastreables): no se vuelven a pintar. */
  document.addEventListener('DOMContentLoaded', function () {
    initStars();
    initForm();
    whenNear(document.getElementById('reviews'), loadInitial);
  });

  function whenNear(el, cb) {
    if (!el || !('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); cb(); }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
  }

  async function loadInitial() {
    var page = await fetchSupabasePage(0);
    if (page.rows.length) {
      loaded = page.rows;
      nextOffset = page.rows.length;
      hasMore = page.hasMore;
      renderReviews(loaded);
    }

    /* Si Google está configurado, esperar que cargue el SDK (reusa lo ya cargado: sin consultas repetidas) */
    if (GOOGLE_READY) {
      if (window.google && window.google.maps) {
        var gReviews = await fetchGoogleReviews();
        if (gReviews.length) renderReviews(mergeReviews(loaded, gReviews));
      } else {
        document.addEventListener('bfc:google-ready', async function () {
          var gReviews = await fetchGoogleReviews();
          if (gReviews.length) renderReviews(mergeReviews(loaded, gReviews));
        }, { once: true });
      }
    }
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    loadingMore = true;
    var btn = document.getElementById('reviewsMore');
    if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Cargando…'; }
    var page = await fetchSupabasePage(nextOffset);
    loadingMore = false;
    if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'Ver más reseñas'; }
    loaded = loaded.concat(page.rows);
    nextOffset += page.rows.length;
    hasMore = page.hasMore;
    renderReviews(loaded);
  }

  /* ─── SUPABASE ──────────────────────────────────── */
  async function fetchSupabasePage(offset) {
    if (!api) return { rows: [], hasMore: false };
    try {
      var res = await api.select('site_reviews', {
        select:  'author_name,review_text,rating,discipline,created_at',
        filters: { approved: 'eq.true' },
        order:   'created_at.desc',
        limit:   PAGE_SIZE,
        offset:  offset
      });
      return { rows: res.data.map(normalizeRow), hasMore: res.hasMore };
    } catch (e) {
      console.warn('[BFC:reviews] Supabase:', e.message);
      return { rows: [], hasMore: false };
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
      var pending = r.source === 'pending'
        ? '<span class="review-pending">En revisión</span>'
        : '';
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
      return '<div class="review-card' + (r.source === 'pending' ? ' is-pending' : '') + '" style="animation:fadeInUp 0.5s ease both;animation-delay:' + (Math.min(idx, 5) * 0.08) + 's">' +
        pending +
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
    setMoreButton(grid);
  }

  function setMoreButton(grid) {
    var btn = document.getElementById('reviewsMore');
    if (!btn) {
      var wrap = document.createElement('div');
      wrap.className = 'reviews-more';
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'reviewsMore';
      btn.className = 'btn';
      btn.innerHTML = '<span>Ver más reseñas</span>';
      btn.addEventListener('click', loadMore);
      wrap.appendChild(btn);
      grid.parentNode.insertBefore(wrap, grid.nextSibling);
    }
    btn.parentNode.hidden = !hasMore;
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

      var discEl = document.querySelector('input[name="revDiscipline"]:checked');
      var row = {
        author_name: nombre,
        review_text: texto,
        rating:      selectedRating,
        discipline:  discEl ? discEl.value : 'General',
        approved:    false   /* queda pendiente hasta que se apruebe desde /admin/ */
      };
      var rating = selectedRating;
      var discValue = discEl ? discEl.value : null;

      /* Optimistic UI: se muestra el resultado sin esperar al servidor.
         La reseña aparece solo para quien la escribió, marcada "En revisión". */
      var mine = { nombre: nombre, texto: texto, rating: rating, created_at: null, source: 'pending', disciplina: row.discipline };
      var before = currentList();
      renderReviews([mine].concat(before));
      showFeedback('¡Gracias por tu reseña! La publicamos apenas la revisemos.', 'success');
      form.reset();
      selectedRating = 0;
      updateStarUI(document.querySelectorAll('#revStarPicker .rev-star-btn'), 0);
      submitB.disabled = true;

      /* Botón Google */
      if (gBtn) {
        var googleUrl = window._bfcGoogleUrl
          || ('https://search.google.com/local/writereview?placeid=' + GOOGLE_PLACE_ID);
        if (GOOGLE_PLACE_ID !== 'TU_PLACE_ID_AQUI') {
          gBtn.href = googleUrl;
          gBtn.hidden = false;
        }
      }

      try {
        if (!api) throw new Error('API no disponible');
        await api.insert('site_reviews', row);
        /* La reseña nueva no es pública hasta aprobarla: no hace falta volver a consultar la lista. */
      } catch (err) {
        console.warn('[BFC:reviews] insert failed', err);
        /* Revertir: sacar la tarjeta y devolver lo escrito al formulario */
        renderReviews(before);
        document.getElementById('revName').value = nombre;
        document.getElementById('revText').value = texto;
        if (discValue) {
          var d = form.querySelector('input[name="revDiscipline"][value="' + discValue + '"]');
          if (d) d.checked = true;
        }
        selectedRating = rating;
        updateStarUI(document.querySelectorAll('#revStarPicker .rev-star-btn'), rating);
        if (gBtn) gBtn.hidden = true;
        showFeedback('No se pudo enviar. Revisá tu conexión e intentá de nuevo.', 'error');
      } finally {
        submitB.disabled = false;
      }
    });
  }

  /* Lista visible actual: lo cargado de Supabase o, si no hay, las estáticas */
  function currentList() {
    return loaded.length ? loaded.slice() : STATIC_REVIEWS.slice();
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
