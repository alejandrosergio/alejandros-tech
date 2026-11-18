// The official SDK lives in this disposable document, never in the main page.
// Removing the outer frame also ends the SDK's timers, listeners and resources.
(() => {
  const params = new URLSearchParams(location.search);
  const event = params.get('event') || '';
  if (!/^\/alejandros-tech\/[a-z0-9-]+$/.test(event)) return;
  const lang = params.get('lang') === 'en' ? 'en' : 'es';
  const notify = type => window.parent.postMessage({ type: `alejandros-booking:${type}` }, location.origin);
  const applyTheme = theme => {
    if (theme !== 'light' && theme !== 'dark') return;
    document.documentElement.dataset.theme = theme;
    window.Cal('ui', { theme });
  };

  // Same command queue contract as Cal.com's published embed snippet.
  const cal = (...args) => cal.q.push(args);
  cal.q = []; cal.ns = {}; cal.loaded = true;
  window.Cal = cal;
  document.documentElement.lang = lang;
  window.Cal('init', { origin: 'https://app.cal.com' });
  window.Cal('on', { action: 'linkReady', callback: () => notify('ready') });
  window.Cal('on', { action: 'linkFailed', callback: () => notify('error') });
  const theme = params.get('theme') === 'light' ? 'light' : 'dark';
  window.Cal('inline', {
    elementOrSelector: '#booking-provider',
    calLink: event.slice(1),
    config: { layout: 'month_view', theme, locale: lang },
  });
  applyTheme(theme);
  window.addEventListener('message', message => {
    if (message.origin !== location.origin || message.source !== window.parent) return;
    if (message.data?.type === 'alejandros-booking:appearance') applyTheme(message.data.theme);
  });
  const script = document.createElement('script');
  script.src = 'https://app.cal.com/embed/embed.js';
  script.async = true;
  script.addEventListener('error', () => notify('error'), { once: true });
  document.head.append(script);
})();
