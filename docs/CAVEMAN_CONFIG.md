# Configuración de Caveman en AORA.json

## Estructura Principal

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": false,
    "model": "full"
  },
  "levels": {...},
  "activation": [...]
}
```

## Variables

### Nivel Global (`caveman.global`)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `enabled` | boolean | true = activa caveman para todos los agentes por defecto |
| `model` | string | "lite" \| "full" \| "ultra" \| "none" (default: "none") |

### Por Agente (`agents.[nombre].cavemanLevel`)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `cavemanLevel` | string | "lite" \| "full" \| "ultra" \| "none" (default: "none") |

## Niveles de Caveman

| Nivel | Valor | Descripción |
|-------|-------|-------------|
| `lite` | `"lite"` | Sin filler, gramática intacta, profesional |
| `full` | `"full"` | Sin artículos, fragmentos OK |
| `ultra` | `"ultra"` | Máxima compresión, telegráfico |
| `none` | `"none"` | No usar caveman (default) |

## Lógica de Aplicación

1. Si `caveman.global.enabled: true` → todos los agentes usan `caveman.global.model` por defecto
2. Si `caveman.global.enabled: false` → cada agente usa su propio `cavemanLevel` (default: "none")
3. El setting del agente sobrescribe el global

## Resumen de Configuración por Agente

| Agente (slug) | cavemanLevel |
|--------------|--------------|
| ultraworker | `"full"` |
| planner | `"lite"` |
| builder | `"full"` |
| reviewer | `"lite"` |
| debug | `"full"` |
| docs | `"ultra"` |
| decider | `"none"` |
| queue | `"lite"` |
| launcher | `"full"` |
| calibrator | `"lite"` |
| config-aora | `"none"` |

## Ejemplo: Activar Caveman Global

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": true,
    "model": "full"
  }
}
```

Todos los agentes usan `full` por defecto.

## Ejemplo: Per-Agente (default)

```json
"caveman": {
  "enabled": true,
  "global": {
    "enabled": false,
    "model": "full"
  }
}
```

Cada agente configura su propio nivel. Default: `"none"` si no se especifica.

## Palabras para Activar Caveman

En el prompt, usar cualquiera de:
- `compact`
- `caveman`
- `modoahorro`
- `ahorrar`
