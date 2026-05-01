# Configuración de Caveman en AORA.json

## Variables Principales

### Nivel Global (`global`)

```json
"global": {
  "compact": false    // true = activa caveman por defecto para todos los agentes
}
```

### Por Agente (`agents.[nombre].compact`)

```json
"agents": {
  "docs": {
    "compact": true   // true = este agente siempre usa caveman
  }
}
```

### Nivel de Caveman por Agente (`agents.[nombre].cavemanLevel`)

```json
"agents": {
  "docs": {
    "cavemanLevel": "ultra"  // lite | full | ultra | none
  }
}
```

## Niveles de Caveman

| Nivel | Valor en AORA.json | Descripción |
|-------|-------------------|-------------|
| Lite | `"lite"` | Sin filler, gramática intacta, profesional |
| Full | `"full"` | Sin artículos, fragmentos OK, grunt completo |
| Ultra | `"ultra"` | Máxima compresión, telegráfico, single words |
| None | `"none"` | No usar caveman (ej: Arbitro, init-cruise) |

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
{
  "global": {
    "compact": true,
    "temperature": 0.3,
    "mode": "primary"
  }
}
```

## Ejemplo: Agente Específico

```json
{
  "agents": {
    "builder": {
      "compact": true,
      "cavemanLevel": "ultra"
    }
  }
}
```

## Palabras para Activar Caveman

En el prompt, usar cualquiera de:
- `compact`
- `caveman`
- `modoahorro`
- `ahorrar`