import { technologyCatalog, projectTechnologies, projectTechnologyCopy } from '../content/project-technologies.mjs';
import { technologyIcon } from './technology-icon.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

const brandMarks = new Set(['html', 'css', 'node', 'rag', 'ai', 'csharp', 'net', 'api', 'automate', 'git', 'powerapps', 'dataverse', 'sap', 'oauth', 'ai-builder', 'sharepoint']);
const colors = { JavaScript: 'js', CSS: 'css', HTML: 'html', 'C#': 'csharp' };
const percentage = (value, lang) => new Intl.NumberFormat(lang === 'es' ? 'es-CO' : 'en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value) + '%';

export function technologyList(id, lang) {
  return `<ul class="project-technologies">${projectTechnologies[id].map(key => {
    const tech = technologyCatalog[key];
    const mark = brandMarks.has(tech.mark) ? technologyIcon(tech.mark) : `<span class="project-tech-mark" aria-hidden="true">${e(tech.mark)}</span>`;
    const name = key === 'connectors' ? (lang === 'es' ? 'Conectores personalizados' : 'Custom connectors') : tech.name;
    return `<li>${mark}<span><strong>${e(name)}</strong><small>${e(tech[lang])}</small></span></li>`;
  }).join('')}</ul>`;
}

export function projectCode(id, lang, report, sourceURL, compact = false) {
  const t = projectTechnologyCopy[lang];
  if (!report) return `<p class="project-code-unavailable">${e(t.unavailable)}</p>`;
  const label = `${t.distribution}: ${report.languages.map(item => `${item.name} ${percentage(item.percentage, lang)}`).join(', ')}`;
  return `<div class="project-code${compact ? ' project-code--compact' : ''}"><p class="project-code-label">${e(t.distribution)} <span>${e(t.approximate)}</span></p><div class="project-code-bar" role="img" aria-label="${e(label)}">${report.languages.map(item => `<span class="code-${colors[item.name]}" style="flex-grow:${item.percentage}" aria-hidden="true"></span>`).join('')}</div><ul class="project-code-legend">${report.languages.map(item => `<li><i class="code-${colors[item.name]}" aria-hidden="true"></i><span>${e(item.name)}</span><strong>${percentage(item.percentage, lang)}</strong></li>`).join('')}</ul>${compact ? '' : `<details class="project-code-method"><summary>${e(t.method)}</summary><p>${e(t.scopes[id])}</p><p>${e(t.explanation)}</p><p>${e(t.excluded)}</p>${report.revision ? `<p>${e(t.snapshot)}: ${e(report.checkedOn)} · <code>${e(report.revision.slice(0, 7))}</code></p>` : ''}<a href="${e(report.sourceURL || sourceURL)}" target="_blank" rel="noopener noreferrer">${e(t.source)}</a></details>`}</div>`;
}

export function projectTechnologySummary(id, lang, report, sourceURL) {
  const t = projectTechnologyCopy[lang];
  return `${projectCode(id, lang, report, sourceURL, true)}<details class="project-tech-disclosure"><summary>${e(t.all)}<span>${projectTechnologies[id].length}</span></summary>${technologyList(id, lang)}</details>`;
}
