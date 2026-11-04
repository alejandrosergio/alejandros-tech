// Deliberately small GLB 2 reader for the site's own static, rigidly articulated bust.
// It never resolves URLs, loads extensions, or evaluates model metadata.
const MAX_BYTES = 2000000;
const fail = message => { throw new Error(`Invalid bust GLB: ${message}`); };
const integer = (value, min = 0) => Number.isSafeInteger(value) && value >= min;
const record = (value, name) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(name);
  return value;
};
const list = (value, name, min = 0) => {
  if (!Array.isArray(value) || value.length < min || value.length > 256) fail(name);
  return value;
};
const vector = (value, size, fallback, name) => {
  if (value === undefined) return [...fallback];
  if (!Array.isArray(value) || value.length !== size || !value.every(Number.isFinite)) fail(name);
  return [...value];
};

export function parseBust(input) {
  let buffer;
  if (input instanceof ArrayBuffer) buffer = input;
  else if (ArrayBuffer.isView(input)) {
    if (input.byteLength < 28 || input.byteLength > MAX_BYTES) fail('file size');
    buffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  }
  else fail('expected binary data');
  if (buffer.byteLength < 28 || buffer.byteLength > MAX_BYTES) fail('file size');
  const header = new DataView(buffer);
  if (header.getUint32(0, true) !== 0x46546c67 || header.getUint32(4, true) !== 2 || header.getUint32(8, true) !== buffer.byteLength) fail('header');
  let offset = 12, json, binary;
  while (offset < buffer.byteLength) {
    if (offset + 8 > buffer.byteLength) fail('truncated chunk');
    const length = header.getUint32(offset, true), type = header.getUint32(offset + 4, true);
    offset += 8;
    if (length % 4 || offset + length > buffer.byteLength) fail('chunk bounds');
    if (type === 0x4e4f534a && json === undefined && binary === undefined) {
      try { json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(buffer, offset, length))); }
      catch { fail('JSON chunk'); }
    } else if (type === 0x004e4942 && json !== undefined && binary === undefined) binary = { offset, length };
    else fail('unsupported chunk');
    offset += length;
  }
  if (!json || !binary || json.asset?.version !== '2.0') fail('asset version or missing chunks');
  record(json, 'asset object');
  if (json.extensionsRequired?.length || json.extensionsUsed?.length) fail('extensions');
  for (const name of ['animations', 'skins', 'textures', 'images', 'samplers', 'cameras']) if (json[name]?.length) fail(`unsupported ${name}`);
  const buffers = list(json.buffers, 'buffers', 1);
  record(buffers[0], 'embedded buffer');
  if (buffers.length !== 1 || buffers[0].uri !== undefined || !integer(buffers[0].byteLength, 1) || buffers[0].byteLength > binary.length || binary.length - buffers[0].byteLength > 3) fail('embedded buffer');
  const views = list(json.bufferViews, 'buffer views', 1), accessors = list(json.accessors, 'accessors', 1);
  for (const view of views) {
    record(view, 'buffer view');
    const start = view.byteOffset ?? 0;
    if (view.buffer !== 0 || view.byteStride !== undefined || !integer(start) || !integer(view.byteLength, 1) || start + view.byteLength > buffers[0].byteLength) fail('buffer view bounds or stride');
  }
  const reference = (array, index, name) => {
    if (!integer(index) || index >= array.length) fail(name);
    return array[index];
  };
  function readAccessor(index, type, components) {
    const accessor = record(reference(accessors, index, 'accessor index'), 'accessor');
    if (accessor.sparse !== undefined || accessor.normalized === true || accessor.type !== type || !components.includes(accessor.componentType) || !integer(accessor.count, 1) || accessor.count > 300000) fail('accessor layout');
    const view = reference(views, accessor.bufferView, 'accessor buffer view'), localOffset = accessor.byteOffset ?? 0;
    const componentBytes = accessor.componentType === 5123 ? 2 : 4, width = type === 'VEC3' ? 3 : 1;
    const length = accessor.count * width, byteLength = length * componentBytes;
    const absolute = binary.offset + (view.byteOffset ?? 0) + localOffset;
    if (!integer(localOffset) || absolute % componentBytes || localOffset + byteLength > view.byteLength) fail('accessor bounds or alignment');
    const ArrayType = accessor.componentType === 5126 ? Float32Array : accessor.componentType === 5123 ? Uint16Array : Uint32Array;
    const data = new ArrayType(buffer, absolute, length);
    if (accessor.componentType === 5126) for (const value of data) if (!Number.isFinite(value)) fail('non-finite geometry');
    return data;
  }
  const materials = list(json.materials, 'materials', 1).map(material => {
    record(material, 'material');
    const pbr = record(material.pbrMetallicRoughness ?? {}, 'material PBR');
    if (material.normalTexture || material.occlusionTexture || material.emissiveTexture || pbr.baseColorTexture || pbr.metallicRoughnessTexture || material.alphaMode && material.alphaMode !== 'OPAQUE') fail('textured or transparent material');
    const color = vector(pbr.baseColorFactor, 4, [1, 1, 1, 1], 'material color');
    const roughness = pbr.roughnessFactor ?? 1, metallic = pbr.metallicFactor ?? 1;
    if (color.some(value => value < 0 || value > 1) || !Number.isFinite(roughness) || roughness < 0 || roughness > 1 || !Number.isFinite(metallic) || metallic < 0 || metallic > 1) fail('material factors');
    return { color, roughness, metallic, doubleSided: material.doubleSided === true };
  });
  let vertices = 0, triangles = 0;
  const meshes = list(json.meshes, 'meshes', 1).map(mesh => ({
    primitives: list(record(mesh, 'mesh').primitives, 'mesh primitives', 1).map(primitive => {
      record(primitive, 'primitive');
      if ((primitive.mode ?? 4) !== 4 || primitive.targets?.length) fail('triangle primitive');
      const attributes = primitive.attributes;
      if (!attributes || Object.keys(attributes).some(key => !['POSITION', 'NORMAL'].includes(key))) fail('attributes');
      const positions = readAccessor(attributes.POSITION, 'VEC3', [5126]);
      const normals = readAccessor(attributes.NORMAL, 'VEC3', [5126]);
      const indices = readAccessor(primitive.indices, 'SCALAR', [5123, 5125]);
      const count = positions.length / 3;
      if (normals.length !== positions.length || indices.length % 3) fail('triangle or normal counts');
      for (const index of indices) if (index >= count) fail('triangle index bounds');
      for (let i = 0; i < normals.length; i += 3) if (Math.hypot(normals[i], normals[i + 1], normals[i + 2]) < .00001) fail('zero normal');
      reference(materials, primitive.material, 'material index');
      vertices += count; triangles += indices.length / 3;
      if (vertices > 60000 || triangles > 100000) fail('geometry budget');
      return { positions, normals, indices, materialIndex: primitive.material };
    })
  }));
  const rawNodes = list(json.nodes, 'nodes', 1);
  const nodes = rawNodes.map(node => {
    record(node, 'node');
    if (node.matrix !== undefined || node.skin !== undefined || node.camera !== undefined) fail('node transforms');
    if (node.mesh !== undefined) reference(meshes, node.mesh, 'node mesh');
    const translation = vector(node.translation, 3, [0, 0, 0], 'node translation');
    const rotation = vector(node.rotation, 4, [0, 0, 0, 1], 'node rotation');
    const scale = vector(node.scale, 3, [1, 1, 1], 'node scale');
    if (Math.abs(Math.hypot(...rotation) - 1) > .001 || scale.some(value => value <= 0)) fail('node rotation or scale');
    const children = node.children === undefined ? [] : [...list(node.children, 'node children')];
    children.forEach(index => reference(rawNodes, index, 'child node index'));
    return { name: typeof node.name === 'string' ? node.name : '', translation, rotation, scale, mesh: node.mesh, children, extras: node.extras ?? null };
  });
  const scenes = list(json.scenes, 'scenes', 1);
  if (scenes.length !== 1 || (json.scene ?? 0) !== 0) fail('single scene');
  const roots = [...list(record(scenes[0], 'scene').nodes, 'scene roots', 1)], visited = new Set(), parents = new Set();
  function visit(index, ancestry) {
    reference(nodes, index, 'scene node index');
    if (ancestry.has(index) || parents.has(index)) fail('cyclic or shared node hierarchy');
    parents.add(index); visited.add(index);
    const next = new Set(ancestry); next.add(index);
    nodes[index].children.forEach(child => visit(child, next));
  }
  roots.forEach(index => visit(index, new Set()));
  if (visited.size !== nodes.length) fail('unreachable node');
  return { nodes, roots, meshes, materials, metadata: { asset: json.asset, extras: json.extras ?? null } };
}
