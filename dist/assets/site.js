(() => {
  const root = document.documentElement;
  const theme = document.querySelector('[data-theme-toggle]');
  if (theme) {
    theme.hidden = false;
    theme.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      window.AlejandroPreferences?.set({ theme: next });
    });
  }

  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  if (menu && nav) {
    const setMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? menu.dataset.close : menu.dataset.open);
      nav.classList.toggle('is-open', open);
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) nav.querySelector('a')?.focus();
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    });
    matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));
    root.classList.add('nav-enhanced'); menu.hidden = false;
  }

  const explorer = document.querySelector('[data-skill-explorer]');
  if (explorer) {
    const tiles = [...explorer.querySelectorAll('[data-skill]')];
    const filters = [...explorer.querySelectorAll('[data-skill-filter]')];
    const fields = ['symbol', 'category', 'name', 'description', 'context'];
    const select = tile => {
      tiles.forEach(item => item.setAttribute('aria-pressed', String(item === tile)));
      fields.forEach(field => { explorer.querySelector(`[data-inspector-${field}]`).textContent = tile.dataset[field]; });
    };
    tiles.forEach(tile => tile.addEventListener('click', () => select(tile)));
    filters.forEach(filter => filter.addEventListener('click', () => {
      const group = filter.dataset.skillFilter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === filter)));
      tiles.forEach(tile => { tile.hidden = group !== 'all' && tile.dataset.group !== group; });
      const selected = tiles.find(tile => tile.getAttribute('aria-pressed') === 'true');
      if (!selected || selected.hidden) select(tiles.find(tile => !tile.hidden));
    }));
    explorer.querySelector('.skill-grid').addEventListener('keydown', event => {
      const tile = event.target.closest('[data-skill]');
      if (!tile || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      const visible = tiles.filter(item => !item.hidden), index = visible.indexOf(tile);
      const columns = getComputedStyle(tile.parentElement).gridTemplateColumns.split(' ').length;
      let next = index;
      if (event.key === 'ArrowLeft') next--;
      if (event.key === 'ArrowRight') next++;
      if (event.key === 'ArrowUp') next -= columns;
      if (event.key === 'ArrowDown') next += columns;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = visible.length - 1;
      event.preventDefault();
      const target = visible[Math.max(0, Math.min(visible.length - 1, next))];
      target.focus(); select(target);
    });
    select(tiles[0]); explorer.hidden = false;
    document.querySelector('[data-skills-static]').hidden = true;
  }

  const copy = document.querySelector('[data-copy-email]');
  if (copy && navigator.clipboard?.writeText && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = document.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(copy.dataset.copyEmail);
        status.textContent = copy.dataset.success;
        copy.querySelector('span').textContent = copy.dataset.success;
      } catch {
        status.textContent = copy.dataset.failure;
        copy.querySelector('span').textContent = copy.dataset.failure;
      }
    });
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    if (!reduced.matches && root.dataset.motion !== 'true') {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
      }), { threshold: .01, rootMargin: '0px 0px 6% 0px' });
      document.querySelectorAll('[data-reveal]').forEach(item => {
        const siblings = [...item.parentElement.children].filter(child => child.hasAttribute('data-reveal'));
        item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 3) * 110}ms`);
        reveal.observe(item);
      });
      root.classList.add('has-reveals');
      reduced.addEventListener('change', () => { if (reduced.matches) { root.classList.remove('has-reveals'); reveal.disconnect(); } });
    }
    const links = [...document.querySelectorAll('[data-nav-section]')];
    const active = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => {
        if (link.dataset.navSection === entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-100px 0px -55% 0px', threshold: 0 });
    links.forEach(link => { const section = document.getElementById(link.dataset.navSection); if (section) active.observe(section); });
  }

  const progress = document.querySelector('[data-reading-progress]');
  if (progress) {
    let pending = false;
    const update = () => {
      const available = root.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0})`;
      pending = false;
    };
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule); update();
  }
})();
