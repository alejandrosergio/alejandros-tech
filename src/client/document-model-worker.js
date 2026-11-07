import { MLCEngine } from '@mlc-ai/web-llm';
import { localModelRequest } from './assistant-core.js';
import { localModel } from '../content/local-model.mjs';

let engine, activeQuery = null;
const send = (type, id, value = {}) => self.postMessage({ type, id, ...value });
self.addEventListener('message', async ({ data }) => {
  const { type, id } = data;
  if (type === 'interrupt') { engine?.interruptGenerate(); return; }
  if (type === 'load') {
    try {
      engine = new MLCEngine({
        logLevel: 'ERROR',
        appConfig: { cacheBackend: 'cache', model_list: [{ model_id: localModel.id, model: localModel.weights, model_lib: new URL(localModel.wasm, self.location.origin).href, low_resource_required: true, overrides: { context_window_size: 4096, max_history_size: 1, conv_config: { stop_token_ids: [248046, 248044] } } }] },
        initProgressCallback: progress => send('progress', id, { progress: Math.max(0, Math.min(1, Number(progress.progress) || 0)) })
      });
      await engine.reload(localModel.id);
      send('ready', id);
    } catch (failure) {
      const detail = String(failure.message).toLowerCase();
      const error = /fetch|network|download/.test(detail) ? 'model_download_failed' : /gpu|buffer|device|shader|memory/.test(detail) ? 'model_gpu_failed' : 'model_failed';
      send('error', id, { error });
    }
    return;
  }
  if (type === 'generate') {
    if (!engine || activeQuery) { send('error', id, { error: 'model_busy' }); return; }
    activeQuery = id;
    try {
      await engine.resetChat();
      const result = await engine.chat.completions.create(localModelRequest(data.question, data.lang, data.sources));
      const content = result.choices?.[0]?.message?.content;
      if (typeof content !== 'string') throw new Error('invalid_sources');
      send('answer', id, { answer: { text: content, finishReason: result.choices[0].finish_reason } });
    } catch { send('error', id, { error: 'invalid_sources' }); }
    finally { activeQuery = null; }
  }
});
