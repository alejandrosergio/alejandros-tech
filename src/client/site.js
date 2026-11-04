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
    const forced = matchMedia('(forced-colors: active)');
    const quiet = () => reduced.matches || forced.matches || root.dataset.motion === 'true';
    if (!quiet()) {
      // Extend the same enhancement to real article content, without changing its HTML source.
      document.querySelectorAll('.detail-heading, .case-image, .case-facts, .prose > section, .prose > .article-intro, .takeaway, .related-notes > h2, .skill-explorer, .contact-bottom').forEach(item => item.setAttribute('data-reveal', ''));
      const targets = [...document.querySelectorAll('[data-reveal]')];
      const protectedText = 'form, summary, button, label, [aria-live], [role="status"], [role="alert"], .sr-only, [hidden], details:not([open])';
      function prepareHeading(heading) {
        if (heading.dataset.revealWords || heading.closest(protectedText) || heading.querySelector('.reveal-word')) return;
        if (heading.textContent.trim().split(/\s+/).length > 16) return;
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT), nodes = [];
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (node.nodeValue.trim() && !node.parentElement.closest('svg, script, style, [aria-hidden="true"], .sr-only')) nodes.push(node);
        }
        let index = 0;
        nodes.forEach(node => {
          const fragment = document.createDocumentFragment();
          node.nodeValue.split(/(\s+)/).forEach(token => {
            if (!token) return;
            if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
            else {
              const word = document.createElement('span'); word.className = 'reveal-word'; word.textContent = token;
              word.style.setProperty('--word-delay', `${Math.min(index++, 9) * 30}ms`); fragment.append(word);
            }
          });
          node.replaceWith(fragment);
        });
        heading.dataset.revealWords = 'true';
      }
      targets.forEach(item => {
        const siblings = [...item.parentElement.children].filter(child => child.hasAttribute('data-reveal'));
        item.style.setProperty('--reveal-delay', `${Math.max(0, Math.min(siblings.indexOf(item), 3)) * 80}ms`);
        const text = [...(item.matches('h1,h2,h3,p') ? [item] : []), ...item.querySelectorAll('h1,h2,h3,p')];
        let paragraph = 0;
        text.forEach(element => {
          if (element.closest('[data-reveal]') !== item || element.closest(protectedText)) return;
          if (element.matches('h1,h2,h3')) prepareHeading(element);
          else if (!element.matches('.eyebrow,.section-label,.small-label') && element.textContent.trim()) {
            element.dataset.revealText = 'paragraph'; element.style.setProperty('--text-delay', `${90 + Math.min(paragraph++, 3) * 70}ms`);
          }
        });
      });
      const show = item => { item.classList.add('is-visible'); reveal.unobserve(item); };
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); }), { threshold: .04, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(item => reveal.observe(item));
      root.classList.add('has-reveals');
      // Focus/hash navigation must never wait for a visual entrance or re-hide after blur.
      document.addEventListener('focusin', event => { const item = event.target.closest('[data-reveal]'); if (item) show(item); });
      const revealHash = () => {
        if (!location.hash) return;
        let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id); if (!target) return;
        const parent = target.closest('[data-reveal]'); if (parent) show(parent);
        target.querySelectorAll('[data-reveal]').forEach(show);
      };
      window.addEventListener('hashchange', revealHash); revealHash();
      let stopped = false;
      const stopWhenQuiet = () => {
        if (!quiet() || stopped) return;
        stopped = true; targets.forEach(show); reveal.disconnect(); root.classList.remove('has-reveals');
      };
      reduced.addEventListener('change', stopWhenQuiet); forced.addEventListener('change', stopWhenQuiet);
      document.addEventListener('alejandro:preferences', stopWhenQuiet);
      if ('MutationObserver' in window) new MutationObserver(stopWhenQuiet).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
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
