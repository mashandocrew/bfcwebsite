# Rendimiento de carga — noviembre 2026

Optimización de las páginas públicas. El panel `/admin/` no se tocó.

## Medición

Home en un Pixel 7 emulado (Playwright), servidor local, sin caché, recorriendo la página entera. La galería y las reseñas se leyeron de Supabase real; los envíos de reseñas se simularon y no se escribió nada en la base.

| | Antes | Después |
|---|---|---|
| Pedidos hasta el evento `load` | 43 | 27 |
| Descargado al abrir (antes de scrollear) | 2.880 KB | 1.593 KB |
| Descargado recorriendo toda la home | 4.738 KB | 3.335 KB |
| Consultas a Supabase al abrir la home | 6 (4 de "semilla" de reseñas + galería + reseñas), al cargar | 0 al cargar; 2 cuando el visitante llega a esas secciones |
| Advertencias en consola | "Multiple GoTrueClient instances" | ninguna |

## Qué se hizo

1. **Skeletons de carga**: tienda (mientras baja el catálogo) y galería; las reseñas estáticas ya vienen en el HTML.
2. **Imágenes AVIF/WebP**: `<picture>` con AVIF, WebP y el JPG/PNG original de respaldo; variantes de 640 px para móviles; fondos CSS con `image-set()`. Los originales quedan para `og:image` y JSON-LD. Regenerar con `python3 _tools/optimizar-imagenes.py`.
3. **Llamadas duplicadas**: un único cliente (`assets/js/bfc-api.js`) en lugar de un `createClient` por módulo; las lecturas iguales en vuelo comparten la misma promesa. Tras enviar una reseña ya no se vuelve a pedir la lista, porque la reseña nueva no es pública hasta que se aprueba.
4. **Debounce**: no aplica. Las páginas públicas no tienen buscador ni autocompletado; la tienda filtra con botones.
5. **Paginación**: galería de a 12 fotos y reseñas de a 6, con botón "Ver más". Solo se piden las columnas que se usan.
6. **CDN**: el sitio ya pasa por Cloudflare. anime.js quedó con versión fija (`@4.1.4`, la misma que servía `@4`) y los íconos se sirven desde el propio sitio.
7. **Cola de trabajos**: no aplica en un sitio estático: no hay servidor propio ni tareas lentas en las páginas públicas.
8. **Consultas N+1**: se eliminó la "semilla" de reseñas que corría en cada visita (una consulta por reseña más posibles inserciones). Esas reseñas ya están en `_tools/supabase-setup.sql`.
9. **Brotli/Gzip**: ya activo (Cloudflare sirve el HTML con Brotli y el CSS/JS con Gzip).
10. **Caché**: no hay servidor para usar Redis. En su lugar, las lecturas públicas se guardan 5 minutos en `sessionStorage`, el catálogo de la tienda se revalida (`no-cache`, responde 304 si no cambió) en vez de bajarse entero (`no-store`), y los recursos tienen `?v=` para poder usar caché larga.
11. **Dependencias sin usar**: fuera `supabase-js` en las páginas públicas (≈48 KB comprimidos), el cargador de Phosphor (6 hojas de ≈80 KB sin comprimir + fuentes de ≈140 KB) reemplazado por un subconjunto local de 14 íconos (≈7 KB), `assets/js/community.js` (no lo cargaba ninguna página y tenía una contraseña en texto plano) y `assets/models/boxing_gloves*` (sin referencias).
12. **Timeout en APIs externas**: 8 s en cada llamada a Supabase (AbortController); si vence, la página sigue con el contenido estático.
13. **Respuestas de IA token a token**: no aplica; el sitio no usa IA.
14. **Optimistic UI**: al enviar una reseña aparece al instante marcada "En revisión" (solo para quien la escribió); si falla se quita y el texto vuelve al formulario.
15. **Lazy loading**: fotos de profesores y Tapa Team en `loading="lazy"` + `decoding="async"` (la de Walter estaba en `eager` estando fuera de pantalla); fondos de disciplinas con carga diferida (`data-bg`); galería y reseñas consultan recién cuando el visitante se acerca.

## Pendientes y observaciones

- **Fotos de la galería en Supabase Storage**: hay una de 274 KB. Conviene subirlas ya en WebP o redimensionadas desde el admin, o activar las transformaciones de imagen de Supabase (plan pago).
- **Mapa de Google**: resuelto con una fachada (ver abajo). **gtag** (179 KB) sigue siendo el mayor peso de terceros.
- **Video del hero** (985 KB): ya tiene variante lite y póster (ahora en WebP); se podría bajar aún más con AV1/VP9.
- **Cloudflare**: el HTML se cachea 10 min y los recursos 4 h. Con los `?v=` se puede subir a un año para `assets/` con una regla de caché.
- **Seguridad**: `community.js` se borró, pero la contraseña sigue en el historial de git. Si se usó en algún lado, hay que cambiarla.

## Mapa con fachada (2026-11-20)

El iframe de Google Maps de la sección Contacto descargaba entre 780 y 980 KB (scripts, teselas y fuentes) en cuanto el visitante se acercaba al final de la home, aunque no lo usara.

- Ahora se muestra una **imagen estática** del mismo punto (−32,92239; −68,84214, igual que el JSON-LD y `geo.position`): 23 KB en móvil y 44 KB en escritorio (AVIF, con WebP y JPG de respaldo). Tiene el mismo tratamiento oscuro que el iframe.
- **"Ver mapa interactivo"** inserta el iframe al tocarlo. Las conexiones con Google se precalientan al pasar el cursor o tocar el botón, y la imagen queda visible hasta que el mapa terminó de cargar.
- **"Cómo llegar"** abre la ruta en Google Maps directamente.
- Sin JavaScript, el botón abre Google Maps en otra pestaña.
- Textos en ES/EN/PT (`contact.mapLoad`, `contact.mapDir`).
- La imagen sale de teselas de OpenStreetMap (© OpenStreetMap contributors, atribución en la esquina). Si cambia el pin, se regenera con `python3 _tools/mapa-estatico.py`.
