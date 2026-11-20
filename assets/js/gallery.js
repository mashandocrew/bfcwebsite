/* BFC · GALERÍA — Supabase community_photos (sin respaldo de relleno)
   Carga diferida: la consulta sale recién cuando el visitante se acerca a la sección.
   Paginada de a PAGE_SIZE fotos con botón "Ver más fotos". Usa el cliente compartido BFC_API. */
(function () {
  'use strict';

  var PAGE_SIZE = 12;

  var currentIndex = 0;
  var sectionVisible = false;
  var GALLERY_DATA = [];
  var nextOffset = 0;
  var loading = false;

  /* ─── API ───────────────────────────────────────────────────── */
  function loadPage(offset) {
    if (!window.BFC_API) return Promise.resolve(null);
    return window.BFC_API.select('community_photos', {
      select:  'photo_url,author_name,description,category',   /* solo las columnas que se usan */
      filters: { approved: 'eq.true' },
      order:   'created_at.desc',
      limit:   PAGE_SIZE,
      offset:  offset
    }).catch(function (e) {
      console.error('Error cargando galería:', e);
      return null;
    });
  }

  function mapRow(row) {
    return {
      src:     row.photo_url,
      alt:     row.author_name || '',
      caption: row.description || row.author_name || '',
      year:    row.category || ''
    };
  }

  /* ─── SKELETON ──────────────────────────────────────────────── */
  function showSkeleton(grid) {
    grid.innerHTML = '';
    for (var s = 0; s < 6; s++) {
      var sk = document.createElement('div');
      sk.className = 'gallery-skeleton';
      grid.appendChild(sk);
    }
  }

  /* ─── BUILD ITEMS ────────────────────────────────────────────── */
  function buildItems(grid, photos, start) {
    var items = [];
    var frag = document.createDocumentFragment();
    photos.forEach(function (photo, j) {
      var i = start + j;
      var item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('data-index', i);
      item.setAttribute('data-src', photo.src);
      item.setAttribute('data-alt', photo.alt || '');
      item.setAttribute('data-caption', photo.caption || '');
      item.setAttribute('data-year', photo.year || '');

      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';

      var overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';

      item.appendChild(img);
      item.appendChild(overlay);

      if (photo.year) {
        var yearEl = document.createElement('span');
        yearEl.className = 'gallery-item-year';
        yearEl.textContent = photo.year;
        item.appendChild(yearEl);
      }

      item.addEventListener('click', function () {
        openLightbox(parseInt(item.getAttribute('data-index'), 10));
      });

      frag.appendChild(item);
      items.push(item);
    });
    grid.appendChild(frag);
    return items;
  }

  /* ─── HOVER ─────────────────────────────────────────────────── */
  function wireHover(items) {
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        try { window.anime.animate(item, { scale: 1.03, duration: 250, easing: 'easeOutQuad' }); } catch (e) {}
      });
      item.addEventListener('mouseleave', function () {
        try { window.anime.animate(item, { scale: 1, duration: 200, easing: 'easeOutQuad' }); } catch (e) {}
      });
    });
  }

  /* ─── ENTRANCE ───────────────────────────────────────────────── */
  function observeEntrance(items) {
    var section = document.getElementById('galeria');
    if (!section || !('IntersectionObserver' in window)) { fallbackShow(items); return; }

    var fallbackTimer = setTimeout(function () { fallbackShow(items); }, 1500);
    var entered = false;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!entered) {
            entered = true;
            clearTimeout(fallbackTimer);
            animateEntrance(items);
          }
          items.forEach(function (item) {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          });
        } else {
          items.forEach(function (item) {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '0.7';
          });
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    io.observe(section);
  }

  function animateEntrance(items) {
    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(40px)';
    });
    if (!window.anime) { fallbackShow(items); return; }
    items.forEach(function (item, i) {
      try {
        window.anime.animate(item, {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 700,
          delay: i * 90,
          easing: 'easeOutExpo'
        });
      } catch (e) {
        item.style.opacity = '1';
        item.style.transform = 'none';
      }
    });
  }

  function fallbackShow(items) {
    items.forEach(function (item) {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
  }

  /* ─── LIGHTBOX ──────────────────────────────────────────────── */
  function openLightbox(index) {
    var photo = GALLERY_DATA[index];
    if (!photo) return;
    currentIndex = index;

    var lb      = document.getElementById('bfc-lightbox');
    var lbImg   = document.getElementById('lbImg');
    var lbTitle = document.getElementById('lbTitle');
    var lbCap   = document.getElementById('lbCaption');
    var lbYear  = document.getElementById('lbYear');
    var content = lb && lb.querySelector('.lb-content');

    if (!lb || !lbImg) return;

    lbImg.src           = photo.src;
    lbImg.alt           = photo.alt || '';
    lbTitle.textContent = photo.alt || '';
    lbCap.textContent   = photo.caption || photo.alt || '';
    lbYear.textContent  = photo.year || '';

    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (content && window.anime) {
      try {
        window.anime.animate(content, { opacity: [0, 1], scale: [0.92, 1], duration: 300, easing: 'easeOutCubic' });
      } catch (e) {}
    }
  }

  function closeLightbox() {
    var lb      = document.getElementById('bfc-lightbox');
    var content = lb && lb.querySelector('.lb-content');
    if (!lb) return;
    if (content && window.anime) {
      try { window.anime.animate(content, { opacity: [1, 0], scale: [1, 0.92], duration: 200, easing: 'easeOutCubic' }); } catch (e) {}
    }
    setTimeout(function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }, 200);
  }

  function navigateLightbox(direction) {
    var total = GALLERY_DATA.length;
    if (!total) return;
    currentIndex = (currentIndex + direction + total) % total;
    openLightbox(currentIndex);
  }

  function wireLightboxEvents() {
    var lb      = document.getElementById('bfc-lightbox');
    var lbClose = document.getElementById('lbClose');
    var lbPrev  = document.getElementById('lbPrev');
    var lbNext  = document.getElementById('lbNext');
    var lbBack  = document.getElementById('lbBackdrop');

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBack)  lbBack.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', function () { navigateLightbox(-1); });
    if (lbNext)  lbNext.addEventListener('click', function () { navigateLightbox(1); });

    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  /* ─── PARALLAX ──────────────────────────────────────────────── */
  function initParallax(grid, section) {
    if ('IntersectionObserver' in window) {
      var visObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          sectionVisible = entry.isIntersecting;
          if (!sectionVisible) grid.style.transform = '';
        });
      }, { threshold: 0 });
      visObs.observe(section);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!sectionVisible) return;
      if (!ticking) {
        requestAnimationFrame(function () {
          var offset = (window.scrollY - section.offsetTop) * 0.06;
          grid.style.transform = 'translateY(' + offset + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── BOTÓN "VER MÁS" ───────────────────────────────────────── */
  function moreButton(grid) {
    var btn = document.getElementById('galleryMore');
    if (btn) return btn;
    var wrap = document.createElement('div');
    wrap.className = 'gallery-more';
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'galleryMore';
    btn.className = 'btn';
    btn.innerHTML = '<span>Ver más fotos</span>';
    btn.addEventListener('click', loadMore);
    wrap.appendChild(btn);
    grid.parentNode.insertBefore(wrap, grid.nextSibling);
    return btn;
  }

  function setMore(grid, hasMore) {
    var btn = moreButton(grid);
    btn.parentNode.hidden = !hasMore;
  }

  async function loadMore() {
    var grid = document.getElementById('galleryGrid');
    var btn  = document.getElementById('galleryMore');
    if (!grid || loading) return;
    loading = true;
    if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Cargando…'; }

    var res = await loadPage(nextOffset);
    loading = false;
    if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'Ver más fotos'; }
    if (!res) return;

    var photos = res.data.map(mapRow);
    var start = GALLERY_DATA.length;
    GALLERY_DATA = GALLERY_DATA.concat(photos);
    nextOffset += photos.length;

    var items = buildItems(grid, photos, start);
    wireHover(items);
    animateEntrance(items);
    setMore(grid, res.hasMore);
  }

  /* ─── MAIN ──────────────────────────────────────────────────── */
  async function buildGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    showSkeleton(grid);
    loading = true;
    var res = await loadPage(0);
    loading = false;

    /* Solo fotos reales desde Supabase: sin fotos de relleno de respaldo */
    var photos = (res && res.data.length) ? res.data.map(mapRow) : [];

    GALLERY_DATA = photos;
    nextOffset = photos.length;
    grid.innerHTML = '';

    var section = document.getElementById('galeria');
    if (!photos.length) {
      /* Sin fotos (o error al cargarlas): se oculta la sección en vez de mostrar un aviso */
      if (section) section.hidden = true;
      return;
    }

    var items = buildItems(grid, photos, 0);
    wireHover(items);
    observeEntrance(items);
    setMore(grid, res.hasMore);

    if (section) initParallax(grid, section);
  }

  /* La consulta sale cuando la sección está a ~600 px de entrar en pantalla */
  function whenNear(el, cb) {
    if (!el || !('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); cb(); }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
  }

  function init() {
    wireLightboxEvents();
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    showSkeleton(grid);
    whenNear(document.getElementById('galeria') || grid, buildGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
