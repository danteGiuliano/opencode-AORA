# AORA — Agents Runtime Architecture

> **AORA** = Agente OpenCode Río Negro Argentina

Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

Inspirado en [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) y el concepto [caveman](https://github.com/JuliusBrussee/caveman) para compresión de output.

---

## Visión

AORA es un sistema multi-agente **agnóstico del proveedor, a nivel de proyecto**. Los agentes son archivos markdown nativos de OpenCode, portables y sin lock-in.

## Instalación

```bash
# 1. En la raíz del proyecto
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/install.sh | bash

# 2. Abrir OpenCode
opencode .

# 3. Configurar desde OpenCode
@config-aora
```

## Configuración Rápida

En OpenCode, escribir:

```
@config-aora
```

El asistente te guía para:
- **Configurar modelo** (minimax, anthropic, openai, gemini, ollama)
- **Actualizar agentes** (desde GitHub)
- **Verificar instalación**

## Tips

### Configurar todos los modelos de una vez

Si querés configurar todos los modelos sin pasar por el menú interactivo:

```
@config-aora configura todos los modelos para big-pickle de OpenCodeZed
```

El agente @config-aora interpreta la solicitud y configura todos los modelos en AORA.json directamente.

### Configuración específica

```
@config-aora usa minimax/MiniMax-M2.7 para todos los modelos
@config-aora configura modelo base como anthropic/claude-3.5-sonnet
```

### Ver estado actual

```
@config-aora ver estado de instalación
```

## Agentes

| Agent | Nombre Semántico | Rol |
|-------|------------------|-----|
| `@ultrawork` | OrquestadorPrincipal | Ciclo completo |
| `@planner` | Estratega | Planificación |
| `@builder` | Constructor | Implementación |
| `@reviewer` | Auditor | Revisión |
| `@debug` | Detective | Debug |
| `@docs` | Bibliotecario | Conocimiento |
| `@decider` | Arbitro | Conflictos |
| `@config-aora` | ConfigAORA | Configuración |

## Modo Compact (Caveman)

Sistema de compresión de output. Reduce ~65-75% tokens sin perder precisión técnica.

Configuración en AORA.json:

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": false,
    "model": "full"
  }
}
```

| Nivel | Descripción |
|-------|-------------|
| `lite` | Sin filler, gramática intacta |
| `full` | Sin artículos, fragmentos OK |
| `ultra` | Máxima compresión, telegráfico |
| `none` | Sin compresión (default) |

## Base de Conocimiento

Los agentes indexan conocimiento en `.opencode/knowledge/KB.json` con schema estructurado:

```json
{
  "id": "unique-id",
  "type": "pattern|bug|decision|integration|concept|gotcha",
  "title": "...",
  "summary": "...",
  "tags": ["tech", "layer", "action"],
  "keywords": ["exact", "terms"]
}
```

## Arquitectura

```
AORA.json
├── global.baseModel
├── models: [base, fast, coder, review]
├── agents: [semantic, model, temperature, cavemanLevel]
└── caveman: [enabled, global, levels]
```

## Ciclo

```
ANALISIS → PLANIFICACION → IMPLEMENTACION → REVISION → DOCS
```

## Licencia

**Opensource** — MIT License