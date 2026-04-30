#!/bin/bash
# install.sh — One-command installer for opencode-minimax-agents
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/YOUR_USER/opencode-minimax-agents/main/install.sh)

set -e

REPO="YOUR_USER/opencode-minimax-agents"
BRANCH="main"
RAW="https://raw.githubusercontent.com/$REPO/$BRANCH"
TARGET=".opencode"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "  OpenCode Agents for MiniMax M2.7"
echo "  =================================="
echo ""

# ── Verificar dependencias ────────────────────────────────────────────────────
check_dep() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}✗ $1 not found. Install it first.${NC}"
    exit 1
  fi
}

check_dep curl
check_dep opencode

echo -e "${GREEN}✓ opencode found${NC}"

# ── Crear estructura ──────────────────────────────────────────────────────────
mkdir -p "$TARGET/agents"

download() {
  local path="$1"
  local dest="$TARGET/$2"
  echo -e "  Downloading $2..."
  curl -fsSL "$RAW/$path" -o "$dest"
}

echo ""
echo "📥 Downloading agents..."
download ".opencode/agents/planner.md"      "agents/planner.md"
download ".opencode/agents/builder.md"      "agents/builder.md"
download ".opencode/agents/reviewer.md"     "agents/reviewer.md"
download ".opencode/agents/debug.md"        "agents/debug.md"
download ".opencode/agents/docs.md"         "agents/docs.md"
download ".opencode/agents/ultraworker.md"  "agents/ultraworker.md"

echo ""
echo "📥 Downloading config..."
download ".opencode/oh-my-openagent.jsonc"  "oh-my-openagent.jsonc"

echo ""
echo "📥 Downloading knowledge base..."

# KNOWLEDGE.md y DECISIONS.md: no sobreescribir si ya existen
if [ ! -f "$TARGET/KNOWLEDGE.md" ]; then
  download ".opencode/KNOWLEDGE.md" "KNOWLEDGE.md"
  echo -e "  ${GREEN}Created KNOWLEDGE.md${NC}"
else
  echo -e "  ${YELLOW}Skipped KNOWLEDGE.md (already exists)${NC}"
fi

if [ ! -f "$TARGET/DECISIONS.md" ]; then
  download ".opencode/DECISIONS.md" "DECISIONS.md"
  echo -e "  ${GREEN}Created DECISIONS.md${NC}"
else
  echo -e "  ${YELLOW}Skipped DECISIONS.md (already exists)${NC}"
fi

# ── Verificar proveedor MiniMax ───────────────────────────────────────────────
echo ""
echo "🔑 Checking MiniMax provider..."

OPENCODE_CONFIG="$HOME/.config/opencode/opencode.json"

if [ -f "$OPENCODE_CONFIG" ] && grep -q "minimax" "$OPENCODE_CONFIG" 2>/dev/null; then
  echo -e "  ${GREEN}✓ MiniMax provider found in opencode.json${NC}"
else
  echo -e "  ${YELLOW}⚠ MiniMax provider not configured.${NC}"
  echo ""
  echo "  Add this to ~/.config/opencode/opencode.json:"
  echo ""
  cat << 'JSON'
  {
    "$schema": "https://opencode.ai/config.json",
    "model": "minimax/MiniMax-M2.7",
    "provider": {
      "minimax": {
        "npm": "@ai-sdk/anthropic",
        "options": {
          "baseURL": "https://api.minimax.io/anthropic/v1",
          "apiKey": "YOUR_MINIMAX_API_KEY"
        },
        "models": {
          "MiniMax-M2.7": { "name": "MiniMax-M2.7" },
          "MiniMax-M2.7-highspeed": { "name": "MiniMax-M2.7-highspeed" }
        }
      }
    }
  }
JSON
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}✅ Installed successfully!${NC}"
echo ""
echo "  Agents installed in .opencode/agents/:"
echo "    @planner      — strategic planning + Decision Gates"
echo "    @builder      — full stack implementation"
echo "    @reviewer     — read-only code review"
echo "    @debug        — root cause diagnosis"
echo "    @docs         — knowledge base manager"
echo "    @ultraworker  — full cycle orchestrator"
echo ""
echo "  Usage in OpenCode TUI:"
echo "    Tab             → cycle through agents"
echo "    ultrawork [task] → full cycle with parallelism"
echo ""
echo "  Verify installation:"
echo "    bunx oh-my-opencode doctor --verbose"
echo ""
