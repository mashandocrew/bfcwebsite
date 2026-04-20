/* =====================================================
   BFC STORE — dynamic rendering from products.json
   ===================================================== */

(function() {
  'use strict';

  const grid       = document.getElementById('storeGrid');
  const filterBox  = document.getElementById('storeFilters');
  const countEl    = document.getElementById('storeCount');
  const modal      = document.getElementById('pdModal');
  const modalBox   = modal && modal.querySelector('.pd-box');
  const DATA_URL   = '../admin/products.json';

  if (!grid) return;

  let state = { data: null, lang: document.documentElement.dataset.lang || 'es', cat: 'all', sel: null, selSize: null };

  const t = {
    es: { all: 'Todo', buy: 'Comprar por WhatsApp', ask: 'Consultar', found: 'productos', selSize: 'Talle:', close: 'Cerrar', priceTbd: 'Consultar precio' },
    en: { all: 'All',  buy: 'Buy via WhatsApp',     ask: 'Ask',       found: 'products', selSize: 'Size:',   close: 'Close',  priceTbd: 'Ask for price' },
    pt: { all: 'Tudo', buy: 'Comprar pelo WhatsApp', ask: 'Consultar', found: 'produtos', selSize: 'Tamanho:', close: 'Fechar', priceTbd: 'Consultar preço' }
  };
  const tr = (k) => (t[state.lang] || t.es)[k];

  const fmtPrice = (p) => {
    if (!p || p <= 0) return { text: tr('priceTbd'), tbd: true };
    return { text: 'AR$ ' + Number(p).toLocaleString('es-AR'), tbd: false };
  };

  async function load() {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      state.data = await res.json();
      mountFilters();
      render();
    } catch (e) {
      grid.innerHTML = `<div style="padding:3rem;color:var(--bfc-red);font-family:var(--ff-mono);letter-spacing:0.2em;text-transform:uppercase;">
        ! No se pudo cargar el catálogo (${e.message}). Abrí el sitio con un servidor local (http-server) o deployalo para que funcione.
      </div>`;
    }
  }

  function mountFilters() {
    const cats = [{ id: 'all', name: { es: tr('all'), en: tr('all'), pt: tr('all') } }]
      .concat(state.data.categories);
    filterBox.querySelector('.filter-inner').innerHTML = cats.map(c =>
      `<button class="filter-btn${c.id === state.cat ? ' is-active' : ''}" data-cat="${c.id}">${c.name[state.lang] || c.name.es}</button>`
    ).join('');
    filterBox.querySelectorAll('[data-cat]').forEach(b => {
      b.addEventListener('click', () => { state.cat = b.dataset.cat; render(); });
    });
  }

  function render() {
    const products = state.data.products.filter(p =>
      p.available !== false && (state.cat === 'all' || p.category === state.cat)
    );
    countEl.textContent = `${products.length} ${tr('found')}`;

    filterBox.querySelectorAll('[data-cat]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.cat === state.cat);
    });

    grid.innerHTML = products.map(p => {
      const price = fmtPrice(p.price);
      const catName = (state.data.categories.find(c => c.id === p.category) || {}).name || {};
      const img = p.images && p.images[0];
      const imgExists = img && !img.includes('merch/');  // heuristic; merch paths are placeholders
      const imgHtml = img && !imgIsPlaceholder(img)
        ? `<img src="${img}" alt="${p.name}" loading="lazy" onerror="this.parentElement.classList.add('placeholder');this.remove();document.getElementById('ph-${p.id}').style.display='flex';">`
        : '';
      return `
        <article class="product" data-id="${p.id}">
          <div class="product-img ${imgHtml ? '' : 'placeholder'}">
            ${imgHtml}
            <div id="ph-${p.id}" style="${imgHtml ? 'display:none' : ''};width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"/></svg>
              <span class="txt">📷 CARGAR<br>${p.name}</span>
            </div>
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          </div>
          <div class="product-body">
            <div class="product-cat">${catName[state.lang] || catName.es || p.category}</div>
            <h3 class="product-name">${p.name}</h3>
            <div class="product-foot">
              <span class="product-price ${price.tbd ? 'tbd' : ''}">${price.text}</span>
              <span class="product-cta">${tr('ask')} <i class="ph ph-arrow-right" aria-hidden="true"></i></span>
            </div>
          </div>
        </article>`;
    }).join('');

    grid.querySelectorAll('.product').forEach(card => {
      card.addEventListener('click', () => openDetail(card.dataset.id));
    });
  }

  function imgIsPlaceholder(p) {
    // products.json uses assets/images/merch/*.jpg as placeholders (don't exist yet)
    return false;
  }

  function openDetail(id) {
    const p = state.data.products.find(x => x.id === id);
    if (!p || !modal) return;
    state.sel = p;
    state.selSize = (p.sizes && p.sizes[0]) || null;
    const price = fmtPrice(p.price);
    const catName = (state.data.categories.find(c => c.id === p.category) || {}).name || {};
    modalBox.innerHTML = `
      <button class="pd-close" type="button" aria-label="${tr('close')}">
        <i class="ph ph-x"></i>
      </button>
      <div class="pd-img">
        <div id="pd-img-box" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;border:1px dashed rgba(200,16,46,0.3);">
          <svg style="width:36px;height:36px;color:var(--bfc-red)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"/></svg>
          <span style="font-family:var(--ff-mono);font-size:0.75rem;letter-spacing:0.2em;color:var(--bfc-red);text-transform:uppercase;text-align:center;padding:0 1rem;">📷 CARGAR:<br>${p.name}</span>
        </div>
      </div>
      <div class="pd-body">
        <span class="cat">${catName[state.lang] || catName.es || p.category}</span>
        <h3>${p.name}</h3>
        <div class="price ${price.tbd ? 'tbd' : ''}">${price.text}</div>
        <p class="desc">${p.description || ''}</p>
        ${p.sizes && p.sizes.length ? `
          <div class="pd-sizes">
            <span class="lbl">${tr('selSize')}</span>
            <div class="pd-size-list">
              ${p.sizes.map((s, i) => `<button class="pd-size-btn${i===0?' is-active':''}" data-size="${s}" type="button">${s}</button>`).join('')}
            </div>
          </div>` : ''}
        <div class="pd-cta">
          <a href="#" class="btn" id="pdBuyBtn">
            <i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i>
            <span>${tr('buy')}</span>
          </a>
        </div>
      </div>
    `;
    // Try image (real)
    if (p.images && p.images[0]) {
      const img = new Image();
      img.src = p.images[0];
      img.alt = p.name;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      img.onload = () => {
        const holder = document.getElementById('pd-img-box');
        if (holder && holder.parentElement) holder.parentElement.innerHTML = '';
        holder.parentElement.appendChild(img);
      };
      img.onerror = () => {};
    }
    modalBox.querySelectorAll('.pd-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modalBox.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.selSize = btn.dataset.size;
      });
    });
    modalBox.querySelector('.pd-close').addEventListener('click', closeDetail);
    modalBox.querySelector('#pdBuyBtn').addEventListener('click', e => {
      e.preventDefault();
      const msg = buildWAMessage(p, state.selSize);
      const phone = state.data.whatsapp || '5492615710531';
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
  }

  function buildWAMessage(p, size) {
    const lang = state.lang;
    const intro = {
      es: `Hola BFC! Me interesa:`,
      en: `Hi BFC! I'm interested in:`,
      pt: `Olá BFC! Tenho interesse em:`
    }[lang] || `Hola BFC! Me interesa:`;
    return `${intro}\n• ${p.name}${size ? `\n• Talle: ${size}` : ''}\n• SKU: ${p.id}`;
  }

  // i18n re-render
  document.addEventListener('bfc:lang', () => {
    state.lang = document.documentElement.dataset.lang || 'es';
    if (state.data) { mountFilters(); render(); }
  });

  load();
})();
