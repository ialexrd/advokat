(() => {
  const catalog = document.querySelector('.articles-catalog');
  const filters = catalog.querySelector('.article-filters');
  const buttons = [...filters.querySelectorAll('button[data-filter]')];
  const cards = [...catalog.querySelectorAll('article[data-category]')];
  const count = catalog.querySelector('.article-count');
  const plural = new Intl.PluralRules('ru');
  const nouns = { one: 'материал', few: 'материала', many: 'материалов' };

  function select(filter) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    const total = cards.filter(card => !card.hidden).length;
    count.textContent = total + ' ' + nouns[plural.select(total)];
  }

  buttons.forEach(button => {
    const filter = button.dataset.filter;
    button.querySelector('span').textContent = cards.filter(card => filter === 'all' || card.dataset.category === filter).length;
    button.addEventListener('click', () => select(filter));
  });
  select('all');
  filters.hidden = false;
})();
