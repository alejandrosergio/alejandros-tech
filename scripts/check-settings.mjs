import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/client/preferences.js', import.meta.url), 'utf8');

// The root carries the selected data-tone too. Native click bubbling must not
// turn that state holder into another palette button or a page-wide listener.
const emitted = [], handlers = new Map(), writes = [], stats = { applies: 0 };
function element(name, dataset = {}) {
  const attrs = new Map();
  return {
    name, dataset, hidden: false, parentElement: null,
    addEventListener(type, fn) { const key = `${name}:${type}`, list = handlers.get(key) ?? []; list.push(fn); handlers.set(key, list); },
    setAttribute(key, value) { attrs.set(key, value); }, getAttribute: key => attrs.get(key) ?? null,
    focus() { this.focused = true; }
  };
}
const root = element('html', { theme: 'dark', tone: 'coral', motion: 'false' });
const tones = ['blue', 'violet', 'coral', 'ocean', 'mono'].map(tone => Object.assign(element(`tone-${tone}`, { tone }), { parentElement: root }));
const launcher = element('settings-launcher'), reset = element('reset'), banner = element('cookie-banner');
const text = element('text-output'), radius = element('radius-output');
const preferenceStatus = element('preference-status', { resetMessage: 'Defaults restored' });
function dialog(name) {
  const node = element(name), close = element(`${name}-close`);
  return Object.assign(node, { open: false, querySelector: () => close, showModal() { this.open = true; }, close() { this.open = false; } });
}
const settings = dialog('settings'), privacy = dialog('privacy');
const defaults = { theme: 'dark', tone: 'coral', text: 100, radius: 6, motion: false };
let values = { ...defaults };
const state = {
  defaults, consent: '', get values() { return { ...values }; }, set values(next) { values = { ...next }; },
  apply() { stats.applies++; root.dataset.theme = values.theme; root.dataset.tone = values.tone; }
};
const document = {
  documentElement: root,
  querySelector(selector) {
    return {
      '[data-settings]': settings, '[data-privacy]': privacy, '[data-cookie-banner]': banner,
      '[data-output="text"]': text, '[data-output="radius"]': radius,
      '[data-reset-preferences]': reset, '[data-preference-status]': preferenceStatus,
      '[data-open-settings]': launcher
    }[selector] ?? null;
  },
  querySelectorAll(selector) {
    if (selector === '[data-tone]') return [root, ...tones];
    if (selector === 'button[data-tone]') return tones;
    if (selector === '[data-open-settings]') return [launcher];
    return [];
  },
  dispatchEvent(event) { emitted.push(event); }
};
vm.runInNewContext(source, {
  document, window: { AlejandroPreferences: state },
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  localStorage: { removeItem(key) { writes.push({ key, action: 'remove' }); }, setItem(key, value) { writes.push({ key, value, action: 'set' }); } }
});
function click(target) {
  for (let current = target; current; current = current.parentElement) {
    for (const fn of handlers.get(`${current.name}:click`) ?? []) fn({ target, currentTarget: current });
  }
}
assert.equal(root.getAttribute('aria-pressed'), null, 'The document is not exposed as a pressed control');
assert.equal(handlers.get('html:click')?.length ?? 0, 0, 'The selected-tone state holder has no palette click handler');
assert.equal(tones.find(button => button.dataset.tone === 'coral').getAttribute('aria-pressed'), 'true');
assert.equal(tones.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
const ordinary = Object.assign(element('ordinary-link'), { parentElement: root });
const child = Object.assign(element('ordinary-link-icon'), { parentElement: ordinary });
click(child);
assert.equal(stats.applies, 0, 'A normal bubbled page click does not reapply appearance preferences');
assert.equal(emitted.length, 0, 'A normal page click does not send a preferences event');
assert.equal(writes.length, 0, 'A normal page click does not touch preference storage');
click(tones[0]);
assert.equal(state.values.tone, 'blue'); assert.equal(root.dataset.tone, 'blue');
assert.equal(stats.applies, 1, 'An actual palette button applies its tone exactly once');
assert.equal(emitted.filter(event => event.type === 'alejandro:preferences').length, 1);
assert.equal(emitted[0].detail.tone, 'blue');
assert.equal(tones[0].getAttribute('aria-pressed'), 'true');
assert.equal(tones.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
assert.equal(root.getAttribute('aria-pressed'), null);
const eventCount = emitted.length, storageCount = writes.length;
click(child);
assert.equal(emitted.length, eventCount); assert.equal(writes.length, storageCount); assert.equal(stats.applies, 1);
assert.equal(root.dataset.tone, 'blue', 'Unrelated navigation leaves the selected tone intact');
console.log(JSON.stringify({ settingsChecks: ['HTML state is not a palette control', 'ordinary bubbled clicks do not dispatch or persist preferences', 'palette action runs once and updates pressed states'] }));
