import { validateContact, submissionState, providerFieldErrors } from './form-rules.js';

const form = document.querySelector('[data-contact-form]');
if (form) {
  const messages = JSON.parse(form.dataset.messages);
  const summary = form.querySelector('[data-form-summary]'), status = form.querySelector('[data-form-status]');
  const button = form.querySelector('[type="submit"]'), label = form.querySelector('[data-submit-label]');
  let submitting = false;
  form.noValidate = true; // Custom messages enhance native constraints; HTML validation remains without JS.
  const clearError = name => {
    form.elements.namedItem(name)?.removeAttribute('aria-invalid');
    const error = form.querySelector(`[data-error="${name}"]`); if (error) error.textContent = '';
  };
  const showErrors = errors => {
    summary.hidden = false; summary.replaceChildren();
    const heading = document.createElement('p'); heading.textContent = messages.errors; summary.append(heading);
    const list = document.createElement('ul');
    for (const name of errors) {
      const input = form.elements.namedItem(name), message = messages[`${name}Error`];
      input.setAttribute('aria-invalid', 'true'); form.querySelector(`[data-error="${name}"]`).textContent = message;
      const item = document.createElement('li'), link = document.createElement('a'); link.href = `#${input.id}`; link.textContent = message;
      link.addEventListener('click', () => input.focus()); item.append(link); list.append(item);
    }
    summary.append(list); summary.focus();
  };
  form.addEventListener('input', event => { if (event.target.name) clearError(event.target.name); });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (submitting) return;
    const data = new FormData(form), values = Object.fromEntries(data);
    const errors = validateContact(values, messages.topics.slice(1));
    ['name','email','topic','message','consent'].forEach(clearError);
    summary.hidden = !errors.length; summary.replaceChildren(); status.textContent = '';
    if (errors.length) {
      showErrors(errors); return;
    }
    if (values._gotcha) return;
    submitting = true; button.disabled = true; form.setAttribute('aria-busy', 'true'); label.textContent = messages.sending;
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    try {
      for (const name of ['name','email','message']) data.set(name, values[name].trim());
      const response = await fetch(form.action, {
        method: 'POST', headers: { Accept: 'application/json' }, body: data, signal: controller.signal, credentials: 'omit', referrerPolicy: 'strict-origin-when-cross-origin'
      });
      const payload = await response.json(), result = submissionState(response.ok, payload);
      const fieldErrors = providerFieldErrors(payload);
      if (fieldErrors.length) showErrors(fieldErrors);
      status.textContent = messages[result]; status.dataset.state = result;
      if (result === 'received') form.reset();
    } catch {
      status.textContent = messages.failed; status.dataset.state = 'failed';
    } finally {
      clearTimeout(timeout); submitting = false; button.disabled = false; form.removeAttribute('aria-busy'); label.textContent = messages.submit;
    }
  });
}
