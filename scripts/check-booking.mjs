import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { bookingURL } from '../src/content/booking.mjs';

const source = await readFile(new URL('../src/client/booking.js', import.meta.url), 'utf8');

// Exercise the controller's lifecycle and failure paths. Real Cal.com dates,
// field constraints and responsive behavior are checked separately in-browser.
function fixture({ nativeDialog = true, modalFailure = false, lang = 'es' } = {}) {
  const target = () => {
    const handlers = new Map();
    return {
      addEventListener(type, callback) { if (!handlers.has(type)) handlers.set(type, new Set()); handlers.get(type).add(callback); },
      removeEventListener(type, callback) { handlers.get(type)?.delete(callback); },
      emit(type, event = {}) { for (const callback of [...handlers.get(type) ?? []]) callback(event); },
      count(type) { return handlers.get(type)?.size ?? 0; },
    };
  };
  const window = Object.assign(target(), {location:{origin:'https://alejandros-tech.alejosergio3000.chatgpt.site'}}), frames = [], timers = new Map(), observers = [];
  let sequence = 0, focusReturns = 0;
  const root = { dataset: { theme: 'dark', tone: 'coral' } };
  const status = { hidden: false, textContent: '' };
  const host = { children: [], append(frame) { this.children.push(frame); }, replaceChildren() { this.children = []; } };
  const close = target();
  const dialog = {
    ...target(), id: 'booking-dialog', open: false,
    dataset: { bookingUrl: bookingURL(lang), bookingLang: lang, frameTitle: 'Booking calendar', loading: 'Loading', slow: 'Use the new-tab link' },
    querySelector(selector) { return { '[data-booking-frame]': host, '[data-booking-status]': status, '[data-booking-close]': close }[selector]; },
    showModal: nativeDialog ? function () { if (modalFailure) throw new Error('Dialog unavailable'); this.open = true; } : undefined,
    close() { this.open = false; this.emit('close'); },
    getBoundingClientRect() { return { left: 0, right: 100, top: 0, bottom: 100 }; },
  };
  const trigger = { ...target(), attrs: new Map(), setAttribute(name, value) { this.attrs.set(name, value); }, focus() { focusReturns++; } };
  const document = {
    documentElement: root,
    querySelector(selector) { return selector === '[data-booking-dialog]' ? dialog : selector === 'dialog[open]' && dialog.open ? dialog : null; },
    querySelectorAll(selector) { return selector === '[data-booking-open]' ? [trigger] : []; },
    createElement(tag) {
      assert.equal(tag, 'iframe', 'Only an explicitly opened booking frame is created');
      const frame = { ...target(), contentWindow: { messages: [], postMessage(message, origin) { this.messages.push({ message, origin }); } }, remove() { host.children = host.children.filter(child => child !== frame); } };
      frames.push(frame); return frame;
    },
  };
  vm.runInNewContext(source, {
    document, window, URL,
    setTimeout(callback) { timers.set(++sequence, callback); return sequence; },
    clearTimeout(id) { timers.delete(id); },
    MutationObserver: class { constructor(callback) { this.callback = callback; observers.push(this); } observe() { this.active = true; } disconnect() { this.active = false; } },
  });
  function click(patch = {}) {
    const event = { button: 0, currentTarget: trigger, prevented: false, preventDefault() { this.prevented = true; }, ...patch };
    trigger.emit('click', event); return event;
  }
  return { window, root, dialog, status, host, frames, timers, observers, trigger, close, click, focusReturns: () => focusReturns };
}

for (const lang of ['es', 'en']) {
  const f = fixture({ lang });
  assert.equal(f.frames.length, 0, 'No provider connection before activation');
  assert.equal(f.timers.size, 0); assert.equal(f.window.count('message'), 0);
  assert.equal(f.click({ ctrlKey: true }).prevented, false, 'Modified clicks keep their ordinary link behavior');
  assert.equal(f.frames.length, 0);
  assert.equal(f.click().prevented, true);
  const first = f.frames[0], url = new URL(first.src);
  assert.equal(url.origin, f.window.location.origin);
  assert.equal(url.pathname, '/assets/booking-shell.html');
  assert.equal(url.searchParams.get('event'), new URL(bookingURL(lang)).pathname);
  assert.equal(url.searchParams.get('lang'), lang);
  assert.equal(url.searchParams.get('theme'), 'dark');
  assert.equal(f.window.count('message'), 1);
  first.emit('load'); assert.equal(f.status.hidden, false, 'A shell load is not provider readiness');
  f.window.emit('message', {origin:f.window.location.origin,source:first.contentWindow,data:{type:'alejandros-booking:ready'}});
  assert.equal(f.status.hidden,true); assert.equal(f.timers.size,0);
  const count = first.contentWindow.messages.length;
  for (const event of [
    { origin: 'https://example.com', source: first.contentWindow },
    { origin: f.window.location.origin, source: {} },
  ]) f.window.emit('message', { ...event, data: { type: 'alejandros-booking:ready' } });
  assert.equal(first.contentWindow.messages.length, count, 'Untrusted messages cannot change the frame');
  f.window.emit('message', { origin: f.window.location.origin, source: first.contentWindow, data: { type: 'alejandros-booking:ready' } });
  assert.equal(first.contentWindow.messages.at(-1).origin, f.window.location.origin);
  f.close.emit('click');
  assert.equal(f.host.children.length, 0); assert.equal(f.window.count('message'), 0);
  assert.equal(f.timers.size, 0); assert.ok(f.observers.every(observer => !observer.active));
  assert.equal(f.focusReturns(), 1);
  f.click(); const second = f.frames[1];
  first.emit('load'); first.emit('error');
  assert.equal(f.status.hidden, false, 'Late callbacks from a removed frame cannot affect a new session');
  assert.equal(f.status.textContent, 'Loading'); assert.equal(f.timers.size, 1);
  [...f.timers.values()][0](); assert.equal(f.status.textContent, 'Use the new-tab link');
  second.emit('error'); assert.equal(f.status.hidden, false);
  f.window.emit('pagehide');
  assert.equal(f.dialog.open, false); assert.equal(f.host.children.length, 0); assert.equal(f.timers.size, 0);
}
for (const options of [{ nativeDialog: false }, { modalFailure: true }]) {
  const f = fixture(options); assert.equal(f.click().prevented, false); assert.equal(f.frames.length, 0);
}
const invalid = fixture(); invalid.dialog.dataset.bookingUrl = 'https://example.com/alejandros-tech/llamada';
assert.equal(invalid.click().prevented, false); assert.equal(invalid.frames.length, 0);
console.log(JSON.stringify({ bookingChecks: ['ES/EN destinations', 'explicit activation only', 'ordinary link fallback', 'trusted frame messaging', 'late callbacks', 'timeout and provider error', 'close/focus/navigation cleanup'] }));
