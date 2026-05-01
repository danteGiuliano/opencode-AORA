# AORA — Agents Runtime Architecture

> **AORA** = Agente OpenCode Río Negro Argentina

Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

Inspirado en [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) y el concepto [caveman](https://github.com/JuliusBrussee/caveman) para compresión de output.

---

## Aviso de Seguridad

> [!WARNING]
> AORA otorga permisos de ejecución de shell sin restricciones a los agentes `@ultrawork` y `@builder`.
> El template de configuración de `AORA.json` incluye patrones de shell destructivos por diseño.
>
> **Este sistema debe instalarse únicamente en entornos de desarrollo aislados y dedicados.**
> 
> **Entornos recomendados:**
> - Máquinas de desarrollo dedicadas sin datos sensibles
> - VMs o containers aislados y limitados a un único proyecto
> - Entornos desechables como dev containers o sandboxes
> 
> **Entornos no recomendados:**
> - Servidores de producción o cualquier sistema expuesto a internet
> - Máquinas compartidas entre múltiples usuarios
> - Pipelines de CI/CD sin sandboxing explícito
> - Cualquier entorno donde la ejecución irrestricta de `bash` represente un riesgo operacional
 
> [!IMPORTANT]
> Los desarrolladores no asumen responsabilidad alguna por pérdida de datos o
> daños al sistema derivados de una instalación fuera de los entornos soportados
> descritos anteriormente.
> Proceda bajo su propio riesgo.
> Recuerde que tiene un cerebro, úselo.

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
| `@queue` | QueueManager | Gestor de pool con dependencias |
| `@launcher` | Launcher | Lanza tareas en background (paralelismo real) |
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
  "type": "decision",
  "title": "Título descriptivo",
  "summary": "Una frase: qué es y por qué importa",
  "content": "Explicación completa...",
  "tags": ["tecnología", "capa", "acción"],
  "keywords": ["término exacto", "nombre función"],
  "context": {
    "files": ["src/path/file.js"]
  },
  "meta": {
    "created": "2026-05-01",
    "source": "@Bibliotecario",
    "confidence": "high"
  }
}
```

### Tipos de Conocimiento

| Tipo | Descripción |
|------|-------------|
| `pattern` | Patrón de código/arquitectura repetible |
| `bug` | Bug conocido y su solución |
| `decision` | Decisión de arquitectura o producto |
| `integration` | Integración con servicio externo |
| `concept` | Concepto técnico importante |
| `gotcha` | Algo no obvio que funcionar |

### Estructura de Archivos

```
.opencode/
├── knowledge/
│   └── KB.json         ← Base de conocimiento estructurada
├── DECISIONS.md        ← Log de decisiones con PENDIENTES
└── KNOWLEDGE.md       ← Redirect a KB.json
```

### Pendientes

Los pendientes se registran en `DECISIONS.md`:

```markdown
## Pendientes

| ID | Descripción | Prioridad | Fecha | Status |
|----|-------------|-----------|-------|--------|
| P-001 | Implementar HTTPS | alta | 2026-05-01 | abierto |
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
ANALISIS → PLANIFICACION → GESTION DE POOL → REVISION → DOCS
           (con @queue y @launcher para paralelismo real)
```

## Licencia

**Opensource** — MIT License
