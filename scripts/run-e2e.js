import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2] === 'open' ? 'open' : 'run';
const children = [];
let stopping = false;

function start(label, args) {
  const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit', env: process.env });
  const entry = { label, child };
  children.push(entry);
  child.on('error', (error) => { entry.error = error; });
  return entry;
}

async function check(url, validate) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    if (!response.ok) return false;
    return await validate(response);
  } catch {
    return false;
  }
}

const apiHealthy = () => check('http://127.0.0.1:3002/api/health', async (response) => {
  const body = await response.json();
  return body.status === 'ok';
});
const frontendHealthy = () => check('http://127.0.0.1:5173/', async (response) => {
  const html = await response.text();
  return html.includes('Northstar') && html.includes('/src/main.jsx');
});

async function waitFor(label, isHealthy, entry, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (stopping) throw new Error('Startup canceled.');
    if (entry?.error) throw new Error(`Could not start ${label}: ${entry.error.message}`);
    if (entry?.child.exitCode !== null && entry?.child.exitCode !== undefined) {
      throw new Error(`${label} exited with code ${entry.child.exitCode}. Its port may already be in use by a different service.`);
    }
    if (await isHealthy()) return;
    await delay(300);
  }
  throw new Error(`Timed out waiting for ${label}. Check whether its port is available and the service started correctly.`);
}

function stopOwnedChildren() {
  stopping = true;
  for (const { child } of [...children].reverse()) {
    if (!child.killed && child.exitCode === null) child.kill('SIGTERM');
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, stopOwnedChildren);

try {
  let apiProcess;
  if (await apiHealthy()) console.log('Reusing existing bank API at http://127.0.0.1:3002');
  else apiProcess = start('bank API', [path.join(root, 'backend', 'server.js')]);

  let frontendProcess;
  if (await frontendHealthy()) console.log('Reusing existing frontend at http://127.0.0.1:5173');
  else frontendProcess = start('Vite', [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), '--host', '127.0.0.1']);

  await Promise.all([
    waitFor('bank API', apiHealthy, apiProcess),
    waitFor('frontend', frontendHealthy, frontendProcess),
  ]);

  console.log('\nFrontend and API are ready. Starting Cypress…\n');
  const cypress = start('Cypress', [path.join(root, 'node_modules', 'cypress', 'bin', 'cypress'), mode]);
  const exitCode = await new Promise((resolve, reject) => {
    cypress.child.on('error', reject);
    cypress.child.on('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
  process.exitCode = exitCode;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  stopOwnedChildren();
}
