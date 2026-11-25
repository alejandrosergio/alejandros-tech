import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { routeGroups } from '../src/content/routes.mjs';
import { site } from '../src/content/site.mjs';

// Read dimensions from the delivered assets, so stale editorial metadata fails a check.
function imageInfo(buffer) {
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    assert.equal(buffer.toString('ascii', 12, 16), 'VP8X', 'The portrait uses an extended WebP header');
    return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1, type: 'image/webp' };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buffer.length) {
      assert.equal(buffer[offset], 0xff, 'Valid JPEG marker');
      const marker = buffer[offset + 1], length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5), type: 'image/jpeg' };
      assert.ok(length >= 2, 'Valid JPEG segment length');
      offset += 2 + length;
    }
  }
  const svg = buffer.toString('utf8').match(/<svg\b([^>]+)>/);
  if (svg) {
    const viewBox = svg[1].match(/\bviewBox="([^"]+)"/)?.[1].split(/[\s,]+/).map(Number);
    assert.ok(viewBox?.length === 4, 'SVG previews declare a viewBox');
    return { width: viewBox[2], height: viewBox[3], type: 'image/svg+xml' };
  }
  throw new Error('Add a dimension reader before introducing a new social image format');
}

const images = new Map();
for (const route of routeGroups) for (const lang of ['es', 'en']) {
  const pathname = route.paths[lang];
  const html = await readFile(new URL(`../dist${pathname}index.html`, import.meta.url), 'utf8');
  const meta = name => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)">`))?.[1];
  const imageURL = new URL(meta('og:image'));
  assert.equal(imageURL.origin, site.origin, 'Social previews stay on this Site');
  if (!images.has(imageURL.pathname)) images.set(imageURL.pathname, imageInfo(await readFile(new URL(`../dist${imageURL.pathname}`, import.meta.url))));
  const image = images.get(imageURL.pathname);
  assert.equal(Number(meta('og:image:width')), image.width, `Actual preview width: ${pathname}`);
  assert.equal(Number(meta('og:image:height')), image.height, `Actual preview height: ${pathname}`);
  assert.equal(meta('og:image:type'), image.type, `Actual preview MIME type: ${pathname}`);
  assert.equal(meta('twitter:card'), image.type !== 'image/svg+xml' && image.width > image.height ? 'summary_large_image' : 'summary');

  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1])['@graph'];
  const nodeIDs = new Set(graph.map(node => node['@id']));
  assert.equal(nodeIDs.size, graph.length, `Unique structured identities: ${pathname}`);
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value['@id']) assert.ok(nodeIDs.has(value['@id']), `Resolved structured reference: ${value['@id']}`);
    Object.values(value).forEach(visit);
  }
  graph.forEach(visit);
  const page = graph.find(node => ['ProfilePage', 'WebPage'].includes(node['@type']));
  assert.equal(page.primaryImageOfPage.width, image.width);
  assert.equal(page.primaryImageOfPage.height, image.height);
  if (route.type === 'note') {
    assert.equal(meta('article:published_time'), route.entity.date, 'The original publication date stays unchanged');
    assert.ok(html.includes(`<time datetime="${route.entity.date}">`), 'The article date is also visible');
    assert.ok(nodeIDs.has(meta('article:author')), 'The article author resolves to the owner');
  } else assert.equal(meta('article:published_time'), undefined, 'Only technical notes have article publication metadata');
}
console.log(JSON.stringify({ seo: true, pages: routeGroups.length * 2, assets: images.size, checks: ['actual social-image dimensions and formats', 'resolved structured references', 'visible article provenance'] }));
