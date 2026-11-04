import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { validateContact, submissionState, providerFieldErrors } from '../src/client/form-rules.js';

const valid = { name: 'Sergio Hernández', email: 'person@example.com', topic: 'Project', message: 'A real message with enough detail.', consent: 'on' };
assert.deepEqual(validateContact(valid, ['Project']), []);
assert.deepEqual(validateContact({ name: ' ', email: 'a@@b.com', topic: 'forged', message: ' ', consent: '' }, ['Project']), ['name','email','topic','message','consent']);
assert.ok(validateContact({ ...valid, name: 'x'.repeat(81) }, ['Project']).includes('name'));
assert.ok(validateContact({ ...valid, message: 'x'.repeat(4001) }, ['Project']).includes('message'));
assert.ok(validateContact({ ...valid, consent: 'false' }, ['Project']).includes('consent'));
assert.equal(submissionState(false, { ok: true }), 'failed');
assert.equal(submissionState(true, { ok: false }), 'failed');
assert.equal(submissionState(true, { ok: true }), 'received');
assert.equal(submissionState(true, { ok: true, errors: [{ code: 'TYPE_EMAIL' }] }), 'failed');
assert.equal(submissionState(true, null), 'failed');
assert.equal(submissionState(true, {}), 'failed');
assert.equal(submissionState(false, { errors: [{ code: 'INACTIVE' }] }), 'activation');
assert.deepEqual(providerFieldErrors({ errors: [{ field: 'email' }, { field: 'email' }, { field: '__proto__' }] }), ['email']);

const init = await readFile(new URL('../src/client/theme-init.js', import.meta.url), 'utf8');
function boot({ consent = '', stored = null, blocked = false, reduced = false, readyState = 'loading', pathname = '/', hash = '' } = {}) {
  const root = { dataset: {}, style: { setProperty() {} } }, timers = new Map(), reads = [], removals = [];
  const listeners = { document: new Map(), window: new Map() };
  let now = Date.now(), nextTimer = 0;
  const eventTarget = name => ({
    addEventListener(type, fn, options = {}) {
      const list = listeners[name].get(type) ?? [];
      list.push({ fn, once: options.once === true }); listeners[name].set(type, list);
    },
    removeEventListener(type, fn) {
      listeners[name].set(type, (listeners[name].get(type) ?? []).filter(listener => listener.fn !== fn));
    }
  });
  const document = { ...eventTarget('document'), documentElement: root, cookie: consent ? `at_consent=${consent}` : '', readyState };
  const window = { ...eventTarget('window'), scrollTo() { throw new Error('The intro must not change the scroll destination'); } };
  const location = { pathname, hash };
  vm.runInNewContext(init, { document, window, location, Date: class extends Date { static now() { return now; } }, Number,
    setTimeout(fn, delay) { const id = ++nextTimer; timers.set(id, { fn, due: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    localStorage: {
      getItem(key) { reads.push(key); if (blocked) throw new Error('Blocked'); return stored; },
      removeItem(key) { if (blocked) throw new Error('Blocked'); removals.push(key); }
    },
    sessionStorage: { getItem() { throw new Error('Intro visibility must not depend on a previous visit'); }, setItem() { throw new Error('Intro visibility must not persist across reloads'); } },
    matchMedia: q => ({ matches: q.includes('reduced') ? reduced : false, addEventListener() {} })
  });
  const fire = (name, type, event = {}) => {
    const target = name === 'document' ? document : window;
    for (const listener of [...listeners[name].get(type) ?? []]) {
      if (listener.once) target.removeEventListener(type, listener.fn);
      listener.fn(event);
    }
  };
  const advance = ms => {
    const end = now + ms; let callbacks = 0;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.due <= end).sort((a, b) => a[1].due - b[1].due || a[0] - b[0])[0];
      if (!next) break;
      assert.ok(++callbacks < 100, 'Intro timers cannot create an unbounded callback loop');
      const [id, timer] = next; timers.delete(id); now = timer.due; timer.fn();
    }
    now = end;
  };
  return {
    root, document, window, location, timers, reads, removals, listeners, fire, advance, state: window.AlejandroPreferences,
    ready() { document.readyState = 'interactive'; fire('document', 'DOMContentLoaded'); }
  };
}
const stored = JSON.stringify({ expires: Date.now() + 100000, values: { theme: 'dark', tone: 'violet', text: 125, motion: true } });
for (const consent of ['', 'essential', 'unknown']) {
  const session = boot({ consent, stored });
  assert.equal(session.reads.length, 0, 'Optional stored preferences are not read before consent');
  assert.equal(session.root.dataset.theme, 'dark');
}
const accepted = boot({ consent: 'preferences', stored });
assert.equal(accepted.root.dataset.theme, 'dark');
assert.equal(accepted.root.dataset.tone, 'violet');
assert.equal(accepted.root.dataset.motion, 'true');
assert.equal(accepted.timers.size, 0, 'Reduced motion skips the intro entirely');
assert.equal(boot({ consent: 'preferences', stored: '{broken' }).root.dataset.theme, 'dark');
assert.equal(boot({ consent: 'preferences', blocked: true }).root.dataset.theme, 'dark');
const expired = boot({ consent: 'preferences', stored: JSON.stringify({ expires: 1, values: { theme: 'dark' } }) });
assert.equal(expired.root.dataset.theme, 'dark');
const unsafe = accepted.state.sanitize({ text: 999, radius: -4, tone: 'url(evil)', theme: 'unexpected', motion: 'true' });
assert.equal(unsafe.text, 125); assert.equal(unsafe.radius, 0); assert.equal(unsafe.tone, 'coral'); assert.equal(unsafe.theme, 'dark'); assert.equal(unsafe.motion, false);
assert.equal(accepted.state.sanitize({ cursor: 'true', guideHidden: 'true' }).cursor, false);
assert.equal(accepted.state.sanitize({ cursor: true, guideHidden: true }).guideHidden, true);
const loading = boot();
assert.equal(loading.root.dataset.loading, 'true');
loading.advance(30); loading.ready(); loading.advance(1169);
assert.equal(loading.root.dataset.loading, 'true', 'A fast document does not dismiss the intro before its perceptible minimum');
loading.advance(1);
assert.equal(loading.root.dataset.loading, undefined, 'A ready document exits at the 1200ms minimum');
assert.equal(loading.timers.size, 0, 'Completing the intro clears its independent deadline');
for (const type of ['DOMContentLoaded', 'keydown', 'click']) assert.equal(loading.listeners.document.get(type)?.length ?? 0, 0, `Finishing removes the ${type} listener`);
assert.equal(loading.listeners.window.get('pageshow')?.length, 0);
loading.advance(5000); loading.ready();
assert.equal(loading.root.dataset.loading, undefined, 'Later events and old deadlines cannot reopen the intro');

const slow = boot(); slow.advance(1600);
assert.equal(slow.root.dataset.loading, 'true', 'The minimum alone does not hide an unfinished document');
slow.ready(); assert.equal(slow.root.dataset.loading, undefined, 'A slower document exits immediately once ready after the minimum');
const stalled = boot(); stalled.advance(2399);
assert.equal(stalled.root.dataset.loading, 'true');
stalled.advance(1); assert.equal(stalled.root.dataset.loading, undefined, 'The 2400ms hard limit fails open even without DOMContentLoaded or later scripts');
assert.equal(stalled.timers.size, 0);
stalled.ready(); assert.equal(stalled.root.dataset.loading, undefined);
const alreadyReady = boot({ readyState: 'complete' }); alreadyReady.advance(1200);
assert.equal(alreadyReady.root.dataset.loading, undefined, 'An already parsed document does not need another readiness event');

for (const key of ['Escape', 'Enter', 'Tab']) {
  const keyboard = boot(); let prevented = false;
  keyboard.fire('document', 'keydown', { key, preventDefault() { prevented = true; } });
  assert.equal(keyboard.root.dataset.loading, undefined, `${key} immediately enters the document`);
  assert.equal(prevented, false, 'Native keyboard navigation remains available');
  assert.equal(keyboard.timers.size, 0);
}
const enter = boot();
enter.fire('document', 'click', { target: { closest: () => null } });
assert.equal(enter.root.dataset.loading, 'true', 'An unrelated click does not discard the intro');
enter.fire('document', 'click', { target: { closest: selector => selector === '[data-enter-site]' } });
assert.equal(enter.root.dataset.loading, undefined, 'The explicit Enter button skips the delay');
assert.equal(enter.timers.size, 0);
const restored = boot(); restored.fire('window', 'pageshow', { persisted: false });
assert.equal(restored.root.dataset.loading, 'true', 'The initial pageshow event does not skip the intro');
restored.fire('window', 'pageshow', { persisted: true });
assert.equal(restored.root.dataset.loading, undefined, 'A restored BFCache document never reopens or retains the overlay');
assert.equal(restored.timers.size, 0);

for (const pathname of ['/', '/en/', '/proyectos/cv-web/', '/en/notes/automation/']) {
  for (let reload = 0; reload < 2; reload++) {
    const fresh = boot({ pathname, hash: '#main' });
    assert.equal(fresh.root.dataset.loading, 'true', 'Each document and reload starts its own intro, including detail routes and deep links');
    fresh.ready(); fresh.advance(1200);
    assert.equal(fresh.root.dataset.loading, undefined);
    assert.equal(fresh.location.hash, '#main', 'The intro preserves the native deep-link destination');
  }
}
const quiet = boot({ reduced: true });
assert.equal(quiet.root.dataset.loading, undefined); assert.equal(quiet.timers.size, 0, 'System reduced motion never delays navigation');
assert.equal(accepted.root.dataset.loading, undefined, 'The stored visitor motion preference never delays navigation');
console.log(JSON.stringify({ visitorChecks: ['contact limits and consent', 'provider errors never reported as success', 'storage requires consent', 'expired/blocked/corrupt storage', 'per-document intro minimum and hard limit', 'keyboard/button exit and cleanup', 'deep links/reload/BFCache', 'reduced motion'] }));
