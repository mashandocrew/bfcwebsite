# Diseño: Galería BFC — Reemplazo de Sección Comunidad

**Fecha:** 2026-05-21  
**Proyecto:** mashandocrew/bfcwebsite  
**Stack:** HTML vanilla, CSS puro, JS puro, Anime.js

---

## Contexto

La sección 07 "Comunidad BFC" permitía a los usuarios subir fotos desde el front, almacenarlas en un bucket de Supabase (`community-photos`) y aprobarlas desde un panel admin. Esta funcionalidad se reemplaza por una galería estática gestionada desde el repositorio, eliminando la dependencia de Supabase Storage y la tabla `community_photos`.

---

## Archivos afectados

| Archivo | Acción |
|---|---|
| `index.html` | Eliminar sección comunidad + modales + admin panel; agregar sección galería + admin panel nuevo |
| `assets/css/main.css` | Eliminar todos los estilos `.comm-*` |
| `assets/css/gallery.css` | Crear nuevo |
| `assets/js/gallery-data.js` | Crear nuevo con array `BFC_GALLERY` |
| `assets/js/community.js` | Eliminar el `<script>` tag (no borrar el archivo físico) |
| `gallery/.gitkeep` | Crear carpeta vacía para las fotos reales |

---

## Lo que NO se toca

- CDN de Supabase → se mantiene (`reviews.js` y `leads.js` usan `window.supabase.createClient`)
- Tablas `site_reviews` y `contact_leads`
- Ninguna otra sección del sitio
- Design system: colores `#0A0A0A`, `#C8102E`, `#D4A017`, fuentes Bebas Neue + Outfit

---

## Sección HTML — Galería BFC

Reemplaza el bloque `<!-- COMUNIDAD BFC -->` (líneas 433–462 index.html):

```html
<section class="section gallery-bfc" id="galeria">
  <div class="container">
    <header class="section-head reveal">
      <span class="eyebrow">07 — Galería</span>
      <h2 class="hl gallery-title">GALERÍA <b>BFC</b></h2>
      <p class="gallery-subtitle">Historia en imágenes</p>
    </header>
    <div class="gallery-grid" id="galleryGrid"></div>
  </div>
</section>
```

El grid se puebla completamente desde JS — sin HTML hardcodeado de fotos.

---

## Estructura de datos — `BFC_GALLERY`

```js
// assets/js/gallery-data.js
const BFC_GALLERY = [
  {
    src: 'gallery/foto-nombre.jpg',
    alt: 'Descripción de la foto',
    size: 'large',   // 'large' | 'medium' | 'small'
    year: '2022'     // opcional
  },
  // ...
];
```

**Placeholders durante desarrollo:** 12 entradas usando `https://picsum.photos/` con dimensiones distintas por `size`:
- `large` → 800×600 (ocupa 2 filas en el grid)
- `medium` → 600×600 (ocupa 1 fila)
- `small` → 400×600 (ocupa 1 fila)

---

## Layout CSS Grid (Opción B: Grid con `grid-row: span N`)

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 260px;
  gap: 12px;
}

.gallery-item[data-size="large"]  { grid-row: span 2; }
.gallery-item[data-size="medium"] { grid-row: span 1; }
.gallery-item[data-size="small"]  { grid-row: span 1; }

@media (max-width: 900px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .gallery-grid { grid-template-columns: 1fr; }
}
```

Cada `.gallery-item`:
- `border-radius: 4px`
- `box-shadow: 0 4px 20px rgba(200,16,46,0.15)`
- Overlay hover: darkening + ícono de lupa dorado (`#D4A017`)
- `overflow: hidden` para contener la imagen

---

## Animaciones Anime.js

### Entrada al viewport (Intersection Observer)

Cada item recibe una animación según su `size`, con stagger de 100ms:

| `size` | Animación |
|---|---|
| `large` | `translateY: [40, 0]`, `opacity: [0, 1]` |
| `medium` | `translateX: [±30, 0]`, `opacity: [0, 1]` (alternado par/impar) |
| `small` | `scale: [0.9, 1]`, `opacity: [0, 1]` |

- `easing: 'easeOutExpo'`
- `duration: 700ms`
- El observer se desregistra una vez que el item anima (one-shot)

### Hover

```js
item.addEventListener('mouseenter', () =>
  anime({ targets: item, scale: 1.03, duration: 250, easing: 'easeOutQuad' })
);
item.addEventListener('mouseleave', () =>
  anime({ targets: item, scale: 1, duration: 250, easing: 'easeOutQuad' })
);
```

### Parallax del contenedor (scroll)

```js
window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.04;
  anime({ targets: '#galleryGrid', translateY: offset, duration: 0 });
}, { passive: true });
```

Se aplica al contenedor `#galleryGrid`, no a los items individuales.

---

## Panel Admin actualizado

**Trigger:** `Shift+A+D+M+I+N` → password `BFC2025admin` (sin cambios)

**Módulo eliminado:** aprobación de `community_photos`

**Módulo nuevo — "Gestión de Galería":**
- Lista de fotos del array `BFC_GALLERY` (nombre de archivo, size, year)
- Botón "Ver en sitio" → scrollea a `#galeria`
- Instrucciones en español para agregar fotos
- `<textarea readonly>` con template copiable para una nueva entrada del array

---

## Cambios en Supabase

| Elemento | Acción |
|---|---|
| CDN `@supabase/supabase-js@2` | ✅ SE MANTIENE |
| Tabla `community_photos` | ❌ Código JS eliminado |
| Bucket `community-photos` | ❌ Código de storage upload eliminado |
| Tabla `site_reviews` | ✅ SIN TOCAR |
| Tabla `contact_leads` | ✅ SIN TOCAR |

---

## Navbar

No existe actualmente ningún link "Comunidad" en la barra de navegación — el paso de renombrar no aplica.

---

## Restricciones absolutas

- No modificar ninguna otra sección
- No agregar frameworks ni dependencias nuevas
- No usar `community.js` en ningún `<script>` tag
- `main.css` mantiene todas sus reglas salvo los bloques `.comm-*`
