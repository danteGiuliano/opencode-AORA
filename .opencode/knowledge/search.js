#!/usr/bin/env node
/**
 * AORA Knowledge Search
 * Busqueda con ranking basado en relevancia y uso
 *
 * Uso:
 *   node search.js --keyword "jwt"
 *   node search.js --keyword "auth" --top 5
 *   node search.js --hit "D-001"      # Registra hit
 *   node search.js --success "D-001"  # Registra uso exitoso
 *   node search.js --failed "D-001"  # Registra uso fallido
 */

const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(__dirname, 'KB.json');
const c = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m', m: '\x1b[35m', c: '\x1b[36m', w: '\x1b[37m', z: '\x1b[0m', bold: '\x1b[1m' };

function log(m, color = 'z') { console.log(`${c[color]}${m}${c.z}`); }

function loadKB() {
  try {
    const data = fs.readFileSync(KB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    log(`Error: No se encontro KB.json en ${KB_PATH}`, 'r');
    process.exit(1);
  }
}

function saveKB(kb) {
  fs.writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
}

// Calcular success rate
function successRate(entry) {
  const total = (entry.meta?.successUses || 0) + (entry.meta?.failedUses || 0) + 1;
  const successes = (entry.meta?.successUses || 0) + 1;
  return successes / total;
}

// Calcular usage boost
function usageBoost(entry) {
  const hits = entry.meta?.hits || 0;
  const sr = successRate(entry);
  return 1 + Math.log(hits + 1) * sr;
}

// Scoring de relevancia
function relevanceScore(entry, query) {
  let score = 0;
  const q = query.toLowerCase();

  // ID match exacto
  if (entry.id.toLowerCase() === q) return 100;

  // Title match
  if ((entry.title || '').toLowerCase().includes(q)) score += 30;

  // Summary match
  if ((entry.summary || '').toLowerCase().includes(q)) score += 20;

  // Keywords match (mas importante)
  if (entry.keywords && entry.keywords.some(k => k.toLowerCase().includes(q))) score += 25;

  // Tags match
  if (entry.tags && entry.tags.some(t => t.toLowerCase().includes(q))) score += 20;

  // Concepts match
  if (entry.concepts && entry.concepts.some(c => c.toLowerCase().includes(q))) score += 15;

  // Content match (menos importante)
  if ((entry.content || '').toLowerCase().includes(q)) score += 10;

  // Type match
  if ((entry.type || '').toLowerCase() === q) score += 15;

  return score;
}

// Score final combinado
function finalScore(entry, query) {
  const relScore = relevanceScore(entry, query);
  const baseWeight = entry.meta?.weight || 0.5;
  const boost = usageBoost(entry);

  return relScore * boost * baseWeight;
}

// Registrar hit
function registerHit(entryId) {
  const kb = loadKB();
  const entry = kb.find(e => e.id === entryId);

  if (!entry) {
    log(`Entrada ${entryId} no encontrada`, 'r');
    return false;
  }

  entry.meta = entry.meta || {};
  entry.meta.hits = (entry.meta.hits || 0) + 1;
  entry.meta.lastUsed = new Date().toISOString();

  saveKB(kb);
  log(`Hit registrado: ${entryId} (hits: ${entry.meta.hits})`, 'g');
  return true;
}

// Registrar uso exitoso
function registerSuccess(entryId) {
  const kb = loadKB();
  const entry = kb.find(e => e.id === entryId);

  if (!entry) {
    log(`Entrada ${entryId} no encontrada`, 'r');
    return false;
  }

  entry.meta = entry.meta || {};
  entry.meta.successUses = (entry.meta.successUses || 0) + 1;

  // Auto-upgrade si tiene muchas exitos
  if (entry.meta.successUses > 10 && entry.meta.successUses > (entry.meta.failedUses || 0) * 2) {
    entry.meta.confidence = 'high';
    entry.meta.weight = Math.min(0.95, (entry.meta.weight || 0.5) + 0.1);
    log(`Entrada ${entryId} elevada a high confidence`, 'g');
  }

  saveKB(kb);
  log(`Uso exitoso: ${entryId} (successUses: ${entry.meta.successUses})`, 'g');
  return true;
}

// Registrar uso fallido
function registerFailed(entryId) {
  const kb = loadKB();
  const entry = kb.find(e => e.id === entryId);

  if (!entry) {
    log(`Entrada ${entryId} no encontrada`, 'r');
    return false;
  }

  entry.meta = entry.meta || {};
  entry.meta.failedUses = (entry.meta.failedUses || 0) + 1;

  // Auto-downgrade si tiene muchos fallos
  if (entry.meta.failedUses > 3 && entry.meta.failedUses > (entry.meta.successUses || 0)) {
    entry.meta.confidence = 'low';
    entry.meta.weight = Math.max(0.1, (entry.meta.weight || 0.5) - 0.2);
    log(`Entrada ${entryId} reducida a low confidence`, 'y');
  }

  saveKB(kb);
  log(`Uso fallido: ${entryId} (failedUses: ${entry.meta.failedUses})`, 'y');
  return true;
}

// Buscar
function search(kb, query, options = {}) {
  const top = options.top || 10;

  const results = kb
    .map(entry => ({
      entry,
      score: finalScore(entry, query),
      relevance: relevanceScore(entry, query),
      boost: usageBoost(entry)
    }))
    .filter(r => r.score > 0 || r.relevance > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  return results;
}

// Mostrar entrada
function print(entry, stats = null) {
  const typeColor = { pattern: 'b', bug: 'r', decision: 'y', integration: 'g', concept: 'm', gotcha: 'c' };
  const tc = typeColor[entry.type] || 'w';

  log(`${c.bold}┌─ ${entry.id}${stats ? ` (score: ${stats.score.toFixed(1)}, boost: ${stats.boost.toFixed(2)})` : ''}${c.z}`, tc);

  if (entry.title) log(`│ Title: ${entry.title}`);
  if (entry.summary) log(`│ Summary: ${entry.summary}`);
  log(`│ Type: ${entry.type}`, tc);

  if (entry.tags && entry.tags.length) log(`│ Tags: [${entry.tags.join(', ')}]`);
  if (entry.keywords && entry.keywords.length) log(`│ Keywords: [${entry.keywords.join(', ')}]`);
  if (entry.related && entry.related.length) log(`│ Related: [${entry.related.join(', ')}]`);

  if (entry.context && entry.context.files) log(`│ Files: ${entry.context.files.join(', ')}`);

  if (entry.meta) {
    const { confidence, weight, hits, successUses, failedUses, lastUsed, created, source } = entry.meta;
    log(`│ Meta: conf=${confidence || 'unset'}, weight=${weight || 0.5}, hits=${hits || 0}, success=${successUses || 0}, failed=${failedUses || 0}`);
    if (lastUsed) log(`│ LastUsed: ${lastUsed}`);
    if (created) log(`│ Created: ${created} | Source: ${source}`);
  }

  log('└─────────────────────────────────────────────────────────\n');
}

// Help
function help() {
  log(`
${c.bold}AORA Knowledge Search${c.z}

Uso: node search.js [opciones]

Busqueda:
  --keyword <texto>  Buscar por keyword (con ranking)
  --top <n>           Maximo resultados (default: 10)
  --type <tipo>       Filtrar por tipo
  --tag <tag>         Filtrar por tag
  --concept <c>       Filtrar por concepto

Registro de uso:
  --hit <id>          Registrar consulta de entrada
  --success <id>      Registrar uso exitoso
  --failed <id>       Registrar uso fallido

Utilidades:
  --all               Mostrar todas las entradas
  --stats             Mostrar estadisticas de KB
  --help              Mostrar esta ayuda

Ejemplos:
  node search.js --keyword "jwt"
  node search.js --keyword "auth" --top 5
  node search.js --hit "D-001"
  node search.js --success "D-001"
  node search.js --failed "D-001"
`);
}

// Main
function main() {
  const args = {};
  process.argv.slice(2).forEach((v, i, a) => {
    if (v.startsWith('--')) args[v.replace('--', '')] = a[i + 1] || true;
  });

  if (args.help) { help(); process.exit(0); }

  log(`\n╔═══════════════════════════════════╗
║   AORA Knowledge Search           ║
╚═══════════════════════════════════╝\n`, 'c');

  // Registro de hits
  if (args.hit) {
    registerHit(args.hit);
    process.exit(0);
  }

  if (args.success) {
    registerSuccess(args.success);
    process.exit(0);
  }

  if (args.failed) {
    registerFailed(args.failed);
    process.exit(0);
  }

  const kb = loadKB();

  // Stats
  if (args.stats) {
    const total = kb.length;
    const totalHits = kb.reduce((sum, e) => sum + (e.meta?.hits || 0), 0);
    const totalSuccess = kb.reduce((sum, e) => sum + (e.meta?.successUses || 0), 0);
    const totalFailed = kb.reduce((sum, e) => sum + (e.meta?.failedUses || 0), 0);

    log(`\n${c.bold}KB Statistics:${c.z}`);
    log(`Total entries: ${total}`);
    log(`Total hits: ${totalHits}`);
    log(`Total successes: ${totalSuccess}`);
    log(`Total failures: ${totalFailed}`);

    const highConf = kb.filter(e => e.meta?.confidence === 'high').length;
    const lowConf = kb.filter(e => e.meta?.confidence === 'low').length;
    log(`High confidence: ${highConf}`);
    log(`Low confidence: ${lowConf}`);
    log('');
    process.exit(0);
  }

  // Mostrar todas
  if (args.all) {
    log(`\n${c.bold}📚 ${kb.length} entradas:${c.z}\n`, 'c');
    kb.forEach(e => print(e));
    process.exit(0);
  }

  // Buscar por keyword
  if (args.keyword) {
    const results = search(kb, args.keyword, { top: parseInt(args.top) || 10 });

    if (results.length === 0) {
      log(`\nSin resultados para "${args.keyword}"\n`, 'y');
      process.exit(0);
    }

    log(`\n${c.bold}🔍 ${results.length} resultados para "${args.keyword}":${c.z}\n`, 'c');
    results.forEach(r => print(r.entry, { score: r.score, boost: r.boost }));
    process.exit(0);
  }

  // Filtrar por tipo
  if (args.type) {
    const filtered = kb.filter(e => e.type && e.type.toLowerCase() === args.type.toLowerCase());
    log(`\n${c.bold}📚 ${filtered.length} entradas de tipo "${args.type}":${c.z}\n`, 'c');
    filtered.forEach(e => print(e));
    process.exit(0);
  }

  // Filtrar por tag
  if (args.tag) {
    const filtered = kb.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes(args.tag.toLowerCase())));
    log(`\n${c.bold}📚 ${filtered.length} entradas con tag "${args.tag}":${c.z}\n`, 'c');
    filtered.forEach(e => print(e));
    process.exit(0);
  }

  // Filtrar por concepto
  if (args.concept) {
    const filtered = kb.filter(e => e.concepts && e.concepts.some(c => c.toLowerCase().includes(args.concept.toLowerCase())));
    log(`\n${c.bold}📚 ${filtered.length} entradas con concepto "${args.concept}":${c.z}\n`, 'c');
    filtered.forEach(e => print(e));
    process.exit(0);
  }

  // Filtrar por ID
  if (args.id) {
    const entry = kb.find(e => e.id === args.id);
    if (entry) {
      log(`\n${c.bold}📄 Entrada ${args.id}:${c.z}\n`, 'c');
      print(entry);
    } else {
      log(`\nEntrada ${args.id} no encontrada\n`, 'y');
    }
    process.exit(0);
  }

  // Sin argumentos
  help();
}

main();