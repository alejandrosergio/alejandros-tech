import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { validateContact, submissionState } from '../src/client/form-rules.js';

const valid = { name: 'Sergio Hernández', email: 'person@example.com', topic: 'Project', message: 'A real message with enough detail.', consent: 'on' };
assert.deepEqual(validateContact(valid, ['Project']), []);
assert.deepEqual(validateContact({ name: ' ', email: 'a@@b.com', topic: 'forged', message: ' ', consent: '' }, ['Project']), ['name','email','topic','message','consent']);
assert.ok(validateContact({ ...valid, name: 'x'.repeat(81) }, ['Project']).includes('name'));
assert.ok(validateContact({ ...valid, message: 'x'.repeat(4001) }, ['Project']).includes('message'));
assert.equal(submissionState(false, { success: true }), 'failed');
assert.equal(submissionState(true, { success: 'false' }), 'failed');
assert.equal(submissionState(true, { success: 'true' }), 'received');
assert.equal(submissionState(true, { success: false, message: 'Please activate your form' }), 'activation');

const init = await readFile(new URL('../src/client/theme-init.js', import.meta.url), 'utf8');
function boot({ consent = '', stored = null, blocked = false, reduced = false } = {}) {
  const root = { dataset: {}, style: { setProperty() {} } }, events = {}, timers = [], reads = [];
  const document = { documentElement: root, cookie: consent ? `at_consent=${consent}` : '', addEventListener: (name, fn) => { events[name] = fn; } };
  const window = {};
  vm.runInNewContext(init, { document, window, location: { pathname: '/' }, Date, Number, setTimeout: (fn, delay) => { timers.push({ fn, delay }); },
    localStorage: { getItem: key => { reads.push(key); if (blocked) throw new Error('Blocked'); return stored; } },
    matchMedia: q => ({ matches: q.includes('reduced') ? reduced : false, addEventListener() {} })
  });
  return { root, events, timers, reads, state: window.AlejandroPreferences };
}
const stored = JSON.stringify({ expires: Date.now() + 100000, values: { theme: 'dark', tone: 'violet', text: 125, motion: true } });
for (const consent of ['', 'essential', 'unknown']) {
  const session = boot({ consent, stored });
  assert.equal(session.reads.length, 0, 'Optional stored preferences are not read before consent');
  assert.equal(session.root.dataset.theme, 'light');
}
const accepted = boot({ consent: 'preferences', stored });
assert.equal(accepted.root.dataset.theme, 'dark');
assert.equal(accepted.root.dataset.tone, 'violet');
assert.equal(accepted.root.dataset.motion, 'true');
assert.equal(accepted.timers.length, 0, 'Reduced motion skips the intro entirely');
assert.equal(boot({ consent: 'preferences', stored: '{broken' }).root.dataset.theme, 'light');
assert.equal(boot({ consent: 'preferences', blocked: true }).root.dataset.theme, 'light');
const expired = boot({ consent: 'preferences', stored: JSON.stringify({ expires: 1, values: { theme: 'dark' } }) });
assert.equal(expired.root.dataset.theme, 'light');
const unsafe = accepted.state.sanitize({ text: 999, radius: -4, tone: 'url(evil)', theme: 'unexpected', motion: 'true' });
assert.equal(unsafe.text, 125); assert.equal(unsafe.radius, 0); assert.equal(unsafe.tone, 'blue'); assert.equal(unsafe.theme, 'system'); assert.equal(unsafe.motion, false);
const loading = boot();
assert.equal(loading.root.dataset.loading, 'true');
const deadline = loading.timers.find(t => t.delay === 1400); assert.ok(deadline);
deadline.fn(); assert.equal(loading.root.dataset.loading, undefined, 'Intro fails open if the rest of JavaScript fails');
assert.equal(boot({ reduced: true }).root.dataset.loading, undefined);
console.log(JSON.stringify({ visitorChecks: ['contact limits and consent', 'provider errors never reported as success', 'storage requires consent', 'expired/blocked/corrupt storage', 'bounded intro', 'reduced motion'] }));
