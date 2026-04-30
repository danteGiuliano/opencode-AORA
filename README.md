# AORA — Agents Runtime Architecture

Sistema multi-agente para [OpenCode](https://opencode.ai) con configuración centralizada, nombres semánticos y modelos arbitrarios.

Inspirado en [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) y el concepto [caveman](https://github.com/JuliusBrussee/caveman) para compresión de output.

## Concepto

AORA define una configuración centralizada en `AORA.json` que especifica:
- **Modelo global base** para todos los agentes
- **Modelos especializados** (base, fast, coder, review)
- **Configuración por agente**: temperature, permissions, semantic name

## Arquitectura

```
AORA.json (config global)
├── global.baseModel: modelo base para todos
├── models: modelos específicos disponibles
├── agents: configuración individual
│   ├── semantic: nombre semántico
│   ├── model: qué modelo usar
│   └── temperature: configuración específica
└── caveman: modo ahorro con niveles lite/full/ultra
```

## Agentes y Nombres Semánticos

| Agent | Nombre Semántico | Rol |
|-------|------------------|-----|
| `@ultrawork` | OrquestadorPrincipal | Orquestador de ciclo completo |
| `@planner` | Estratega | Planificación estratégica |
| `@builder` | Constructor | Implementación full-stack |
| `@reviewer` | Auditor | Revisión de código |
| `@debug` | Detective | Diagnóstico de errores |
| `@docs` | Bibliotecario | Gestión de conocimiento |
| `@decider` | Arbitro | Mediador de conflictos dominio vs implementación |
| `@init-cruise` | Configurador | Replica permisos en proyectos |

## Archivos del Sistema

```
.opencode/
├── agents/
│   ├── ultraworker.md    ← OrquestadorPrincipal
│   ├── planner.md        ← Estratega
│   ├── builder.md        ← Constructor
│   ├── reviewer.md       ← Auditor
│   ├── debug.md           ← Detective
│   ├── docs.md           ← Bibliotecario
│   ├── decider.md        ← Arbitro
│   └── init-cruise.md    ← Configurador
├── KNOWLEDGE.md          ← Base de conocimiento
└── DECISIONS.md          ← Registro de decisiones

AORA.json                  ← Configuración global
docs/WORKFLOW_ES.md        ← Flujo de trabajo detallado
```

## Modo Compact (Caveman)

Sistema de compresión de output inspirado en [caveman](https://github.com/JuliusBrussee/caveman). Reduce ~65-75% de tokens sin perder precisión técnica.

### Niveles

| Nivel | Descripción |
|-------|-------------|
| `lite` | Sin filler, gramática intacta |
| `full` | Sin artículos, fragmentos OK |
| `ultra` | Máxima compresión, telegráfico |

### Activación

```
compact [tarea]
caveman [tarea]
modoahorro [tarea]
```

## Uso

```bash
# Ciclo completo
ultrawork crear módulo de pagos con Stripe

# Flujo manual
@Estratega analizar: agregar sistema de notificaciones
@Constructor implementar T1.1 y T1.2
@Auditor revisar src/notifications/
@Detective diagnosticar TypeError en webhook
@Bibliotecario registrar decisión de Stripe
@Arbitro conflicto: dominio dice X, implementación hace Y
init-cruise --apply  # replicar permisos en proyecto
```

## Ciclo de Trabajo

```
ANALISIS → PLANIFICACION → IMPLEMENTACION → REVISION → DOCS
    ↓              ↓               ↓            ↓         ↓
Orquestador  Estratega       Constructor    Auditor   Bibliotecario
   Principal
                 ↓
         ¿Puerta de Decisión?
                 ↓
            PAUSAR → esperar decisión → continuar
```

## Auto-recuperación

Errores se reintentan automáticamente (max 3 intentos):
1. Constructor corrige
2. Detective analiza
3. Escalar al usuario

## Base de Conocimiento

Los agentes actualizan automáticamente:
- `KNOWLEDGE.md`: patrones, bugs resueltos, integraciones
- `DECISIONS.md`: decisiones de producto/arquitectura