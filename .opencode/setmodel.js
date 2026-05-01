#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const c = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', c: '\x1b[36m', z: '\x1b[0m', bold: '\x1b[1m' };

function log(m, color = 'z') { console.log(`${c[color]}${m}${c.z}`); }

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}

async function getCurrentOpenCodeConfig() {
  const home = process.env.HOME || process.env.USERPROFILE;
  const configPath = path.join(home, '.config', 'opencode', 'opencode.json');
  
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config;
    } catch { return null; }
  }
  return null;
}

const PROVIDERS = {
  'minimax': {
    name: 'MiniMax',
    models: ['MiniMax-M2.7', 'MiniMax-M2.7-highspeed']
  },
  'anthropic': {
    name: 'Anthropic (Claude)',
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus']
  },
  'openai': {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo']
  },
  'gemini': {
    name: 'Google Gemini',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash']
  },
  'ollama': {
    name: 'Ollama (local)',
    models: ['llama3', 'codellama', 'mistral']
  }
};

async function setModel() {
  log(`\n╔═══════════════════════════════╗
║   AORA Model Configuration       ║
╚═══════════════════════════════╝\n`, 'c');

  log('Detectando configuración actual de OpenCode...\n', 'y');
  
  const opencodeConfig = await getCurrentOpenCodeConfig();
  if (opencodeConfig && opencodeConfig.provider) {
    const providers = Object.keys(opencodeConfig.provider);
    log(`Proveedores detectados: ${providers.join(', ')}\n`, 'g');
  }

  log('Proveedores disponibles:\n');
  Object.entries(PROVIDERS).forEach(([key, p]) => {
    log(`  ${key.padEnd(12)} - ${p.name}`, 'c');
  });

  log('\nIngresa el provider (ej: minimax, anthropic, openai): ', 'z');
  const provider = await ask('');

  if (!PROVIDERS[provider]) {
    log(`\n❌ Provider "${provider}" no reconocido\n`, 'r');
    return;
  }

  log(`\nModelos para ${PROVIDERS[provider].name}:\n`);
  PROVIDERS[provider].models.forEach(m => log(`  - ${m}`, 'c'));

  log('\nIngresa el modelo: ', 'z');
  const model = await ask('');

  const modelId = `${provider}/${model}`;

  log(`\n✅ Modelo seleccionado: ${modelId}\n`, 'g');

  const aoraPath = path.join(__dirname, '..', '..', 'AORA.json');
  
  if (!fs.existsSync(aoraPath)) {
    log('❌ AORA.json no encontrado\n', 'r');
    return;
  }

  try {
    const aora = JSON.parse(fs.readFileSync(aoraPath, 'utf8'));
    
    if (!aora.models) aora.models = {};
    if (!aora.models.base) aora.models.base = {};
    
    aora.global.baseModel = modelId;
    aora.models.base.id = modelId;
    aora.models.base.name = model;
    aora.models.base.description = `${PROVIDERS[provider].name} ${model}`;

    fs.writeFileSync(aoraPath, JSON.stringify(aora, null, 2));
    log('✅ AORA.json actualizado correctamente\n', 'g');
    log(`   global.baseModel: ${aora.global.baseModel}\n`, 'c');
  } catch (err) {
    log(`❌ Error actualizando AORA.json: ${err.message}\n`, 'r');
  }

  log('Para aplicar en OpenCode, agrega a tu ~/.config/opencode/opencode.json:\n', 'y');
  log(`"model": "${modelId}"\n`, 'c');
}

async function main() {
  const args = {};
  process.argv.slice(2).forEach((v, i, a) => {
    if (v.startsWith('--')) args[v.replace('--', '')] = a[i + 1] || true;
  });

  if (args.help) {
    log(`
${c.bold}AORA Model Configuration${c.z}

${c.bold}Uso:${c.z} node setmodel.js

Actualiza AORA.json con el provider y modelo elegido.

${c.bold}Flujo:${c.z}
  1. Muestra providers disponibles
  2. Pide provider (minimax, anthropic, openai, etc)
  3. Pide modelo específico
  4. Actualiza AORA.json global.baseModel

No modifica opencode.json del sistema.
`);
    return;
  }

  await setModel();
}

main().catch(err => { log(`\n❌ Error: ${err.message}\n`, 'r'); process.exit(1); });
