# AORA — Agents Runtime Architecture

Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

## Concepto

AORA define una configuración centralizada en `AORA.json` que especifica:
- **Modelo global base** para todos los agentes
- **Modelos especializados** (base, fast, coder, review)
- **Configuración por agente**: temperature, permissions, semantic name

## Arquitectura

```
AORA.json (config global)
├── global.baseModel: modelo base para todos
├── models: modelos específicos disponibles
└── agents: configuración individual
    ├── semantic: nombre semántico
    ├── model: qué modelo usar
    └── temperature: configuración específica
```

## Agentes y Nombres Semánticos

| Agent | Nombre Semántico | Modelo | Rol |
|-------|------------------|--------|-----|
| `@ultrawork` | OrquestadorPrincipal | base | Orquestador de ciclo completo |
| `@planner` | Estratega | base | Planificación estratégica |
| `@builder` | Constructor | coder | Implementación full-stack |
| `@reviewer` | Auditor | review | Revisión de código |
| `@debug` | Detective | coder | Diagnóstico de errores |
| `@docs` | Bibliotecario | fast | Gestión de conocimiento |

## Archivos del Sistema

```
.opencode/
├── agents/
│   ├── ultraworker.md    ← OrquestadorPrincipal
│   ├── planner.md        ← Estratega
│   ├── builder.md        ← Constructor
│   ├── reviewer.md       ← Auditor
│   ├── debug.md           ← Detective
│   └── docs.md           ← Bibliotecario
├── KNOWLEDGE.md          ← Base de conocimiento
└── DECISIONS.md          ← Registro de decisiones

AORA.json                  ← Configuración global
docs/WORKFLOW_ES.md        ← Flujo de trabajo detallado
```

## Modelos Configurables

| Modelo | ID | Uso |
|--------|-----|-----|
| `base` | minimax/MiniMax-M2.7 | Razonamiento complejo |
| `fast` | minimax/MiniMax-M2.7-highspeed | Baja latencia |
| `coder` | minimax/MiniMax-M2.7 | Implementación/debug |
| `review` | minimax/MiniMax-M2.7 | Análisis y revisión |

## Uso

```bash
# Ciclo completo con ultrawork
ultrawork crear módulo de pagos con Stripe

# Flujo manual con nombres semánticos
@Estratega analizar: agregar sistema de notificaciones
@Constructor implementar T1.1 y T1.2
@Auditor revisar src/notifications/
@Detective diagnosticar TypeError en webhook
@Bibliotecario registrar decisión de Stripe
```

## Ciclo de Trabajo

```
ANALISIS → PLANIFICACION → IMPLEMENTACION → REVISION → DOCS
    ↓              ↓               ↓            ↓         ↓
Orquestador  Estratega       Constructor    Auditor   Bibliotecario
   Principal
                ↓
        ¿Puerta de Decisión?
                ↓
           PAUSAR → esperar decisión → continuar
```

## Auto-recuperación

Errores se reintentan automáticamente (max 3 intentos):
1. Constructor corrige
2. Detective analiza
3. Escalar al usuario

## Base de Conocimiento

Los agentes actualizan automáticamente:
- `KNOWLEDGE.md`: patrones, bugs resueltos, integraciones
- `DECISIONS.md`: decisiones de producto/arquitectura

## Requisitos

- [OpenCode](https://opencode.ai) `>= 1.14`
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-openagent)
- API key de MiniMax — [platform.minimax.io](https://platform.minimax.io)

## Configuración del Provider

En `~/.config/opencode/opencode.json`:

```json
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
```

## Verificar Instalación

```bash
bunx oh-my-opencode doctor --verbose
```