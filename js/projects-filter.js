export function setupProjectFilter() {
  const searchInput = document.getElementById('searchInput');
  const tagFilters = document.querySelectorAll('.tag-filter');
  const toolFilters = document.querySelectorAll('.tool-filter');
  const sortSelect = document.getElementById('sortSelect');
  const projectCards = document.querySelectorAll('.project-card');
  const toolOptions = document.querySelectorAll('.tool-filter, label[for^="tool-"]');

  // Hide tool filters by default
  toolOptions.forEach(el => {
    if (el.style) el.style.display = 'none';
  });

  // Listen for any change
  searchInput.addEventListener('input', filterProjects);
  tagFilters.forEach(cb => cb.addEventListener('change', filterProjects));
  toolFilters.forEach(cb => cb.addEventListener('change', filterProjects));
  sortSelect.addEventListener('change', filterProjects);

  function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTags = Array.from(tagFilters).filter(cb => cb.checked).map(cb => cb.value);
    const selectedTools = Array.from(toolFilters).filter(cb => cb.checked).map(cb => cb.value);
    const sortValue = sortSelect.value;

    let visibleProjects = Array.from(projectCards).filter(card => {
      const text = card.textContent.toLowerCase();
      const cardTags = card.dataset.tags ? card.dataset.tags.split(" ") : [];
      const cardTools = card.dataset.tools ? card.dataset.tools.split(" ") : [];

      const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => cardTags.includes(tag));
      const toolMatch = selectedTools.length === 0 || selectedTools.every(tool => cardTools.includes(tool));
      const textMatch = text.includes(searchTerm);

      const shouldShow = tagMatch && toolMatch && textMatch;
      card.classList.toggle('hidden', !shouldShow);

      return shouldShow;
    });

    // Sorting
    visibleProjects.sort((a, b) => {
      switch (sortValue) {
        case 'title-asc':
          return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        case 'title-desc':
          return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
        case 'updated-asc':
          return new Date(a.dataset.updated) - new Date(b.dataset.updated);
        case 'updated-desc':
          return new Date(b.dataset.updated) - new Date(a.dataset.updated);
        default:
          return 0;
      }
    });

    const parent = projectCards[0].parentNode;
    visibleProjects.forEach(card => parent.appendChild(card));
  }
}
