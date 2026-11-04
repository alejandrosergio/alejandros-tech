import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { locales } from '../src/content/locales.mjs';

const [siteSource, journeySource] = await Promise.all([
  readFile(new URL('../src/client/site.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/client/journey.js', import.meta.url), 'utf8')
]);

// Run both controllers together so the system-theme regression includes the
// real action-label update, with batched attribute delivery like the browser.
function boot(lang = 'en') {
  const listeners = new Map(), timers = new Map(), frames = new Map(), observers = [];
  let now = 0, nextId = 0, observerCalls = 0;
  const listen = name => ({ addEventListener(type, fn) {
    const key = `${name}:${type}`, values = listeners.get(key) ?? [];
    values.push(fn); listeners.set(key, values);
  } });
  const notify = (target, attributeName) => {
    for (const observer of observers) if (observer.target === target && observer.options.attributeFilter.includes(attributeName)) observer.records.push({ target, attributeName });
  };
  const root = { dataset: { theme: 'dark' }, scrollHeight: 2000 };
  function control(name, label, left = 1120) {
    const attrs = new Map([['aria-label', label], ['aria-describedby', `${name}-help`]]);
    return {
      ...listen(name), dataset: { tooltip: '' }, hidden: false, disabled: false, isConnected: true, focusVisible: false,
      getAttribute: key => attrs.get(key) ?? null,
      setAttribute(key, value) {
        attrs.set(key, value);
        if (key === 'data-tooltip') this.dataset.tooltip = value;
        notify(this, key);
      },
      removeAttribute(key) { attrs.delete(key); if (key === 'data-tooltip') delete this.dataset.tooltip; notify(this, key); },
      closest(selector) { return selector === '[data-tooltip]' ? this : null; },
      matches(selector) { return selector === ':disabled' ? this.disabled : selector === ':focus-visible' ? this.focusVisible : false; },
      contains(target) { return target === this; },
      getBoundingClientRect: () => ({ left, top: 400, width: 44, height: 44, bottom: 444 })
    };
  }
  const theme = control('theme', 'Stale action');
  Object.assign(theme.dataset, { themeLight: locales[lang].themeLight, themeDark: locales[lang].themeDark });
  const music = control('music', 'Play music');
  const tooltip = {
    id: 'interaction-tooltip', hidden: true, textContent: '', style: {},
    getBoundingClientRect() { return { width: Math.min(320, this.textContent.length * 6 + 24), height: this.textContent.length > 44 ? 64 : 32 }; }
  };
  const document = {
    ...listen('document'), documentElement: root, hidden: false, activeElement: null, querySelectorAll: () => [],
    querySelector: selector => selector === '[data-theme-toggle]' ? theme : selector === '[data-interaction-tooltip]' ? tooltip : null
  };
  const window = {
    ...listen('window'), scrollY: 0, MutationObserver: true,
    AlejandroPreferences: { set(patch) { root.dataset.theme = patch.theme; notify(root, 'data-theme'); fire('document', 'alejandro:preferences'); } }
  };
  function fire(target, type, event = {}) { for (const fn of listeners.get(`${target}:${type}`) ?? []) fn(event); }
  function flush() {
    let batches = 0;
    while (observers.some(observer => observer.records.length) || frames.size) {
      assert.ok(++batches < 20, 'Tooltip linkage must not cause an attribute-observer loop');
      for (const observer of observers) if (observer.records.length) {
        const records = observer.records.splice(0); observerCalls++; observer.fn(records, observer);
      }
      const pending = [...frames.values()]; frames.clear(); for (const fn of pending) fn();
    }
  }
  const context = vm.createContext({
    document, window, innerHeight: 900, innerWidth: 1200,
    matchMedia: query => ({ matches: query.includes('hover:'), addEventListener() {} }),
    setTimeout(fn, delay) { const id = ++nextId; timers.set(id, { fn, due: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(fn) { const id = ++nextId; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); },
    MutationObserver: class {
      constructor(fn) { this.fn = fn; this.records = []; observers.push(this); }
      observe(target, options) { this.target = target; this.options = options; }
      disconnect() { this.target = null; this.records.length = 0; }
    }
  });
  vm.runInContext(siteSource, context); vm.runInContext(journeySource, context);
  function advance(ms) {
    const end = now + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break;
      const [id, timer] = next; timers.delete(id); now = timer.due; timer.fn(); flush();
    }
    now = end; flush();
  }
  return {
    root, theme, music, tooltip, timers, fire, flush, advance,
    get observerCalls() { return observerCalls; },
    hover(target) { fire('document', 'pointerover', { pointerType: 'mouse', target, clientX: 1130, clientY: 420 }); flush(); },
    focus(target) { target.focusVisible = true; document.activeElement = target; fire('document', 'focusin', { target }); flush(); },
    systemTheme(value) { root.dataset.theme = value; notify(root, 'data-theme'); flush(); },
    attribute(target, name, value) { target.setAttribute(name, value); flush(); }
  };
}

for (const lang of ['es', 'en']) {
  const page = boot(lang), t = locales[lang];
  page.hover(page.theme); page.advance(399); assert.equal(page.tooltip.hidden, true);
  page.advance(1); assert.equal(page.tooltip.hidden, false); assert.equal(page.tooltip.textContent, t.themeLight);
  const before = page.observerCalls;
  page.systemTheme('light');
  assert.equal(page.theme.getAttribute('aria-label'), t.themeDark);
  assert.equal(page.tooltip.textContent, t.themeDark, 'A visible tooltip updates after the real system-theme label change');
  assert.ok(page.observerCalls - before <= 2, 'Only the theme and source-label observers run');
  assert.equal(page.theme.getAttribute('aria-describedby'), 'theme-help interaction-tooltip', 'Refresh preserves existing descriptions without duplicating tooltip linkage');
}

const playback = boot(); playback.hover(playback.music); playback.advance(400);
assert.equal(playback.tooltip.textContent, 'Play music');
const oldLeft = Number.parseFloat(playback.tooltip.style.left);
playback.attribute(playback.music, 'aria-label', 'Pause the background music while keeping the rest of the page interactive');
assert.equal(playback.tooltip.textContent, 'Pause the background music while keeping the rest of the page interactive');
assert.ok(Number.parseFloat(playback.tooltip.style.left) < oldLeft, 'A larger label is repositioned inside the viewport');
assert.equal(playback.tooltip.style.top, '326px', 'The refreshed tooltip position uses its new height');
playback.attribute(playback.music, 'data-tooltip', 'Pause audio');
assert.equal(playback.tooltip.textContent, 'Pause audio', 'An explicit tooltip label is observed too');
playback.attribute(playback.music, 'aria-label', 'Play music');
assert.equal(playback.tooltip.textContent, 'Pause audio', 'Explicit tooltip copy retains precedence');
playback.attribute(playback.music, 'data-tooltip', '');
assert.equal(playback.tooltip.textContent, 'Play music', 'An empty tooltip inherits the current accessible action');
const beforeDescription = playback.observerCalls;
playback.attribute(playback.music, 'aria-describedby', 'music-help interaction-tooltip extra-help');
assert.equal(playback.observerCalls, beforeDescription, 'aria-describedby is excluded from source-label observation');
for (const label of ['Pause music', 'Play music', 'Pause music']) playback.attribute(playback.music, 'aria-label', label);
assert.equal(playback.music.getAttribute('aria-describedby'), 'music-help interaction-tooltip extra-help');
playback.fire('document', 'pointerdown'); playback.flush();
assert.equal(playback.tooltip.hidden, true);
assert.equal(playback.music.getAttribute('aria-describedby'), 'music-help extra-help', 'Hiding removes only the tooltip description');
const stopped = playback.observerCalls;
playback.attribute(playback.music, 'aria-label', 'Play music');
assert.equal(playback.observerCalls, stopped, 'A hidden control is no longer observed');
assert.equal(playback.tooltip.hidden, true, 'Attribute changes cannot reopen a dismissed tooltip');

const pending = boot(); pending.hover(pending.music); pending.advance(200);
pending.attribute(pending.music, 'aria-label', 'Pause music'); pending.advance(199);
assert.equal(pending.tooltip.hidden, true, 'A label change does not bypass the initial hover delay');
pending.advance(1); assert.equal(pending.tooltip.textContent, 'Pause music');
pending.fire('document', 'pointerout', { relatedTarget: null }); pending.flush(); assert.equal(pending.tooltip.hidden, true);

const keyboard = boot(); keyboard.focus(keyboard.music); keyboard.advance(400);
assert.equal(keyboard.tooltip.hidden, false);
keyboard.attribute(keyboard.music, 'aria-label', 'Pause music');
assert.equal(keyboard.tooltip.textContent, 'Pause music', 'Keyboard tooltips refresh without pointer movement');
keyboard.fire('document', 'keydown', { key: 'Escape' }); keyboard.flush(); assert.equal(keyboard.tooltip.hidden, true);
keyboard.focus(keyboard.music); keyboard.advance(400); keyboard.fire('document', 'focusout'); keyboard.flush(); assert.equal(keyboard.tooltip.hidden, true);
keyboard.hover(keyboard.music); keyboard.advance(400); keyboard.fire('window', 'scroll'); keyboard.flush(); assert.equal(keyboard.tooltip.hidden, true);
keyboard.hover(keyboard.music); keyboard.advance(400); keyboard.music.isConnected = false;
keyboard.attribute(keyboard.music, 'aria-label', 'Play music'); assert.equal(keyboard.tooltip.hidden, true, 'A removed control does not leave an orphan tooltip');
console.log(JSON.stringify({ tooltipChecks: ['real system-theme regression ES/EN', 'dynamic playback actions', 'text and position refresh', 'source-label observer without linkage loops', 'pending hover delay', 'pointer/keyboard dismissal and observer cleanup'] }));
