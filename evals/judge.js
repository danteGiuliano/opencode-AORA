#!/usr/bin/env node
/**
 * AORA Judge - Evalua outputs de agentes contra expected
 * Uso: node judge.js --case eval-001 --output "output string"
 */

const fs = require('fs');
const path = require('path');

const DATASET_PATH = path.join(__dirname, 'dataset.json');
// Use project root as base, not __dirname (which is evals/)
const PROJECT_ROOT = path.join(__dirname, '..');
const METRICS_PATH = path.join(PROJECT_ROOT, '.opencode', 'calibrator', 'metrics.json');

function loadDataset() {
  return JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
}

// Note: metrics are written by @calibrator agent only
// judge.js is read-only for CI gate purposes

function loadMetrics() {
  if (fs.existsSync(METRICS_PATH)) {
    return JSON.parse(fs.readFileSync(METRICS_PATH, 'utf8'));
  }
  return { agents: {}, recentTasks: [] };
}

function evaluateCase(caseData, output) {
  const results = {
    passed: true,
    score: 100,
    details: []
  };

  const expected = { ...(caseData.expected || {}), ...(caseData.criteria || {}) };

  // Evaluar segun tipo de agente
  switch (caseData.agent) {
    case 'planner':
      results.details = evaluatePlanner(output, expected);
      break;
    case 'builder':
      results.details = evaluateBuilder(output, expected);
      break;
    case 'reviewer':
      results.details = evaluateReviewer(output, expected);
      break;
    case 'docs':
      results.details = evaluateDocs(output, expected);
      break;
    case 'queue':
      results.details = evaluateQueue(output, expected);
      break;
    case 'calibrator':
      results.details = evaluateCalibrator(output, expected);
      break;
    case 'ultraworker':
      results.details = evaluateUltraworker(output, expected);
      break;
    case 'decider':
      results.details = evaluateDecider(output, expected);
      break;
    case 'debug':
      results.details = evaluateDebug(output, expected);
      break;
    case 'launcher':
      results.details = evaluateLauncher(output, expected);
      break;
    default:
      results.details.push({ check: 'agent-type', status: 'PASS', note: 'No specific evaluation' });
  }

  // Calcular score
  const failedChecks = results.details.filter(d => d.status === 'FAIL');
  results.score = Math.max(0, 100 - (failedChecks.length * 20));
  results.passed = results.score >= 60;

  return results;
}

function evaluatePlanner(output, expected) {
  const checks = [];
  const lowerOutput = output.toLowerCase();

  if (expected.hasTareasIndependientes !== undefined) {
    const has = /tareas\s+independientes/i.test(output);
    checks.push({ check: 'hasTareasIndependientes', status: has === expected.hasTareasIndependientes ? 'PASS' : 'FAIL' });
  }

  if (expected.hasTareasDependientes !== undefined) {
    const has = /tareas\s+dependientes/i.test(output);
    checks.push({ check: 'hasTareasDependientes', status: has === expected.hasTareasDependientes ? 'PASS' : 'FAIL' });
  }

  if (expected.hasRiesgosIdentificados !== undefined) {
    const has = /riesgos\s+identificados/i.test(output);
    checks.push({ check: 'hasRiesgosIdentificados', status: has === expected.hasRiesgosIdentificados ? 'PASS' : 'FAIL' });
  }

  if (expected.includesJWT) {
    const has = /jwt|token|autentic/i.test(lowerOutput);
    checks.push({ check: 'includesJWT', status: has ? 'PASS' : 'FAIL' });
  }

  if (expected.includesRateLimiting) {
    const has = /rate|limiting|limite/i.test(lowerOutput);
    checks.push({ check: 'includesRateLimiting', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateBuilder(output, expected) {
  const checks = [];

  if (expected.fileCreated) {
    const hasFile = output.includes(expected.fileCreated);
    checks.push({ check: 'fileCreated', status: hasFile ? 'PASS' : 'FAIL', detail: expected.fileCreated });
  }

  if (expected.functionExports) {
    expected.functionExports.forEach(fn => {
      const has = new RegExp(`export.*${fn}|module\\.exports.*${fn}`, 'i').test(output);
      checks.push({ check: `exports:${fn}`, status: has ? 'PASS' : 'FAIL' });
    });
  }

  return checks;
}

function evaluateReviewer(output, expected) {
  const checks = [];
  const lowerOutput = output.toLowerCase();

  if (expected.findings) {
    if (expected.findings.critical !== undefined) {
      // Match the RESUMEN line format: "RESUMEN: [X] críticos, [X] advertencias, [X] correctos"
      const criticalMatch = output.match(/RESUMEN.*?(\d+)\s*cr[ií]ticos/i) || output.match(/🔴\s*cr[ií]ticos.*?(\d+)/i) || output.match(/critical.*?(\d+)/i);
      if (criticalMatch) {
        const reported = parseInt(criticalMatch[1]);
        checks.push({
          check: 'criticalCount',
          status: reported === expected.findings.critical ? 'PASS' : 'FAIL',
          detail: `Expected ${expected.findings.critical}, got ${reported}`
        });
      } else {
        checks.push({ check: 'criticalCount', status: 'FAIL', detail: 'Could not find critical count in output' });
      }
    }
    if (expected.findings.warnings !== undefined) {
      const warnMatch = output.match(/RESUMEN.*?(\d+)\s*advertencias/i) || output.match(/🟡.*?advertencias.*?(\d+)/i) || output.match(/warnings.*?(\d+)/i);
      if (warnMatch) {
        const reported = parseInt(warnMatch[1]);
        checks.push({
          check: 'warningCount',
          status: reported === expected.findings.warnings ? 'PASS' : 'FAIL',
          detail: `Expected ${expected.findings.warnings}, got ${reported}`
        });
      }
    }
  }

  // Verificar que encontro problemas si se esperaba
  if (expected.noHardcodedSecrets) {
    const hasSecrets = /password|secret|api_key|apikey.*=/i.test(lowerOutput) && !/env|process\.env/i.test(lowerOutput);
    checks.push({ check: 'noHardcodedSecrets', status: hasSecrets ? 'FAIL' : 'PASS' });
  }

  return checks;
}

function evaluateDocs(output, expected) {
  const checks = [];

  if (expected.decisionId) {
    const hasId = /D-\d+|decision/i.test(output);
    checks.push({ check: 'decisionId', status: hasId ? 'PASS' : 'FAIL' });
  }

  if (expected.hasProsCons) {
    const has = /pros?|contras?|ventajas?|desventajas?/i.test(output);
    checks.push({ check: 'hasProsCons', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateQueue(output, expected) {
  const checks = [];

  if (expected.parallelismUsed) {
    const has = new RegExp(`parallelism.*?${expected.parallelismUsed}|${expected.parallelismUsed}.*?simultane`).test(output.toLowerCase());
    checks.push({ check: 'parallelismUsed', status: has ? 'PASS' : 'FAIL' });
  }

  if (expected.launcherWasCalled) {
    const has = /@launcher|launcher/i.test(output);
    checks.push({ check: 'launcherWasCalled', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateCalibrator(output, expected) {
  const checks = [];

  if (expected.successRate !== undefined) {
    const rateMatch = output.match(/tasa\s+de\s+exito.*?(\d+)/i) || output.match(/successRate.*?(\d+)/i);
    if (rateMatch) {
      const reported = parseInt(rateMatch[1]);
      checks.push({
        check: 'successRate',
        status: reported >= expected.successRate ? 'PASS' : 'FAIL',
        detail: `Expected >= ${expected.successRate}, got ${reported}`
      });
    }
  }

  if (expected.metricsUpdated) {
    const hasUpdate = /metrics.*?actualizado|actualizando.*?metrics/i.test(output.toLowerCase());
    checks.push({ check: 'metricsUpdated', status: hasUpdate ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateUltraworker(output, expected) {
  const checks = [];
  const lower = output.toLowerCase();

  if (expected.fase0Complete) {
    const has = /fase\s*0|contexto|analisis/i.test(lower);
    checks.push({ check: 'fase0Complete', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.fase1Complete) {
    const has = /fase\s*1|planner|plan/i.test(lower);
    checks.push({ check: 'fase1Complete', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.fase2Complete) {
    const has = /fase\s*2|queue|pool|builder/i.test(lower);
    checks.push({ check: 'fase2Complete', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.fase3Complete) {
    const has = /fase\s*3|reviewer|audit/i.test(lower);
    checks.push({ check: 'fase3Complete', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.fase4Complete) {
    const has = /fase\s*4|docs|document/i.test(lower);
    checks.push({ check: 'fase4Complete', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.planEjecutado) {
    const has = /implementado|completado|ULTRA WORK/i.test(output);
    checks.push({ check: 'planEjecutado', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateDecider(output, expected) {
  const checks = [];
  const lower = output.toLowerCase();

  if (expected.decision) {
    const hasDecision = /decisi[oó]n|decidido/i.test(lower);
    checks.push({ check: 'decision', status: hasDecision ? 'PASS' : 'FAIL' });
  }
  if (expected.prioridad) {
    const has = /prioridad|dominio|implementaci[oó]n|h[ií]brido/i.test(lower);
    checks.push({ check: 'prioridad', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.justificacion) {
    const has = /justificaci[oó]n|por\s+qu[eé]|raz[oó]n/i.test(lower);
    checks.push({ check: 'justificacion', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateDebug(output, expected) {
  const checks = [];
  const lower = output.toLowerCase();

  if (expected.rootCause) {
    const has = /causa\s+ra[ií]z|root\s*cause|origen/i.test(lower);
    checks.push({ check: 'rootCause', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.hasSteps) {
    const has = /paso\s*\d|step\s*\d/i.test(lower) || /\d+\.\s/.test(output);
    checks.push({ check: 'hasSteps', status: has ? 'PASS' : 'FAIL' });
  }
  if (expected.hasVerification) {
    const has = /verific|comprobar|confirmar|validar/i.test(lower);
    checks.push({ check: 'hasVerification', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function evaluateLauncher(output, expected) {
  const checks = [];
  const lower = output.toLowerCase();

  if (expected.maxConcurrent !== undefined) {
    const match = output.match(/paralelismo.*?(\d+)|max.*?(\d+).*?simult/i);
    checks.push({ check: 'maxConcurrent', status: match ? 'PASS' : 'FAIL' });
  }
  if (expected.allLaunched) {
    const has = /lanzad[ao]s|🚀|PID/i.test(output);
    checks.push({ check: 'allLaunched', status: has ? 'PASS' : 'FAIL' });
  }

  return checks;
}

function runCIgate() {
  const metrics = loadMetrics();
  const recentTasks = metrics.recentTasks || [];

  // Obtener ultimas 10 tareas
  const last10 = recentTasks.slice(-10);

  if (last10.length === 0) {
    console.log('CI-GATE: SKIP - No hay tareas recientes para evaluar');
    process.exit(0);
  }

  // Contar exitos y fallos
  const successful = last10.filter(t => t.result === 'success').length;
  const successRate = successful / last10.length;

  // Buscar tareas con muchas correcciones
  const highCorrections = last10.filter(t => t.corrections > 3);

  // Buscar tareas fallidas recientes
  const recentFailures = last10.filter(t => t.result === 'failure');

  let exitCode = 0;
  let report = 'CI-GATE RESULTS\n';
  report += `================\n`;
  report += `Tasks evaluated: ${last10.length}\n`;
  report += `Success rate: ${(successRate * 100).toFixed(1)}%\n`;
  report += `Recent failures: ${recentFailures.length}\n`;
  report += `High correction tasks: ${highCorrections.length}\n\n`;

  if (successRate < 0.8) {
    report += `🔴 FAIL: Success rate ${(successRate * 100).toFixed(1)}% < 80%\n`;
    exitCode = 1;
  } else {
    report += `🟢 PASS: Success rate OK\n`;
  }

  if (highCorrections.length > 0) {
    report += `⚠️  WARN: ${highCorrections.length} tasks with > 3 corrections\n`;
  }

  if (recentFailures.length > 2) {
    report += `🔴 FAIL: ${recentFailures.length} recent failures - investigate\n`;
    exitCode = 1;
  }

  console.log(report);
  process.exit(exitCode);
}

// CLI
const args = process.argv.slice(2);

if (args.includes('ci-gate')) {
  runCIgate();
} else if (args.includes('--help')) {
  console.log(`
AORA Judge - Evaluador de agentes

Uso:
  node judge.js --case eval-001 --output "output del agente"
  node judge.js ci-gate

Opciones:
  --case <id>    ID del caso de evaluacion
  --output <str> Output del agente a evaluar
  ci-gate        Ejecutar validacion de CI
  --help         Mostrar esta ayuda
  `);
  process.exit(0);
} else {
  const caseIndex = args.indexOf('--case');
  const outputIndex = args.indexOf('--output');

  if (caseIndex === -1 || outputIndex === -1) {
    console.error('Error: Se requiere --case y --output');
    console.error('Usa --help para mas informacion');
    process.exit(1);
  }

  const caseId = args[caseIndex + 1];
  const agentOutput = args[outputIndex + 1];

  const dataset = loadDataset();
  const testCase = dataset.cases.find(c => c.id === caseId);

  if (!testCase) {
    console.error(`Error: Caso ${caseId} no encontrado`);
    process.exit(1);
  }

  const result = evaluateCase(testCase, agentOutput);

  console.log(`
EVALUATION RESULTS
==================
Case: ${caseId}
Agent: ${testCase.agent}
Score: ${result.score}/100
Status: ${result.passed ? '🟢 PASS' : '🔴 FAIL'}

Details:
${result.details.map(d => `  ${d.status === 'PASS' ? '✅' : '❌'} ${d.check}${d.detail ? ` - ${d.detail}` : ''}`).join('\n')}
  `);

  process.exit(result.passed ? 0 : 1);
}