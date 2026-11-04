import assert from 'node:assert/strict';
import { parseBust } from '../src/client/bust-glb.js';
import { createBustGLB } from '../src/model/stylized-bust.mjs';

const authored = createBustGLB();
assert.ok(authored instanceof Uint8Array, 'The authoring module returns binary GLB data');
// Buffer.slice aliases storage; own Uint8Arrays keep every malformed-asset case isolated.
const bytes = Uint8Array.from(authored), repeated = Uint8Array.from(createBustGLB());
assert.ok(bytes.length > 10000 && bytes.length < 2000000, 'The complete 3D bust stays within its binary budget');
assert.deepEqual(bytes, repeated, 'The authored model is deterministic');
const bust = parseBust(bytes);
assert.match(bust.metadata.extras.representation, /stylized volumetric approximation.*not.*scan/i, 'The model identifies its approximation boundary');
assert.equal(bust.nodes[0].name, 'Body'); assert.equal(bust.nodes[0].mesh, 0);
assert.equal(bust.nodes[1].name, 'Head'); assert.equal(bust.nodes[1].mesh, 1);
assert.deepEqual(bust.nodes[1].translation, [0, .65, 0]);
assert.deepEqual(bust.nodes[1].children, [2, 3]);
assert.equal(bust.nodes[2].name, 'Eye.Left'); assert.equal(bust.nodes[3].name, 'Eye.Right');
assert.equal(bust.nodes[2].mesh, bust.nodes[3].mesh, 'Both independently articulated eyes reuse their own mesh');
assert.ok(bust.nodes[2].translation[0] < 0 && bust.nodes[3].translation[0] > 0);
assert.deepEqual(bust.roots, [0, 1]);

function geometryBounds(mesh) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const primitive of mesh.primitives) for (let i = 0; i < primitive.positions.length; i++) {
    min[i % 3] = Math.min(min[i % 3], primitive.positions[i]); max[i % 3] = Math.max(max[i % 3], primitive.positions[i]);
  }
  return max.map((value, axis) => value - min[axis]);
}
const headSize = geometryBounds(bust.meshes[1]), bodySize = geometryBounds(bust.meshes[0]);
assert.ok(headSize[0] > .8 && headSize[1] > .9 && headSize[2] > .5, 'Head has real width, height and skull depth');
assert.ok(bodySize[0] > 1.8 && bodySize[1] > 1.3 && bodySize[2] > .35, 'Clothed body, arms and hands are volumetric');
let vertexCount = 0, triangleCount = 0, backwards = 0, measured = 0, degenerate = 0;
for (const mesh of bust.meshes) for (const { positions: p, normals: n, indices } of mesh.primitives) {
  vertexCount += p.length / 3; triangleCount += indices.length / 3;
  for (let i = 0; i < n.length; i += 3) assert.ok(Math.abs(Math.hypot(n[i], n[i + 1], n[i + 2]) - 1) < .025, 'Authored normals are normalized');
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const u = [p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]], v = [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]];
    const face = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...face);
    if (length < 1e-11) { degenerate++; continue; }
    const normal = [n[a] + n[b] + n[c], n[a + 1] + n[b + 1] + n[c + 1], n[a + 2] + n[b + 2] + n[c + 2]];
    if (face.reduce((sum, value, axis) => sum + value * normal[axis], 0) < -length * .01) backwards++;
    measured++;
  }
}
assert.ok(vertexCount <= 60000 && triangleCount <= 100000, 'Vertex and triangle budgets');
assert.ok(degenerate / triangleCount < .04, 'No broad degenerate surfaces');
assert.ok(backwards / measured < .02, `Triangle winding agrees with outward normals (${backwards}/${measured})`);

const raw = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), view = new DataView(raw), jsonLength = view.getUint32(12, true);
const json = JSON.parse(new TextDecoder().decode(new Uint8Array(raw, 20, jsonLength)));
const binaryOffset = 20 + jsonLength + 8, binary = new Uint8Array(raw, binaryOffset);
function rewriteJSON(change) {
  const altered = JSON.parse(JSON.stringify(json)); change(altered);
  const encoded = new TextEncoder().encode(JSON.stringify(altered)), padded = Math.ceil(encoded.length / 4) * 4;
  const result = new Uint8Array(12 + 8 + padded + 8 + binary.length), out = new DataView(result.buffer);
  out.setUint32(0, 0x46546c67, true); out.setUint32(4, 2, true); out.setUint32(8, result.length, true);
  out.setUint32(12, padded, true); out.setUint32(16, 0x4e4f534a, true); result.fill(32, 20, 20 + padded); result.set(encoded, 20);
  out.setUint32(20 + padded, binary.length, true); out.setUint32(24 + padded, 0x004e4942, true); result.set(binary, 28 + padded);
  return result;
}
const reject = value => assert.throws(() => parseBust(value), /Invalid bust GLB:/);
const badMagic = bytes.slice(); new DataView(badMagic.buffer, badMagic.byteOffset, badMagic.byteLength).setUint32(0, 0, true); reject(badMagic);
const badVersion = bytes.slice(); new DataView(badVersion.buffer, badVersion.byteOffset, badVersion.byteLength).setUint32(4, 1, true); reject(badVersion);
reject(bytes.slice(0, -1)); reject(new Uint8Array(2000001));
reject(rewriteJSON(data => { data.buffers[0].uri = 'https://example.invalid/private'; }));
reject(rewriteJSON(data => { data.bufferViews[0].byteStride = 12; }));
reject(rewriteJSON(data => { data.accessors[0].sparse = {}; }));
reject(rewriteJSON(data => { data.accessors[0].byteOffset = data.bufferViews[data.accessors[0].bufferView].byteLength; }));
reject(rewriteJSON(data => { data.nodes[1].children = [1]; }));
reject(rewriteJSON(data => { data.animations = [{}]; }));
reject(rewriteJSON(data => { data.textures = [{}]; }));
reject(rewriteJSON(data => { data.meshes[0].primitives[0].mode = 1; }));
const nonFinite = bytes.slice(), position = json.accessors[json.meshes[0].primitives[0].attributes.POSITION], positionView = json.bufferViews[position.bufferView];
new DataView(nonFinite.buffer, nonFinite.byteOffset, nonFinite.byteLength).setFloat32(binaryOffset + (positionView.byteOffset ?? 0) + (position.byteOffset ?? 0), NaN, true); reject(nonFinite);
const outOfRange = bytes.slice(), primitive = json.meshes[0].primitives[0], index = json.accessors[primitive.indices], indexView = json.bufferViews[index.bufferView];
const indexOffset = binaryOffset + (indexView.byteOffset ?? 0) + (index.byteOffset ?? 0), vertexAmount = json.accessors[primitive.attributes.POSITION].count;
new DataView(outOfRange.buffer, outOfRange.byteOffset, outOfRange.byteLength)[index.componentType === 5123 ? 'setUint16' : 'setUint32'](indexOffset, vertexAmount, true); reject(outOfRange);
console.log(JSON.stringify({ bustChecks: ['deterministic GLB2', 'volumetric head and clothed body', 'head/eye rig', 'normal and triangle winding', 'geometry budget', 'malformed asset rejection', 'no external model resources'], bytes: bytes.length, vertices: vertexCount, triangles: triangleCount }));
