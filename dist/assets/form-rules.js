export function validateContact(values, topics) {
  const errors = [];
  const name = String(values.name || '').trim(), email = String(values.email || '').trim(), message = String(values.message || '').trim();
  if (name.length < 2 || name.length > 80) errors.push('name');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (!topics.includes(values.topic)) errors.push('topic');
  if (message.length < 20 || message.length > 4000) errors.push('message');
  if (!values.consent) errors.push('consent');
  return errors;
}

export function submissionState(responseOK, data) {
  if (!responseOK) return 'failed';
  if (/activat|confirm your email/i.test(data?.message || '')) return 'activation';
  if (data?.success !== true && data?.success !== 'true') return 'failed';
  return 'received';
}
