#!/usr/bin/env python3
"""Genera la imagen estática del mapa de contacto (assets/images/mapa/).

La home muestra esta imagen en lugar del iframe de Google Maps, que se carga solo
si el visitante toca "Ver mapa interactivo". Si cambia el pin, actualizar LAT/LON
(deben coincidir con el JSON-LD, la meta geo.position y data-map-src del index.html)
y volver a correr:

    python3 _tools/mapa-estatico.py

Usa unas pocas teselas de OpenStreetMap, una sola vez (© OpenStreetMap contributors,
licencia ODbL: la atribución está en la esquina del mapa). Requiere Pillow con AVIF.
"""
import io, math, os, time, urllib.request
from PIL import Image

LAT, LON, ZOOM = -32.92239053023553, -68.84214251689912, 16
ANCHO, ALTO, TESELA = 1280, 560, 256
SALIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'images', 'mapa')


def a_pixel(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n * TESELA
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n * TESELA
    return x, y


def armar():
    cx, cy = a_pixel(LAT, LON, ZOOM)
    x0, y0 = cx - ANCHO / 2, cy - ALTO / 2
    lienzo = Image.new('RGB', (ANCHO, ALTO))
    for tx in range(int(x0 // TESELA), int((x0 + ANCHO) // TESELA) + 1):
        for ty in range(int(y0 // TESELA), int((y0 + ALTO) // TESELA) + 1):
            url = f'https://tile.openstreetmap.org/{ZOOM}/{tx}/{ty}.png'
            req = urllib.request.Request(url, headers={'User-Agent': 'bfc-static-map-builder/1.0 (one-off static image)'})
            tesela = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=20).read())).convert('RGB')
            lienzo.paste(tesela, (int(tx * TESELA - x0), int(ty * TESELA - y0)))
            time.sleep(0.3)  # sin apurar al servidor de OSM
    return lienzo


def oscurecer(im):
    """Mismo aspecto que tenía el iframe: grayscale + invert(0.94) + contrast(0.95)."""
    lut = [max(0, min(255, round(((-0.88 * v + 239.7) - 128) * 0.95 + 128))) for v in range(256)]
    return im.convert('L').point(lut)


def exportar(im):
    os.makedirs(SALIDA, exist_ok=True)
    w, h = im.size
    variantes = [('mapa-bfc', im), ('mapa-bfc-640', im.crop((w // 2 - 320, 0, w // 2 + 320, h)))]
    for nombre, v in variantes:
        base = os.path.join(SALIDA, nombre)
        v.convert('RGB').save(base + '.avif', 'AVIF', quality=38, speed=4)
        v.save(base + '.webp', 'WEBP', quality=60, method=6)
        v.save(base + '.jpg', 'JPEG', quality=60, optimize=True, progressive=True)
        print(nombre, {e: f"{os.path.getsize(base + '.' + e) // 1024} KB" for e in ('avif', 'webp', 'jpg')})


if __name__ == '__main__':
    exportar(oscurecer(armar()))
