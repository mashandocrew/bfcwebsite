# Bonati Fight Club — Sitio Web

Sitio oficial de **Bonati Fight Club**, academia de K1, Muay Thai, MMA y Wrestling en Godoy Cruz, Mendoza, Argentina.

HTML/CSS/JS puro · Cero build · Multi-idioma ES/EN/PT · Tienda dinámica via JSON.

---

## Estructura

```
bfc-website/
├── index.html            Landing principal (ES default)
├── en/index.html         Redirect → setea idioma EN
├── pt/index.html         Redirect → setea idioma PT
├── store/index.html      Tienda oficial BFC Merch
├── tapa-team/index.html  Sección MMA & Wrestling
├── admin/products.json   Datos de productos (editable a mano)
└── assets/
    ├── css/  (main.css, animations.css, store.css)
    ├── js/   (i18n.js, main.js, store.js)
    ├── images/
    │   ├── logo.svg      ← SVG del logo
    │   ├── gaston-hero.jpg, walter-gaston.jpg, …
    │   ├── merch/        ← Fotos de productos
    │   └── gallery/      ← Torneos y fotos extra
    └── videos/
        └── video-Hero.mp4  ← Video del hero (loop, rotado 90°)
```

---

## Abrir en local

### Opción A — doble click
Abrí `index.html` directamente en el navegador.
⚠️ La **tienda** fallará porque `fetch('products.json')` requiere un servidor HTTP. Para la tienda, usá la Opción B.

### Opción B — servidor local (recomendado)
```bash
cd bfc-website
# Node
npx http-server -p 8080
# Python
python -m http.server 8080
```
Abrí `http://localhost:8080`.

---

## Cargar contenido real

### 1. Logo definitivo
Reemplazá **`assets/images/logo.svg`** por el logo vectorizado oficial.
Para convertir el JPG a SVG:
- **Vectorizer.ai** (online, rápido, mejor calidad)
- **Inkscape** → File → Import JPG → Path → Trace Bitmap → Save as Plain SVG

### 2. Video del hero
Ya está cargado en `assets/videos/video-Hero.mp4`.
El video se **rota 90°** automáticamente via CSS (`transform: rotate(-90deg)`). Si se ve al revés, cambiá `-90deg` por `90deg` en [main.css#hero-video](assets/css/main.css).

Para reemplazarlo:
```bash
cp /ruta/al/nuevo-video.mp4 assets/videos/video-Hero.mp4
```
Sugerido: H.264 MP4, máx. 5 MB, 720p o 1080p, duración 10–30 seg.

### 3. Fotos
```bash
cp /ruta/foto.jpg assets/images/gaston-hero.jpg
cp /ruta/foto.jpg assets/images/walter-gaston.jpg
cp /ruta/foto.jpg assets/images/gaston-walter.jpg
cp /ruta/foto.jpg assets/images/tapa-team.jpg
# galería
cp /ruta/foto.jpg assets/images/gallery/torneo-1.jpg
```

### 4. Productos de la tienda
Editá **`admin/products.json`**. Estructura:
```json
{
  "id": "bfc-short-001",
  "name": "Short BFC Competition",
  "category": "shorts",
  "price": 25000,          // 0 = "Consultar precio"
  "images": ["../assets/images/merch/short-001.jpg"],
  "description": "...",
  "sizes": ["S","M","L","XL"],
  "badge": "NUEVO",        // o "" vacío
  "available": true
}
```

Fotos de productos en `assets/images/merch/<id>.jpg`. Si no existe la foto, se muestra un placeholder "📷 CARGAR".

---

## Editar traducciones

Abrí **`assets/js/i18n.js`**. Tres objetos (`es`, `en`, `pt`) con las mismas claves. Los nombres propios (Walter Bonati, Gastón Silva, títulos) **no se traducen** — van fijos en HTML/i18n.

---

## Despliegue

### Netlify (drag & drop)
1. Entrá a https://app.netlify.com/drop
2. Arrastrá la carpeta `bfc-website/` completa
3. Listo — tenés un URL tipo `https://random.netlify.app`

### GitHub Pages
```bash
cd bfc-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<USUARIO>/bfc-website.git
git push -u origin main
```
En GitHub → Settings → Pages → Branch: `main` / Folder: `/` → Save.

### Vercel
```bash
npx vercel
```

---

## Contactos operativos

- **WhatsApp K1 / Muay Thai** (Walter): +54 9 261 571-0531
- **WhatsApp MMA / Wrestling** (Tapa Team): +54 9 261 467-1743
- **Instagram**: [@bonati_fightclub](https://instagram.com/bonati_fightclub)
- **Dirección**: Balcarce 230, Godoy Cruz, Mendoza, Argentina

---

## Checklist antes de publicar

- [ ] Reemplazar `logo.svg` por el logo oficial vectorizado
- [ ] Verificar rotación del video hero (si se ve invertido, cambiar `-90deg` → `90deg`)
- [ ] Cargar fotos de productos en `assets/images/merch/`
- [ ] Completar precios en `admin/products.json` (campo `price`)
- [ ] Verificar URLs de Instagram de Walter y Tonga
- [ ] Revisar dirección exacta en el mapa de Google (Balcarce 230)
- [ ] Probar desde mobile: navbar, idioma, video hero, WhatsApp links

#SiempreBFC
