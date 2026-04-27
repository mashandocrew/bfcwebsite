/* BFC · MÓDULO 1 — COMUNIDAD BFC
   Galería dinámica desde Supabase con filtros, lightbox y panel admin
*/
(function () {
  'use strict';

  var SUPABASE_URL = 'https://kmlobikkamhnzkmbtckg.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbG9iaWtrYW1obnprbWJ0Y2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYyOTQsImV4cCI6MjA5MjQwMjI5NH0.yeN_hygM4q9tZIq4hst6-6SzeAf5mdLnTuWG-eLatts';
  var BUCKET      = 'community-photos';
  var ADMIN_PASS  = 'BFC2025admin';
  var ADMIN_SEQ   = ['A','D','M','I','N'];

  var sb           = null;
  var allPhotos    = [];
  var visiblePhotos= [];
  var lbIdx        = 0;
  var pendingFile  = null;
  var adminSeqPos  = 0;

  /* ─── INIT ─────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async function () {
    if (!window.supabase) return;
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    await loadPhotos();
    initFilters();
    initUploadModal();
    initLightbox();
    initAdminSequence();
    initAdminPanel();
  });

  /* ─── LOAD PHOTOS ──────────────────────────── */
  async function loadPhotos() {
    try {
      var res = await sb
        .from('community_photos')
        .select('id, url, category, author, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (res.error) throw res.error;
      allPhotos = res.data || [];
    } catch (e) {
      console.warn('[BFC:community] load failed', e);
      allPhotos = [];
    }
    renderGrid(allPhotos);
  }

  /* ─── RENDER GRID ──────────────────────────── */
  function renderGrid(photos) {
    var grid  = document.getElementById('commGrid');
    var empty = document.getElementById('commEmpty');
    if (!grid) return;

    grid.querySelectorAll('.comm-item').forEach(function (el) { el.remove(); });
    visiblePhotos = photos;

    if (!photos.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    var frag = document.createDocumentFragment();
    photos.forEach(function (photo, idx) {
      var item = document.createElement('div');
      item.className = 'comm-item reveal';
      item.innerHTML =
        '<img src="' + esc(photo.url) + '" alt="' + esc(photo.category || 'BFC') + '" loading="lazy" />' +
        (photo.category ? '<span class="comm-tag">' + esc(photo.category) + '</span>' : '');
      (function (i) {
        item.addEventListener('click', function () { openLb(i); });
      })(idx);
      frag.appendChild(item);
    });
    grid.insertBefore(frag, empty || null);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    grid.querySelectorAll('.comm-item.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ─── FILTERS ──────────────────────────────── */
  function initFilters() {
    var filtersEl = document.getElementById('commFilters');
    if (!filtersEl) return;
    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cat]');
      if (!btn) return;
      filtersEl.querySelectorAll('[data-cat]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.dataset.cat;
      renderGrid(cat === 'all' ? allPhotos : allPhotos.filter(function (p) { return p.category === cat; }));
    });
  }

  /* ─── LIGHTBOX ─────────────────────────────── */
  function initLightbox() {
    var lb    = document.getElementById('commLightbox');
    var close = document.getElementById('commLbClose');
    var prev  = document.getElementById('commLbPrev');
    var next  = document.getElementById('commLbNext');
    if (!lb) return;

    close.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    prev.addEventListener('click', function () { navigate(-1); });
    next.addEventListener('click', function () { navigate(1); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    var tx0 = 0;
    lb.addEventListener('touchstart', function (e) { tx0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - tx0;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    });

    function navigate(dir) {
      if (!visiblePhotos.length) return;
      lbIdx = (lbIdx + dir + visiblePhotos.length) % visiblePhotos.length;
      showLb();
    }
  }

  function openLb(idx) {
    var lb = document.getElementById('commLightbox');
    if (!lb || !visiblePhotos[idx]) return;
    lbIdx = idx;
    showLb();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function showLb() {
    var p   = visiblePhotos[lbIdx];
    var img = document.getElementById('commLbImg');
    var cap = document.getElementById('commLbCaption');
    if (!p || !img) return;
    img.src = p.url;
    if (cap) cap.textContent = [p.category, p.author].filter(Boolean).join(' · ');
  }

  function closeLb() {
    var lb = document.getElementById('commLightbox');
    if (lb) { lb.hidden = true; document.body.style.overflow = ''; }
  }

  /* ─── UPLOAD MODAL ─────────────────────────── */
  function initUploadModal() {
    var uploadBtn = document.getElementById('commUploadBtn');
    var modal     = document.getElementById('commModal');
    var closeBtn  = document.getElementById('commModalClose');
    var dropZone  = document.getElementById('commDropZone');
    var fileInput = document.getElementById('commFileInput');
    var preview   = document.getElementById('commPreview');
    var submitBtn = document.getElementById('commSubmitBtn');
    if (!uploadBtn || !modal) return;

    uploadBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault(); dropZone.classList.add('is-dragging');
    });
    dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('is-dragging'); });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('is-dragging');
      var f = e.dataTransfer.files[0];
      if (f && f.type.startsWith('image/')) handleFile(f);
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    submitBtn.addEventListener('click', submitPhoto);

    function handleFile(file) {
      pendingFile = file;
      var reader = new FileReader();
      reader.onload = function (ev) {
        preview.src = ev.target.result;
        preview.hidden = false;
        dropZone.hidden = true;
        submitBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    }

    async function submitPhoto() {
      if (!pendingFile || !sb) return;
      var span = submitBtn.querySelector('span');
      submitBtn.disabled = true;
      if (span) span.textContent = 'Enviando…';

      var cat    = document.getElementById('commCategory').value;
      var author = (document.getElementById('commAuthor').value || '').trim();
      var parts  = pendingFile.name.split('.');
      var ext    = parts.length > 1 ? parts.pop() : 'jpg';
      var fname  = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;

      try {
        var upRes = await sb.storage.from(BUCKET).upload(fname, pendingFile, { upsert: false });
        if (upRes.error) throw upRes.error;
        var pubData = sb.storage.from(BUCKET).getPublicUrl(fname);
        var insRes  = await sb.from('community_photos').insert({
          url:      pubData.data.publicUrl,
          category: cat,
          author:   author || null,
          approved: false
        });
        if (insRes.error) throw insRes.error;
        if (span) span.textContent = '¡Enviado! En revisión.';
        setTimeout(closeModal, 1800);
      } catch (err) {
        console.warn('[BFC:community] upload failed', err);
        submitBtn.disabled = false;
        if (span) span.textContent = 'Error. Intentá de nuevo.';
      }
    }

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      pendingFile = null;
      preview.hidden = true;
      preview.src    = '';
      dropZone.hidden = false;
      fileInput.value = '';
      submitBtn.disabled = true;
      var span = submitBtn.querySelector('span');
      if (span) span.textContent = 'Enviar foto';
    }
  }

  /* ─── ADMIN KEY SEQUENCE (Shift+A+D+M+I+N) ─── */
  function initAdminSequence() {
    document.addEventListener('keydown', function (e) {
      if (!e.shiftKey) { adminSeqPos = 0; return; }
      if (e.key.toUpperCase() === ADMIN_SEQ[adminSeqPos]) {
        adminSeqPos++;
        if (adminSeqPos === ADMIN_SEQ.length) {
          adminSeqPos = 0;
          openAdminPanel();
        }
      } else {
        adminSeqPos = 0;
      }
    });
  }

  /* ─── ADMIN PANEL ──────────────────────────── */
  function initAdminPanel() {
    var panel  = document.getElementById('commAdminPanel');
    var closeB = document.getElementById('commAdminClose');
    var loginB = document.getElementById('commAdminLogin');
    var passIn = document.getElementById('commAdminPass');
    if (!panel) return;

    closeB.addEventListener('click', function () {
      panel.hidden = true;
      document.body.style.overflow = '';
    });

    passIn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') loginB.click();
    });

    loginB.addEventListener('click', async function () {
      if (passIn.value === ADMIN_PASS) {
        document.getElementById('commAdminAuth').hidden    = true;
        document.getElementById('commAdminContent').hidden = false;
        await loadPending();
      } else {
        passIn.style.borderBottomColor = 'var(--bfc-red)';
        setTimeout(function () { passIn.style.borderBottomColor = ''; passIn.value = ''; }, 1400);
      }
    });
  }

  function openAdminPanel() {
    var panel = document.getElementById('commAdminPanel');
    if (panel) { panel.hidden = false; document.body.style.overflow = 'hidden'; }
  }

  async function loadPending() {
    var box = document.getElementById('commAdminPending');
    if (!box || !sb) return;
    try {
      var res = await sb.from('community_photos').select('*').eq('approved', false).order('created_at', { ascending: false });
      if (res.error) throw res.error;
      if (!res.data.length) {
        box.innerHTML = '<p style="color:var(--bfc-gold);padding:1rem 0;font-size:var(--fs-sm)">No hay fotos pendientes.</p>';
        return;
      }
      box.innerHTML = res.data.map(function (p) {
        return '<div class="admin-item" data-id="' + p.id + '">' +
          '<img src="' + esc(p.url) + '" alt="" />' +
          '<div class="admin-item-meta"><span>' + esc(p.category || '—') + '</span>' +
          (p.author ? '<span>' + esc(p.author) + '</span>' : '') + '</div>' +
          '<div class="admin-item-btns">' +
          '<button class="btn admin-approve" data-id="' + p.id + '" type="button">Aprobar</button>' +
          '<button class="btn admin-reject"  data-id="' + p.id + '" type="button" style="background:var(--bfc-red-deep);border-color:var(--bfc-red-deep)">Rechazar</button>' +
          '</div></div>';
      }).join('');
      box.querySelectorAll('.admin-approve').forEach(function (b) {
        b.addEventListener('click', function () { moderatePhoto(b.dataset.id, true); });
      });
      box.querySelectorAll('.admin-reject').forEach(function (b) {
        b.addEventListener('click', function () { moderatePhoto(b.dataset.id, false); });
      });
    } catch (e) {
      box.innerHTML = '<p style="color:var(--bfc-red)">Error cargando pendientes.</p>';
    }
  }

  async function moderatePhoto(id, approve) {
    if (!sb) return;
    try {
      if (approve) {
        await sb.from('community_photos').update({ approved: true }).eq('id', id);
      } else {
        await sb.from('community_photos').delete().eq('id', id);
      }
      var el = document.querySelector('.admin-item[data-id="' + id + '"]');
      if (el) {
        el.style.opacity = '0.4';
        setTimeout(function () { el.remove(); }, 300);
      }
      if (approve) await loadPhotos();
    } catch (e) {
      console.warn('[BFC:community] moderate failed', e);
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
