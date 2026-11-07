import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createWorkflow } from '../src/client/workflow-core.js';
import { workflowCopy } from '../src/content/workflow.mjs';

const fixtures = JSON.parse(await readFile(new URL('../examples/workflow-api/fixtures.json', import.meta.url), 'utf8'));
const contract = JSON.parse(await readFile(new URL('../examples/workflow-api/openapi.json', import.meta.url), 'utf8'));
assert.equal(contract.openapi, '3.1.0');
for (const route of ['/health', '/requests', '/requests/{requestId}', '/requests/{requestId}/transitions']) assert.ok(contract.paths[route]);
function checkReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) assert.ok(value.$ref.startsWith('#/') && value.$ref.slice(2).split('/').reduce((node, field) => node?.[field], contract), `Contract reference: ${value.$ref}`);
  for (const entry of Object.values(value)) checkReferences(entry);
}
checkReferences(contract);
let checks = 0;
for (const scenario of fixtures.scenarios) {
  const store = createWorkflow({ now: () => '2026-11-07T00:00:00.000Z' });
  for (const step of scenario.steps) {
    const result = step.operation === 'create' ? store.create(step.payload, step.key) : step.operation === 'get' ? store.get(step.requestId) : store.transition(step.requestId, step.action, step.expectedVersion);
    assert.equal(result.status, step.expected.status, scenario.name); assert.equal(result.code, step.expected.code); assert.equal(store.count, step.expected.count); checks += 3;
    if (step.expected.state) { assert.equal(result.body.request.status, step.expected.state); assert.equal(result.body.request.version, step.expected.version); checks += 2; }
    if (result.status >= 400) { assert.equal(result.body.status, result.status); assert.equal(result.body.code, result.code); checks += 2; }
  }
}
const payload = { requestId: 'REQ-TEST', title: 'A valid fictional request', category: 'integration', priority: 'normal' };
const store = createWorkflow({ capacity: 1 });
const created = store.create(payload, 'test-key-001'); created.body.request.events.length = 0;
assert.equal(store.get('REQ-TEST').body.request.events.length, 1, 'Snapshots cannot mutate stored events');
assert.equal(store.create({ ...payload, requestId: 'REQ-OTHER' }, 'test-key-002').status, 503);
assert.equal(store.create(payload, 'test-key-001').code, 'replayed', 'Replay works at capacity');
assert.equal(store.create({ ...payload, extra: true }, 'test-key-003').status, 400);
assert.equal(store.create({ ...payload, title: 'A title with\u0000a control' }, 'test-key-003').status, 400);
assert.equal(store.transition('REQ-TEST', 'review', 1).status, 200);
assert.equal(store.transition('REQ-TEST', 'approve', 1).code, 'version_conflict');
assert.equal(store.get('REQ-TEST').body.request.events.length, 2);
for (const lang of ['es', 'en']) for (const code of ['created', 'replayed', 'updated', 'invalid_payload', 'idempotency_conflict', 'duplicate_request', 'capacity_reached', 'invalid_transition_payload', 'version_conflict', 'invalid_transition', 'not_found']) assert.ok(workflowCopy[lang].messages[code], `Localized status ${lang}:${code}`);
console.log(JSON.stringify({ workflow: true, scenarios: fixtures.scenarios.length, sharedSteps: fixtures.scenarios.reduce((n, item) => n + item.steps.length, 0), checks: checks + 8 }));
