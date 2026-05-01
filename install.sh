#!/bin/bash
# AORA - Project-level installer
# Instala AORA en el directorio actual del proyecto

set -e

AORA_REPO="https://github.com/danteGiuliano/opencode-AORA.git"
AORA_DIR=".opencode"
AGENTS_DIR="$AORA_DIR/agents"

echo "🪨 AORA - Project-level installer"

# Verificar que estamos en un proyecto
if [ ! -d ".git" ]; then
    echo "⚠️  No detected .git directory"
    echo "  Press Enter to init git, or Ctrl+C to cancel"
    echo ""
    git init
    echo "  ✅ git inicializado"
fi

# Crear estructura .opencode si no existe
mkdir -p "$AGENTS_DIR"

echo "📦 Descargando agentes AORA..."

# Descargar agentes directamente del repo
if command -v curl &> /dev/null; then
    AGENTS_BASE="https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/.opencode/agents"
else
    echo "❌ curl requerido para descargar agentes"
    exit 1
fi

# Lista de agentes a descargar
AGENTS=("ultraworker" "planner" "builder" "reviewer" "debug" "docs" "decider" "init-cruise" "config-aora")

for agent in "${AGENTS[@]}"; do
    echo "  ⬇️  $agent.md"
    curl -sf "$AGENTS_BASE/$agent.md" -o "$AGENTS_DIR/$agent.md" || {
        echo "  ❌ Fallo al descargar $agent.md"
        exit 1
    }
done

# Crear AORA.json si no existe
if [ ! -f "AORA.json" ]; then
    echo "📄 Creando AORA.json..."
    curl -sf "https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/AORA.json" -o "AORA.json"
else
    echo "ℹ️  AORA.json ya existe, no se sobreescribe"
fi

# Crear archivos de conocimiento si no existen
[ ! -f "$AORA_DIR/KNOWLEDGE.md" ] && echo "# Knowledge Base" > "$AORA_DIR/KNOWLEDGE.md"
[ ! -f "$AORA_DIR/DECISIONS.md" ] && echo "# Decision Registry" > "$AORA_DIR/DECISIONS.md"

echo ""
echo "✅ AORA instalado correctamente!"
echo ""

# Conectar con OpenCode global config
"$AORA_DIR/setup-opencode.sh"
echo "Estructura creada:"
echo "  $AORA_DIR/"
echo "  ├── agents/"
echo "  │   ├── ultraworker.md"
echo "  │   ├── planner.md"
echo "  │   ├── builder.md"
echo "  │   ├── reviewer.md"
echo "  │   ├── debug.md"
echo "  │   ├── docs.md"
echo "  │   ├── decider.md"
echo "  │   └── config-aora.md"
echo "  ├── KNOWLEDGE.md"
echo "  └── DECISIONS.md"
echo "  AORA.json"
echo ""
echo "Usa: @Estratega, @Constructor, @Auditor, etc. en OpenCode"
