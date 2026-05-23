/* BFC · GALERÍA — Supabase community_photos + BFC_GALLERY fallback */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://kmlobikkamhnzkmbtckg.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbG9iaWtrYW1obnprbWJ0Y2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYyOTQsImV4cCI6MjA5MjQwMjI5NH0.yeN_hygM4q9tZIq4hst6-6SzeAf5mdLnTuWG-eLatts';

  var currentIndex = 0;
  var sectionVisible = false;
  var GALLERY_DATA = [];

  /* ─── SUPABASE ──────────────────────────────────────────────── */
  function getClient() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return null;
  }

  async function loadFromSupabase() {
    var sb = getClient();
    if (!sb) return null;
    try {
      var result = await sb
        .from('community_photos')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (result.error) { console.error('Error cargando galería:', result.error); return null; }
      return result.data || [];
    } catch (e) {
      console.error('Supabase gallery error:', e);
      return null;
    }
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
  function buildItems(grid, photos) {
    grid.innerHTML = '';
    var items = [];
    photos.forEach(function (photo, i) {
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

      grid.appendChild(item);
      items.push(item);
    });
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

  /* ─── MAIN ──────────────────────────────────────────────────── */
  async function buildGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    showSkeleton(grid);

    var supabasePhotos = await loadFromSupabase();

    var photos;
    if (supabasePhotos && supabasePhotos.length > 0) {
      photos = supabasePhotos.map(mapRow);
    } else if (typeof BFC_GALLERY !== 'undefined' && BFC_GALLERY.length > 0) {
      photos = BFC_GALLERY;
    } else {
      photos = [];
    }

    GALLERY_DATA = photos;
    grid.innerHTML = '';

    if (!photos.length) {
      if (supabasePhotos === null) {
        grid.innerHTML = '<div style="text-align:center;padding:3rem 1rem;color:#C8102E"><i class="ph ph-warning" style="font-size:2rem;display:block;margin-bottom:.5rem"></i>Error al cargar la galería.</div>';
      } else {
        grid.innerHTML = '<p style="text-align:center;font-family:\'Outfit\',sans-serif;font-weight:300;color:rgba(255,255,255,0.4);padding:3rem 1rem">La galería se está preparando. Volvé pronto.</p>';
      }
      return;
    }

    var items = buildItems(grid, photos);
    wireHover(items);
    observeEntrance(items);

    var section = document.getElementById('galeria');
    if (section) initParallax(grid, section);
  }

  function init() {
    wireLightboxEvents();
    buildGallery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
