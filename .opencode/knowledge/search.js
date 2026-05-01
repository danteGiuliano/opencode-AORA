#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(__dirname, 'KB.json');
const c = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m', m: '\x1b[35m', c: '\x1b[36m', w: '\x1b[37m', z: '\x1b[0m', bold: '\x1b[1m' };

function log(m, color = 'z') { console.log(`${c[color]}${m}${c.z}`); }

function loadKB() {
  try {
    return JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
  } catch {
    log(`Error: No se encontró KB.json en ${KB_PATH}`, 'r');
    process.exit(1);
  }
}

function score(entry, q) {
  let s = 0;
  const l = q.toLowerCase();
  if (entry.id === l) return 100;
  if (entry.title.toLowerCase().includes(l)) s += 30;
  if (entry.summary.toLowerCase().includes(l)) s += 20;
  (entry.keywords || []).forEach(k => { if (k.toLowerCase().includes(l)) s += 25; });
  (entry.tags || []).forEach(t => { if (t.toLowerCase().includes(l)) s += 20; });
  (entry.concepts || []).forEach(c => { if (c.toLowerCase().includes(l)) s += 15; });
  if (entry.content && entry.content.toLowerCase().includes(l)) s += 10;
  if (entry.type && entry.type.toLowerCase() === l) s += 15;
  return s;
}

const typeColor = { pattern: 'b', bug: 'r', decision: 'y', integration: 'g', concept: 'm', gotcha: 'c' };

function print(entry, sc = null) {
  const tc = typeColor[entry.type] || 'w';
  log(`${c.bold}┌─ ${entry.id}${sc ? ` (score: ${sc})` : ''}${c.z}`, tc);
  if (entry.title) log(`│ Title: ${entry.title}`);
  if (entry.summary) log(`│ Summary: ${entry.summary}`);
  log(`│ Type: ${entry.type}`, tc);
  if (entry.tags && entry.tags.length) log(`│ Tags: [${entry.tags.join(', ')}]`);
  if (entry.keywords && entry.keywords.length) log(`│ Keywords: [${entry.keywords.join(', ')}]`);
  if (entry.related && entry.related.length) log(`│ Related: [${entry.related.join(', ')}]`);
  if (entry.context && entry.context.files) log(`│ Files: ${entry.context.files.join(', ')}`);
  if (entry.meta) log(`│ Created: ${entry.meta.created} | Source: ${entry.meta.source}`);
  log('└─────────────────────────────────────────────────────────\n');
}

function search(kb, args) {
  let r = [...kb];
  if (args.id) return kb.filter(e => e.id === args.id);
  if (args.type) r = r.filter(e => e.type && e.type.toLowerCase() === args.type.toLowerCase());
  if (args.tag) r = r.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes(args.tag.toLowerCase())));
  if (args.concept) r = r.filter(e => e.concepts && e.concepts.some(c => c.toLowerCase().includes(args.concept.toLowerCase())));
  if (args.keyword) {
    const sc = r.map(e => ({ e, s: score(e, args.keyword) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
    if (sc.length) { log(`\n${c.bold}🔍 Resultados para "${args.keyword}":${c.z}\n`, 'c'); sc.forEach(x => print(x.e, x.s)); return; }
    log(`\nSin resultados para "${args.keyword}"\n`, 'y'); return;
  }
  if (r.length) { log(`\n${c.bold}📚 ${r.length} entradas${c.z}\n`, 'c'); r.forEach(e => print(e)); }
  else log('\nSin resultados\n', 'y');
}

function help() {
  log(`\n${c.bold}Knowledge Base Search${c.z}\nUso: node search.js [opciones]\nOpciones:\n  --keyword <texto>  Buscar por keyword\n  --type <tipo>      pattern|bug|decision|integration|concept|gotcha\n  --tag <tag>         Filtrar por tag\n  --concept <c>       Filtrar por concepto\n  --id <id>           Entrada por ID\n  --all              Mostrar todo\n`);
}

const args = {};
process.argv.slice(2).forEach((v, i, a) => { if (v.startsWith('--')) args[v.replace('--', '')] = a[i + 1] || true; });

if (!Object.keys(args).length || args.help) { help(); process.exit(0); }

log(`\n╔═══════════════════════════════════╗\n║   Knowledge Base Search             ║\n╚═══════════════════════════════════╝\n`, 'c');
search(loadKB(), args);
