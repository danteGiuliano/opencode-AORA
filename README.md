# AORA — Agents Runtime Architecture

> Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

**AORA** = Agente OpenCode Rio Negro Argentina

Inspirado en [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) y el concepto [caveman](https://github.com/JuliusBrussee/caveman).

---

## Quick Start

```bash
# 1. Instalar en tu proyecto
curl -fsSL https://raw.githubusercontent.com/danteGiuliano/opencode-AORA/main/install.sh | bash

# 2. Abrir OpenCode
opencode .

# 3. Configurar (opcional, pero recomendado)
@config-aora

# 4. Lanzar una tarea compleja
ulw Implementar sistema de autenticacion JWT con rate limiting
```

---

## Agentes

| Agent | Semantico | Rol |
|-------|-----------|-----|
| `@ultrawork` | OrquestadorPrincipal | Orquestador de ciclo completo |
| `@planner` | Estratega | Planificación y descomposicion |
| `@queue` | QueueManager | Gestor de pool con dependencias |
| `@launcher` | Launcher | Paralelismo real via background |
| `@builder` | Constructor | Implementacion de codigo |
| `@reviewer` | Auditor | Revision y validacion |
| `@debug` | Detective | Diagnostico de errores |
| `@docs` | Bibliotecario | Gestion de conocimiento |
| `@decider` | Arbitro | Resolucion de conflictos |
| `@calibrator` | Calibrator | Metricas y evaluacion |
| `@config-aora` | ConfigAORA | Configuracion del sistema |

---

## Uso de Agentes

### @ultrawork — Orquestador Principal

El agente principal. Activa el ciclo completo de trabajo.

```bash
# Activacion
ultrawork [descripcion de tarea]
ulw [descripcion de tarea]

# Ejemplo
ulw Agregar autenticacion JWT al backend Express
```

**Flujo interno:**

```
FASE 0: Analisis de contexto + consulta KB
   ↓
FASE 1: @planner crea el plan
   ↓
FASE 2: @queue gestiona el pool → @launcher + @builder ejecutan
   ↓
FASE 3: @reviewer valida
   ↓
FASE 4: @calibrator registra metricas
   ↓
FASE 5: @docs documenta
```

### @config-aora — Configuracion

Agente unificado para configurar el sistema.

```bash
# Menu interactivo
@config-aora

# Comandos directos
@config-aora usa minimax/MiniMax-M2.7 para todos los modelos
@config-aora configura modelo base como anthropic/claude-3.5-sonnet
@config-aora ver estado de instalacion

# Configurar rapidamente
@config-aora configura todos los modelos para big-pickle
```

**Lo que configura:**

- `AORA.json` — modelos, temperaturas, permisos
- Agentes — actualiza desde GitHub
- Verificacion de instalacion

### @planner — Planificador

Descompone tareas complejas en pasos ejecutables.

```bash
@planner Necesito implementar un API REST con autenticacion
```

**Output:** Plan con tareas independientes y dependientes listas para `@queue`.

### @builder — Constructor

Implementa codigo. Solo recibe tareas de `@queue` o `@ultrawork`.

```bash
@builder [T1: Crear endpoints /auth/login y /auth/register]
```

### @reviewer — Auditor

Revisa codigo y reporta problemas.

```bash
@reviewer Revisar implementacion de autenticacion JWT
```

**Formatos de reporte:**

- 🔴 Criticos — deben arreglarse antes de continuar
- 🟡 Advertencias — recomendados arreglar
- 🟢 Correcto — lo que esta bien

---

## Calibracion y Validacion

AORA incluye un sistema de evaluacion continua para mantener la calidad del sistema.

### @calibrator — Agente de Metricas

Mide el rendimiento de los agentes y detecta regresiones.

```bash
# Evaluar un agente especifico
@calibrator evaluar: @builder

# Registrar resultado de tarea
@calibrator verificar: T1 completada, resultado: exito
@calibrator verificar: T2 completada, resultado: fallo, correcciones: 2

# Analisis de ultimas tareas
@calibrator analizar: ultimas 10 tareas

# Validacion de CI
@calibrator CI-gate
```

**Métricas que registra:**

| Métrica | Descripcion |
|---------|-------------|
| `tasksCompleted` | Tareas completadas exitosamente |
| `tasksFailed` | Tareas que fallaron |
| `avgCorrections` | Promedio de correcciones por tarea |
| `lastUpdated` | Ultima actualizacion |

### Recalibracion

La recalibracion ocurre automaticamente despues de cada ciclo de trabajo:

1. **Post-revision:** `@reviewer` reporta si hay 🔴
2. **Registro:** `@calibrator` actualiza `metrics.json`
3. **Decision:** Si `successRate < 0.8`, se reporta regression

**Para recalibrar manualmente:**

```bash
# Forzar recalibracion de todos los agentes
@calibrator evaluar: @ultraworker
@calibrator evaluar: @planner
@calibrator evaluar: @builder

# Analisis profundo
@calibrator analizar: ultimas 20 tareas
```

### CI Gate — Validacion Automatica

Script para integracion en pipelines de CI/CD.

```bash
# Ejecutar validacion
./evals/ci-gate.sh

# Exit codes
# 0 = PASS, 1 = FAIL
```

**Criterios de aprobacion:**

| Criterio | Threshold |
|-----------|----------|
| Success Rate | >= 80% |
| Fallos Recientes | <= 2 |
| Correcciones por Tarea | <= 3 |

### Modulo de Evals

El directorio `evals/` contiene herramientas de evaluacion.

```
evals/
├── dataset.json    # 15 casos de prueba
├── judge.js       # Evaluador automatico
└── ci-gate.sh    # Script de CI
```

**Ejecutar evaluacion individual:**

```bash
node evals/judge.js --case eval-001 --output "output del agente"
```

**Casos disponibles:** eval-001 a eval-015 cubriendo planner, builder, reviewer, docs, queue, launcher, calibrator.

---

## Base de Conocimiento

Los agentes comparten conocimiento via `.opencode/knowledge/KB.json`.

### Schema de Entrada

```json
{
  "id": "D-001",
  "type": "decision",
  "title": "Titulo descriptivo",
  "summary": "Una frase: que es y por que importa",
  "content": "Explicacion completa...",
  "tags": ["tecnologia", "capa", "accion"],
  "keywords": ["termino exacto", "nombre funcion"],
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

| Tipo | Uso |
|------|-----|
| `decision` | Decisiones de arquitectura o producto |
| `pattern` | Patrones de codigo repetibles |
| `bug` | Bugs conocidos y soluciones |
| `integration` | Integraciones con servicios externos |
| `concept` | Conceptos tecnicos importantes |
| `gotcha` | Algo no obvio que funciona |

### Flujo de Conocimiento

```
@ultraworker FASE 0 → consulta KB.json
        ↓
@planner Paso 0    → consulta KB.json
        ↓
...implementacion...
        ↓
@docs FASE 5      → escribe nueva decision en KB.json
```

---

## Configuracion

### AORA.json

Archivo principal de configuracion.

```json
{
  "global": {
    "baseModel": "minimax/MiniMax-M2.7",
    "temperature": 0.3
  },
  "models": {
    "base": { "id": "minimax/MiniMax-M2.7" },
    "coder": { "id": "minimax/MiniMax-M2.7" },
    "review": { "id": "minimax/MiniMax-M2.7" }
  },
  "workflow": {
    "parallelism": { "maxParallel": 3 },
    "selfHealing": { "enabled": true, "maxAttempts": 3 }
  },
  "ci": {
    "enabled": true,
    "thresholds": {
      "successRateMin": 0.8,
      "maxCorrections": 3
    }
  }
}
```

### Caveman — Modo Compact

Sistema de compresion de output. Reduce ~65-75% tokens.

```json
"caveman": {
  "enabled": true,
  "levels": {
    "lite": "Sin filler, gramatica intacta",
    "full": "Sin articulos, fragmentos OK",
    "ultra": "Maxima compresion, telegráfico"
  }
}
```

---

## Arquitectura

```
.opencode/
├── agents/              # 11 agentes markdown
├── calibrator/
│   └── metrics.json    # Metricas de agentes
├── knowledge/
│   └── KB.json         # Base de conocimiento
├── logs/               # Logs para CI
├── aora-agents.json    # Registro de agentes
├── DECISIONS.md        # Log de decisiones
└── KNOWLEDGE.md        # Redirect

evals/
├── dataset.json         # Casos de prueba
├── judge.js            # Evaluador
└── ci-gate.sh         # CI/CD gating
```

---

## Seguridad

> [!WARNING]
> AORA otorga permisos de ejecucion de shell sin restricciones a los agentes `@ultrawork` y `@builder`. El template de configuracion de `AORA.json` incluye patrones de shell destructivos por diseño.
>
> **Este sistema debe instalarse unicamente en entornos de desarrollo aislados y dedicados.**

**Entornos recomendados:**
- Maquinas de desarrollo dedicadas sin datos sensibles
- VMs o containers aislados y limitados a un unico proyecto
- Entornos desechables como dev containers o sandboxes

**Entornos no recomendados:**
- Servidores de produccion o cualquier sistema expuesto a internet
- Maquinas compartidas entre multiples usuarios
- Pipelines de CI/CD sin sandboxing explicito
- Cualquier entorno donde la ejecucion irrestricta de `bash` represente un riesgo operacional

> [!IMPORTANT]
> Los desarrolladores no asumen responsabilidad alguna por perdida de datos o danos al sistema derivados de una instalacion fuera de los entornos soportados descritos anteriormente. Proceda bajo su propio riesgo. Recuerde que tiene un cerebro, uselo.

---

## Licencia

MIT License