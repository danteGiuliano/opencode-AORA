# Knowledge Base — Estructura de Entradas

## Schema JSON

Cada entrada en la base de conocimiento sigue este formato:

```json
{
  "id": "kebab-case-unique-id",
  "type": "pattern | bug | decision | integration | concept | gotcha",
  "title": "Short descriptive title",
  "summary": "One sentence: what this is and why it matters",
  "content": "Full explanation. Can be multi-line. Include context.",
  "example": "Code snippet or concrete example if applicable",
  "tags": ["technology", "layer", "action"],
  "concepts": ["abstract concept", "domain concept"],
  "keywords": ["specific term", "function name", "error message"],
  "related": ["other-entry-id"],
  "context": {
    "files": ["src/path/to/file.ts"],
    "project": "project-name"
  },
  "meta": {
    "created": "ISO date",
    "source": "@agent or 'manual'",
    "confidence": "high | medium | low",
    "weight": 0.5,
    "hits": 0,
    "lastUsed": null,
    "successUses": 0,
    "failedUses": 0
  }
}
```

## Campos Meta — Tracking de Uso

| Campo | Tipo | Default | Descripcion |
|-------|------|---------|-------------|
| `weight` | number | 0.5 | Peso base de la entrada (0.0 - 1.0) |
| `hits` | number | 0 | Veces que fue consultada |
| `lastUsed` | string | null | ISO date de ultima consulta |
| `successUses` | number | 0 | Consultas marcadas como utiles |
| `failedUses` | number | 0 | Consultas marcadas como no utiles |

## Sistema de Scoring

El scoring combina multiple factores:

```
score = relevanceScore * usageBoost * baseWeight

usageBoost = 1 + log(hits + 1) * successRate
successRate = successUses / (successUses + failedUses + 1)
relevanceScore = match en keywords/tags/content (0-100)
```

## Recalibracion Automatica

El agente @calibrator recalibra periodicamente:

```
Si hits > 10 AND successRate > 0.8:
  confidence = "high"
  weight = 0.9

Si hits > 5 AND successRate < 0.5:
  confidence = "low"
  weight = 0.3

Si failedUses > 3:
  Marcar para revision manual
```

## Campos

| Campo | Tipo | Obligatorio | Descripcion |
|-------|------|-------------|-------------|
| `id` | string | ✅ | ID unico en kebab-case |
| `type` | enum | ✅ | Categoria principal |
| `title` | string | ✅ | Titulo descriptivo corto |
| `summary` | string | ✅ | Una frase: que es y por que importa |
| `content` | string | ✅ | Explicacion completa, multilinea |
| `example` | string | ❌ | Code snippet o ejemplo concreto |
| `tags` | string[] | ✅ | Tecnologia + capa + accion |
| `concepts` | string[] | ❌ | Conceptos abstractos |
| `keywords` | string[] | ❌ | Terminos buscables exactos |
| `related` | string[] | ❌ | IDs de entradas relacionadas |
| `context` | object | ❌ | Archivos y proyecto |
| `meta` | object | ✅ | Metadata de creacion y tracking |

## Tipos de Entrada

| Type | Descripcion | Ejemplo |
|------|-------------|---------|
| `pattern` | Patron de codigo/arquitectura | "n+1-query-pattern" |
| `bug` | Bug conocido y su solucion | "jwt-token-expiry-bug" |
| `decision` | Decision de arquitectura/producto | "base64-storage-decision" |
| `integration` | Integracion con servicio externo | "jwt-shared-auth-ts-superior" |
| `concept` | Concepto tecnico importante | "base64-file-upload-flow" |
| `gotcha` | Algo no obvio que funcionar | "tipo-doc-mensual-match-opt-interno" |

## Tags Recomendados

### Tecnologia
```
nestjs, typescript, typeorm, mysql, jwt, passport, filesystem, base64
```

### Capa
```
api, service, repository, entity, dto, guard, middleware, controller
```

### Accion
```
auth, crud, upload, validation, query, transaction, error-handling
```

## Busqueda

El archivo `search.js` permite buscar en la base de conocimiento.

```bash
# Buscar por keyword (con ranking)
node search.js --keyword "jwt"

# Buscar por tipo
node search.js --type "bug"

# Buscar por tag
node search.js --tag "typeorm"

# Buscar por concepto
node search.js --concept "n+1"

# Combinar
node search.js --tag "nestjs" --type "pattern"

# Mostrar todas las entradas
node search.js --all
```

## Archivo

La base de conocimiento se almacena en:
```
.opencode/knowledge/KB.json
```