// Pinned upstream weights. The small runtime is served locally; the large model
// is fetched by WebLLM only after the visitor's explicit download action.
export const localModel = {
  id: 'Qwen3.5-0.8B-q4f16_1-MLC',
  name: 'Qwen3.5 · 0.8B',
  revision: '0ec138972555613c1d7812a821778ad0398c8790',
  weights: 'https://huggingface.co/mlc-ai/Qwen3.5-0.8B-q4f16_1-MLC/resolve/0ec138972555613c1d7812a821778ad0398c8790/',
  wasm: '/assets/models/qwen35-08b-webgpu.wasm',
  wasmSHA256: '39623bb05581e04616debfd762b8ea0d0f2d641b3afa8ac1df902aac0dfdb04e',
  wasmSource: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/146ed9cd4b4062e967b017fd2291f7106b50599f/web-llm-models/v0_2_87/base/Qwen3.5-0.8B-q4f16_1_cs1k-webgpu.wasm'
};
