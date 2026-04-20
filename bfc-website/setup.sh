#!/usr/bin/env bash
# =====================================================
# BFC — setup.sh
# Verifica estructura y lista pendientes
# =====================================================

set -e
cd "$(dirname "$0")"

RED='\033[0;31m'
GOLD='\033[0;33m'
GRN='\033[0;32m'
BONE='\033[0;37m'
NC='\033[0m'

echo -e "${RED}"
echo "╔════════════════════════════════════════════╗"
echo "║   BONATI FIGHT CLUB — SETUP CHECKER        ║"
echo "║   #SiempreBFC                              ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Required dirs ---
REQUIRED_DIRS=(
  "assets/css" "assets/js" "assets/images" "assets/images/merch"
  "assets/images/gallery" "assets/videos"
  "en" "pt" "store" "tapa-team" "admin"
)
missing=0
echo -e "${BONE}▸ Verificando estructura…${NC}"
for d in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$d" ]; then
    echo -e "  ${GRN}✓${NC} $d"
  else
    echo -e "  ${RED}✗${NC} $d (falta)"
    missing=$((missing+1))
  fi
done

# --- Required files ---
REQUIRED_FILES=(
  "index.html"
  "en/index.html" "pt/index.html"
  "store/index.html" "tapa-team/index.html"
  "admin/products.json"
  "assets/css/main.css" "assets/css/animations.css" "assets/css/store.css"
  "assets/js/i18n.js" "assets/js/main.js" "assets/js/store.js"
  "assets/images/logo.svg"
  "assets/videos/video-Hero.mp4"
)
echo ""
echo -e "${BONE}▸ Verificando archivos críticos…${NC}"
for f in "${REQUIRED_FILES[@]}"; do
  if [ -f "$f" ]; then
    size=$(du -h "$f" 2>/dev/null | cut -f1)
    echo -e "  ${GRN}✓${NC} $f ($size)"
  else
    echo -e "  ${RED}✗${NC} $f (FALTA)"
    missing=$((missing+1))
  fi
done

# --- Pending placeholders / content to load ---
echo ""
echo -e "${GOLD}▸ Pendientes de cargar (contenido real):${NC}"
echo ""

count_ph=0

# Check merch folder
if [ -d "assets/images/merch" ]; then
  merch_count=$(find assets/images/merch -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) 2>/dev/null | wc -l)
  if [ "$merch_count" -eq 0 ]; then
    echo -e "  ${GOLD}📷${NC} assets/images/merch/  → sin fotos de productos"
    count_ph=$((count_ph+1))
  else
    echo -e "  ${GRN}✓${NC} assets/images/merch/ tiene $merch_count fotos"
  fi
fi

# Check products.json for price=0
if [ -f "admin/products.json" ]; then
  zero_prices=$(grep -c '"price": 0' admin/products.json 2>/dev/null || echo 0)
  if [ "$zero_prices" -gt 0 ]; then
    echo -e "  ${GOLD}💵${NC} admin/products.json  → $zero_prices productos sin precio (price=0)"
    count_ph=$((count_ph+1))
  fi
fi

# Check logo
if [ -f "assets/images/logo.svg" ]; then
  if grep -q "BFC monogram inside" assets/images/logo.svg 2>/dev/null; then
    echo -e "  ${GOLD}🖼️${NC}  assets/images/logo.svg → placeholder (cargar logo oficial)"
    count_ph=$((count_ph+1))
  else
    echo -e "  ${GRN}✓${NC} assets/images/logo.svg  → logo personalizado detectado"
  fi
fi

# Check video
if [ -f "assets/videos/video-Hero.mp4" ]; then
  vsize=$(du -h assets/videos/video-Hero.mp4 | cut -f1)
  echo -e "  ${GRN}✓${NC} assets/videos/video-Hero.mp4 ($vsize) — rotado 90° via CSS"
fi

# Gallery
gal_count=$(find assets/images/gallery -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) 2>/dev/null | wc -l)
echo -e "  ${BONE}i${NC}  assets/images/gallery/ tiene $gal_count imágenes"

echo ""
echo -e "${BONE}▸ Resumen${NC}"
if [ "$missing" -eq 0 ]; then
  echo -e "  ${GRN}✓ Estructura completa${NC}"
else
  echo -e "  ${RED}✗ $missing archivos/carpetas faltan${NC}"
fi
if [ "$count_ph" -eq 0 ]; then
  echo -e "  ${GRN}✓ Sin placeholders pendientes${NC}"
else
  echo -e "  ${GOLD}! $count_ph placeholders por completar${NC}"
fi

echo ""
echo -e "${BONE}Para abrir el sitio:${NC}"
echo "  npx http-server -p 8080"
echo "  # o"
echo "  python -m http.server 8080"
echo ""
echo -e "${RED}#SiempreBFC${NC}"
