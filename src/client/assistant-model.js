// Lightweight supervisor: constructing it never creates a worker or starts a
// download. A terminated worker cannot keep GPU work running after navigation.
export function createLocalModel({ onState, onProgress, workerFactory = () => new Worker('/assets/document-model-worker.js', { type: 'module' }) }) {
  let worker = null, state = 'idle', sequence = 0, generation = 0;
  const pending = new Map();
  const update = next => { state = next; onState(next); };
  function release(reason = 'model_stopped', nextState = 'idle') {
    generation++; worker?.terminate(); worker = null;
    for (const task of pending.values()) { clearTimeout(task.timer); task.reject(new Error(reason)); }
    pending.clear(); update(nextState);
  }
  function task(message, timeout, signal) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      let cancelTimer;
      const cancel = () => {
        if (!worker) return;
        worker.postMessage({ type: 'interrupt' });
        // Give an active GPU dispatch a short chance to finish. Terminate the
        // worker if it cannot acknowledge cancellation; the UI must not hang.
        cancelTimer = setTimeout(() => release('cancelled'), 1500);
      };
      const timer = setTimeout(() => release('model_timeout', 'error'), timeout);
      const finish = callback => value => { clearTimeout(timer); clearTimeout(cancelTimer); signal?.removeEventListener('abort', cancel); callback(value); };
      pending.set(id, { resolve: finish(resolve), reject: finish(reject), timer, signal });
      signal?.addEventListener('abort', cancel, { once: true });
      worker.postMessage({ ...message, id });
    });
  }
  return {
    get state() { return state; },
    async load(gpu) {
      if (worker || state === 'checking') return;
      const attempt = ++generation; update('checking');
      try {
        const adapter = await gpu?.requestAdapter({ powerPreference: 'low-power' });
        if (attempt !== generation) return;
        if (!adapter?.features.has('shader-f16')) { update('unsupported'); return; }
        worker = workerFactory();
        worker.addEventListener('message', ({ data }) => {
          const current = pending.get(data.id); if (!current) return;
          if (data.type === 'progress') { onProgress(data.progress); return; }
          pending.delete(data.id);
          if (data.type === 'error') current.reject(new Error(data.error));
          else if (data.type === 'answer') current.signal?.aborted ? current.reject(new Error('cancelled')) : current.resolve(data.answer);
          else if (data.type === 'ready') current.resolve();
        });
        worker.addEventListener('error', () => release('model_failed', 'error'));
        update('loading'); await task({ type: 'load' }, 300000);
        if (attempt === generation) update('ready');
      } catch { if (attempt === generation) release('model_failed', 'error'); }
    },
    async generate(question, lang, sources, signal) {
      if (state !== 'ready' || !worker || signal.aborted) throw new Error(signal.aborted ? 'cancelled' : 'model_unavailable');
      update('generating');
      try { return await task({ type: 'generate', question, lang, sources }, 60000, signal); }
      finally { if (worker && state === 'generating') update('ready'); }
    },
    stop() { release(); }
  };
}

// Remove only this demo's model files, preserving preferences and other caches.
export async function clearModelDownload(storage, weights, wasm) {
  for (const name of await storage.keys()) {
    const cache = await storage.open(name);
    for (const request of await cache.keys()) if (request.url.startsWith(weights) || request.url === wasm) await cache.delete(request);
  }
}
