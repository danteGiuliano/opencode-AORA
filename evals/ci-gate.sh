#!/bin/bash
# AORA CI Gate - Validacion automatica de calidad
# Uso: ./ci-gate.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVALS_DIR="$SCRIPT_DIR/evals"

echo "🔍 AORA CI Gate"
echo "================"

# 1. Verificar que juez existe
if [ ! -f "$EVALS_DIR/judge.js" ]; then
    echo "❌ Error: judge.js no encontrado"
    exit 1
fi

# 2. Ejecutar CI gate via judge
echo ""
echo "📊 Evaluando metricas de agentes..."
node "$EVALS_DIR/judge.js" ci-gate
EXIT_CODE=$?

# 3. Interpretar resultado
if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ CI-GATE PASSED"
    echo "Los agentes estan dentro de los umbrales de calidad."
else
    echo ""
    echo "🔴 CI-GATE FAILED"
    echo "Revisa las metricas en .opencode/calibrator/metrics.json"
    echo "Ejecuta '@calibrator analizar: ultimas 10 tareas' para mas detalles."
fi

exit $EXIT_CODE