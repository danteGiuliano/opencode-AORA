#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const REPO = 'danteGiuliano/opencode-AORA';
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/main`;

const c = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', c: '\x1b[36m', z: '\x1b[0m', bold: '\x1b[1m' };

function log(m, color = 'z') { console.log(`${c[color]}${m}${c.z}`); }

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchFile(filePath) {
  const url = `${BASE_URL}/${filePath}`;
  log(`  Descargando ${filePath}...`, 'y');
  return download(url);
}

async function updateAgents(force) {
  const agentFiles = [
    'ultraworker.md', 'planner.md', 'builder.md', 'reviewer.md',
    'debug.md', 'docs.md', 'decider.md', 'queue.md', 'launcher.md',
    'calibrator.md', 'init-cruise.md', 'config-aora.md'
  ];

  log(`\n${c.bold}📦 Actualizando agentes...${c.z}`, 'c');
  const agentsDir = path.join(__dirname, '..', 'agents');
  
  for (const file of agentFiles) {
    try {
      const content = await fetchFile(`.opencode/agents/${file}`);
      const localPath = path.join(agentsDir, file);
      
      if (fs.existsSync(localPath) && !force) {
        log(`  ⚠️  ${file} existe, usa --force para sobrescribir`, 'y');
      } else {
        fs.writeFileSync(localPath, content);
        log(`  ✅ ${file}`, 'g');
      }
    } catch (err) {
      log(`  ❌ Error descargando ${file}: ${err.message}`, 'r');
    }
  }
}

async function updateDocs(force) {
  const docFiles = ['docs/WORKFLOW_ES.md', 'docs/CAVEMAN_CONFIG.md'];

  log(`\n${c.bold}📄 Actualizando documentación...${c.z}`, 'c');
  
  for (const file of docFiles) {
    try {
      const content = await fetchFile(file);
      const localPath = path.join(__dirname, '..', '..', file);
      
      if (fs.existsSync(localPath) && !force) {
        log(`  ⚠️  ${file} existe, usa --force para sobrescribir`, 'y');
      } else {
        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(localPath, content);
        log(`  ✅ ${file}`, 'g');
      }
    } catch (err) {
      log(`  ❌ Error descargando ${file}: ${err.message}`, 'r');
    }
  }
}

async function updateStructure(force) {
  const files = ['AORA.json', 'README.md', 'install.sh'];

  log(`\n${c.bold}🏗️  Actualizando estructura...${c.z}`, 'c');
  
  for (const file of files) {
    try {
      const content = await fetchFile(file);
      const localPath = path.join(__dirname, '..', '..', file);
      
      if (fs.existsSync(localPath) && !force) {
        log(`  ⚠️  ${file} existe, usa --force para sobrescribir`, 'y');
      } else {
        fs.writeFileSync(localPath, content);
        log(`  ✅ ${file}`, 'g');
      }
    } catch (err) {
      log(`  ❌ Error descargando ${file}: ${err.message}`, 'r');
    }
  }
}

async function checkUpdates() {
  log(`\n${c.bold}🔍 Verificando actualizaciones...${c.z}\n`, 'c');
  
  const localFiles = {
    agents: ['ultraworker.md', 'planner.md', 'builder.md', 'reviewer.md', 'debug.md', 'docs.md', 'decider.md', 'queue.md', 'launcher.md', 'calibrator.md', 'init-cruise.md', 'config-aora.md'],
    docs: ['docs/WORKFLOW_ES.md', 'docs/CAVEMAN_CONFIG.md'],
    structure: ['AORA.json', 'README.md', 'install.sh']
  };

  const baseDir = path.join(__dirname, '..', '..');

  for (const [cat, files] of Object.entries(localFiles)) {
    log(`${c.bold}${cat.toUpperCase()}:${c.z}`, 'c');
    for (const file of files) {
      const localPath = path.join(baseDir, file);
      if (fs.existsSync(localPath)) {
        log(`  ✅ ${file} existe`, 'g');
      } else {
        log(`  ❌ ${file} no existe`, 'r');
      }
    }
  }

  log(`\n${c.bold}⚠️  No se toca:${c.z}`, 'y');
  log(`  - .opencode/knowledge/KB.json`);
  log(`  - .opencode/KNOWLEDGE.md`);
  log(`  - .opencode/DECISIONS.md`);
}

function help() {
  log(`
${c.bold}AORA Update Tool${c.z}

${c.bold}Uso:${c.z} node update.js [opciones]

${c.bold}Opciones:${c.z}
  --agents    Solo agentes
  --docs      Solo documentación
  --structure Estructura (AORA.json, README, install.sh)
  --all       Todo
  --check     Verificar estado
  --force     Sobrescribir existentes

${c.bold}Ejemplos:${c.z}
  node update.js --check
  node update.js --agents
  node update.js --all --force
`);
}

async function main() {
  const args = {};
  // Parse args: handle values that start with --
  for (let i = 0; i < process.argv.length; i++) {
    const v = process.argv[i];
    if (v.startsWith('--')) {
      const key = v.replace('--', '');
      const nextArg = process.argv[i + 1];
      if (nextArg === undefined || nextArg === null || nextArg.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = nextArg;
        i++;
      }
    }
  }

  if (args.help) { help(); process.exit(0); }

  log(`\n╔═══════════════════════════════╗
║   AORA Update Tool              ║
╚═══════════════════════════════╝\n`, 'c');

  if (args.check) { await checkUpdates(); return; }

  const force = args.force === true;

  if (args.agents || args.all) await updateAgents(force);
  if (args.docs || args.all) await updateDocs(force);
  if (args.structure || args.all) await updateStructure(force);

  if (!args.agents && !args.docs && !args.structure && !args.all && !args.check) help();

  log(`\n${c.g}✅ Actualización completada${c.z}\n`, 'g');
}

main().catch(err => { log(`\n❌ Error: ${err.message}\n`, 'r'); process.exit(1); });
