import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { codeBreakdown, projectCodeReports } from './project-code.mjs';
import { root } from './build.mjs';
import { projects, projectPath } from '../src/content/projects.mjs';
import { professionalWork } from '../src/content/professional-work.mjs';
import { technologyCatalog, projectTechnologies, projectTechnologyCopy } from '../src/content/project-technologies.mjs';

// Rounding must preserve a complete 100%, even with ties and tiny languages.
for (const sizes of [[1, 1, 1], [1, 99999, 7], [3, 7, 11]]) {
  const report = codeBreakdown(['a.js', 'b.css', 'c.cs'].map((path, i) => ({ path, bytes: sizes[i] })));
  assert.equal(report.languages.reduce((sum, item) => sum + Math.round(item.percentage * 10), 0), 1000);
}
assert.equal(codeBreakdown([{ path: 'model.wasm', bytes: 9000000 }, { path: 'data.json', bytes: 5000 }, { path: 'app.js', bytes: 10 }]).totalBytes, 10);
assert.throws(() => codeBreakdown([{ path: 'app.js', bytes: -1 }]));
const reports = await projectCodeReports(root);
assert.deepEqual(JSON.parse(await readFile(new URL('../dist/assets/project-code.json', import.meta.url), 'utf8')), reports, 'Code percentages match current sources');
assert.equal(reports.cv.fileCount, 5);
assert.equal(reports.cv.totalBytes, 85546);
for (const project of [...projects, ...professionalWork]) {
  const ids = projectTechnologies[project.id];
  assert.ok(ids.length && new Set(ids).size === ids.length);
  for (const id of ids) assert.ok(technologyCatalog[id]?.es && technologyCatalog[id]?.en);
}
for (const lang of ['es', 'en']) {
  const home = await readFile(new URL(`../dist/${lang === 'en' ? 'en/' : ''}index.html`, import.meta.url), 'utf8');
  assert.equal((home.match(/class="project-code-bar"/g) || []).length, 4);
  assert.equal((home.match(/class="project-code-unavailable"/g) || []).length, 4);
  for (const project of projects) {
    const html = await readFile(new URL(`../dist${projectPath(project, lang)}index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes('id="project-technologies"'));
    if (reports[project.id]) {
      assert.ok(html.includes(projectTechnologyCopy[lang].explanation));
      assert.ok(html.includes('role="img" aria-label='));
    } else {
      assert.ok(html.includes(projectTechnologyCopy[lang].unavailable));
      assert.ok(!html.includes('class="project-code-bar"'), 'No invented distribution without project sources');
    }
    for (const id of projectTechnologies[project.id]) assert.ok(html.includes(technologyCatalog[id][lang]));
  }
}
console.log(JSON.stringify({ projectTechnologies: true, publicCases: projects.length, professionalInventories: 3, sourceBasedPercentages: true }));
