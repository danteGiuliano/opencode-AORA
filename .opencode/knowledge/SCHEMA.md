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
    "confidence": "high | medium | low"
  }
}
```

## Campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | string | ✅ | ID único en kebab-case |
| `type` | enum | ✅ | Categoría principal |
| `title` | string | ✅ | Título descriptivo corto |
| `summary` | string | ✅ | Una frase: qué es y por qué importa |
| `content` | string | ✅ | Explicación completa, multilínea |
| `example` | string | ❌ | Code snippet o ejemplo concreto |
| `tags` | string[] | ✅ | Tecnología + capa + acción |
| `concepts` | string[] | ❌ | Conceptos abstractos |
| `keywords` | string[] | ❌ | Términos buscables exactos |
| `related` | string[] | ❌ | IDs de entradas relacionadas |
| `context` | object | ❌ | Archivos y proyecto |
| `meta` | object | ✅ | Metadata de creación |

## Tipos de Entrada

| Type | Descripción | Ejemplo |
|------|-------------|---------|
| `pattern` | Patrón de código/arquitectura | "n+1-query-pattern" |
| `bug` | Bug conocido y su solución | "jwt-token-expiry-bug" |
| `decision` | Decisión de arquitectura/producto | "base64-storage-decision" |
| `integration` | Integración con servicio externo | "jwt-shared-auth-ts-superior" |
| `concept` | Concepto técnico importante | "base64-file-upload-flow" |
| `gotcha` | Algo no obvio que funcionar | "tipo-doc-mensual-match-opt-interno" |

## Tags Recomendados

### Tecnología
```
nestjs, typescript, typeorm, mysql, jwt, passport, filesystem, base64
```

### Capa
```
api, service, repository, entity, dto, guard, middleware, controller
```

### Acción
```
auth, crud, upload, validation, query, transaction, error-handling
```

## Búsqueda

El archivo `search.js` permite buscar en la base de conocimiento.

```bash
# Buscar por keyword
node search.js --keyword "jwt"

# Buscar por tipo
node search.js --type "bug"

# Buscar por tag
node search.js --tag "typeorm"

# Buscar por concepto
node search.js --concept "n+1"

# Combinar
node search.js --tag "nestjs" --type "pattern"
```

## Archivo

La base de conocimiento se almacena en:
```
.opencode/knowledge/KB.json
```