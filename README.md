# AORA — Agents Runtime Architecture

> **AORA** = Agente OpenCode Río Negro Argentina

Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

Inspirado en [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) y el concepto [caveman](https://github.com/JuliusBrussee/caveman) para compresión de output.

---

## Visión

AORA es un sistema multi-agente **agnóstico del proveedor, a nivel de proyecto**. A diferencia de los sistemas basados en plugins — que requieren modelos específicos y múltiples suscripciones — los agentes de AORA son archivos markdown nativos de OpenCode, portables y sin lock-in de proveedor.

### Principios Core

- **Portable**: Archivos markdown, no requiere npm ni plugins
- **Agnóstico del proveedor**: Los modelos se configuran en AORA.json, los prompts son genéricos
- **A nivel de proyecto**: Instalar por proyecto, commitear a git, consistencia del equipo
- **Incremental**: Un único modelo de suscripción, sin cobros por agente

## Instalación

```bash
# En la raíz de tu proyecto
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/install.sh | bash
```

## Documentación

| Doc | Descripción |
|-----|-------------|
| [WORKFLOW](docs/WORKFLOW_ES.md) | Diagrama de flujo completo |
| [CAVEMAN_CONFIG](docs/CAVEMAN_CONFIG.md) | Configuración del modo compresión |

## Agentes

| Agent | Nombre Semántico | Rol |
|-------|------------------|-----|
| `@ultrawork` | OrquestadorPrincipal | Orquestador de ciclo completo |
| `@planner` | Estratega | Planificación estratégica |
| `@builder` | Constructor | Implementación full-stack |
| `@reviewer` | Auditor | Revisión de código |
| `@debug` | Detective | Diagnóstico de errores |
| `@docs` | Bibliotecario | Gestión de conocimiento |
| `@decider` | Arbitro | Conflictos dominio vs implementación |
| `@init-cruise` | Configurador | Replica permisos en proyectos |

## Modo Compact (Caveman)

Sistema de compresión de output inspirado en [caveman](https://github.com/JuliusBrussee/caveman). Reduce ~65-75% de tokens sin perder precisión técnica.

### Configuración en AORA.json

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

MIT