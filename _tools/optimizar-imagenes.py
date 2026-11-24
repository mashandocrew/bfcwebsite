#!/usr/bin/env python3
"""Genera versiones AVIF y WebP de las imágenes del sitio (y una variante de 640 px
para móviles en las fotos grandes). Los originales JPG/PNG se conservan como respaldo
y para og:image / JSON-LD.

Uso:  python3 _tools/optimizar-imagenes.py            (todas las de la lista)
      python3 _tools/optimizar-imagenes.py walter.jpg  (solo esa)
Requiere Pillow con soporte AVIF (Pillow >= 11).
"""
import os, sys
from PIL import Image, ImageOps

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
# archivo relativo a assets/ -> (ancho máximo, generar variante de 640 px)
IMAGENES = {
    'images/logo-original.png':            (160,  False),
    'images/logo-tapa-team.png':           (180,  False),
    'images/gaston-hero.jpg':              (1600, True),
    'images/historia-bfc.jpg':             (1200, True),
    'images/walter.jpg':                   (1080, True),
    'images/gaston-solo.jpg':              (1200, True),
    'images/tapa-team-squad.jpg':          (1400, True),
    'images/tapa-team.jpg':                (900,  True),
    'images/gimnasio-1.webp':              (1080, True),
    'images/gimnasio-2.webp':              (1080, True),
    'images/tapa-entrenamiento-prueba.jpeg': (1200, True),
    'images/tapa-entrenamiento-01.jpg':    (1000, True),
    'images/tapa-entrenamiento-02.jpg':    (201,  False),
    'images/tapa-competencia-01.jpg':      (562,  False),
    'videos/video-Hero-poster.jpg':        (720,  False),
}
CALIDAD_WEBP, CALIDAD_AVIF = 78, 55

def redimensionar(im, ancho):
    if im.width <= ancho:
        return im
    alto = round(im.height * ancho / im.width)
    return im.resize((ancho, alto), Image.LANCZOS)

def guardar(im, base):
    im.save(base + '.webp', 'WEBP', quality=CALIDAD_WEBP, method=6)
    im.save(base + '.avif', 'AVIF', quality=CALIDAD_AVIF, speed=4)

def procesar(rel, ancho_max, movil):
    ruta = os.path.join(RAIZ, rel)
    base, ext = os.path.splitext(ruta)
    im = ImageOps.exif_transpose(Image.open(ruta))
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    grande = redimensionar(im, ancho_max)
    if ext.lower() == '.webp':
        grande.save(base + '.avif', 'AVIF', quality=CALIDAD_AVIF, speed=4)  # el WebP ya existe
    else:
        guardar(grande, base)
    if movil and im.width > 640:
        chica = redimensionar(im, 640)
        guardar(chica, base + '-640')
    tam = lambda p: os.path.getsize(p) // 1024 if os.path.exists(p) else 0
    print(f"{rel}: original {tam(ruta)} KB -> webp {tam(base + '.webp')} KB, avif {tam(base + '.avif')} KB"
          + (f", 640 avif {tam(base + '-640.avif')} KB" if movil else ''))

if __name__ == '__main__':
    pedidos = sys.argv[1:]
    for rel, (ancho, movil) in IMAGENES.items():
        if not pedidos or os.path.basename(rel) in pedidos:
            procesar(rel, ancho, movil)
