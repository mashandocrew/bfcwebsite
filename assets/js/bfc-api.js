/* BFC · API — cliente mínimo para la API REST de Supabase.
   Reemplaza a supabase-js en las páginas públicas (≈48 KB comprimidos menos por visita).

   - Un solo cliente compartido por galería y reseñas.
   - Timeout en cada llamada: si Supabase no responde en 8 s se corta y la página sigue.
   - Deduplicación: dos lecturas iguales en vuelo comparten la misma promesa.
   - Caché en sessionStorage (5 min) para las lecturas públicas: al navegar entre
     páginas o volver a la home no se repite la consulta.
   - Paginación con limit/offset; pide un registro de más para saber si hay otra página.

   Uso:
     BFC_API.select('site_reviews', { select: 'author_name,rating', filters: { approved: 'eq.true' },
                                      order: 'created_at.desc', limit: 6, offset: 0 })
       .then(function (r) { r.data; r.hasMore; });
     BFC_API.insert('site_reviews', { ... });
*/
(function () {
  'use strict';

  var BASE = 'https://kmlobikkamhnzkmbtckg.supabase.co/rest/v1/';
  /* Clave pública "anon" (la misma que ya usaba el sitio). Los permisos los define RLS en Supabase. */
  var KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbG9iaWtrYW1obnprbWJ0Y2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjYyOTQsImV4cCI6MjA5MjQwMjI5NH0.yeN_hygM4q9tZIq4hst6-6SzeAf5mdLnTuWG-eLatts';

  var TIMEOUT_MS = 8000;
  var TTL_MS     = 5 * 60 * 1000;
  var PREFIX     = 'bfc:api:';
  var inflight   = {};

  function headers(extra) {
    var h = { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  /* fetch con timeout (AbortController) */
  function request(url, opts, ms) {
    opts = opts || {};
    var ctrl  = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = null;
    if (ctrl) {
      opts.signal = ctrl.signal;
      timer = setTimeout(function () { ctrl.abort(); }, ms || TIMEOUT_MS);
    }
    return fetch(url, opts).then(
      function (res) { clearTimeout(timer); return res; },
      function (err) {
        clearTimeout(timer);
        throw (err && err.name === 'AbortError') ? new Error('Tiempo de espera agotado') : err;
      }
    );
  }

  function cacheGet(key) {
    try {
      var raw = sessionStorage.getItem(key);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (Date.now() - o.t > TTL_MS) { sessionStorage.removeItem(key); return null; }
      return o.v;
    } catch (e) { return null; }
  }

  function cacheSet(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value })); } catch (e) {}
  }

  function select(table, q) {
    q = q || {};
    var params = ['select=' + encodeURIComponent(q.select || '*')];
    var f = q.filters || {};
    Object.keys(f).forEach(function (k) {
      params.push(encodeURIComponent(k) + '=' + encodeURIComponent(f[k]));
    });
    if (q.order) params.push('order=' + encodeURIComponent(q.order));
    var limit = q.limit != null ? q.limit : null;
    if (limit != null) params.push('limit=' + (limit + 1));   /* +1 para saber si hay más */
    if (q.offset) params.push('offset=' + q.offset);

    var url = BASE + table + '?' + params.join('&');
    var key = PREFIX + url;
    var useCache = q.cache !== false;

    if (useCache) {
      var hit = cacheGet(key);
      if (hit) return Promise.resolve(hit);
    }
    if (inflight[key]) return inflight[key];

    var p = request(url, { headers: headers() })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rows) {
        rows = rows || [];
        var hasMore = limit != null && rows.length > limit;
        var out = { data: hasMore ? rows.slice(0, limit) : rows, hasMore: hasMore };
        if (useCache) cacheSet(key, out);
        return out;
      });

    inflight[key] = p;
    var clear = function () { delete inflight[key]; };
    p.then(clear, clear);
    return p;
  }

  function insert(table, row) {
    return request(BASE + table, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(row)
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error('HTTP ' + res.status + ' ' + t); });
    });
  }

  /* Borra de la caché las lecturas de una tabla (por ejemplo, después de escribir en ella). */
  function invalidate(table) {
    try {
      var needle = PREFIX + BASE + table + '?';
      for (var i = sessionStorage.length - 1; i >= 0; i--) {
        var k = sessionStorage.key(i);
        if (k && k.indexOf(needle) === 0) sessionStorage.removeItem(k);
      }
    } catch (e) {}
  }

  window.BFC_API = { select: select, insert: insert, invalidate: invalidate };
})();
