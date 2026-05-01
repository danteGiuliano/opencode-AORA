# AORA — Agents Runtime Architecture

> **AORA** = Agente OpenCode Río Negro Argentina

Multi-agent system for [OpenCode](https://opencode.ai) with centralized configuration, semantic names, and arbitrary models.

**Language:** [English](README-en.md) | [Español](README-es.md)

---

## Vision

AORA is a **provider-agnostic, project-level** multi-agent system. Unlike plugin-based systems that require specific models and multiple subscriptions, AORA agents are native OpenCode markdown files — portable and without vendor lock-in.

### Core Principles

- **Portable**: Markdown files, no npm packages or plugins required
- **Provider-agnostic**: Configure models in AORA.json, prompts stay generic
- **Project-level**: Install per-project, commit to git, team consistency
- **Incremental**: Single subscription model, not per-agent billing

## Quick Start

```bash
# Install in your project root
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/install.sh | bash
```

## Documentation

| Doc | Description |
|-----|-------------|
| [WORKFLOW](docs/WORKFLOW_ES.md) | Complete workflow diagram |
| [CAVEMAN_CONFIG](docs/CAVEMAN_CONFIG.md) | Compression mode setup |
| [README-en](README-en.md) | Full English documentation |
| [README-es](README-es.md) | Documentación completa en español |

## Agents

| Agent | Semantic Name | Role |
|-------|---------------|------|
| `@ultrawork` | OrquestadorPrincipal | Full cycle orchestrator |
| `@planner` | Estratega | Strategic planning |
| `@builder` | Constructor | Full-stack implementation |
| `@reviewer` | Auditor | Code review |
| `@debug` | Detective | Error diagnosis |
| `@docs` | Bibliotecario | Knowledge management |
| `@decider` | Arbitro | Domain vs implementation conflicts |
| `@init-cruise` | Configurador | Replicate permissions to projects |

## Mode Compact (Caveman)

Output compression inspired by [caveman](https://github.com/JuliusBrussee/caveman). Reduces ~65-75% tokens without losing technical accuracy.

### Configuration in AORA.json

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": false,
    "model": "full"
  }
}
```

**Levels:** `lite` | `full` | `ultra` | `none`

### Activation

```
compact [task]
caveman [task]
modoahorro [task]
```

## Architecture

```
AORA.json
├── global.baseModel
├── models: [base, fast, coder, review]
├── agents: [semantic, model, temperature, cavemanLevel]
└── caveman: [enabled, global, levels, activation]
```

## Cycle

```
ANALYSIS → PLANNING → IMPLEMENTATION → REVIEW → DOCS
```

## License

MIT