# Flujo de Trabajo AORA — Sistema de Agentes

## Concepto General

AORA (Agents Runtime Architecture) es un sistema de agentes orquestados donde cada agente tiene un **nombre semántico** específico y puede configurarse para usar un modelo global base o un modelo especializado.

## Modo Compact (Caveman)

Sistema de compresión de output inspirado en [caveman](https://github.com/JuliusBrussee/caveman). Reduce ~65-75% de tokens sin perder precisión técnica.

### Activación

| Palabra | Descripción |
|---------|-------------|
| `compact` | Activa modo caveman |
| `caveman` | Activa modo caveman |
| `modoahorro` | Activa modo caveman |
| `ahorrar` | Activa modo caveman |

### Niveles

| Nivel | Descripción | Uso |
|-------|-------------|-----|
| `lite` | Sin filler, gramática intacta | Revisiones, planning |
| `full` | Sin artículos, fragmentos OK | Implementación, debug |
| `ultra` | Máxima compresión, telegráfico | Docs, queries rápidos |

### Reglas generales

- Solo fluff muere. Especificación técnica viva.
- Artículos fuera. "El", "la", "un" → fuera.
- Fragmentos OK. Oraciones incompletas OK.
- Hedging fuera. "Quizás", "probablemente" → fuera.
- Patrón: [cosa] [acción] [razón].

### Ejemplos

| Normal | Compact |
|--------|---------|
| "La razón por la que tu componente re-renderiza es porque estás creando una nueva referencia de objeto en cada ciclo." | "New obj ref each render. Inline obj prop = new ref = re-render." |
| "El problema aquí es que hay una condición de carrera potencial." | "Race condition potencial. Datos inconsistentes posibles." |
| "Esta decisión se tomó porque el impacto en el rendimiento sería demasiado grande." | "Decisión: opción A. Razón: imp perf muy alto." |

### Cuándo usar

**Útil cuando:**
- Tokens limitados
- Tareas simples/recurrentes
- Queries rápidos
- Documentación densa

**No usar cuando:**
- Decisiones complejas de arquitectura
- Debugging profundo
- Explicaciones que requieren contexto
- Problemas con múltiples causas raíz

## Modelo de Configuración

### Niveles de modelo

```
┌─────────────────────────────────────────┐
│           AORA.json (global)            │
│  baseModel: minimax/MiniMax-M2.7        │
│  temperature: 0.3                       │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌───────────────┐         ┌────────────────┐
│ Modelo Base   │         │ Modelo Específico│
│ (para todos)  │         │ (por agente)     │
└───────────────┘         └────────────────┘
```

### Modelos disponibles en AORA.json

| Modelo | ID | Uso |
|--------|-----|-----|
| `base` | minimax/MiniMax-M2.7 | Tareas de razonamiento complejo |
| `fast` | minimax/MiniMax-M2.7-highspeed | Documentación, tareas rápidas |
| `coder` | minimax/MiniMax-M2.7 | Implementación y debugging |
| `review` | minimax/MiniMax-M2.7 | Análisis y revisión |

## Nombres Semánticos de Agentes

| Agent | Nombre Semántico | Rol |
|-------|-------------------|-----|
| `@ultraworker` | OrquestadorPrincipal | Orquesta el ciclo completo |
| `@planner` | Estratega | Planificación estratégica |
| `@builder` | Constructor | Implementación full-stack |
| `@reviewer` | Auditor | Revisión de código |
| `@debug` | Detective | Diagnóstico de errores |
| `@docs` | Bibliotecario | Gestión de conocimiento |

## Ciclo de Ejecución

### Ciclo Completo (UltraWork)

```
┌──────────────────────────────────────────────────────────────┐
│                     FASE 0: ANÁLISIS                         │
│  OrquestadorPrincipal analiza el contexto y entiende         │
│  el alcance de la tarea                                      │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                  FASE 1: PLANIFICACIÓN                        │
│  Estratega descompone en tareas atómicas                    │
│  Identifica dependencias y puertas de decisión              │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ ¿Puerta de      │
                    │ Decisión?       │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ↓                             ↓
        SÍ → PAUSAR                    NO → CONTINUAR
        Esperar decisión               ↓
        del usuario                    ↓
                             ┌────────────────────────────────┐
                             │    FASE 2: IMPLEMENTACIÓN     │
                             │    PARALELA                    │
                             │    Constructor T1.1            │
                             │    Constructor T1.2 (parallel)│
                             └────────────────────────────────┘
                                           ↓
                             ┌────────────────────────────────┐
                             │    PUNTO DE SINCRONIZACIÓN    │
                             │    Verificar integración      │
                             └────────────────────────────────┘
                                           ↓
┌──────────────────────────────────────────────────────────────┐
│                       FASE 3: REVISIÓN                        │
│  Auditor analiza el código implementado                      │
│  Reporte estructurado 🔴🟡🟢                                │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ ¿Hay 🔴 items?  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ↓                             ↓
        SÍ → Corregir                  NO → CONTINUAR
        (hasta 3 intentos)                ↓
        ↓                                ↓
   ¿Persiste?                      ┌────────────────────────────────┐
        ↓                          │    FASE 4: DOCUMENTACIÓN       │
        ↓                          │    Bibliotecario actualiza     │
   Escalar al usuario              │    KNOWLEDGE.md + DECISIONS.md│
                                   └────────────────────────────────┘
                                              ↓
                                   ┌────────────────────────────────┐
                                   │    VERIFICACIÓN FINAL          │
                                   │    Tests pasan + Build limpio  │
                                   └────────────────────────────────┘
                                              ↓
                                          COMPLETO ✅
```

### Flujo Alternativo: Debug

```
Constructor ejecuta
        ↓
   ¿Error persiste
   después de 3 intentos?
        ↓
        SÍ
        ↓
   @Detective entra
   (Diagnóstico sistemático)
        ↓
   ┌─────────────────────┐
   │ 1. Reproducir        │
   │ 2. Caveman logs      │
   │ 3. Trazar causa raíz │
   │ 4. Hipótesis/verif   │
   │ 5. Mínimo arreglo    │
   └─────────────────────┘
        ↓
   ¿Bug implica decisión
   de producto?
        ↓
   SÍ → Puerta de Decisión
        → @Estratega
        → Esperar decisión
        → Continuar
```

## Configuración de Modelos por Agente

### Estructura en AORA.json

```json
{
  "agents": {
    "nombreDelAgente": {
      "model": "base|coder|fast|review",
      "temperature": 0.1-0.5,
      "permissions": {...}
    }
  }
}
```

### Ejemplo: Agente con modelo específico

```json
{
  "agents": {
    "ultraworker": {
      "model": "base",
      "temperature": 0.2
    },
    "docs": {
      "model": "fast",
      "temperature": 0.4
    }
  }
}
```

## Protocolo de Paralelismo

### Clasificación de tareas

```
TAREAS INDEPENDIENTES
├── No comparten archivos
├── Sin dependencias entre ellas
├── Pueden ejecutarse en paralelo
└── Se integran después

TAREAS SECUENCIALES
├── Una depende del output de la anterior
├── Modifican los mismos archivos
└── Requieren verificación entre pasos

PUNTOS DE SINCRONIZACIÓN
├── Donde ramas paralelas convergen
└── Requieren verificación antes de continuar
```

### Ejemplo de ejecución paralela

```
FASE 2: Constructor ejecuta en paralelo
├── T1.1 (auth endpoint) ──────────────────┐
├── T1.2 (user model)      ──┬─→ SINCRONIZAR → T2.1
└── T1.3 (db migration) ────┘
```

## Puertas de Decisión

### Detección y Flujo

```
Agente detecta decisión pendiente
        ↓
   ¿Es decisión de producto
   que bloquea desarrollo?
        ↓
        SÍ
        ↓
   DETENER ejecución de esa rama
        ↓
   Presentar al usuario:
   ┌────────────────────────────────────┐
   │ ⚡ PUERTA DE DECISIÓN              │
   │                                    │
   │ Situación: [descripción]          │
   │                                    │
   │ Opción A: [descripción]           │
   │   → impacto técnico: [...]        │
   │                                    │
   │ Opción B: [descripción]           │
   │   → impacto técnico: [...]        │
   │                                    │
   │ Recomendación: [agente sugiere]   │
   └────────────────────────────────────┘
        ↓
   Usuario decide
        ↓
   @Bibliotecario registra en DECISIONS.md
        ↓
   Continuar ejecución
```

## Auto-Recuperación

### Bucle Self-Healing

```
Build falla o revisión tiene 🔴 items
        ↓
   Intento 1: @Constructor corrige
        ↓
   ¿Funciona? → SÍ → Continuar
        ↓ NO
   Intento 2: @Detective analiza
        ↓
   ¿Funciona? → SÍ → Continuar
        ↓ NO
   Intento 3: @Constructor corrige con debug info
        ↓
   ¿Funciona? → SÍ → Continuar
        ↓ NO
   ESCALAR al usuario con análisis completo
```

## Base de Conocimiento

### Archivos de tracking

```
.opencode/
├── KNOWLEDGE.md    ← patrones, bugs resueltos, integraciones
└── DECISIONS.md    ← registro de decisiones de producto/arquitectura
```

### Estructura de KNOWLEDGE.md

```markdown
## Decisiones de Arquitectura
### [FECHA] [título]
**Contexto**: ...
**Opciones evaluadas**: ...
**Decisión**: ...
**Razón**: ...
**Consecuencias**: ...

## Patrones del Proyecto
### [nombre]
**Dónde se usa**: ...
**Por qué**: ...
**Ejemplo**: ...

## Bugs Resueltos
### [FECHA] [descripción]
**Síntoma**: ...
**Causa raíz**: ...
**Solución**: ...
**Prevención**: ...
```

## Activación de Agentes

| Agent | Activation | Cuándo usarlo |
|-------|-------------|---------------|
| `@OrquestadorPrincipal` | `ultrawork [task]` | Tareas complejas needing ciclo completo |
| `@Estratega` | `@planner` | Análisis y planificación |
| `@Constructor` | `@builder` | Implementación de código |
| `@Auditor` | `@reviewer` | Revisión de código |
| `@Detective` | `@debug` | Diagnóstico de errores |
| `@Bibliotecario` | `@docs` | Documentación y conocimiento |

## Ejemplo de conversación

```
Usuario: ultrawork agregar sistema de notificaciones push

OrquestadorPrincipal: Analizando contexto...
  → Leyendo estructura del proyecto
  → Identificando servicios existentes

OrquestadorPrincipal → @Estratega: Planificar sistema push

Estratega: Descomponiendo en tareas...
  T1.1: Crear servicio de notificaciones
  T1.2: Integrar con FCM/APNs
  T1.3: Crear endpoint de suscripción
  T1.4: Implementar cola de mensajes

Estratega: ⚡ PUERTA DE DECISIÓN
  ¿Usar FCM (Firebase) o APNs directamente?

  Opción A: Firebase Cloud Messaging
    → impacto: más fácil, mayor dependencia
  Opción B: APNs directo
    → impacto: más complejo, menos dependencia

  Recomendación: FCM para empezar

Usuario: Usemos FCM

Bibliotecario: Registrando decisión en DECISIONS.md

Constructor (T1.1 + T1.2 en paralelo):
  → Creando notification-service.ts
  → Configurando Firebase SDK

Constructor (T1.3 + T1.4):
  → Creando endpoint /subscribe
  → Implementando cola con Bull

Auditor: Revisando...
  🔴 Falta validación de tokens
  🟡 Agregar retry logic

Constructor: Corrigiendo 🔴

Auditor: ✅ Aprobado

Bibliotecario: Actualizando KNOWLEDGE.md

OrquestadorPrincipal: ULTRA WORK COMPLETO ✅
```