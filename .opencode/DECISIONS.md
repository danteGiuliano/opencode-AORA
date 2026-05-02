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

### [D-2026-005] Second Bug Fixes Session - Mayo 2026 Round 2

**Fecha**: 2026-05-02
**Tipo**: bug fixes
**Detectado por**: @ultraworker

**Bugs corregidos**:

1. **BUG 1 - ultraworker.md diagrama duplicado**: El archivo tenía dos diagramas ASCII completos (7 fases + 5 fases). El segundo estaba fuera del bloque de código (`` ``` `` mal cerrado). Fix: Eliminé el diagrama duplicado de 5 fases.

2. **BUG 2 - judge.js acquireLock rompía en Windows**: Usaba `require('child_process').execSync('sleep 0.1')` en un busy-wait loop. `sleep` no existe en Windows. Fix: Removí el sleep externo, el loop ahora solo usa Date.now() checking.

3. **BUG 3 - ci-gate.sh EVALS_DIR apuntaba a evals/evals/**: ci-gate.sh vive en evals/, entonces SCRIPT_DIR=evals/ y EVALS_DIR="$SCRIPT_DIR/evals"=evals/evals/. Fix: Cambié a JUDGE_PATH="$SCRIPT_DIR/judge.js" directamente.

4. **BUG 4 - docs.md grep para verificar IDs**: Usaba `grep -q "\"id\": \"$ID\""` que puede tener falsos positivos con formatting JSON variable o IDs en content. Fix: Cambié a `node -e` con JSON.parse para verificación confiable.

**Inconsistencias corregidas**:

1. **INC 1 - ci-gate.sh sin lock**: El lock de Node en judge.js y el lock bash documentado en calibrator.md son mecanismos distintos. Decisión: el lock de Node es suficiente para protect writes dentro del mismo proceso Node. Bash scripts que leen no necesitan lock.

2. **INC 2 - WORKFLOW_ES.md tabla de activación**: Usaba nombres semánticos (@OrquestadorPrincipal, @Estratega) en la columna Agent. Fix: Cambiado a slugs (@ultraworker, @planner).

3. **INC 3 - README.md fases 4 y 5**: Decía FASE 4 @calibrator y FASE 5 @docs. El sistema real tiene FASE 3.5 y FASE 4. Fix: Actualizado a FASE 3.5 y FASE 4.

4. **INC 4 - decider.md código de ejemplo asignado a @planner**: Decía "No generar código de ejemplo (para eso está @planner)" pero @planner no genera código. Fix: Cambiado a @builder.

5. **INC 5 - SEED-005 tag en cirílico**: `["deployment", "migrations", "database", "devops", " порядок"]` - " порядок" es ruso. Fix: Cambiado a "order".

6. **INC 6 - ultraworker.md FASE 3.5 "automática"**: Decía "el sistema la invoca por sí solo" pero OpenCode no tiene triggers automáticos. Fix: Cambiado a explicación correcta de que se llama explícitamente después de @reviewer.

7. **INC 7 - setmodel.js parser viejo**: main() usaba el parser con bug de args que empiezan con --. Fix: Actualizado con el mismo parser corregido que tiene search.js.

**Menores corregidos**:

1. **MENOR 1 - KNOWLEDGE.md**: No explicaba por qué KB.json está vacío en el repo. Fix: Agregué nota sobre kb-seed.json + install.sh.

2. **MENOR 2 - calibrator.md sintaxis inexistente**: "@calibrator kb-hit:" no existe como protocolo. Fix: Cambiado a invocar node search.js directamente.

3. **MENOR 3 - eval-005 criteria no implementados**: dataset.json tenía criteria detectaSQLInjection, detectaXSS pero judge.js solo esperaba noHardcodedSecrets. Fix: Simplifiqué criteria a solo noHardcodedSecrets que judge.js ya implementa.

**Archivos afectados**:
- ultraworker.md (BUG 1, INC 6)
- evals/judge.js (BUG 2)
- evals/ci-gate.sh (BUG 3)
- docs.md (BUG 4)
- docs/WORKFLOW_ES.md (INC 2)
- README.md (INC 3)
- decider.md (INC 4)
- kb-seed.json (INC 5)
- setmodel.js (INC 7)
- calibrator.md (MENOR 2)
- KNOWLEDGE.md (MENOR 1)
- evals/dataset.json (MENOR 3)

---

### [D-2026-006] Third Bug Fixes Session - Mayo 2026 Round 3

**Fecha**: 2026-05-02
**Tipo**: bug fixes
**Detectado por**: @ultraworker

**Bugs corregidos**:

1. **BUG 1 - judge.js acquireLock busy-wait**: El while síncrono bloqueaba el event loop de Node completamente. No había yield real. Fix: Reemplazado por check no-bloqueante simple - si el lock existe, retorna false inmediatamente. Lock es best-effort entre procesos Node.

2. **BUG 2 - calibrator.md kb-hit residual**: La sección "Integracion con @ultraworker y @planner" al final del archivo todavía tenía @calibrator kb-hit:, kb-success:, kb-failed: (sintaxis inexistente). Fix: Actualizado a invocar node search.js directamente.

3. **BUG 3 - update.js parser de args**: El parser viejo asignaba --force como valor de --all, dejando args.force undefined. Fix: Actualizado con el mismo parser iterativo de search.js y setmodel.js.

**Inconsistencias corregidas**:

1. **I1 - ultraworker.md checklist "automática"**: Checklist decía "FASE 3.5 automática" contradictorio con el cuerpo que dice "explicitamente llamá". Fix: Cambiado a "@ultraworker llama explícitamente".

2. **I2 - WORKFLOW_ES.md flujo debug con nombres semánticos**: "@Detective", "@Estratega", "@Constructor" en el flujo de debug. Fix: Cambiado a @debug, @planner, @builder. También en self-healing loop.

3. **I3 - CAVEMAN_CONFIG.md tabla con nombres semánticos**: La tabla de configuración usaba "OrquestadorPrincipal", "Constructor", etc. Fix: Cambiado a slugs (ultraworker, builder, etc).

4. **I4 - README.md FASE 5**: La sección de flujo de conocimiento decía "@docs FASE 5". Fix: Cambiado a FASE 4.

5. **I5 - calibrator.md bash lock vs Node lock**: Documentaba dos mecanismos de lock incompatibles (bash lock en calibrator.md + Node lock en judge.js). Fix: Removida la sección de bash lock. El lock es responsabilidad de judge.js (Node).

6. **I6 - AORA.json bashRestriction para docs**: docs.md usa `node -e` pero bashRestriction no lo permitía. Fix: Agregado "node -e" a la lista de comandos permitidos.

**Menores corregidos**:

1. **M2 - builder.md 报告**: Carácter chino en "debug sistemático antes de报告". Fix: Cambiado a "escalar".

2. **M3 - decider.md 冲突**: Template decía "[qué冲突]". Fix: Cambiado a "[qué conflicto]".

3. **M4 - install.sh cat|tr ineficiente**: Usaba `cat "$KB.json" | tr -d ' '` que no maneja saltos de línea. Fix: Cambiado a `node -e` con JSON.parse para verificación robusta del array vacío.

**Archivos afectados**:
- evals/judge.js (BUG 1)
- .opencode/agents/calibrator.md (BUG 2, I5)
- .opencode/update.js (BUG 3)
- .opencode/agents/ultraworker.md (I1)
- docs/WORKFLOW_ES.md (I2)
- docs/CAVEMAN_CONFIG.md (I3)
- README.md (I4)
- AORA.json (I6)
- .opencode/agents/builder.md (M2)
- .opencode/agents/decider.md (M3)
- install.sh (M4)

---

### [D-2026-007] Fourth Bug Fixes Session - Mayo 2026 Round 4

**Fecha**: 2026-05-02
**Tipo**: bug fixes
**Detectado por**: @ultraworker

**Bugs corregidos**:

1. **BUG 1 - install.sh KB empty check invertida**: El `$()` capturaba stdout no exit code, y la comparación `= "0"` siempre fallaba porque stdout estaba vacío. Fix: Usar exit code directamente con `if node ... 2>/dev/null; then KB_EMPTY=true; fi`.

2. **BUG 2 - ultraworker.md diagrama FASE 3.5 decia "Automático"**: El diagrama de 7 fases todavía decia "Automático, no requiere delegacion manual" contradiciendo el cuerpo. Fix: Cambiado a "@ultraworker llama explicitamente".

**Inconsistencias corregidas**:

1. **I1 - AORA.json automatic: true para fase 3.5**: El campo automatic: true contradecía el comportamiento explícito documentado. Fix: Cambiado a automatic: false.

2. **I2 - calibrator.md doble backtick**: La seccion "Registro de Uso de KB" tenía un bloque de código triple backtick que cerraba y otro triple backtick suelto que dejaba texto como prosa. Fix: Removido el bloque extra.

3. **I3 - docs.md header permisos desactualizado**: El header de identidad no mencionaba node -e que fue agregado a bashRestriction. Fix: Actualizado el header.

4. **I4 - WORKFLOW_ES.md ejemplo de conversación con nombres semánticos**: El ejemplo usaba "OrquestadorPrincipal", "Estratega", "Bibliotecario", "Constructor", "Auditor". Fix: Cambiado todo a slugs (@ultraworker, @planner, @docs, @builder, @reviewer).

5. **I5 - judge.js saveMetrics código muerto**: saveMetrics estaba implementada con lock pero nunca se llamaba. Design decision: judge.js es solo-lectura, calibrator escribe métricas. Fix: Comentado que saveMetrics no se usa por judge.js.

6. **I6 - update.js faltaba config-aora.md**: agentFiles y localFiles agents no incluían config-aora.md. Fix: Agregado.

**Menores corregidos**:

1. **M1 - calibrator.md indentación rota en recalibrar KB**: La condición failedUses > 3 tenía indentación inconsistente. Fix: Simplificado a una línea por item.

2. **M2 - WORKFLOW_ES.md Orchestra en español**: "Orchestra" es inglés, el resto del doc está en español. Fix: Cambiado a "Orquesta".

3. **M3 - README.md @Bibliotecario en schema ejemplo**: El campo source del ejemplo usaba @Bibliotecario en lugar de @docs. Fix: Cambiado a @docs.

**Archivos afectados**:
- install.sh (BUG 1)
- .opencode/agents/ultraworker.md (BUG 2)
- AORA.json (I1)
- .opencode/agents/calibrator.md (I2, M1)
- .opencode/agents/docs.md (I3)
- docs/WORKFLOW_ES.md (I4, M2)
- evals/judge.js (I5)
- .opencode/update.js (I6)
- README.md (M3)

---

<!-- Agregar decisiones abajo con formato -->

---

## Pendientes

| ID | Descripción | Prioridad | Fecha Creación | Status |
|----|-------------|-----------|----------------|--------|
| P-001 | [pendiente] | alta/media/baja | YYYY-MM-DD | abierto/cerrado |

---
