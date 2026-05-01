# Configuración de Caveman en AORA.json

## Estructura Principal

```json
"caveman": {
  "enabled": true,
  "compact": false,
  "defaultLevel": "full",
  "levels": {...},
  "activation": [...]
}
```

## Variables

### Nivel Global (`caveman`)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `enabled` | boolean | true = sistema caveman activo |
| `compact` | boolean | true = activa compact por defecto para todos los agentes |
| `defaultLevel` | string | "lite" \| "full" \| "ultra" |

### Por Agente (`agents.[nombre]`)

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `compact` | boolean | Sobrescribe global para este agente |
| `cavemanLevel` | string | "lite" \| "full" \| "ultra" \| "none" |

## Niveles de Caveman

| Nivel | Descripción |
|-------|-------------|
| `lite` | Sin filler, gramática intacta, profesional |
| `full` | Sin artículos, fragmentos OK, grunt completo |
| `ultra` | Máxima compresión, telegráfico |
| `none` | No usar caveman (ej: Arbitro, init-cruise) |

## Resumen de Configuración por Agente

| Agente | compact | cavemanLevel |
|--------|---------|--------------|
| OrquestadorPrincipal | `false` | `"full"` |
| Estratega | `false` | `"lite"` |
| Constructor | `false` | `"full"` |
| Auditor | `false` | `"lite"` |
| Detective | `false` | `"full"` |
| Bibliotecario | `true` | `"ultra"` |
| Arbitro | `false` | `"none"` |
| Configurador | `false` | `"none"` |

## Ejemplo: Activar Caveman Global

```json
"caveman": {
  "enabled": true,
  "compact": true,
  "defaultLevel": "full"
}
```

## Ejemplo: Agente Específico

```json
"agents": {
  "builder": {
    "compact": true,
    "cavemanLevel": "ultra"
  }
}
```

## Palabras para Activar Caveman

En el prompt, usar cualquiera de:
- `compact`
- `caveman`
- `modoahorro`
- `ahorrar`
