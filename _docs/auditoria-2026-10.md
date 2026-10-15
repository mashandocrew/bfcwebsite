# Auditoría SEO · GEO · UX · CRO · Copy — bonatifightclub.com.ar

Fecha: 14/10/2026 · Alcance: home, `/tapa-team/`, `/store/`, `/en/`, `/pt/`, `/admin/`, `migrate-gallery.html`, JS propios (`i18n.js`, `reviews.js`, `gallery.js`, `leads.js`, `store.js`), metadatos, JSON-LD, robots.txt, sitemap, medios.
Tipo de sitio: negocio local con local físico (academia de deportes de combate) + tienda en preparación · Zona: Godoy Cruz, Mendoza · Objetivo: «kickboxing / K1 / Muay Thai / MMA / Wrestling» + Godoy Cruz / Mendoza.
Publicación: GitHub Pages (`CNAME`), sin `.nojekyll` → las carpetas que empiezan con `_` no se publican. Cada push a `main` es producción.

---

## §0 Fuera del alcance, pero urgente: seguridad del panel y de Supabase

Visto de paso, sin probarlo ni explotarlo. No se reproduce ninguna contraseña.

1. **🔴 El login de `/admin/` se valida en el navegador.** La contraseña está en el JS público de la página, solo codificada (Base64), no cifrada. Cualquiera que abra el código fuente puede entrar al panel. **Qué hacer:** pasar el panel a Supabase Auth (link mágico por email para Walter y quien administre) y **cambiar la contraseña actual**, porque hay que darla por conocida.
2. **🔴 Reglas RLS demasiado abiertas** (según `_tools/supabase-setup.sql` y el SQL que trae el panel; confirmar en el panel de Supabase cuáles están activas):
   - `community_photos`: `update` y `delete` con `using (true)` para el rol anónimo → cualquiera con la clave pública (está en el JS, como debe ser) puede **borrar o reemplazar todas las fotos de la galería** sin pasar por el panel.
   - `site_reviews`: `insert ... with check (true)` → cualquiera puede publicar reseñas ya aprobadas. En esta fase el formulario del sitio pasó a enviar `approved: false` (quedan pendientes en `/admin/`), pero **la regla de la base es la que protege de verdad**.
   - El panel también define `read_reviews` con `using (true)`: cualquiera puede leer las reseñas pendientes.
   - **SQL propuesto** (probar primero; requiere el punto 1 para que el panel siga pudiendo moderar):
     ```sql
     -- Reseñas: el público solo crea pendientes y lee aprobadas
     drop policy if exists "insert_reviews" on public.site_reviews;
     create policy "insert_reviews" on public.site_reviews
       for insert to anon with check (approved = false);
     drop policy if exists "read_reviews" on public.site_reviews;
     create policy "read_reviews" on public.site_reviews
       for select to anon using (approved = true);
     create policy "admin_all_reviews" on public.site_reviews
       for all to authenticated using (true) with check (true);

     -- Fotos: el público solo sube pendientes; editar/borrar solo admin logueado
     drop policy if exists "admin_update_photos" on public.community_photos;
     drop policy if exists "admin_delete_photos" on public.community_photos;
     drop policy if exists "insert_photos" on public.community_photos;
     create policy "insert_photos" on public.community_photos
       for insert to anon with check (approved = false);
     create policy "admin_all_photos" on public.community_photos
       for all to authenticated using (true) with check (true);
     ```
3. **Ya aplicado en esta fase:** se quitó el link «Admin» del footer público; `migrate-gallery.html` (escribe en Supabase), `supabase-setup.sql` y `setup.sh` se movieron a `_tools/` (no se publican).

---

## Estado al 15/10/2026

- **Publicado:** Fases 1, 3 y 4, y la parte de la Fase 2 que dependía de datos del club (ver §7).
- **Pendiente del club, en este orden:** (1) aplicar el copy con `propuestas-copy-2026-10.md`; (2) después, GA4 (marcar `whatsapp_click` como evento clave y crear la dimensión `linea`), Search Console (propiedad, sitemap, indexación) y Bing Webmaster Tools (importar desde Search Console). Pasos en §10.
- **Decisión del club:** el panel de `/admin/` y las reglas de Supabase quedan como están (§0).

## Resumen ejecutivo

1. **La base SEO ya estaba bien encaminada** (canonical de la home, JSON-LD completo, FAQ visible igual al FAQPage, robots con bots de IA). Lo que fallaba era el resto del sitio: `/tapa-team/` sin canonical, sin og:image y sin JSON-LD; favicons de Tapa Team inexistentes; tienda indexable mostrando «📷 CARGAR» en 14 productos.
2. **Lo que más autoridad le da al club era invisible para las IA.** Los títulos de Tonga (Sudamericano FFG 2025, Argentino ISKA 2023, Argentino FFG 2021, oro WKF 2019, Senado de Mendoza), la línea de tiempo desde 2010 y los datos de los profesores solo existían en `i18n.js`: ChatGPT, Claude o Perplexity leían 974 palabras y no veían ningún título. **Corregido:** ahora están en el HTML (1.136 palabras).
3. **Peso:** el video del hero pesaba 12,2 MB, duraba 143 s, tenía audio sin usar y se precargaba con prioridad alta en cada visita. **Corregido:** 60 s, sin audio, 2,6 MB, con póster de 38 KB y sin precarga forzada. Queda pendiente la foto de Tonga (`gaston-solo.jpg`, **8,5 MB**, 3648×5472) y otras dos de 1,6 MB (Fase 3).
4. **No había medición de conversiones.** GA4 cargaba, pero ningún clic a WhatsApp se registraba: no existe línea de base para demostrar mejoras. **Corregido:** eventos `whatsapp_click` (con la línea K1 o MMA), `instagram_click` y `maps_click` en todas las páginas.
5. **Copy:** pocas marcas de IA (pasión ×1, compromiso ×1, «todo el país» ×1, 9 rayas), pero hay **datos que envejecen** («Quince años», «15+», «hace aproximadamente un año», «© 2025»), **promesas distintas** («2 clases de prueba gratuitas» en la home vs. «Clase de prueba gratis» en Tapa Team) y **mezcla de trato** («Síguenos» en el footer de un sitio que vosea). Propuestas en `propuestas-copy-2026-10.md`.

**Sobre el mapa (Local Pack).** Para «kickboxing Godoy Cruz» o «muay thai Mendoza», los tres primeros resultados son el mapa de Google, y el mapa se gana sobre todo con el Perfil de Empresa: categorías, reseñas y fotos. El sitio muestra 4 reseñas de 5★ y declara `reviewCount: 4` en el JSON-LD; si el perfil de Google tiene otra cifra, hay que alinearla [CONFIRMAR]. La web ayuda (relevancia y confianza), pero el plan tiene que incluir el Perfil: ver `kit-perfil-google.md`.

---

## 1. 🔴 Crítico: arreglar primero

| # | Hallazgo | Dónde | Fix | Esfuerzo | Estado |
|---|---|---|---|---|---|
| 1 | Login de admin validado en el navegador; RLS abiertas | `/admin/`, Supabase | §0 | medio | **No se cambia (decisión del club, 15/10)** |
| 2 | Títulos, línea de tiempo y datos de profesores solo en JS | home | Pasarlos al HTML estático | bajo | ✅ |
| 3 | Video hero de 12,2 MB precargado con `fetchpriority=high` | home | 60 s sin audio y sin recomprimir (MP4 4,8 MB) + AV1 3,3 MB, póster, sin `preload`; cubre la pantalla en celular | bajo | ✅ |
| 4 | `robots.txt`: los grupos propios de Googlebot, GPTBot, ClaudeBot… no heredan `Disallow: /admin/` | robots.txt | Un solo grupo con todos los `User-agent` | bajo | ✅ |
| 5 | Tienda indexable con «📷 CARGAR» y precios «Consultar» | `/store/` | `noindex`, fuera del menú, footer y sitemap | bajo | ✅ |
| 6 | Herramientas internas publicadas (`migrate-gallery.html`, SQL, script) | raíz | Mover a `_tools/` | bajo | ✅ |
| 7 | Galería con respaldo de fotos de stock (picsum) y leyendas inventadas si falla Supabase | `gallery-data.js` | Sin respaldo: si no hay fotos reales, la sección se oculta | bajo | ✅ |
| 8 | Foto de 8,5 MB en la tarjeta de Tonga | home | JPG 1200 px, 157 KB | bajo | ✅ |
| 9 | H1 de la home sin keyword («Bonati Fight Club») | home | Ver propuesta de copy §4 | bajo | Propuesta |

## 2. SEO

### 2.1 Mapa de keywords

| Búsqueda objetivo | Página que debería ganarla | Situación actual |
|---|---|---|
| kickboxing Godoy Cruz / Mendoza, K1 Mendoza | Home | Title ahora con la keyword y la zona. H1 sin keyword (propuesta). |
| muay thai Mendoza / Godoy Cruz | Home (a futuro, página propia) | Solo una tarjeta de 15 palabras. **Fase 2:** página `/muay-thai-mendoza/` si usted la aprueba. |
| MMA Mendoza, wrestling Mendoza | `/tapa-team/` | Title, canonical y JSON-LD nuevos. **Falta el horario de MMA**: no figura en ninguna página [CONFIRMAR]. |
| gimnasio de artes marciales Godoy Cruz | Home | Cubierta por title, JSON-LD y dirección en texto. |
| kickboxing para chicos / adolescentes Mendoza | **No existe** | Tapa Team dice «desde 12 años». ¿Hay K1/Muay Thai para menores? [CONFIRMAR] Si sí, merece sección o página. |
| Walter Bonati, Gastón «Tonga» Silva | Home | Ahora con títulos en HTML y `Person` en JSON-LD. |

### 2.2 Acciones

1. ✅ Title home: `Kickboxing, Muay Thai y MMA en Godoy Cruz | Bonati Fight Club` (61 car.). Meta: 150 car., con «desde 2010» y el título de Tonga.
2. ✅ `/tapa-team/`: title `MMA y Wrestling en Godoy Cruz, Mendoza | Tapa Team · BFC`, meta, canonical, Open Graph, JSON-LD `SportsTeam` + `WebPage` + `BreadcrumbList` enlazados al `@id` del club.
3. ✅ `/en/` y `/pt/`: `noindex`. Son redirecciones por JS sin contenido; el idioma se cambia en la misma URL, así que Google y las IA solo leen el español. Si el público extranjero importa, la solución real son URLs propias con `hreflang` (proyecto aparte).
4. ✅ Sitemap: home y Tapa Team, `lastmod` 2026-10-14. La tienda vuelve cuando tenga fotos.
5. 🟢 H1 con keyword (ver copy). 🟢 Jerarquía H2→H4 en el footer (los `h4` del footer pueden ser `p` o `h2` visualmente chicos).
6. 🟡 `aggregateRating` del JSON-LD: Google no muestra estrellas para reseñas que el negocio publica sobre sí mismo. Mantenerlo solo si la cifra coincide con las reseñas visibles; idealmente, las del Perfil de Google [CONFIRMAR].
7. 🟡 Coordenadas: el JSON-LD dice −32.92235, −68.84212 y el mapa embebido apunta a −32.9275, −68.8458: **669 m de diferencia**. Confirmar el pin real en Google Maps y unificar los dos [CONFIRMAR].

## 3. GEO: cómo lo leen ChatGPT, Gemini, Claude y Perplexity

**Lo que ya está bien:** robots.txt permite a todos los bots de IA; JSON-LD con fundador, entrenadores, horario, dirección y FAQ; FAQ visible con respuestas que arrancan por la respuesta («No.», «Sí.»); dirección y teléfonos en texto.

**Lo que falta:**
1. ✅ Contenido de autoridad en HTML (títulos, línea de tiempo, bullets de profesores).
2. 🟢 **Párrafo de entidad** visible (propuesta en `propuestas-copy-2026-10.md` §3). Hoy no hay ninguna oración que diga en un solo lugar qué es, dónde está, desde cuándo y qué enseña.
3. 🟢 **Datos en vez de adjetivos:** cuota mensual o «desde $…», duración de la clase, qué llevar, si prestan guantes, edad mínima por disciplina [CONFIRMAR cada uno]. Son las preguntas que las IA no pueden responder hoy.
4. 🟢 **Horario de Tapa Team** en texto y en el JSON-LD.
5. 🟢 **`sameAs`:** solo figura Instagram. Sumar Facebook, Google Maps (URL del perfil), YouTube o TikTok si existen [CONFIRMAR URLs].
6. 🟢 **Menciones externas:** nota de prensa del Senado de Mendoza sobre Tonga, cobertura del Sudamericano FFG, federaciones (FFG, ISKA, WKF Argentina), medios de Godoy Cruz. Confirmar cuáles ya existen y pedir que enlacen al sitio.
7. 🟢 `llms.txt` (opcional, bajo impacto).

## 4. UX y conversión

- ✅ Póster en el video: el hero ya no queda negro mientras carga.
- 🟡 **Dos WhatsApp compitiendo en la home** sin explicación arriba del pliegue: el CTA principal va siempre a K1. Propuesta: el formulario de contacto ya elige el número según la modalidad; replicar esa lógica con un selector simple («¿K1/Muay Thai o MMA?») o dejar claro en el botón a qué línea va.
- 🟡 **Mensaje pre-redactado:** los botones de la home abren WhatsApp vacío; solo Tapa Team trae texto. Propuesta: `?text=Hola, quiero coordinar una clase de prueba de K1/Muay Thai`.
- 🟡 **Formulario de reseñas propio:** desvía reseñas que valdrían más en Google. Cuando tengan el link «Pedir reseñas» del Perfil, el botón principal debería ir ahí.
- 🟢 11 imágenes sin `width`/`height` (riesgo de saltos de layout).
- 🟢 Promesa de respuesta: hoy «arreglamos tu primera clase hoy mismo» (Tapa Team) y ninguna en la home. Unificar [CONFIRMAR].

## 5. Copy con marcas de IA

### Patrones detectados en todo el sitio

| Patrón | Ejemplos reales (con conteo) | Qué hacer |
|---|---|---|
| Datos que envejecen | «Quince años», «15+», «Más de 15 años», «hace aproximadamente un año» ×2, «© 2025» ×3 (corregido) | «Desde 2010», «desde 2025» |
| Grandilocuencia | «una de las academias más reconocidas de Argentina», «el futuro de las artes marciales mixtas mendocinas» ×2, «atletas de élite» | Hechos: títulos, eventos, años |
| Fórmulas de marketing | «desde la pasión», «disciplina y compromiso» | Borrar o decir el hecho |
| Tríadas | «disciplina, respeto y voluntad», «Ritmo, explosividad y precisión» | Cortar o reemplazar por un dato |
| Promesas inconsistentes | «2 clases de prueba gratuitas» vs. «Clase de prueba Gratis» | Una sola [CONFIRMAR] |
| Mezcla de trato | «Síguenos» (tú) en 3 footers; resto en voseo | «Seguinos» |
| Rayas | 9 en el texto principal | Punto o coma |
| Afirmación sin fuente | «reconocida entre las academias destacadas de Mendoza» | Nombrar quién la reconoció o borrar |

### Página por página

- **Home:** copy correcto en general, con voz propia («Elegí tu round», «Antes de tu primera clase»). Problemas: H1 sin keyword, datos que envejecen, párrafo de historia grandilocuente, frase de Walter repetida dos veces.
- **Tapa Team:** H1 sin keyword, sin horario, stat vacío («Entrenamientos / Semanales»), «todo el país» sin eventos concretos.
- **Tienda:** sin fotos ni precios; fuera del índice hasta completarla.

## 6. Fuera de la web

Perfil de Empresa de Google (categorías, servicios con link, horario por turno, fotos mensuales), plan de reseñas con meta concreta, citas NAP idénticas (Instagram, Facebook, Apple Maps, Bing Places), menciones de federaciones y prensa. Todo en `kit-perfil-google.md`.

## 7. Plan por fases

| Fase | Qué | Prioridad | Esfuerzo | Quién | Estado |
|---|---|---|---|---|---|
| 0 | Seguridad del panel y RLS (§0) | 🔴 | medio | Usted / dev, con el SQL propuesto | No se cambia (decisión del club) |
| 1 | Críticos: contenido estático, robots, metadatos y JSON-LD de Tapa Team, video, GA4, tienda noindex, archivos internos fuera | 🔴 | bajo | Claude | ✅ publicado (#3, #4) |
| 2 | Página `/muay-thai-mendoza/` (y quizás K1 / menores), horario de MMA, párrafo de entidad, FAQ ampliado | 🟢 | medio | Claude, con datos confirmados | Parcial: horario de MMA, FAQ (8 preguntas), reseñas 4,9/112, coordenadas y fuente de la pandemia ✅ (#5). Página de Muay Thai y párrafo de entidad: después del copy |
| 3 | Rendimiento: `gaston-solo.jpg` 8,5 MB, `historia-bfc.jpg` y `tapa-entrenamiento-01.jpg` 1,6 MB, `logo-tapa-team.png` 590 KB, favicons de 38 KB, `width`/`height` | 🟡 | bajo | Claude | ✅ publicado (#5). Falta: fotos de mejor resolución para `tapa-entrenamiento-02.jpg` (201×251) y `tapa-competencia-01.jpg` |
| 4 | UX: selector de línea de WhatsApp, mensajes pre-redactados, botón de reseña a Google | 🟡 | bajo | Claude | ✅ publicado (#7) |
| 5 | Copy | 🟢 | medio | Usted, con `propuestas-copy-2026-10.md` | Pendiente |
| 6 | Perfil de Google y reseñas | 🟢 | continuo | El club, con `kit-perfil-google.md` | Pendiente |

## 8. Inventario técnico: no tocar

- **GA4:** `G-04MT2XNK8L` en todas las páginas. Eventos nuevos (`assets/js/tracking.js`): `whatsapp_click` (parámetro `linea`: `k1_muay_thai` / `mma_wrestling`), `instagram_click`, `maps_click`. Se detectan por el `href` (`wa.me/5492615710531`, `wa.me/5492614671743`): si cambia un número, actualizar `tracking.js`.
- **Ids de sección** (menú y anclas): `#home`, `#academy`, `#champions`, `#history`, `#coaches`, `#schedule`, `#tapa`, `#galeria`, `#reviews`, `#faq`, `#contact`.
- **JS:** `#contactForm` (abre WhatsApp según modalidad), `#revForm`, `#revStarPicker`, `#revGoogleBtn`, `#reviews-grid`, `#galleryGrid`, `#gallerySwipeHint`, `[data-disc-carousel]`, `[data-champions-quote]`, `.count[data-target]`, `#navToggle`, `#navLinks`.
- **i18n:** todo `data-i18n`, `data-i18n-html`, `data-i18n-list`, `data-i18n-placeholder`. **Cualquier cambio de texto va en el HTML y en `assets/js/i18n.js`** (si no, el JS pisa el texto nuevo).
- **Tienda:** `admin/products.json` lo lee `store.js`; no mover.

## 9. Verificación manual requerida

- [ ] Cambiar la contraseña del panel y revisar las políticas RLS activas en Supabase (§0).
- [ ] Pin real en Google Maps (diferencia de 669 m entre JSON-LD y mapa embebido).
- [ ] Cantidad y nota de reseñas en el Perfil de Google; link «Pedir reseñas»; Place ID (hoy `reviews.js` tiene `TU_PLACE_ID_AQUI`).
- [ ] ¿1 o 2 clases de prueba gratis? ¿Para todas las disciplinas?
- [ ] «300+ alumnos activos»: cifra real.
- [ ] Horario de Tapa Team (MMA y Wrestling) y de los turnos para menores.
- [ ] Edad mínima por disciplina; cuota o precio orientativo; si prestan guantes.
- [ ] Quién reconoció al club «entre las academias destacadas» en la pandemia (nota, medio o institución).
- [ ] URLs de Facebook, YouTube, TikTok o perfil de Google para `sameAs`.
- [ ] Revisar el video de 60 s en un celular (orientación y encuadre) antes de publicar.
- [ ] Fotos de productos de la tienda (para reactivarla).

## 10. Cómo medirlo

**Línea de base (hoy, antes del merge):**
- GA4: no hay eventos de conversión previos, así que la línea de base arranca con el deploy. En GA4 → Administrar → Eventos, marcar `whatsapp_click` como **evento clave** y registrar `linea` como dimensión personalizada.
- Search Console: impresiones, clics y posición de «kickboxing mendoza», «kickboxing godoy cruz», «muay thai mendoza», «mma mendoza», «bonati fight club». Pedir indexación de `/` y `/tapa-team/` después del deploy.
- Rendimiento: medir en [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fbonatifightclub.com.ar%2F) la versión publicada hoy y repetir tras el deploy. Estimación por pesos: la home pasó de ~24 MB de medios pesados a ~13 MB; con la Fase 3 baja a ~3 MB.
- Perfil de Google: capturas de «Rendimiento» (vistas, llamadas, cómo llegar, clics al sitio, reseñas).

**Protocolo en IAs** (ChatGPT con búsqueda, Gemini, Perplexity, Claude), mismas preguntas cada mes:
1. «¿Dónde puedo entrenar kickboxing en Godoy Cruz, Mendoza?»
2. «¿Qué academia de Muay Thai me recomendás en Mendoza?»
3. «¿Dónde entrena MMA en Mendoza?»
4. «¿Quién es Gastón Tonga Silva?»
5. «¿Bonati Fight Club es bueno? ¿Qué opinan?»

| Pregunta | IA | ¿Aparece? | Puesto | Datos que dice (¿correctos?) | Fuentes que cita | Competidores |
|---|---|---|---|---|---|---|
| | | | | | | |

**Re-medición:** a las 4 y 8 semanas del deploy, mismos KPIs. Se reporta el delta, no la sensación.
