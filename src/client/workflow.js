import { createWorkflow } from './workflow-core.js';

const page = document.querySelector('[data-workflow]');
if (page) {
  const t = JSON.parse(page.dataset.copy), form = page.querySelector('form'), store = createWorkflow();
  const find = name => page.querySelector(`[data-workflow-${name}]`), actions = find('actions'), trace = [];
  let original, key, request;
  find('create').disabled = false; find('reset').hidden = false;
  form.noValidate = true;
  function show(result, operation) {
    const actionHadFocus = actions.contains(document.activeElement);
    trace.push({ at: new Date().toISOString(), operation, result }); if (trace.length > 30) trace.shift();
    if (result.body.request) request = result.body.request;
    find('status').textContent = `${result.status} · ${t.messages[result.code]}`;
    find('response').textContent = JSON.stringify({ status: result.status, code: result.code, ...result.body }, null, 2);
    find('count').textContent = store.count; find('export').hidden = false;
    for (const name of ['replay', 'conflict']) find(name).disabled = !original;
    find('stale').disabled = !request || request.version < 2;
    find('empty').hidden = Boolean(request); find('record').hidden = !request;
    if (!request) return;
    find('state').textContent = t.states[request.status]; find('version').textContent = `${t.version} ${request.version}`;
    find('help').textContent = t.stateHelp[request.status]; actions.replaceChildren();
    const allowed = { received: ['review'], review: ['approve', 'reject'], approved: ['complete'] }[request.status] ?? [];
    for (const action of allowed) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button button-secondary'; button.textContent = t.actions[action];
      button.addEventListener('click', () => show(store.transition(request.requestId, action, request.version), action)); actions.append(button);
    }
    find('events').replaceChildren(...request.events.map(event => {
      const row = document.createElement('li'), state = document.createElement('strong'), meta = document.createElement('span');
      state.textContent = t.states[event.status]; meta.textContent = `v${event.version} · ${new Intl.DateTimeFormat(page.dataset.language, { timeStyle: 'medium' }).format(new Date(event.at))}`;
      row.append(state, meta); return row;
    }));
    if (actionHadFocus) find('state').focus({ preventScroll: true });
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const input of form.elements) input.removeAttribute('aria-invalid');
    if (!form.checkValidity()) {
      for (const input of form.elements) if (input.validity && !input.validity.valid) input.setAttribute('aria-invalid', 'true');
      find('status').textContent = t.invalid; form.querySelector('[aria-invalid]')?.focus(); return;
    }
    const data = new FormData(form), payload = Object.fromEntries(['requestId', 'title', 'category', 'priority'].map(name => [name, data.get(name)]));
    const result = store.create(payload, data.get('idempotencyKey'));
    if (result.status < 400) { original = payload; key = data.get('idempotencyKey'); }
    for (const name of Object.keys(result.body.errors ?? {})) form.elements.namedItem(name)?.setAttribute('aria-invalid', 'true');
    show(result, 'create');
    if (result.status >= 400) form.querySelector('[aria-invalid="true"]')?.focus();
  });
  find('replay').addEventListener('click', () => show(store.create(original, key), 'replay'));
  find('conflict').addEventListener('click', () => show(store.create({ ...original, title: original.title === 'Conflicting request payload' ? 'Alternative request payload' : 'Conflicting request payload' }, key), 'conflict'));
  find('stale').addEventListener('click', () => show(store.transition(request.requestId, 'review', request.version - 1), 'stale-version'));
  find('reset').addEventListener('click', () => {
    store.reset(); request = original = key = undefined; trace.length = 0; actions.replaceChildren(); find('events').replaceChildren();
    find('record').hidden = true; find('empty').hidden = false; find('count').textContent = '0'; find('response').textContent = '{}'; find('status').textContent = t.cleared; find('export').hidden = true;
    for (const name of ['replay', 'conflict', 'stale']) find(name).disabled = true;
    for (const input of form.elements) input.removeAttribute('aria-invalid');
  });
  find('export').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, scope: 'browser-memory-prototype', trace }, null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'alejandros-tech-workflow.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
