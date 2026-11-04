import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

// Exercise the real menu handlers. This DOM fixture does not claim browser input
// or CSS breakpoint coverage; those remain separate visual checks.
const source = await readFile(new URL('../src/client/site.js', import.meta.url), 'utf8');
function fixture({ menuPresent = true } = {}) {
  const handlers = new Map(), media = new Map();
  const listen = name => ({ addEventListener(event, callback) { handlers.set(`${name}:${event}`, callback); } });
  const classes = () => {
    const values = new Set();
    return { add: value => values.add(value), contains: value => values.has(value), toggle(value, on) { if (on) values.add(value); else values.delete(value); } };
  };
  const root = { dataset: {}, classList: classes() };
  const document = { documentElement: root, activeElement: null, ...listen('document'), querySelectorAll: () => [], getElementById: () => null };
  const attrs = new Map([['aria-expanded', 'false'], ['aria-label', 'Open navigation']]);
  const outside = { closest: () => null }, inside = { closest: () => null };
  const menuChild = { closest: () => null };
  const link = { closest: selector => selector === 'a' ? link : null, focus() { document.activeElement = link; } };
  const linkChild = { closest: selector => selector === 'a' ? link : null };
  const menu = { hidden: true, dataset: { open: 'Open navigation', close: 'Close navigation' }, ...listen('menu'),
    getAttribute: name => attrs.get(name), setAttribute: (name, value) => attrs.set(name, value),
    contains: target => target === menu || target === menuChild, focus() { document.activeElement = menu; } };
  const nav = { classList: classes(), ...listen('nav'), querySelector: selector => selector === 'a' ? link : null,
    contains: target => target === nav || target === inside || target === link || target === linkChild };
  document.querySelector = selector => selector === '[data-menu-toggle]' ? (menuPresent ? menu : null) : selector === '[data-primary-nav]' ? nav : null;
  vm.runInNewContext(source, { document, window: {}, matchMedia(query) {
    const item = { matches: false, listeners: [], addEventListener(_event, callback) { this.listeners.push(callback); } };
    media.set(query, item); return item;
  } });
  function emit(target, event, value) { handlers.get(`${target}:${event}`)?.(value); }
  return { menu, nav, root, document, link, outside, inside, menuChild, linkChild,
    click(target) {
      if (menu.contains(target)) emit('menu', 'click', { target });
      if (nav.contains(target)) emit('nav', 'click', { target });
      emit('document', 'click', { target });
    },
    key(key) { emit('document', 'keydown', { key }); },
    desktop(matches) {
      const item = media.get('(min-width: 761px)');
      assert.ok(item, 'The expanded desktop boundary has a state-reset handler');
      item.matches = matches; item.listeners.forEach(callback => callback({ matches }));
    },
    state(open) {
      assert.equal(menu.getAttribute('aria-expanded'), String(open), 'Expanded state matches the visible menu state');
      assert.equal(nav.classList.contains('is-open'), open, 'Menu class follows its state');
      assert.equal(menu.getAttribute('aria-label'), open ? menu.dataset.close : menu.dataset.open, 'The control describes its next action');
    }
  };
}

const page = fixture();
assert.equal(page.menu.hidden, false, 'JavaScript reveals the progressive menu control');
assert.equal(page.root.classList.contains('nav-enhanced'), true); page.state(false);
page.click(page.menuChild); page.state(true); assert.equal(page.document.activeElement, page.link, 'Opening focuses the first navigation link');
page.click(page.menu); page.state(false);
page.click(page.menu); page.key('Enter'); page.state(true);
page.key('Escape'); page.state(false); assert.equal(page.document.activeElement, page.menu, 'Escape returns focus to the menu control');
page.click(page.menu); page.click(page.inside); page.state(true);
page.click(page.outside); page.state(false);
page.click(page.menu); page.click(page.linkChild); page.state(false);
page.click(page.menu); page.desktop(true); page.state(false);
page.click(page.menu); page.desktop(false); page.state(false);
const noControl = fixture({ menuPresent: false });
assert.equal(noControl.root.classList.contains('nav-enhanced'), false, 'Missing controls leave the ordinary navigation alone');
console.log(JSON.stringify({ navigationChecks: ['progressive setup', 'toggle ARIA and class', 'first-link focus', 'Escape focus return', 'inside/outside/link clicks', 'desktop transition reset', 'missing-control fallback'] }));
