import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { locales } from '../src/content/locales.mjs';
import { renderPage } from '../src/components/page.mjs';

// Exercise the real menu handlers. This DOM fixture does not claim browser input
// or CSS breakpoint coverage; those remain separate visual checks.
const source = await readFile(new URL('../src/client/site.js', import.meta.url), 'utf8');
function fixture({ menuPresent = true, themePresent = true, initialTheme = 'dark', lightLabel = 'Switch to light theme', darkLabel = 'Switch to dark theme' } = {}) {
  const handlers = new Map(), media = new Map(), observers = [], preferenceWrites = [];
  const listen = name => ({ addEventListener(event, callback) { handlers.set(`${name}:${event}`, callback); } });
  const classes = () => {
    const values = new Set();
    return { add: value => values.add(value), contains: value => values.has(value), toggle(value, on) { if (on) values.add(value); else values.delete(value); } };
  };
  const root = { dataset: { theme: initialTheme }, classList: classes() };
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
  const themeAttrs = new Map([['aria-label', 'Stale theme action']]);
  const theme = { hidden: true, dataset: { themeLight: lightLabel, themeDark: darkLabel }, ...listen('theme'),
    getAttribute: name => themeAttrs.get(name), setAttribute: (name, value) => themeAttrs.set(name, value) };
  document.querySelector = selector => selector === '[data-theme-toggle]' ? (themePresent ? theme : null) : selector === '[data-menu-toggle]' ? (menuPresent ? menu : null) : selector === '[data-primary-nav]' ? nav : null;
  const window = { MutationObserver: true, AlejandroPreferences: { set(values) { preferenceWrites.push(values); Object.assign(root.dataset, values); emit('document', 'alejandro:preferences', {}); } } };
  vm.runInNewContext(source, { document, window,
    MutationObserver: class { constructor(callback) { this.callback = callback; observers.push(this); } observe(target, options) { this.target = target; this.options = options; } },
    matchMedia(query) {
    const item = { matches: false, listeners: [], addEventListener(_event, callback) { this.listeners.push(callback); } };
    media.set(query, item); return item;
  } });
  function emit(target, event, value) { handlers.get(`${target}:${event}`)?.(value); }
  return { menu, nav, theme, root, document, link, outside, inside, menuChild, linkChild, preferenceWrites,
    click(target) {
      if (target === theme && themePresent) emit('theme', 'click', { target });
      if (menu.contains(target)) emit('menu', 'click', { target });
      if (nav.contains(target)) emit('nav', 'click', { target });
      emit('document', 'click', { target });
    },
    key(key) { emit('document', 'keydown', { key }); },
    preferences(value) { root.dataset.theme = value; emit('document', 'alejandro:preferences', {}); },
    systemTheme(value) {
      root.dataset.theme = value;
      for (const observer of observers) if (observer.target === root && observer.options.attributeFilter.includes('data-theme')) observer.callback();
    },
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
for (const lang of ['es', 'en']) {
  const t = locales[lang], control = fixture({ menuPresent: false, lightLabel: t.themeLight, darkLabel: t.themeDark });
  assert.equal(control.theme.hidden, false);
  assert.equal(control.theme.getAttribute('aria-label'), t.themeLight, 'The initial dark theme announces switching to light');
  control.click(control.theme);
  assert.equal(control.preferenceWrites[0].theme, 'light', 'The action requests the announced target theme');
  assert.equal(control.theme.getAttribute('aria-label'), t.themeDark, 'After switching, the control announces the reverse action');
  control.preferences('dark');
  assert.equal(control.theme.getAttribute('aria-label'), t.themeLight, 'Appearance settings refresh the action label');
  control.systemTheme('light');
  assert.equal(control.theme.getAttribute('aria-label'), t.themeDark, 'A system theme change updates the label without a preference event');
  control.click(control.theme);
  assert.equal(control.preferenceWrites[1].theme, 'dark');
  const initiallyLight = fixture({ initialTheme: 'light', lightLabel: t.themeLight, darkLabel: t.themeDark });
  assert.equal(initiallyLight.theme.getAttribute('aria-label'), t.themeDark, 'A restored light preference starts with the correct action');
  const html = renderPage(lang), themeButton = html.match(/<button\b[^>]*data-theme-toggle[^>]*>/)?.[0];
  assert.ok(themeButton?.includes(`data-theme-light="${t.themeLight}"`) && themeButton.includes(`data-theme-dark="${t.themeDark}"`), 'Both localized actions are available to progressive enhancement');
  assert.ok(themeButton.includes(`aria-label="${t.themeLight}"`) && /\sdata-tooltip(?:\s|>)/.test(themeButton), 'The shared tooltip inherits the current accessible action instead of a stale fixed string');
  assert.ok(html.includes(t.hero.kicker));
  assert.ok(html.match(/<button\b[^>]*data-copy-email[^>]*>/)?.[0].includes(`aria-label="${t.contact.copy}"`), 'Copy feedback does not replace the accessible copy action');
}
fixture({ themePresent: false });
assert.equal(locales.es.hero.kicker, 'Analista y desarrollador de software');
assert.equal(locales.en.hero.kicker, 'Software analyst and developer');
console.log(JSON.stringify({ navigationChecks: ['progressive setup', 'toggle ARIA and class', 'first-link focus', 'Escape focus return', 'inside/outside/link clicks', 'desktop transition reset', 'missing-control fallback', 'localized theme actions after click/preferences/system changes', 'copy action and requested home role'] }));
