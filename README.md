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

O descarga manualmente:

```bash
mkdir -p .opencode/agents

# Descargar agentes desde GitHub
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/.opencode/agents/ultraworker.md -o .opencode/agents/ultraworker.md
# ... repetir para cada agente

# Descargar AORA.json
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/AORA.json -o AORA.json
```

## ⚠️ Instalación a Nivel de Proyecto

**AORA se recomienda instalar a nivel de proyecto**, no a nivel de sistema operativo.

### Por qué a nivel de proyecto?

- **Limpieza del SO**: No modifica archivos globales de OpenCode
- **Portabilidad**: El proyecto tiene sus agentes y configuración incluidos
- **Control de versiones**: Agentes y KNOWLEDGE.md se commitear junto al código
- **Consistencia**: Todo el equipo usa la misma versión de agentes
- **Aislamiento**: Cambios en un proyecto no afectan otros

```
 proyecto/
 ├── .opencode/           ← agentes, conocimiento local
 ├── AORA.json             ← configuración del proyecto
 └── tu-código/            ← tu aplicación
```

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

## Documentación

| Doc | Descripción |
|-----|-------------|
| [WORKFLOW](docs/WORKFLOW_ES.md) | Diagrama de flujo completo |
| [CAVEMAN_CONFIG](docs/CAVEMAN_CONFIG.md) | Configuración del modo compresión |

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

Por agente:

```json
"agents": {
  "miAgente": {
    "cavemanLevel": "ultra"
  }
}
```

### Niveles

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

## Base de Conocimiento

Los agentes actualizan automáticamente:
- `KNOWLEDGE.md`: patrones, bugs resueltos, integraciones
- `DECISIONS.md`: decisiones de producto/arquitectura

## Licencia

MIT