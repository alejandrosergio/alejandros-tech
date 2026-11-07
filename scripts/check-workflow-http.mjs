import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const assembly = path.join(root, 'examples/workflow-api/src/WorkflowApi/bin/Release/net10.0/WorkflowApi.dll');
const fixtures = JSON.parse(await readFile(new URL('../examples/workflow-api/fixtures.json', import.meta.url), 'utf8'));
let checks = 0;

async function withAPI(test) {
  const reservation = createServer(); reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
  const port = reservation.address().port; await new Promise(resolve => reservation.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(process.env.TASK_DOTNET || 'dotnet', [assembly, '--urls', origin], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1', ASPNETCORE_ENVIRONMENT: 'Production' } });
  let output = '', spawnError;
  child.stdout.on('data', data => { output = (output + data).slice(-3000); }); child.stderr.on('data', data => { output = (output + data).slice(-3000); }); child.on('error', error => { spawnError = error; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (spawnError) throw spawnError;
      if (child.exitCode !== null) throw new Error(`Owned API exited: ${output}`);
      try { const response = await fetch(origin + '/health', { signal: AbortSignal.timeout(400) }); const body = await response.json(); if (body.scope === 'process-local-reference') { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, `Owned loopback API must start: ${output}`);
    await test(origin);
  } finally {
    if (child.exitCode === null && child.pid) { const exited = once(child, 'exit'); child.kill(); await exited; }
  }
}

for (const scenario of fixtures.scenarios) await withAPI(async origin => {
  for (const step of scenario.steps) {
    const pathname = step.operation === 'create' ? '/requests' : `/requests/${step.requestId}${step.operation === 'transition' ? '/transitions' : ''}`;
    const response = await fetch(origin + pathname, step.operation === 'get' ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json', ...(step.operation === 'create' ? { 'Idempotency-Key': step.key } : {}) }, body: JSON.stringify(step.operation === 'create' ? step.payload : { action: step.action, expectedVersion: step.expectedVersion }) });
    const body = await response.json();
    assert.equal(response.status, step.expected.status, `${scenario.name}:${step.operation}`); checks++;
    if (response.status >= 400) { assert.equal(body.code, step.expected.code); assert.equal(body.status, response.status); assert.match(response.headers.get('content-type'), /application\/problem\+json/); checks += 3; }
    else {
      assert.equal(body.request.status, step.expected.state); assert.equal(body.request.version, step.expected.version); checks += 2;
      if (step.operation === 'create') { assert.equal(body.replayed, step.expected.code === 'replayed'); checks++; }
      if (response.status === 201) { assert.equal(response.headers.get('location'), `/requests/${body.request.requestId}`); checks++; }
    }
    assert.equal(response.headers.get('cache-control'), 'no-store'); checks++;
  }
});

await withAPI(async origin => {
  const payload = { requestId: 'REQ-CONCURRENT', title: 'A fictional concurrent request', category: 'integration', priority: 'normal' };
  const send = (body, type = 'application/json', key = 'concurrent-key') => fetch(origin + '/requests', { method: 'POST', headers: { 'Content-Type': type, 'Idempotency-Key': key }, body });
  const results = await Promise.all(Array.from({ length: 12 }, () => send(JSON.stringify(payload))));
  assert.equal(results.filter(result => result.status === 201).length, 1); assert.equal(results.filter(result => result.status === 200).length, 11); checks += 2;
  for (const [body, type, key, expected] of [['{', 'application/json', 'valid-key', 400], [JSON.stringify({ ...payload, unknown: true }), 'application/json', 'valid-key', 400], [JSON.stringify({ ...payload, title: 42 }), 'application/json', 'valid-key', 400], [JSON.stringify(payload), 'text/plain', 'valid-key', 415], [JSON.stringify(payload), 'application/json', '', 400], [JSON.stringify({ ...payload, title: 'x'.repeat(9000) }), 'application/json', 'valid-key', 413]]) {
    const response = await send(body, type, key); assert.equal(response.status, expected); assert.match(response.headers.get('content-type'), /application\/problem\+json/); checks += 2;
  }
  const state = await (await fetch(origin + '/requests/REQ-CONCURRENT')).json(); assert.equal(state.request.version, 1); assert.equal(state.request.events.length, 1); checks += 2;
});
console.log(JSON.stringify({ workflowHTTP: true, checks, sharedScenarios: fixtures.scenarios.length, concurrentRequests: 12, malformedInput: true }));
