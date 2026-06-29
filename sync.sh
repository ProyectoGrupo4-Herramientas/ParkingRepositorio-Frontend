#!/bin/bash
# ==============================================================
# sync.sh — Sincroniza cambios de ParkControl a CondoSaaS
# Copia los archivos del módulo parking de ParkControl
# a la carpeta local de CondoSaaS para hacer push después.
# ==============================================================

CONDO_SAAS_DIR="${1:-$HOME/Downloads/parking-system-frontend-main}"

echo "📁 Sincronizando ParkControl → CondoSaaS"
echo "   Destino: $CONDO_SAAS_DIR"
echo ""

# ── Validar que la carpeta destino existe ──
if [ ! -d "$CONDO_SAAS_DIR" ]; then
    echo "❌ Error: No se encuentra la carpeta $CONDO_SAAS_DIR"
    exit 1
fi

# ── Componentes del módulo parking ──
echo "📦 Copiando componentes del parking..."
rsync -a --delete \
    src/components/parking/ \
    "$CONDO_SAAS_DIR/src/components/parking/"

# ── Servicios ──
echo "🔌 Copiando servicios..."
mkdir -p "$CONDO_SAAS_DIR/src/services"
cp src/services/parkingService.js "$CONDO_SAAS_DIR/src/services/parkingService.js"

# ── Utilidades ──
echo "🔧 Copiando utilidades..."
mkdir -p "$CONDO_SAAS_DIR/src/utils"
cp src/utils/pagination.js "$CONDO_SAAS_DIR/src/utils/pagination.js"

# ── Assets (hero.png) ──
if [ -f src/components/parking/assets/hero.png ]; then
    echo "🖼️  Copiando assets..."
    mkdir -p "$CONDO_SAAS_DIR/src/components/parking/assets"
    cp src/components/parking/assets/hero.png "$CONDO_SAAS_DIR/src/components/parking/assets/hero.png"
fi

echo ""
echo "✅ Sincronización completada."
echo ""
echo "➡️  Ahora ve a CondoSaaS y haz push:"
echo "   cd $CONDO_SAAS_DIR"
echo "   git add ."
echo "   git commit -m \"feat: sincronizar cambios del módulo parking desde ParkControl\""
echo "   git push"
