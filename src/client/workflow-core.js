// In-memory teaching model. No request, approval or message leaves the browser.
// The .NET reference implements the same contract and runs the same fixtures.
const copy = value => JSON.parse(JSON.stringify(value));
const fields = ['requestId', 'title', 'category', 'priority'];
const transitions = { received: { review: 'review' }, review: { approve: 'approved', reject: 'rejected' }, approved: { complete: 'completed' } };
const problem = (status, code, errors = {}) => ({ status, code, body: { type: 'about:blank', title: code, status, code, errors } });

export function createWorkflow({ now = () => new Date().toISOString(), capacity = 50 } = {}) {
  const records = new Map(), keys = new Map();
  function validate(payload, key) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).some(field => !fields.includes(field))) return { error: problem(400, 'invalid_payload', { payload: 'unknown_fields' }) };
    const value = Object.fromEntries(fields.map(field => [field, typeof payload[field] === 'string' ? payload[field].trim() : ''])); value.requestId = value.requestId.toUpperCase();
    const errors = {};
    if (!/^[A-Z0-9][A-Z0-9-]{2,31}$/.test(value.requestId)) errors.requestId = 'format';
    if (value.title.length < 12 || value.title.length > 160 || /[\u0000-\u001f\u007f]/.test(value.title)) errors.title = 'length_or_control';
    if (!['access', 'automation', 'integration'].includes(value.category)) errors.category = 'choice';
    if (!['normal', 'high'].includes(value.priority)) errors.priority = 'choice';
    if (typeof key !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(key)) errors.idempotencyKey = 'format';
    return Object.keys(errors).length ? { error: problem(400, 'invalid_payload', errors) } : { value };
  }
  return {
    get count() { return records.size; },
    create(payload, key) {
      const { value, error } = validate(payload, key); if (error) return error;
      const fingerprint = JSON.stringify(value), existing = keys.get(key);
      if (existing) return existing.fingerprint === fingerprint ? { status: 200, code: 'replayed', body: { replayed: true, request: copy(records.get(existing.requestId)) } } : problem(409, 'idempotency_conflict');
      if (records.has(value.requestId)) return problem(409, 'duplicate_request');
      if (records.size >= capacity) return problem(503, 'capacity_reached');
      const record = { ...value, status: 'received', version: 1, events: [{ status: 'received', version: 1, at: now() }] };
      records.set(value.requestId, record); keys.set(key, { fingerprint, requestId: value.requestId });
      return { status: 201, code: 'created', body: { replayed: false, request: copy(record) } };
    },
    transition(requestId, action, expectedVersion) {
      if (!['review', 'approve', 'reject', 'complete'].includes(action) || !Number.isInteger(expectedVersion) || expectedVersion < 1) return problem(400, 'invalid_transition_payload');
      const record = records.get(requestId); if (!record) return problem(404, 'not_found');
      if (record.version !== expectedVersion) return problem(409, 'version_conflict');
      const target = transitions[record.status]?.[action]; if (!target) return problem(409, 'invalid_transition');
      record.status = target; record.version++; record.events.push({ status: target, version: record.version, at: now() });
      return { status: 200, code: 'updated', body: { request: copy(record) } };
    },
    get(requestId) { const request = records.get(requestId); return request ? { status: 200, code: 'found', body: { request: copy(request) } } : problem(404, 'not_found'); },
    reset() { records.clear(); keys.clear(); }
  };
}
