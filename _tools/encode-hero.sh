#!/usr/bin/env bash
# Regenera los videos del hero a partir del original (_fuentes/video-Hero-original.mp4).
# Loop de 565 cuadros (18,83 s): termina justo en un corte de escena, así que el salto
# al reiniciar no se nota. Sin audio, H.264 8-bit (decodificación por hardware en
# prácticamente cualquier equipo), faststart para que arranque sin bajar todo el archivo.
#   video-Hero.mp4       720x1280  CRF 26  (~1,0 MB)  → por defecto
#   video-Hero-lite.mp4  480x854   CRF 28  (~0,5 MB)  → 3G, poca RAM o conexión lenta
# Requiere ffmpeg con libx264. Si cambiás los archivos, subí el ?v= en index.html.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="_fuentes/video-Hero-original.mp4"
OUT="assets/videos"
FRAMES=565

ENC=(-an -c:v libx264 -profile:v high -level 3.1 -preset veryslow -g 90 -keyint_min 30
     -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709
     -movflags +faststart)

ffmpeg -y -i "$SRC" -frames:v "$FRAMES" "${ENC[@]}" -crf 26 "$OUT/video-Hero.mp4"
ffmpeg -y -i "$SRC" -frames:v "$FRAMES" -vf scale=480:854:flags=lanczos "${ENC[@]}" -crf 28 "$OUT/video-Hero-lite.mp4"

ls -lh "$OUT"/video-Hero*.mp4
