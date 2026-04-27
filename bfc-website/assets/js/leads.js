/* =====================================================
   BFC — LEAD MODAL + SUPABASE
   Hero CTA → Modal → Supabase leads table → WhatsApp
   =====================================================

   SUPABASE SETUP — run once in the SQL editor:
   -----------------------------------------------
   CREATE TABLE leads (
     id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
     name        text        NOT NULL,
     phone       text,
     discipline  text,
     lang        text        DEFAULT 'es',
     source      text        DEFAULT 'hero_cta',
const BFC_SUPABASE_URL  = 'https://TU-PROYECTO.supabase.co';
  const BFC_SUPABASE_KEY  = 'TU-ANON-KEY';   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "anon_insert" ON leads
     FOR INSERT TO anon WITH CHECK (true);
   -----------------------------------------------
*/

// ── CONFIG ─────────────────────────────────────────
const BFC_SUPABASE_URL  = 'https://TU-PROYECTO.supabase.co'; // reemplazar
const BFC_SUPABASE_KEY  = 'TU-ANON-KEY';                     // reemplazar
const BFC_WA_NUMBER     = '5492615710531';

(function () {
  'use strict';

  // ── SUPABASE CLIENT ──────────────────────────────
  let sb = null;
  if (window.supabase && !BFC_SUPABASE_URL.includes('TU-PROYECTO')) {
    try {
      sb = window.supabase.createClient(BFC_SUPABASE_URL, BFC_SUPABASE_KEY);
    } catch (err) {
      console.warn('[BFC] Supabase init failed:', err);
    }
  }

  // ── DOM REFS ─────────────────────────────────────
  const modal      = document.getElementById('leadModal');
  const panel      = document.getElementById('leadPanel');
  const closeBtn   = document.getElementById('leadClose');
  const form       = document.getElementById('leadForm');
  const errorEl    = document.getElementById('leadError');
  const submitBtn  = document.getElementById('leadSubmit');
  const submitText = document.getElementById('leadSubmitText');
  const successEl  = document.getElementById('leadSuccess');

  if (!modal || !form) return;

  // ── OPEN / CLOSE ─────────────────────────────────
  function openModal() {
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn && closeBtn.focus(), 60);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── TRIGGERS ─────────────────────────────────────
  const heroCta = document.getElementById('heroCtaBtn');
  if (heroCta) {
    heroCta.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  }

  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // ── SAVE LEAD TO SUPABASE ────────────────────────
  async function saveLead(data) {
    if (!sb) return;
    try {
      const { error } = await sb.from('leads').insert([data]);
      if (error) console.error('[BFC] Supabase insert error:', error.message);
    } catch (err) {
      console.error('[BFC] Supabase exception:', err);
    }
  }

  // ── FORM SUBMIT ──────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name   = form.leadName.value.trim();
    const phone  = form.leadPhone.value.trim();
    const select = form.leadDisc;
    const disc   = select.value;
    const discDisplay = select.selectedOptions[0]?.textContent || disc;
    const lang   = document.documentElement.dataset.lang || 'es';

    // Validate required fields
    if (!name || !phone) {
      const dict = window.BFC?.i18n?.dict?.[lang]?.modal;
      showError(dict?.required || 'Completá nombre y WhatsApp para continuar.');
      if (!name)  form.leadName.classList.add('field-error');
      if (!phone) form.leadPhone.classList.add('field-error');
      return;
    }

    // Disable submit during async work
    submitBtn.disabled = true;

    // Save to Supabase (fire-and-forget; errors are logged only)
    await saveLead({ name, phone, discipline: disc, lang, source: 'hero_cta' });

    // Show success state
    form.style.display   = 'none';
    if (errorEl) errorEl.hidden = true;
    if (successEl) successEl.hidden = false;

    // Build WhatsApp message
    const dict     = window.BFC?.i18n?.dict?.[lang]?.modal;
    const template = dict?.waMsg || 'Hola! Soy {name}. Me interesa {disc}. Mi número es {phone}.';
    const msg      = template
      .replace('{name}',  name)
      .replace('{disc}',  discDisplay)
      .replace('{phone}', phone);

    // Redirect after brief success display
    setTimeout(() => {
      window.open(
        `https://wa.me/${BFC_WA_NUMBER}?text=${encodeURIComponent(msg)}`,
        '_blank',
        'noopener'
      );
      closeModal();
      setTimeout(resetModal, 350);
    }, 1400);
  });

  // Clear errors on user input
  [form.leadName, form.leadPhone].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('field-error');
      if (!form.querySelector('.field-error') && errorEl) errorEl.hidden = true;
    });
  });

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function resetModal() {
    form.reset();
    form.style.display = '';
    if (successEl) successEl.hidden = true;
    if (errorEl)   errorEl.hidden   = true;
    submitBtn.disabled = false;
    form.querySelectorAll('.field-error').forEach(f => f.classList.remove('field-error'));
  }

  // ── MULTILINGUAL UPDATE ──────────────────────────
  function applyModalLang(lang) {
    const dict = window.BFC?.i18n?.dict?.[lang]?.modal;
    if (!dict) return;

    const setText = (id, key) => {
      const el = document.getElementById(id);
      if (el && dict[key] !== undefined) el.textContent = dict[key];
    };
    const setPlaceholder = (id, key) => {
      const el = document.getElementById(id);
      if (el && dict[key] !== undefined) el.placeholder = dict[key];
    };

    setText('leadEyebrowText', 'eyebrow');
    setText('leadTitle',       'title');
    setText('leadSub',         'sub');
    setText('leadNameLabel',   'nameLabel');
    setText('leadPhoneLabel',  'phoneLabel');
    setText('leadDiscLabel',   'discLabel');
    setText('leadSubmitText',  'submit');
    setText('leadSuccessText', 'success');
    setPlaceholder('leadName',  'namePlaceholder');
    setPlaceholder('leadPhone', 'phonePlaceholder');

    const closeEl = document.getElementById('leadClose');
    if (closeEl && dict.close) closeEl.setAttribute('aria-label', dict.close);

    // Update select option display text (not value — kept canonical)
    const selectEl = document.getElementById('leadDisc');
    if (selectEl && Array.isArray(dict.discOptions)) {
      Array.from(selectEl.options).forEach((opt, i) => {
        if (dict.discOptions[i] !== undefined) opt.textContent = dict.discOptions[i];
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.dataset.lang || 'es';
    applyModalLang(lang);
  });

  document.addEventListener('bfc:lang', e => {
    applyModalLang(e.detail.lang);
  });

})();
