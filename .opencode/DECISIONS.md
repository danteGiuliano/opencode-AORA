# Decision Registry

Registro de decisiones de arquitectura y producto.

## Decisiones

### [D-2026-001] KB.json Cold Start - Seed Initialization

**Fecha**: 2026-05-02
**Tipo**: architectural fix
**Detectado por**: @ultraworker
**Contexto**: Fresh installations created empty KB.json, making knowledge search useless until entries accumulated over many sessions.

**Problema**:
- install.sh created KB.json with `{"entries":[]}` 
- search.js and docs.md expect KB.json to be an array `[]`
- Fresh install = cold start = no value until real entries accumulated

**Solucion**:
1. Fix install.sh to initialize KB.json as `[]` (array, not object)
2. Create kb-seed.json with 8 high-utility generic entries (weight: 0.5, confidence: medium)
3. Modify install.sh to copy kb-seed.json to KB.json if KB.json is empty or does not exist

**Archivos afectados**:
- install.sh: Change `{"entries":[]}` to `[]` + add seed initialization logic
- .opencode/knowledge/kb-seed.json: New file with 8 seed entries

**Seed entries**:
- SEED-001: JWT vs Sessions decision
- SEED-002: Env vars for secrets pattern
- SEED-003: Async/await error handling pattern
- SEED-004: CREATE INDEX before bulk writes (gotcha)
- SEED-005: Migrate before deploy order pattern
- SEED-006: DTO validation layer pattern
- SEED-007: Rate limiting on auth endpoints (gotcha)
- SEED-008: Gitignore env files (gotcha)

**Verificacion**: KB.json now starts with useful content, not empty. Agents can provide value from session one.

---

### [D-2026-002] Agent Name Normalization

**Fecha**: 2026-05-02
**Tipo**: consistency fix
**Detectado por**: @ultraworker

**Problema**: Agents referenced with both semantic names and slugs, causing potential ambiguity in prompt resolution.

**Solucion**: Usar slug técnico en todas las referencias entre agentes, nombres semánticos solo en sección "Identidad".

**Mapeo aplicado**:
- @Bibliotecario → @docs
- @Constructor → @builder
- @Auditor → @reviewer
- @Detective → @debug
- @Estratega → @planner
- @Arbitro → @decider
- @QueueManager → @queue
- @Launcher → @launcher
- @Calibrator → @calibrator
- @OrquestadorPrincipal → @ultraworker

**Archivos afectados**: ultraworker.md, planner.md, reviewer.md, builder.md, decider.md, docs.md

---

### [D-2026-003] Parallelism Safe Mode

**Fecha**: 2026-05-02
**Tipo**: robustness fix
**Detectado por**: @ultraworker

**Problema**: launcher.md assumed parallel execution always works. Rate limits and context conflicts could break it.

**Solucion**:
1. Add AORA_PARALLEL env var detection (default: safe mode = false)
2. Add sequential fallback mode when AORA_PARALLEL != true
3. Add backoff/retry on rate limit errors (5s wait, max 2 retries)
4. Update AORA.json with new parallelism config fields

**Config agregada en AORA.json**:
```json
"parallelism": {
  "safeMode": true,
  "envVar": "AORA_PARALLEL",
  "backoffSeconds": 5,
  "maxRetries": 2
}
```

**Archivos afectados**: launcher.md, queue.md, AORA.json

---

### [D-2026-004] Bug Fixes Session - Mayo 2026

**Fecha**: 2026-05-02
**Tipo**: bug fixes
**Detectado por**: @ultraworker

**Bugs corregidos**:

1. **BUG 1 - search.js args parser**: `node search.js --keyword --top` asignaba `args.keyword = "--top"`. Fix: parseo iterativo que detecta si el siguiente arg empieza con `--` y asigna `true` en ese caso.

2. **BUG 2 - judge.js path resolution**: `__dirname` en evals/judge.js resolvia a `evals/` no al root. Fix: usar `path.join(__dirname, '..')` como PROJECT_ROOT para calcular paths relativos al proyecto.

3. **BUG 3 - metrics.json double-write race**: calibrator.md y judge.js escribian metrics.json sin lock. Fix: agregar lock file mechanism en judge.js y documentar lock en calibrator.md.

4. **BUG 4 - ultraworker.md faltaba FASE 3.5**: Diagrama mostraba 6 fases pero faltaba @calibrator. Fix: Actualizar diagrama a 7 fases con FASE 3.5 (@calibrator automatico).

5. **BUG 5 - docs.md sin deduplicacion**: No habia mecanismo para evitar IDs duplicados en KB.json. Fix: Agregar verificacion obligatoria de ID existente antes de hacer push.

6. **BUG 6 - install.sh sin 3 agentes**: Faltan queue, launcher, calibrator en la lista de descarga. Fix: Agregar los tres agentes faltantes.

**Inconsistencias corregidas**:

1. **INC 1 - aora-agents.json vs AORA.json**: Sincronizados manualmente. aora-agents.json es simple key-value, AORA.json es la fuente de verdad completa.

2. **INC 2 - setmodel.js solo actualizaba global**: Fix: ahora actualiza todos los modelos (base, coder, review, fast) y cambia todos los agentes a `model: "base"`.

3. **INC 3 - @Árbitro vs @Arbitro**: Arreglado a @decider (slug). Mencionaba "@Árbitro" con tilde que no existe como agente.

4. **INC 4 - upgrade/downgrade asymmetric**: Documentado en search.js comments. Asimetria intencional: downgrade -0.2 vs upgrade +0.1.

5. **INC 5 - calibrator.md --stats comment**: Aclarado que --stats es solo lectura.

6. **INC 6 - @launcher no aparecia en diagrama**: Ya estaba en FASE 2 como parte de @queue.

7. **INC 7 - WORKFLOW_ES.md desactualizado**: Actualizado para reflejar flujo actual con queue, launcher, calibrator.

**Menores corregidos**:
- MENOR 1: update.js faltaban queue, launcher, calibrator
- MENOR 2: decider.md "CONFlicto" -> "CONFlicto (minuscula intencional)"
- MENOR 3: eval-005 esperaba 0 critical/warnings pero archivo no existia. Creado src/auth/middleware.js con vulnerabilidades, expected: 2 critical, 3 warnings.

**Archivos afectados**:
- search.js, judge.js, install.sh, update.js, setmodel.js
- ultraworker.md, calibrator.md, docs.md, decider.md, reviewer.md
- WORKFLOW_ES.md, evals/dataset.json
- src/auth/middleware.js (creado)

---

<!-- Agregar decisiones abajo con formato -->

---

## Pendientes

| ID | Descripción | Prioridad | Fecha Creación | Status |
|----|-------------|-----------|----------------|--------|
| P-001 | [pendiente] | alta/media/baja | YYYY-MM-DD | abierto/cerrado |

---
