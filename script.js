const search = document.querySelector('#project-search');
if (search) {
  const rows = [...document.querySelectorAll('[data-project]')];
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const row of rows) {
      row.hidden = !row.dataset.search.includes(query);
      if (!row.hidden) count++;
    }
    document.querySelector('#project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
    document.querySelector('#empty-state').hidden = count !== 0;
  });
}
