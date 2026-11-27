// Search and category selection reveal a bounded page of the complete HTML
// directory. No request, model, storage or framework is needed for filtering.
(() => {
  const explorer = document.querySelector('[data-skill-explorer]');
  if (!explorer) return;
  const tiles = [...explorer.querySelectorAll('[data-skill]')];
  const filters = [...explorer.querySelectorAll('[data-skill-filter]')];
  const search = explorer.querySelector('[data-skill-search]');
  const category = explorer.querySelector('[data-skill-category]');
  const more = explorer.querySelector('[data-skill-more]');
  const count = explorer.querySelector('[data-skill-count]');
  const inspector = explorer.querySelector('#skill-inspector');
  const empty = explorer.querySelector('[data-skill-empty]');
  const pageSize = Number(explorer.dataset.pageSize) || 12;
  let group = 'all', limit = pageSize;
  const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const index = new Map(tiles.map(tile => [tile, normalize([tile.dataset.name, tile.dataset.description, tile.dataset.context, tile.dataset.category].join(' '))]));
  function select(tile) {
    tiles.forEach(item => item.setAttribute('aria-pressed', String(item === tile)));
    if (!tile) return;
    for (const field of ['category', 'name', 'description', 'context']) explorer.querySelector(`[data-inspector-${field}]`).textContent = tile.dataset[field];
    explorer.querySelector('[data-inspector-symbol]').replaceChildren(tile.querySelector('.technology-mark').cloneNode(true));
  }
  function render() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    const matches = tiles.filter(tile => (group === 'all' || tile.dataset.group === group) && words.every(word => index.get(tile).includes(word)));
    const visible = new Set(matches.slice(0, limit));
    tiles.forEach(tile => { tile.hidden = !visible.has(tile); });
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.skillFilter === group)));
    category.value = group;
    count.textContent = count.dataset.template.replace('{shown}', String(visible.size)).replace('{total}', String(matches.length));
    more.hidden = matches.length <= limit;
    empty.hidden = matches.length > 0; inspector.hidden = !matches.length;
    const selected = tiles.find(tile => tile.getAttribute('aria-pressed') === 'true');
    if (!selected || selected.hidden) select(matches[0]);
  }
  function changeGroup(value) { group = value; limit = pageSize; render(); }
  filters.forEach(filter => filter.addEventListener('click', () => changeGroup(filter.dataset.skillFilter)));
  category.addEventListener('change', () => changeGroup(category.value));
  search.addEventListener('input', () => { limit = pageSize; render(); });
  more.addEventListener('click', () => { limit += pageSize; render(); });
  tiles.forEach(tile => tile.addEventListener('click', () => select(tile)));
  explorer.querySelector('.skill-grid').addEventListener('keydown', event => {
    const tile = event.target.closest('[data-skill]');
    if (!tile || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const visible = tiles.filter(item => !item.hidden), current = visible.indexOf(tile);
    const columns = getComputedStyle(tile.parentElement).gridTemplateColumns.split(' ').length;
    let next = current;
    if (event.key === 'ArrowLeft') next--;
    if (event.key === 'ArrowRight') next++;
    if (event.key === 'ArrowUp') next -= columns;
    if (event.key === 'ArrowDown') next += columns;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = visible.length - 1;
    event.preventDefault();
    const target = visible[Math.max(0, Math.min(visible.length - 1, next))];
    target?.focus(); if (target) select(target);
  });
  render(); explorer.hidden = false;
  document.querySelector('[data-skills-static]').hidden = true;
})();
