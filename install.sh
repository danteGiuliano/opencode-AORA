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

mkdir -p "$AORA_DIR/knowledge"

# Crear archivos de conocimiento si no existen
[ ! -f "$AORA_DIR/KNOWLEDGE.md" ] && echo "# Knowledge Base

→ Ver .opencode/knowledge/KB.json para entradas estructuradas" > "$AORA_DIR/KNOWLEDGE.md"

[ ! -f "$AORA_DIR/DECISIONS.md" ] && curl -sf "https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/.opencode/DECISIONS.md" -o "$AORA_DIR/DECISIONS.md"

[ ! -f "$AORA_DIR/knowledge/KB.json" ] && echo '{"entries":[]}' > "$AORA_DIR/knowledge/KB.json"

# Crear config local vacío (OpenCode auto-detecta .opencode/agents/)
cat > "$AORA_DIR/opencode.json" << CONFIG
{
  "\$schema": "https://opencode.ai/config.json"
}
CONFIG

echo ""
echo "✅ AORA instalado correctamente!"
