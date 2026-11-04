/**
 * Alejandro’sTech: an original, procedurally sculpted, genuinely volumetric bust.
 * The owner approved a stylized interpretation of his reference portrait, not a
 * facial scan or an exact reconstruction. There are no photographs, billboards,
 * external meshes, learned models, accessories, or runtime dependencies here.
 * Front is +Z. Head geometry is authored around a neck pivot; eyes are children.
 */
export const BUST_RIG = Object.freeze({
  body: 0, head: 1, eyes: [2, 3], headPivot: [0, .65, 0],
  eyeCenters: [[-.19, .80, .29], [.19, .80, .29]], front: [0, 0, 1]
});

const TAU = Math.PI * 2;
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const mul = (a, s) => a.map(v => v * s);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normal = a => { const n = Math.hypot(...a); return n > 1e-12 ? mul(a, 1 / n) : [0, 1, 0]; };
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const gaussian = (x, mean, width) => Math.exp(-(((x - mean) / width) ** 2));
const lerpPoint = (a, b, t) => a.map((v, i) => mix(v, b[i], t));
const rotateY = (p, angle) => [p[0] * Math.cos(angle) + p[2] * Math.sin(angle), p[1], -p[0] * Math.sin(angle) + p[2] * Math.cos(angle)];

const materialDefinitions = [
  ['Charcoal shirt', [.050, .055, .061], .95],
  ['Collar and seams', [.083, .088, .095], .91],
  ['Graphite skin', [.29, .285, .28], .76],
  ['Skin creases', [.17, .165, .16], .87],
  ['Dark curls', [.027, .029, .032], .73],
  ['Curl highlights', [.045, .048, .052], .76],
  ['Short beard', [.065, .067, .069], .92],
  ['Beard strands', [.086, .087, .089], .94],
  ['Sculpted lips', [.18, .17, .165], .79],
  ['Eye stone', [.12, .125, .13], .54],
  ['Dark iris', [.064, .066, .069], .46],
  ['Pupil and mouth detail', [.010, .011, .012], .52],
  ['Shirt buttons', [.12, .125, .13], .66]
];
const MAT = { shirt: 0, seam: 1, skin: 2, crease: 3, hair: 4, curl: 5, beard: 6, strand: 7, lips: 8, eye: 9, iris: 10, black: 11, button: 12 };

class Mesh {
  constructor(offset = [0, 0, 0]) { this.offset = offset; this.groups = new Map(); }
  geometry(material, positions, triangles) {
    const indices = [];
    const vertexNormals = positions.map(() => [0, 0, 0]);
    const welded = new Map();
    const keyFor = p => p.map(v => Math.round(v * 1e6)).join(',');
    // A normal is shared by coincident seam vertices within this surface only.
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i], b = triangles[i + 1], c = triangles[i + 2];
      const n = cross(sub(positions[b], positions[a]), sub(positions[c], positions[a]));
      if (Math.hypot(...n) < 1e-11) continue;
      indices.push(a, b, c);
      for (const id of [a, b, c]) { const key = keyFor(positions[id]); welded.set(key, add(welded.get(key) || [0, 0, 0], n)); }
    }
    for (let i = 0; i < positions.length; i++) vertexNormals[i] = normal(welded.get(keyFor(positions[i])) || [0, 1, 0]);
    if (!this.groups.has(material)) this.groups.set(material, { positions: [], normals: [], indices: [] });
    const group = this.groups.get(material), offset = group.positions.length / 3;
    positions.forEach((p, i) => { group.positions.push(...sub(p, this.offset)); group.normals.push(...vertexNormals[i]); });
    group.indices.push(...indices.map(i => i + offset));
  }
  surface(material, fn, columns, rows, reverse = false, keep = () => true) {
    const positions = [], indices = [];
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) positions.push(fn(x / columns, y / rows));
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      if (!keep((x + .5) / columns, (y + .5) / rows)) continue;
      const a = y * (columns + 1) + x, b = a + 1, c = a + columns + 1, d = c + 1;
      indices.push(...(reverse ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
    this.geometry(material, positions, indices);
  }
}

function ellipsoid(mesh, material, center, radii, columns = 32, rows = 20, transform = p => p) {
  mesh.surface(material, (u, v) => {
    const phi = u * TAU, theta = v * Math.PI;
    return transform(add(center, [radii[0] * Math.sin(theta) * Math.cos(phi), radii[1] * Math.cos(theta), radii[2] * Math.sin(theta) * Math.sin(phi)]));
  }, columns, rows);
}

function catmull(points, t) {
  const scaled = clamp(t) * (points.length - 1), i = Math.min(points.length - 2, Math.floor(scaled)), f = scaled - i;
  const p = [points[Math.max(0, i - 1)], points[i], points[i + 1], points[Math.min(points.length - 1, i + 2)]];
  return [0, 1, 2].map(k => .5 * ((2 * p[1][k]) + (-p[0][k] + p[2][k]) * f + (2 * p[0][k] - 5 * p[1][k] + 4 * p[2][k] - p[3][k]) * f * f + (-p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k]) * f * f * f));
}

function tube(mesh, material, points, radius, steps = 20, sides = 8, flatten = 1) {
  const positions = [], indices = [];
  for (let j = 0; j <= steps; j++) {
    const t = j / steps, p = catmull(points, t);
    const tangent = normal(sub(catmull(points, Math.min(1, t + .001)), catmull(points, Math.max(0, t - .001))));
    const reference = Math.abs(tangent[2]) > .92 ? [1, 0, 0] : [0, 0, 1];
    const right = normal(cross(reference, tangent)), up = normal(cross(tangent, right));
    const r = typeof radius === 'function' ? radius(t) : radius;
    for (let i = 0; i <= sides; i++) {
      const angle = i / sides * TAU;
      positions.push(add(p, add(mul(right, Math.cos(angle) * r), mul(up, Math.sin(angle) * r * flatten))));
    }
  }
  for (let j = 0; j < steps; j++) for (let i = 0; i < sides; i++) {
    const a = j * (sides + 1) + i, b = a + 1, c = a + sides + 1, d = c + 1;
    indices.push(a, b, c, b, d, c);
  }
  const first = positions.length; positions.push(points[0], points.at(-1));
  for (let i = 0; i < sides; i++) { indices.push(first, i + 1, i); const a = steps * (sides + 1) + i; indices.push(first + 1, a, a + 1); }
  mesh.geometry(material, positions, indices);
}

function faceOffset(x, y) {
  let z = .045 * gaussian(x, 0, .25) * gaussian(y, 1.27, .28);
  z += .064 * (gaussian(x, -.255, .12) + gaussian(x, .255, .12)) * gaussian(y, 1.27, .12);
  z += .033 * (gaussian(x, -.20, .16) + gaussian(x, .20, .16)) * gaussian(y, 1.565, .055);
  z -= .034 * (gaussian(x, -.19, .10) + gaussian(x, .19, .10)) * gaussian(y, 1.45, .065);
  z += .085 * gaussian(x, 0, .045) * gaussian(y, 1.37, .19);
  z += .075 * gaussian(x, 0, .070) * gaussian(y, 1.230, .055);
  z += .045 * (gaussian(x, -.075, .039) + gaussian(x, .075, .039)) * gaussian(y, 1.207, .038);
  z += .027 * gaussian(x, 0, .18) * gaussian(y, 1.115, .075);
  z += .026 * gaussian(x, 0, .21) * gaussian(y, .91, .095);
  return z;
}
function headRadiusAtY(y) { return .465 * (1 - .10 * gaussian(y, .91, .21)); }
function faceZ(x, y) {
  const q = clamp((y - 1.36) / .625, -.9999, .9999), latitude = Math.sqrt(1 - q * q), r = headRadiusAtY(y) * latitude;
  const front = Math.sqrt(Math.max(.001, 1 - (x / Math.max(.001, r)) ** 2));
  return .352 * latitude * front + faceOffset(x, y) * front ** 4;
}

function sculptHead(head) {
  // Closed, shaped cranium/jaw with integrated cheekbones, eye sockets and nose.
  head.surface(MAT.skin, (u, v) => {
    const theta = v * Math.PI, phi = u * TAU, y = 1.36 + .625 * Math.cos(theta);
    const x = headRadiusAtY(y) * Math.sin(theta) * Math.cos(phi), front = Math.max(0, Math.sin(phi));
    const z = .352 * Math.sin(theta) * Math.sin(phi) + faceOffset(x, y) * front ** 4;
    return [x, y, z];
  }, 96, 64);
  for (const side of [-1, 1]) {
    ellipsoid(head, MAT.skin, [side * .455, 1.37, -.005], [.09, .15, .058], 28, 20);
    ellipsoid(head, MAT.crease, [side * .485, 1.375, .047], [.035, .084, .012], 20, 14);
    const helix = Array.from({ length: 15 }, (_, i) => { const a = -.8 + i / 14 * Math.PI * 1.65; return [side * (.475 + .052 * Math.cos(a)), 1.375 + .114 * Math.sin(a), .050]; });
    tube(head, MAT.skin, helix, .013, 22, 7);
    ellipsoid(head, MAT.skin, [side * .474, 1.27, .026], [.044, .054, .039], 20, 14);
    // Eyelid hoods close over the ocular spheres, leaving a sculpted almond.
    for (const upper of [true, false]) {
      head.surface(MAT.skin, (u, v) => {
        const s = u * 2 - 1, aperture = (upper ? .026 : -.019) * Math.sqrt(Math.max(0, 1 - s * s));
        const x = side * .19 + s * mix(.090, .108, v), innerY = 1.45 + aperture;
        const y = mix(innerY, 1.45 + (upper ? .085 : -.065) * Math.sqrt(Math.max(.15, 1 - s * s)), v);
        const eyeZ = .29 + .055 * Math.sqrt(Math.max(.005, 1 - (s * .090 / .082) ** 2 - (aperture / .052) ** 2)) + .003;
        return [x, y, mix(eyeZ, faceZ(x, y) + .006, v)];
      }, 24, 7, !upper);
      const lid = Array.from({ length: 19 }, (_, i) => {
        const s = i / 18 * 2 - 1, aperture = (upper ? .026 : -.019) * Math.sqrt(Math.max(0, 1 - s * s));
        return [side * .19 + s * .090, 1.45 + aperture, .29 + .055 * Math.sqrt(Math.max(.005, 1 - (s * .090 / .082) ** 2 - (aperture / .052) ** 2)) + .005];
      });
      tube(head, upper ? MAT.crease : MAT.skin, lid, upper ? .0045 : .004, 22, 6);
    }
    // Thick, gently arched brows; individual ridges keep a sculptural hair edge.
    const brow = Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = side * (.075 + t * .255), y = 1.566 + .028 * Math.sin(t * Math.PI) - .022 * t; return [x, y, faceZ(x, y) + .018]; });
    tube(head, MAT.hair, brow, t => .010 + .010 * Math.sin(Math.PI * t) ** .5, 22, 7, .6);
    for (let j = 0; j < 7; j++) { const t = .12 + j / 7 * .72, x = side * (.075 + t * .255), y = 1.566 + .028 * Math.sin(t * Math.PI) - .022 * t; tube(head, MAT.beard, [[x, y - .008, faceZ(x, y) + .028], [x + side * .015, y + .014, faceZ(x, y) + .026]], .003, 3, 5); }
    ellipsoid(head, MAT.black, [side * .055, 1.202, faceZ(side * .055, 1.202) + .004], [.020, .010, .006], 16, 10);
  }
  // Closed relaxed mouth, with modeled lips and a narrow dark opening.
  for (const [material, y, lift, radius] of [[MAT.lips, 1.127, .010, .012], [MAT.lips, 1.103, -.004, .014], [MAT.black, 1.118, .001, .0035]]) {
    const path = Array.from({ length: 17 }, (_, i) => { const t = i / 16, x = mix(-.13, .13, t), shape = Math.sin(t * Math.PI); const yy = y + lift * shape - (y > 1.12 ? .008 * gaussian(x, 0, .029) : 0); return [x, yy, faceZ(x, yy) + .016 * shape + .006]; });
    tube(head, material, path, t => Math.max(.0025, radius * Math.sin(Math.PI * t) ** .5), 24, 7, .6);
  }
  // A close beard patch follows the actual shaped facial surface, not a decal.
  const beardPoint = (u, v) => {
    const x = (u * 2 - 1) * .365, side = Math.abs(x) / .365;
    const top = 1.15 + .14 * side ** .65, bottom = .84 + .21 * side ** 3.1;
    const y = mix(top, bottom, v), ripple = .002 * Math.sin(u * 98 + v * 19) * Math.sin(v * 75);
    return [x, y, faceZ(x, y) + .014 + .012 * Math.sin(v * Math.PI) + ripple];
  };
  head.surface(MAT.beard, beardPoint, 64, 28, true, (u, v) => { const [x, y] = beardPoint(u, v); return (x / .152) ** 2 + ((y - 1.119) / .046) ** 2 > 1; });
  for (const side of [-1, 1]) {
    const mustache = Array.from({ length: 13 }, (_, i) => { const t = i / 12, x = side * (.017 + .134 * t), y = 1.183 - .037 * t; return [x, y, faceZ(x, y) + .028]; });
    tube(head, MAT.beard, mustache, t => .012 + .007 * Math.sin(t * Math.PI), 18, 7, .55);
  }
  let randomState = 8493;
  const random = () => { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return randomState / 4294967296; };
  for (let i = 0; i < 90; i++) {
    const u = .03 + random() * .94, v = .12 + random() * .76, p = beardPoint(u, v);
    if ((p[0] / .17) ** 2 + ((p[1] - 1.12) / .06) ** 2 < 1.15) continue;
    tube(head, i % 4 ? MAT.beard : MAT.strand, [add(p, [0, .011, .006]), add(p, [.003, -.007, .010]), add(p, [.002, -.025, .007])], .0035 + random() * .002, 4, 5);
  }
  // A full cap is covered with individually modeled, non-spherical curls.
  const scalpPoint = (theta, phi, lift = 0) => {
    const wave = .006 * Math.sin(phi * 7 + theta * 13) * Math.sin(theta * 6);
    return [( .482 + wave + lift) * Math.sin(theta) * Math.cos(phi), 1.36 + (.646 + wave + lift) * Math.cos(theta), (.371 + wave + lift) * Math.sin(theta) * Math.sin(phi)];
  };
  const cutoff = phi => 1.45 - .29 * Math.max(0, Math.sin(phi)) + .14 * Math.max(0, -Math.sin(phi));
  head.surface(MAT.hair, (u, v) => { const phi = u * TAU; return scalpPoint(v * cutoff(phi), phi); }, 64, 30);
  const curls = 264;
  for (let i = 0; i < curls; i++) {
    const phi = i * 2.399963229728653 + random() * .35;
    const theta = Math.acos(1 - ((i + .5) / curls) * (1 - Math.cos(cutoff(phi)))) + (random() - .5) * .10;
    const p = scalpPoint(theta, phi, .007), n = normal([p[0] / .482 ** 2, (p[1] - 1.36) / .646 ** 2, p[2] / .371 ** 2]);
    const baseTangent = normal([-Math.sin(phi), 0, Math.cos(phi)]), baseAcross = normal(cross(n, baseTangent));
    const turn = random() * TAU, tangent = add(mul(baseTangent, Math.cos(turn)), mul(baseAcross, Math.sin(turn))), across = normal(cross(n, tangent));
    const radius = .022 + random() * .031, loops = .32 + random() * .60, phase = random() * TAU;
    const lift = .008 + random() * .022, arch = .010 + random() * .024, shape = .55 + random() * .50;
    const strand = Array.from({ length: 12 }, (_, j) => {
      const t = j / 11, a = phase + t * TAU * loops, r = radius * (.75 + .30 * Math.sin(t * Math.PI * shape));
      return add(p, add(add(mul(tangent, Math.cos(a) * r), mul(across, Math.sin(a) * r * shape)), mul(n, lift + Math.sin(t * Math.PI) * arch)));
    });
    tube(head, i % 7 ? MAT.hair : MAT.curl, strand, t => (.0055 + radius * .105) * (.45 + .55 * Math.sin(Math.PI * t) ** .7), 11, 5);
  }
}

const torsoWidth = y => .72 + .21 * gaussian(y, -.2, .9) - .55 * gaussian(y, .67, .19);
const torsoDepth = y => .245 + .115 * gaussian(y, -.05, .85) - .055 * gaussian(y, .67, .18);
function shirtZ(x, y) { return torsoDepth(y) * Math.sqrt(Math.max(.01, 1 - (x / torsoWidth(y)) ** 2)) + .010 * Math.sin(x * 20 + y * 7) * gaussian(y, -.45, .8); }

function sculptBody(body) {
  body.surface(MAT.shirt, (u, v) => {
    const y = mix(.65, -1.5, v), phi = u * TAU, x = torsoWidth(y) * Math.cos(phi);
    const fold = .009 * Math.sin(phi * 9 + y * 8) * Math.sin(phi * 3 - y * 11);
    return [x * (1 + fold), y, torsoDepth(y) * Math.sin(phi) + fold + .010 * Math.sin(x * 20 + y * 7) * gaussian(y, -.45, .8) * Math.max(0, Math.sin(phi))];
  }, 64, 42);
  // Close the shirt base and neck opening with small radial discs.
  for (const [y, reverse] of [[-1.5, true], [.65, false]]) body.surface(MAT.shirt, (u, v) => [Math.cos(u * TAU) * torsoWidth(y) * v, y, Math.sin(u * TAU) * torsoDepth(y) * v], 40, 4, reverse);
  ellipsoid(body, MAT.skin, [0, .66, -.015], [.205, .26, .19], 36, 24);
  for (const side of [-1, 1]) {
    const armPath = [[side * .78, .33, 0], [side * .94, -.06, .015], [side * 1.04, -.47, .055], [side * 1.02, -.71, .15], [side * 1.17, -.48, .32], [side * 1.28, -.22, .47]];
    tube(body, MAT.shirt, armPath, t => mix(.225, .118, t) + .012 * Math.sin(t * Math.PI * 9) * Math.sin(t * Math.PI), 40, 18, .94);
    const cuff = [armPath.at(-1), [side * 1.29, -.165, .484]];
    tube(body, MAT.seam, cuff, .122, 4, 18, .9);
    // Folded collar surfaces are actual shaped fabric, not a photograph.
    body.surface(MAT.seam, (u, v) => {
      const x = side * ((.045 + .25 * u) * (1 - .80 * v) + .125 * v);
      return [x, .615 - .07 * u - .335 * v, .215 + .11 * u + .13 * v + .025 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI)];
    }, 12, 12, side > 0);
    const seam = Array.from({ length: 14 }, (_, i) => { const t = i / 13, x = side * mix(.28, .70, t), y = .40 - t * .12; return [x, y, shirtZ(x, y) + .012]; });
    tube(body, MAT.seam, seam, .006, 18, 5);
    const transform = p => {
      const angle = -.10, x = p[0] * Math.cos(angle) - p[1] * Math.sin(angle), y = p[0] * Math.sin(angle) + p[1] * Math.cos(angle);
      const turned = rotateY([side * x, y, p[2]], side * .18);
      return add([side * 1.30, -.015, .49], turned);
    };
    ellipsoid(body, MAT.skin, [0, 0, 0], [.132, .183, .063], 28, 22, transform);
    for (let finger = 0; finger < 4; finger++) {
      const x = -.092 + finger * .061, length = [.235, .315, .292, .220][finger], splay = (finger - 1.5) * .018;
      const points = [[x, .112, .008], [x + splay * .3, .17 + length * .28, .014], [x + splay * .75, .13 + length * .72, .045], [x + splay, .12 + length, .079]].map(transform);
      tube(body, MAT.skin, points, t => mix(.032, .021, t) * (1 + .07 * Math.cos(t * Math.PI * 4)), 17, 8, .92);
      // Palmar joint folds, kept subtle in the same sculptural material family.
      for (const t of [.42, .72]) {
        const p = catmull([[x, .112, .008], [x + splay * .3, .17 + length * .28, .014], [x + splay * .75, .13 + length * .72, .045], [x + splay, .12 + length, .079]], t);
        tube(body, MAT.crease, [transform(add(p, [-.019, 0, .026])), transform(add(p, [0, -.003, .030])), transform(add(p, [.019, 0, .026]))], .0024, 5, 5);
      }
    }
    tube(body, MAT.skin, [[-.105, -.058, .005], [-.17, .005, .046], [-.235, .07, .088], [-.255, .135, .11]].map(transform), t => mix(.043, .025, t), 18, 9);
    const palmCrease = [[-.093, .008, .055], [-.045, -.04, .066], [.02, -.065, .065], [.08, -.025, .052]].map(transform);
    tube(body, MAT.crease, palmCrease, .0027, 12, 5);
  }
  // A raised placket and small plain buttons identify a shirt without accessories.
  body.surface(MAT.seam, (u, v) => { const y = mix(.35, -1.49, v), x = (u - .5) * .045; return [x, y, shirtZ(x, y) + .008]; }, 4, 32, true);
  for (const y of [.11, -.26, -.64, -1.02, -1.36]) ellipsoid(body, MAT.button, [0, y, shirtZ(0, y) + .019], [.021, .021, .009], 16, 10);
}

function sculptEye(eye) {
  ellipsoid(eye, MAT.eye, [0, 0, 0], [.082, .052, .055], 32, 22);
  for (const [material, radius, lift] of [[MAT.iris, .031, .0015], [MAT.black, .014, .0028]]) {
    eye.surface(material, (u, v) => {
      const x = Math.cos(u * TAU) * radius * v, y = Math.sin(u * TAU) * radius * v;
      return [x, y, .055 * Math.sqrt(Math.max(.01, 1 - (x / .082) ** 2 - (y / .052) ** 2)) + lift];
    }, 28, 7, true);
  }
}

function packGLB(meshes) {
  const chunks = [], bufferViews = [], accessors = [], gltfMeshes = [];
  let byteOffset = 0;
  const append = (typed, target) => {
    if (byteOffset % 4) { const padding = 4 - byteOffset % 4; chunks.push(Buffer.alloc(padding)); byteOffset += padding; }
    const data = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength), index = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: data.length, target }); chunks.push(data); byteOffset += data.length; return index;
  };
  const bounds = values => {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < values.length; i++) { min[i % 3] = Math.min(min[i % 3], values[i]); max[i % 3] = Math.max(max[i % 3], values[i]); }
    return { min, max };
  };
  for (const [meshIndex, mesh] of meshes.entries()) {
    const primitives = [];
    for (const [material, group] of mesh.groups) {
      const positions = new Float32Array(group.positions), normals = new Float32Array(group.normals);
      const shortIndices = positions.length / 3 < 65536;
      const indices = shortIndices ? new Uint16Array(group.indices) : new Uint32Array(group.indices);
      const position = accessors.length; accessors.push({ bufferView: append(positions, 34962), componentType: 5126, count: positions.length / 3, type: 'VEC3', ...bounds(positions) });
      const normalAccessor = accessors.length; accessors.push({ bufferView: append(normals, 34962), componentType: 5126, count: normals.length / 3, type: 'VEC3' });
      const index = accessors.length; accessors.push({ bufferView: append(indices, 34963), componentType: shortIndices ? 5123 : 5125, count: indices.length, type: 'SCALAR' });
      primitives.push({ attributes: { POSITION: position, NORMAL: normalAccessor }, indices: index, material, mode: 4 });
    }
    gltfMeshes.push({ name: ['Shirted body and relaxed open hands', 'Sculpted head curls and beard', 'Gaze eye'][meshIndex], primitives });
  }
  const doc = {
    asset: { version: '2.0', generator: 'Alejandro’sTech deterministic stylized bust sculptor', copyright: 'Sergio Alejandro Hernández Patiño' },
    scene: 0, scenes: [{ name: 'Sergio · stylized graphite bust', nodes: [0, 1] }],
    nodes: [{ name: 'Body', mesh: 0 }, { name: 'Head', mesh: 1, translation: BUST_RIG.headPivot, children: BUST_RIG.eyes }, { name: 'Eye.Left', mesh: 2, translation: BUST_RIG.eyeCenters[0] }, { name: 'Eye.Right', mesh: 2, translation: BUST_RIG.eyeCenters[1] }],
    meshes: gltfMeshes,
    materials: materialDefinitions.map(([name, color, roughness]) => ({ name, pbrMetallicRoughness: { baseColorFactor: [...color, 1], metallicFactor: .015, roughnessFactor: roughness }, doubleSided: false })),
    buffers: [{ byteLength: byteOffset }], bufferViews, accessors,
    extras: { representation: 'Original stylized volumetric approximation, not a biometric scan or exact likeness', reference: 'Owner-approved public portrait of Sergio Hernández', style: 'Graphite sculpture, curly hair and short beard, plain shirt, relaxed open hands, no accessories', coordinates: '+Y up, +Z front', rig: BUST_RIG }
  };
  const jsonBytes = Buffer.from(JSON.stringify(doc)), json = Buffer.alloc(Math.ceil(jsonBytes.length / 4) * 4, 32); jsonBytes.copy(json);
  const binary = Buffer.concat(chunks), bin = Buffer.alloc(Math.ceil(binary.length / 4) * 4); binary.copy(bin);
  const header = Buffer.alloc(20), binHeader = Buffer.alloc(8), length = 12 + 8 + json.length + 8 + bin.length;
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(length, 8); header.writeUInt32LE(json.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
  binHeader.writeUInt32LE(bin.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, json, binHeader, bin]);
}

export function createBustGLB() {
  const body = new Mesh(), head = new Mesh(BUST_RIG.headPivot), eye = new Mesh();
  sculptBody(body); sculptHead(head); sculptEye(eye);
  return packGLB([body, head, eye]);
}
