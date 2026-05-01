#!/bin/bash
# Conecta AORA con la config global de OpenCode

OPENCODE_CONFIG="$HOME/.config/opencode/opencode.json"
AORA_DIR="$(pwd)/.opencode"

echo "🔗 Conectando AORA con OpenCode..."
echo ""

# Backup config actual
cp "$OPENCODE_CONFIG" "$OPENCODE_CONFIG.backup-$(date +%Y%m%d%H%M%S)" 2>/dev/null || true

# Crear config временную para injectar agents
cat > "$OPENCODE_CONFIG" << CONFIG
{
  "\$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "enabled": true,
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  },
  "permission": {
    "bash": { "*": "allow" },
    "read": { "*": "allow" },
    "write": { "*": "allow" },
    "edit": { "*": "allow" }
  },
  "plugin": ["oh-my-openagent@latest"],
  "agentDirectories": ["$AORA_DIR/agents"]
}
CONFIG

echo "✅ OpenCode configurado"
echo ""
echo "Reiniciá OpenCode para ver los agentes"
echo ""
echo "Para usar:"
echo "  @ultraworker [tarea]    → Orquestador"
echo "  @planner [tarea]        → Estratega"
echo "  @builder [tarea]        → Constructor"
echo "  /config-aora            → Configurar modelo"
