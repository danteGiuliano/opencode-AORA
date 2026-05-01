# AORA — Agents Runtime Architecture

> **AORA** = Agente OpenCode Río Negro Argentina

Multi-agent system for [OpenCode](https://opencode.ai) with centralized configuration, semantic names, and arbitrary models.

Inspired by [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) and [caveman](https://github.com/JuliusBrussee/caveman) concept for output compression.

**Idioma:** [English](README-en.md) | [Español](README-es.md)

---

## Vision

AORA is a **provider-agnostic, project-level** multi-agent system. Unlike plugin-based systems that require specific models and multiple subscriptions, AORA agents are native OpenCode markdown files — portable and without vendor lock-in.

### Core Principles

- **Portable**: Markdown files, no npm packages or plugins required
- **Provider-agnostic**: Configure models in AORA.json, prompts stay generic
- **Project-level**: Install per-project, commit to git, team consistency
- **Incremental**: Single subscription model, not per-agent billing

## Installation

```bash
# In your project root
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/install.sh | bash
```

Or download manually:

```bash
mkdir -p .opencode/agents

# Download agents from GitHub
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/.opencode/agents/ultraworker.md -o .opencode/agents/ultraworker.md
# ... repeat for each agent

# Download AORA.json
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/AORA.json -o AORA.json
```

## Documentation

| Doc | Description |
|-----|-------------|
| [WORKFLOW](docs/WORKFLOW_ES.md) | Complete workflow diagram |
| [CAVEMAN_CONFIG](docs/CAVEMAN_CONFIG.md) | Compression mode setup |

## ⚠️ Project-Level Installation

**AORA is recommended to be installed at project level**, not at operating system level.

### Why project-level?

- **Clean OS**: Does not modify global OpenCode files
- **Portability**: Project includes its agents and configuration
- **Version control**: Agents and KNOWLEDGE.md are committed with code
- **Consistency**: Entire team uses the same agent version
- **Isolation**: Changes in one project don't affect others

```
project/
├── .opencode/           ← agents, local knowledge
├── AORA.json             ← project configuration
└── your-code/            ← your application
```

## Architecture

```
AORA.json (global config)
├── global.baseModel: base model for all agents
├── models: available specific models
├── agents: individual agent configuration
│   ├── semantic: semantic name
│   ├── model: which model to use
│   ├── temperature: specific configuration
│   └── cavemanLevel: compression level
└── caveman: compression settings
    ├── enabled: true/false
    ├── global: { enabled, model }
    ├── levels: { lite, full, ultra, none }
    └── activation: [keywords]
```

## Agents and Semantic Names

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

## System Files

```
.opencode/
├── agents/
│   ├── ultraworker.md    ← OrquestadorPrincipal
│   ├── planner.md        ← Estratega
│   ├── builder.md        ← Constructor
│   ├── reviewer.md       ← Auditor
│   ├── debug.md          ← Detective
│   ├── docs.md           ← Bibliotecario
│   ├── decider.md        ← Arbitro
│   └── init-cruise.md    ← Configurador
├── KNOWLEDGE.md          ← Knowledge base
└── DECISIONS.md          ← Decision registry

AORA.json                  ← Global configuration
docs/WORKFLOW_ES.md        ← Detailed workflow
```

## Mode Compact (Caveman)

Output compression system inspired by [caveman](https://github.com/JuliusBrussee/caveman). Reduces ~65-75% tokens without losing technical accuracy.

### Configuration in AORA.json

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": false,    // true = activate for all by default
    "model": "full"       // lite | full | ultra | none
  }
}
```

Per agent (overrides global):

```json
"agents": {
  "myAgent": {
    "cavemanLevel": "ultra"  // lite | full | ultra | none
  }
}
```

### Levels

| Level | Description |
|-------|-------------|
| `lite` | No filler, intact grammar, professional |
| `full` | No articles, fragments OK |
| `ultra` | Maximum compression, telegraphic |
| `none` | No caveman (default) |

### Activation by Keyword

```
compact [task]
caveman [task]
modoahorro [task]
```

## Usage

```bash
# Full cycle
ultrawork create payment module with Stripe

# Manual flow
@Estratega analyze: add notification system
@Constructor implement T1.1 and T1.2
@Auditor review src/notifications/
@Detective diagnose TypeError in webhook
@Bibliotecario register Stripe decision
@Arbitro conflict: domain says X, implementation does Y
init-cruise --apply  # replicate permissions to project
```

## Work Cycle

```
ANALYSIS → PLANNING → IMPLEMENTATION → REVIEW → DOCS
    ↓              ↓               ↓            ↓         ↓
Orquestador  Estratega       Constructor    Auditor   Bibliotecario
   Principal
                 ↓
         Decision Gate?
                 ↓
            PAUSE → wait decision → continue
```

## Self-Healing

Errors are automatically retried (max 3 attempts):
1. Constructor fixes
2. Detective analyzes
3. Escalate to user

## Knowledge Base

Agents automatically update:
- `KNOWLEDGE.md`: patterns, resolved bugs, integrations
- `DECISIONS.md`: product/architecture decisions

## License

MIT