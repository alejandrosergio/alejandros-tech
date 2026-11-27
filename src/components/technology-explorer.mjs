import { skills } from '../content/profile.mjs';
import { technologyGroups } from '../content/technology-interface.mjs';
import { technologyIcon } from './technology-icon.mjs';
import { escapeHTML as e } from '../lib/html.mjs';

// Native category disclosures keep the entire directory available without JS.
// The enhanced view starts with twelve cards, never a wall of every technology.
export function technologyExplorer(lang, t, label, title) {
  const groups = technologyGroups[lang], first = skills[0];
  const entries = Object.entries(groups), size = 12;
  return `<section class="section skills-section" id="tecnologias" aria-labelledby="skills-title"><div class="wrap">
    <div class="section-heading" data-reveal><div>${label}<h2 id="skills-title">${title}</h2></div><p>${e(t.intro)}</p></div>
    <p class="skill-scope">${e(t.scope)}</p>
    <div class="skills-static" data-skills-static><h3 class="sr-only">${e(t.fallback)}</h3>${entries.map(([group, name]) => `<details class="skill-static-group"><summary>${e(name)}<span>${skills.filter(s => s.group === group).length}</span></summary><ul>${skills.filter(s => s.group === group).map(s => `<li><strong class="skill-static-name">${technologyIcon(s.mark)}<span>${e(s.name)}</span></strong><p>${e(s[lang])}</p><small>${e(s.context[lang])}</small></li>`).join('')}</ul></details>`).join('')}</div>
    <div class="skill-explorer" data-skill-explorer data-page-size="${size}" aria-label="${e(t.explorerLabel)}" hidden>
      <div class="skill-search"><label for="technology-search">${e(t.search)}</label><input id="technology-search" type="search" data-skill-search placeholder="${e(t.searchHint)}" autocomplete="off" spellcheck="false" aria-controls="technology-grid"></div>
      <label class="skill-category-mobile" for="technology-category">${e(t.category)}<select id="technology-category" data-skill-category><option value="all">${e(t.all)} (${skills.length})</option>${entries.map(([key, name]) => `<option value="${key}">${e(name)} (${skills.filter(s => s.group === key).length})</option>`).join('')}</select></label>
      <div class="skill-filters" role="group" aria-label="${e(t.filterLabel)}"><button type="button" data-skill-filter="all" aria-pressed="true">${e(t.all)}<span>${skills.length}</span></button>${entries.map(([key, name]) => `<button type="button" data-skill-filter="${key}" aria-pressed="false">${e(name)}<span>${skills.filter(s => s.group === key).length}</span></button>`).join('')}</div>
      <p class="skill-results" data-skill-count data-template="${e(t.count)}" role="status" aria-live="polite"></p>
      <p class="skill-empty" data-skill-empty hidden>${e(t.empty)}</p>
      <div class="skill-explorer-body"><div><div class="skill-grid" id="technology-grid">${skills.map((s, i) => `<button type="button" class="skill-tile" data-skill="${s.id}" data-group="${s.group}" data-name="${e(s.name)}" data-description="${e(s[lang])}" data-context="${e(s.context[lang])}" data-category="${e(groups[s.group])}" aria-pressed="${i === 0}" aria-controls="skill-inspector"${i >= size ? ' hidden' : ''}><span class="skill-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="skill-symbol">${technologyIcon(s.mark)}</span><span class="skill-name">${e(s.name)}</span></button>`).join('')}</div><button type="button" class="button button-secondary skill-more" data-skill-more aria-controls="technology-grid">${e(t.showMore)}<span aria-hidden="true">+</span></button></div>
      <aside class="skill-inspector" id="skill-inspector" aria-live="polite" aria-atomic="true"><span class="small-label">${e(t.selected)}</span><span class="inspector-symbol" data-inspector-symbol aria-hidden="true">${technologyIcon(first.mark)}</span><p class="inspector-category" data-inspector-category>${e(groups[first.group])}</p><h3 data-inspector-name>${e(first.name)}</h3><p data-inspector-description>${e(first[lang])}</p><div class="inspector-context"><span class="small-label">${e(t.related)}</span><p data-inspector-context>${e(first.context[lang])}</p></div></aside></div>
    </div>
  </div></section>`;
}
