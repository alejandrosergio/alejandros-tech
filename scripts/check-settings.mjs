import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { preferences } from '../src/components/preferences.mjs';

const source = await readFile(new URL('../src/client/preferences.js', import.meta.url), 'utf8');

function exercise(script) {
  // Close events are queued like native dialogs, so switching between modals
  // cannot accidentally restore focus to a control inside the closed dialog.
  const emitted = [], handlers = new Map(), writes = [], queued = [];
  const stats = { applies: 0 };
  function element(name, dataset = {}) {
    const attrs = new Map();
    return {
      name, dataset, hidden: false, isConnected: true, parentElement: null,
      addEventListener(type, fn) { const key = `${name}:${type}`, list = handlers.get(key) ?? []; list.push(fn); handlers.set(key, list); },
      setAttribute(key, value) { attrs.set(key, value); }, getAttribute: key => attrs.get(key) ?? null,
      closest() {
        for (let node = this; node; node = node.parentElement) if (node.hidden || node.inert || (node.isDialog && !node.open)) return node;
        return null;
      },
      getClientRects() { return this.isConnected && !this.closest() ? [{ width: 44, height: 44 }] : []; },
      focus() {
        assert.ok(this.getClientRects().length, `Never focus an invisible or disconnected control: ${name}`);
        document.activeElement = this;
      }
    };
  }
  const root = element('html', { theme: 'dark', tone: 'coral', motion: 'false' });
  const tones = ['blue', 'violet', 'coral', 'ocean', 'mono'].map(tone => Object.assign(element(`tone-${tone}`, { tone }), { parentElement: root }));
  const launcher = element('settings-launcher'), reset = element('reset'), banner = element('cookie-banner'), wordmark = element('wordmark');
  const text = element('text-output'), radius = element('radius-output');
  const preferenceStatus = element('preference-status', { resetMessage: 'Defaults restored' });
  const consentStatus = element('consent-status', { message: 'Choice saved' });
  function dialog(name) {
    const node = element(name), closeButton = element(`${name}-close`);
    closeButton.parentElement = node;
    return Object.assign(node, {
      isDialog: true, open: false, closeButton, querySelector: () => closeButton,
      showModal() { this.open = true; closeButton.focus(); },
      close() { if (this.open) { this.open = false; queued.push(() => fire(node, 'close')); } }
    });
  }
  const settings = dialog('settings'), privacy = dialog('privacy');
  const footerPrivacy = element('footer-privacy'), settingsPrivacy = element('settings-privacy'), bannerPrivacy = element('banner-privacy');
  settingsPrivacy.parentElement = settings; bannerPrivacy.parentElement = banner;
  const bannerAccept = element('banner-accept', { consent: 'preferences' }), bannerEssential = element('banner-essential', { consent: 'essential' });
  const privacyAccept = element('privacy-accept', { consent: 'preferences' }), privacyEssential = element('privacy-essential', { consent: 'essential' });
  bannerAccept.parentElement = banner; bannerEssential.parentElement = banner;
  privacyAccept.parentElement = privacy; privacyEssential.parentElement = privacy;
  const defaults = { theme: 'dark', tone: 'coral', text: 100, radius: 6, motion: false };
  let values = { ...defaults };
  const state = {
    defaults, consent: '', get values() { return { ...values }; }, set values(next) { values = { ...next }; },
    apply() { stats.applies++; root.dataset.theme = values.theme; root.dataset.tone = values.tone; }
  };
  const document = {
    documentElement: root, activeElement: null, cookie: '',
    querySelector(selector) {
      return {
        '[data-settings]': settings, '[data-privacy]': privacy, '[data-cookie-banner]': banner,
        '[data-output="text"]': text, '[data-output="radius"]': radius,
        '[data-reset-preferences]': reset, '[data-preference-status]': preferenceStatus,
        '[data-consent-status]': consentStatus, '[data-open-settings]': launcher, '.wordmark': wordmark
      }[selector] ?? null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-tone]') return [root, ...tones];
      if (selector === 'button[data-tone]') return tones;
      if (selector === '[data-open-settings]') return [launcher];
      if (selector === '[data-open-privacy]') return [footerPrivacy, settingsPrivacy, bannerPrivacy];
      if (selector === '[data-consent]') return [bannerAccept, bannerEssential, privacyAccept, privacyEssential];
      return [];
    },
    dispatchEvent(event) { emitted.push(event); }
  };
  vm.runInNewContext(script, {
    document, window: { AlejandroPreferences: state }, location: { protocol: 'https:' },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    localStorage: { removeItem(key) { writes.push({ key, action: 'remove' }); }, setItem(key, value) { writes.push({ key, value, action: 'set' }); } }
  });
  function fire(target, type, event = {}) {
    for (const fn of handlers.get(`${target.name}:${type}`) ?? []) fn({ target, currentTarget: target, ...event });
  }
  function click(target) {
    target.focus();
    for (let current = target; current; current = current.parentElement) fire(current, 'click', { target });
  }
  function flushClose() { while (queued.length) queued.shift()(); }

  // The selected-tone root is state, never another palette control.
  assert.equal(root.getAttribute('aria-pressed'), null);
  assert.equal(handlers.get('html:click')?.length ?? 0, 0);
  assert.equal(tones.find(button => button.dataset.tone === 'coral').getAttribute('aria-pressed'), 'true');
  assert.equal(tones.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
  const ordinary = Object.assign(element('ordinary-link'), { parentElement: root });
  const child = Object.assign(element('ordinary-link-icon'), { parentElement: ordinary });
  click(child);
  assert.equal(stats.applies, 0, 'An ordinary bubbled click does not apply preferences');
  assert.equal(emitted.length, 0); assert.equal(writes.length, 0);
  click(tones[0]);
  assert.equal(state.values.tone, 'blue'); assert.equal(root.dataset.tone, 'blue');
  assert.equal(stats.applies, 1, 'A palette action runs exactly once');
  assert.equal(emitted.filter(event => event.type === 'alejandro:preferences').length, 1);
  assert.equal(emitted[0].detail.tone, 'blue');
  assert.equal(tones[0].getAttribute('aria-pressed'), 'true');
  assert.equal(tones.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
  assert.equal(root.getAttribute('aria-pressed'), null);
  const eventCount = emitted.length, storageCount = writes.length;
  click(child);
  assert.equal(emitted.length, eventCount); assert.equal(writes.length, storageCount); assert.equal(stats.applies, 1);
  assert.equal(root.dataset.tone, 'blue', 'Unrelated navigation preserves the selected tone');

  click(footerPrivacy); click(privacy.closeButton); flushClose();
  assert.equal(document.activeElement, footerPrivacy, 'Footer privacy returns focus to its own link');
  click(launcher); click(settings.closeButton); flushClose();
  assert.equal(document.activeElement, launcher, 'Settings returns focus to the gear');
  click(bannerPrivacy); click(privacy.closeButton); flushClose();
  assert.equal(document.activeElement, bannerPrivacy, 'Dismissed cookie details return to the still-visible banner');

  click(launcher); click(settingsPrivacy); flushClose();
  assert.equal(settings.open, false); assert.equal(privacy.open, true);
  assert.equal(document.activeElement, privacy.closeButton, 'A queued settings close never steals focus from the new modal');
  click(privacy.closeButton); flushClose();
  assert.equal(document.activeElement, launcher, 'Settings to privacy preserves the original external invoker');

  click(footerPrivacy); click(privacyAccept); flushClose();
  assert.equal(document.activeElement, footerPrivacy, 'Consent from footer privacy still returns to the footer');
  assert.equal(state.consent, 'preferences'); assert.equal(banner.hidden, true);
  assert.ok(document.cookie.includes('at_consent=preferences;'));
  assert.ok(writes.some(item => item.action === 'set' && item.key === 'alejandros-tech-preferences-v1'));
  assert.equal(state.values.tone, 'blue', 'Accepting storage preserves current choices');

  banner.hidden = false;
  click(bannerPrivacy); click(privacyAccept); flushClose();
  assert.equal(banner.hidden, true);
  assert.equal(document.activeElement, launcher, 'After consent, the now-hidden banner invoker is skipped');

  click(footerPrivacy); click(privacyEssential); flushClose();
  assert.equal(document.activeElement, footerPrivacy);
  assert.equal(state.consent, 'essential'); assert.deepEqual(state.values, defaults);
  assert.ok(document.cookie.includes('at_consent=essential;'));
  assert.equal(writes.at(-1).action, 'remove', 'Withdrawing preference consent removes optional storage');
  assert.equal(writes.at(-1).key, 'alejandros-tech-preferences-v1');

  banner.hidden = false;
  click(bannerEssential);
  assert.equal(banner.hidden, true); assert.equal(document.activeElement, launcher, 'A direct banner choice focuses a visible fallback');
  click(footerPrivacy); footerPrivacy.isConnected = false; click(privacy.closeButton); flushClose();
  assert.equal(document.activeElement, launcher, 'A removed invoker is skipped');
  footerPrivacy.isConnected = true;
  click(footerPrivacy); footerPrivacy.hidden = true; launcher.hidden = true; click(privacy.closeButton); flushClose();
  assert.equal(document.activeElement, wordmark, 'When both invoker and gear are hidden, focus returns to the visible brand link');
}

for (const lang of ['es', 'en']) {
  const html = preferences(lang);
  assert.ok(html.includes('<option value="dark" selected>'));
  assert.ok(html.includes('data-tone="coral" aria-pressed="true"'));
  assert.equal((html.match(/data-tone="[^"]+" aria-pressed="true"/g) ?? []).length, 1);
  assert.ok(html.includes('data-output="radius">6 px</output>'));
  assert.ok(html.includes('data-preference="radius" type="range" min="0" max="28" step="2" value="6"'));
}
const minified = (await transform(source, { loader: 'js', minify: true, target: 'es2022' })).code;
exercise(source); exercise(minified);
console.log(JSON.stringify({ settingsChecks: ['HTML defaults match dark/coral/6px', 'palette actions run once', 'focus returns to real visible invokers', 'modal switching preserves external focus', 'consent hides banner without focusing it', 'preference consent and withdrawal preserve storage rules'], variants: ['source', 'minified'] }));
