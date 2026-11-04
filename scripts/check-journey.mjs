import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/client/journey.js', import.meta.url), 'utf8');

// Exercise the actual controller with measurable sections and native event order.
// This fixture deliberately leaves the tooltip enhancement absent: it tests the
// guide, module surfaces and cursor without pretending to perform browser layout.
function boot({ headerPresent = true, height = 900, headerHeight = 89 } = {}) {
  const handlers = new Map(), frames = new Map(), observers = [], media = new Map();
  let frameId = 0, modalOpen = false;
  const listen = name => ({ addEventListener(type, fn) {
    const key = `${name}:${type}`;
    if (!handlers.has(key)) handlers.set(key, []);
    handlers.get(key).push(fn);
  } });
  const element = name => ({
    ...listen(name), hidden: false, dataset: {}, attrs: {},
    style: { setProperty(key, value) { this[key] = value; } },
    classList: { toggle() {} },
    setAttribute(key, value) { this.attrs[key] = value; },
    getAttribute(key) { return this.attrs[key] ?? null; },
    removeAttribute(key) { delete this.attrs[key]; },
    closest() { return null; }, contains() { return false; },
    focus() { this.focused = true; }
  });
  const root = element('root'); root.scrollHeight = 3000;
  const body = element('body'), window = { ...listen('window'), scrollY: 0 };
  const marker = Math.min(height * .35, (headerPresent ? headerHeight : 86) + 24);
  const entries = [
    { id: 'inicio', title: 'Home', text: 'Home content', action: 'About', href: '#about' },
    { id: 'about', title: 'About', text: 'About content', action: 'Contact', href: '#contact' },
    { id: 'contact', title: 'Contact', text: 'Contact content', action: 'Home', href: '#inicio' }
  ];
  const sections = entries.map((entry, i) => {
    const heading = element(`heading${i}`);
    return {
      ...element(`section${i}`), id: entry.id, heading,
      getBoundingClientRect: () => ({ top: i * 900 - window.scrollY, bottom: (i + 1) * 900 - window.scrollY, height: 900 }),
      querySelector: selector => selector === 'h1,h2' ? heading : null,
      scrollIntoView(options) {
        this.lastScroll = options;
        window.scrollY = Math.max(0, Math.min(root.scrollHeight - height, i * 900 - marker));
        fire('window', 'scroll');
      }
    };
  });
  const header = headerPresent ? {
    ...element('header'), getBoundingClientRect: () => ({ top: 0, bottom: headerHeight, height: headerHeight })
  } : null;
  const panel = element('panel'), toggle = element('toggle');
  const action = { ...element('action'), firstChild: { textContent: '' } };
  const fields = Object.fromEntries(['dismiss', 'previous', 'next', 'location', 'description', 'position', 'percent'].map(name => [name, element(name)]));
  const guide = {
    ...element('guide'), dataset: { entries: JSON.stringify(entries) },
    querySelector(selector) {
      if (selector === '[data-guide-panel]') return panel;
      if (selector === '[data-guide-toggle]') return toggle;
      if (selector === '[data-guide-action]') return action;
      return fields[selector.match(/data-guide-([\w-]+)/)?.[1]] ?? null;
    }
  };
  const links = entries.map(entry => ({ ...element(`link-${entry.id}`), dataset: { sceneSection: entry.id } }));
  const scene = { ...element('scene'), querySelectorAll: () => links };
  const dot = element('dot'), orbit = element('orbit');
  const background = { ...element('background'), dataset: { paused: 'false' } };
  const cookie = element('cookie'); cookie.hidden = true;
  const modal = element('modal');
  const targets = {
    '.site-header': header, '[data-portrait-hero]': sections[0],
    '[data-journey-guide]': guide, '.hero-section-dots': scene,
    '[data-cursor-dot]': dot, '[data-cursor-orbit]': orbit,
    '[data-letter-glitch]': background, '[data-cookie-banner]': cookie
  };
  const document = {
    ...listen('document'), documentElement: root, body, hidden: false, activeElement: null,
    getElementById: id => sections.find(section => section.id === id) ?? null,
    querySelector: selector => selector === 'dialog[open]' ? (modalOpen ? modal : null) : targets[selector] ?? null
  };
  function fire(target, type, event = {}) {
    for (const fn of handlers.get(`${target}:${type}`) ?? []) fn(event);
  }
  function flush() {
    let batches = 0;
    while (frames.size) {
      assert.ok(++batches < 200, 'Animation settles instead of requesting idle frames forever');
      const pending = [...frames.values()]; frames.clear();
      for (const fn of pending) fn();
    }
  }
  function notify(target) { for (const observer of observers) if (observer.target === target) observer.fn(); }
  function setMedia(fragment, value) {
    const entry = [...media].find(([query]) => query.includes(fragment))?.[1];
    assert.ok(entry, `Media condition exists: ${fragment}`);
    entry.matches = value;
    for (const fn of entry.listeners) fn({ matches: value });
    flush();
  }
  vm.runInNewContext(source, {
    document, window, innerHeight: height, innerWidth: 1280,
    requestAnimationFrame(fn) { const id = ++frameId; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    matchMedia(query) {
      const value = { matches: query.includes('hover:') || query.includes('min-width:'), listeners: [], addEventListener(_type, fn) { this.listeners.push(fn); } };
      media.set(query, value); return value;
    },
    MutationObserver: class {
      constructor(fn) { this.fn = fn; observers.push(this); }
      observe(target) { this.target = target; }
    }
  });
  return {
    root, document, window, sections, guide, scene, links, fields, background, dot, orbit, marker, frames, fire, flush, setMedia,
    scroll(y) { window.scrollY = y; fire('window', 'scroll'); flush(); },
    pointer(x = 100, y = 200, target = body) {
      fire('document', 'pointermove', { pointerType: 'mouse', clientX: x, clientY: y, target }); flush();
    },
    modal(value, observe = true) { modalOpen = value; if (observe) notify(body); },
    preferences(values) { Object.assign(root.dataset, values); fire('document', 'alejandro:preferences'); flush(); },
    pause(value) { background.dataset.paused = String(value); notify(background); flush(); }
  };
}

const close = (value, expected, message) => assert.ok(Math.abs(Number(value) - expected) < 1e-8, `${message}: ${value} ≈ ${expected}`);
const journey = boot();
const local = () => journey.guide.style['--journey-progress'];
const global = () => journey.scene.style['--section-progress'];
close(local(), 0, 'The first section begins at zero');
journey.scroll((900 - journey.marker) * .5);
close(local(), .5, 'The first section advances halfway');
journey.scroll(900 - journey.marker - 2);
assert.ok(Number(local()) > .995, 'The first section completes immediately before the next section');
journey.fire('next', 'click', { detail: 0 }); journey.flush();
assert.equal(journey.fields.location.textContent, 'About');
close(local(), 0, 'Native section navigation arrives at zero using the header clearance');
close(global(), 1 / 3, 'The navigation rail retains overall section position');
assert.equal(journey.sections[1].lastScroll.behavior, 'smooth');
assert.equal(journey.sections[1].heading.focused, true, 'Keyboard navigation places focus on the section heading');
assert.equal(journey.links[1].attrs['aria-current'], 'location');
journey.scroll(900 - journey.marker - .3);
assert.equal(journey.fields.location.textContent, 'About', 'Fractional native anchor rounding still enters the destination module');
close(local(), 0, 'A destination .3px below the marker begins at zero');

journey.scroll(900 + 450 - journey.marker);
close(local(), .5, 'The current module reaches halfway');
assert.equal(journey.fields.percent.textContent, '50%');
journey.scroll(1800 - journey.marker - 2);
assert.ok(Number(local()) > .995, 'The current module completes before the boundary');
journey.scroll(1800 - journey.marker);
close(local(), 0, 'Progress resets on entry into the next module');
assert.equal(journey.fields.location.textContent, 'Contact');
close(global(), 2 / 3, 'The rail does not reset with the module indicator');
journey.scroll(900 + 675 - journey.marker); close(local(), .75, 'Scrolling upward restores the preceding module position');
journey.scroll(900 + 225 - journey.marker); close(local(), .25, 'Module progress moves backward when scrolling upward');
journey.scroll(900 + 180 - journey.marker);
close(local(), .2, 'The guide shows local module progress');
close(global(), .4, 'The rail shows independent overall progress');
journey.scroll(journey.root.scrollHeight - 900);
close(local(), 1, 'The end of the document reaches a complete final module');
close(global(), 1, 'The overall rail completes at document end');
assert.equal(journey.fields.percent.textContent, '100%');
assert.equal(journey.fields.next.disabled, true);

const fallback = boot({ headerPresent: false });
fallback.scroll(900 - fallback.marker);
close(fallback.guide.style['--journey-progress'], 0, 'Routes without a header measurement use the same 86px clearance fallback');
const shortViewport = boot({ height: 200, headerHeight: 100 });
assert.equal(shortViewport.marker, 70);
shortViewport.scroll(900 - 70);
assert.equal(shortViewport.fields.location.textContent, 'About', 'The marker is bounded on short viewports');
close(shortViewport.guide.style['--journey-progress'], 0, 'The capped marker retains an exact module boundary');

const surfaces = boot();
surfaces.scroll(150);
const surfaceValue = () => Number(surfaces.sections[1].style['--module-focus']);
assert.ok(surfaceValue() > .65 && surfaceValue() < 1, 'The approaching module gradually gains its reading surface');
assert.equal(surfaces.sections[0].style['--module-focus'], undefined, 'The portrait scene is excluded from module surface animation');
surfaces.setMedia('prefers-reduced-motion', true);
assert.equal(surfaceValue(), 1, 'System reduced motion makes the module surface static');
surfaces.setMedia('prefers-reduced-motion', false);
assert.ok(surfaceValue() < 1);
surfaces.preferences({ motion: 'true' }); assert.equal(surfaceValue(), 1, 'The visitor motion preference makes the module static');
surfaces.preferences({ motion: 'false' }); surfaces.pause(true);
assert.equal(surfaceValue(), 1, 'Background pause also freezes module surface animation');
surfaces.scroll(60); assert.equal(surfaceValue(), 1, 'Paused surfaces remain static during scrolling');
surfaces.pause(false); surfaces.setMedia('forced-colors', true);
assert.equal(surfaceValue(), 1, 'Forced colors always use the complete reading surface');
surfaces.setMedia('forced-colors', false); surfaces.preferences({ contrast: 'true' });
assert.equal(surfaceValue(), 1, 'The high contrast preference uses the complete reading surface');

const cursor = boot();
cursor.pointer();
assert.equal(cursor.root.dataset.cursorActive, 'true');
assert.equal(cursor.frames.size, 0, 'The cursor settles without idle frame requests');
cursor.modal(true, false);
cursor.pointer(200, 300);
assert.equal(cursor.root.dataset.cursorActive, undefined, 'A newly opened modal blocks a retargeted body pointer event before its observer runs');
assert.equal(cursor.dot.hidden, true); assert.equal(cursor.orbit.hidden, true);
cursor.modal(true);
assert.equal(cursor.root.dataset.dialogOpen, 'true');
cursor.pointer(400, 500);
assert.equal(cursor.root.dataset.cursorActive, undefined, 'The modal keeps the native cursor after observation');
cursor.modal(false); cursor.pointer(800, 500);
assert.equal(cursor.root.dataset.cursorActive, 'true', 'The custom cursor resumes after the modal closes');
assert.equal(cursor.dot.style.transform, 'translate3d(800px,500px,0)', 'The resumed cursor uses the current pointer position');
cursor.preferences({ cursor: 'true' }); cursor.pointer();
assert.equal(cursor.root.dataset.cursorActive, undefined, 'The visitor native-cursor preference remains authoritative');

const batched = boot();
batched.fire('window', 'scroll'); batched.fire('window', 'scroll'); batched.fire('window', 'resize');
assert.equal(batched.frames.size, 1, 'Section measurements share one scheduled animation frame');
batched.flush(); assert.equal(batched.frames.size, 0);
console.log(JSON.stringify({ journeyChecks: ['per-module completion and reset', 'header-aligned native navigation', 'reverse scroll and independent overall rail', 'document end', 'static module surfaces', 'modal cursor event order', 'bounded idle work'] }));
