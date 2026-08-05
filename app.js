const STORAGE_KEY = "think-book-m-prompts";
const THEME_KEY = "think-book-m-theme";

const categoryColors = [
  "#dff4f1",
  "#f9e7bf",
  "#e7e3ff",
  "#dbeafe",
  "#fce0e8",
  "#dff6dd",
  "#f1e6d6"
];

const starterPrompts = [
  {
    id: crypto.randomUUID(),
    title: "Launch Strategy Builder",
    category: "Startup",
    description: "Turn messy product notes into a focused go-to-market plan with positioning, channels, and next actions.",
    tags: ["gtm", "founder", "strategy"],
    body: "Act as a startup growth strategist. Turn these rough product notes into a clear go-to-market plan. Include the ICP, positioning, acquisition channels, launch sequence, risks, and the first 10 experiments to run. Ask clarifying questions before making assumptions.",
    favorite: true,
    createdAt: Date.now() - 900000
  },
  {
    id: crypto.randomUUID(),
    title: "Creator Content Engine",
    category: "Writing",
    description: "Generate a week of useful content from one idea while keeping a sharp, human voice.",
    tags: ["creator", "content", "social"],
    body: "Act as a senior content strategist. Transform this idea into 7 posts for LinkedIn and X. Keep the tone practical, original, and concise. For each post, include a hook, body, closing line, and one suggested visual.",
    favorite: true,
    createdAt: Date.now() - 700000
  },
  {
    id: crypto.randomUUID(),
    title: "Code Review Lens",
    category: "Developer",
    description: "Review a code change for bugs, readability, edge cases, and simpler implementation paths.",
    tags: ["code", "review", "quality"],
    body: "Act as a pragmatic senior engineer. Review this code for correctness, edge cases, security, maintainability, and test coverage. Prioritize findings by severity and suggest the smallest useful fix for each issue.",
    favorite: false,
    createdAt: Date.now() - 500000
  },
  {
    id: crypto.randomUUID(),
    title: "Customer Research Synthesizer",
    category: "Research",
    description: "Summarize interview notes into patterns, pain points, language, and product opportunities.",
    tags: ["research", "customers", "insights"],
    body: "Act as a product researcher. Analyze these customer notes and extract recurring pain points, exact customer language, jobs-to-be-done, objections, buying triggers, and product opportunities. End with the top 5 insights.",
    favorite: false,
    createdAt: Date.now() - 300000
  }
];

let prompts = loadPrompts();
let activeCategory = "All";
let activePromptId = null;


const elements = {
  searchInput: document.querySelector("#searchInput"),
  categoryFilters: document.querySelector("#categoryFilters"),
  promptGrid: document.querySelector("#promptGrid"),
  favoritesGrid: document.querySelector("#favoritesGrid"),
  favoritesSection: document.querySelector("#favoritesSection"),
  emptyState: document.querySelector("#emptyState"),
  totalPrompts: document.querySelector("#totalPrompts"),
  favoriteCount: document.querySelector("#favoriteCount"),
  categoryCount: document.querySelector("#categoryCount"),
  promptModal: document.querySelector("#promptModal"),
  promptForm: document.querySelector("#promptForm"),
  promptId: document.querySelector("#promptId"),
  titleInput: document.querySelector("#titleInput"),
  categoryInput: document.querySelector("#categoryInput"),
  tagsInput: document.querySelector("#tagsInput"),
  descriptionInput: document.querySelector("#descriptionInput"),
  bodyInput: document.querySelector("#bodyInput"),
  modalMode: document.querySelector("#modalMode"),
  modalTitle: document.querySelector("#modalTitle"),
  deletePrompt: document.querySelector("#deletePrompt"),
  detailDrawer: document.querySelector("#detailDrawer"),
  detailCategory: document.querySelector("#detailCategory"),
  detailTitle: document.querySelector("#detailTitle"),
  detailDescription: document.querySelector("#detailDescription"),
  detailTags: document.querySelector("#detailTags"),
  detailBody: document.querySelector("#detailBody"),
  detailFavorite: document.querySelector("#detailFavorite"),
  detailEdit: document.querySelector("#detailEdit"),
  detailCopy: document.querySelector("#detailCopy"),
  toastStack: document.querySelector("#toastStack"),
  themeToggle: document.querySelector("#themeToggle")
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  applyTheme();
  bindEvents();
  render();
}

function bindEvents() {
  document.querySelector("#openCreateModal").addEventListener("click", openCreateModal);
  document.querySelector("#heroCreateButton").addEventListener("click", openCreateModal);
  document.querySelector("#emptyCreateButton").addEventListener("click", openCreateModal);
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
  document.querySelector("#clearFilters").addEventListener("click", clearFilters);

  elements.searchInput.addEventListener("input", render);
  elements.promptForm.addEventListener("submit", savePromptFromForm);
  elements.deletePrompt.addEventListener("click", deleteActivePrompt);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.detailFavorite.addEventListener("click", toggleActiveFavorite);
  elements.detailEdit.addEventListener("click", () => openEditModal(activePromptId));
  elements.detailCopy.addEventListener("click", () => copyPrompt(activePromptId));

  elements.promptModal.addEventListener("click", (event) => {
    if (event.target === elements.promptModal) closeModal();
  });

  elements.detailDrawer.addEventListener("click", (event) => {
    if (event.target === elements.detailDrawer) closeDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeDrawer();
    }
  });
}

function loadPrompts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterPrompts));
  return starterPrompts;
}

function savePrompts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.dataset.theme = savedTheme;
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
  showToast(`${capitalize(nextTheme)} mode saved`);
}

function render() {
  renderCategoryFilters();
  renderStats();

  const filteredPrompts = getFilteredPrompts();
  const favoritePrompts = filteredPrompts.filter((prompt) => prompt.favorite);
  const regularPrompts = filteredPrompts.filter((prompt) => !prompt.favorite);

  renderPromptGrid(elements.favoritesGrid, favoritePrompts);
  renderPromptGrid(elements.promptGrid, [...favoritePrompts, ...regularPrompts]);

  elements.favoritesSection.hidden = favoritePrompts.length === 0;
  elements.emptyState.hidden = filteredPrompts.length > 0;
}

function renderStats() {
  const categories = new Set(prompts.map((prompt) => prompt.category));
  elements.totalPrompts.textContent = prompts.length;
  elements.favoriteCount.textContent = prompts.filter((prompt) => prompt.favorite).length;
  elements.categoryCount.textContent = categories.size;
}

function renderCategoryFilters() {
  const categories = ["All", ...new Set(prompts.map((prompt) => prompt.category))];
  elements.categoryFilters.innerHTML = categories
    .map((category) => {
      const activeClass = category === activeCategory ? "active" : "";
      return `<button class="chip ${activeClass}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
    })
    .join("");

  elements.categoryFilters.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.category;
      render();
    });
  });
}

function renderPromptGrid(container, promptList) {
  container.innerHTML = promptList.map(createPromptCard).join("");

  container.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleCardAction);
  });
}

function createPromptCard(prompt, index) {
  const favoriteClass = prompt.favorite ? "favorite" : "";
  const favoriteButtonClass = prompt.favorite ? "active" : "";
  const tags = prompt.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");


  return `
    <article class="prompt-card ${favoriteClass}" style="animation-delay: ${index * 45}ms">
      <div class="card-top">
        <span class="category-pill" style="--category-color: ${getCategoryColor(prompt.category)}">${escapeHtml(prompt.category)}</span>
        <button class="favorite-button ${favoriteButtonClass}" type="button" aria-label="Toggle favorite" data-action="favorite" data-id="${prompt.id}">
          ${prompt.favorite ? "Star" : "Save"}
        </button>
      </div>
      <div>
        <h3>${escapeHtml(prompt.title)}</h3>
        <p>${escapeHtml(prompt.description)}</p>
      </div>
      <div class="tag-row">${tags}</div>
      <div class="card-actions">
        <button class="secondary-button" type="button" data-action="details" data-id="${prompt.id}">Details</button>
        <button class="primary-button" type="button" data-action="copy" data-id="${prompt.id}">Copy</button>
      </div>
    </article>
  `;
}

function handleCardAction(event) {
  const id = event.currentTarget.dataset.id;
  const action = event.currentTarget.dataset.action;

  if (action === "favorite") toggleFavorite(id);
  if (action === "copy") copyPrompt(id);
  if (action === "details") openDrawer(id);
}

function getFilteredPrompts() {
  const query = elements.searchInput.value.trim().toLowerCase();

  return prompts
    .filter((prompt) => activeCategory === "All" || prompt.category === activeCategory)
    .filter((prompt) => {
      const searchableText = [
        prompt.title,
        prompt.description,
        prompt.category,
        prompt.tags.join(" "),
        prompt.body
      ].join(" ").toLowerCase();

      return searchableText.includes(query);
    })
    .sort((first, second) => Number(second.favorite) - Number(first.favorite) || second.createdAt - first.createdAt);
}

function openCreateModal() {
  activePromptId = null;
  elements.promptForm.reset();
  elements.promptId.value = "";
  elements.modalMode.textContent = "New prompt";
  elements.modalTitle.textContent = "Save a useful prompt";
  elements.deletePrompt.hidden = true;
  elements.promptModal.hidden = false;
  elements.titleInput.focus();
}

function openEditModal(id) {
  const prompt = findPrompt(id);
  if (!prompt) return;

  activePromptId = id;
  elements.promptId.value = prompt.id;
  elements.titleInput.value = prompt.title;
  elements.categoryInput.value = prompt.category;
  elements.tagsInput.value = prompt.tags.join(", ");
  elements.descriptionInput.value = prompt.description;
  elements.bodyInput.value = prompt.body;
  elements.modalMode.textContent = "Edit prompt";
  elements.modalTitle.textContent = "Refine your prompt";
  elements.deletePrompt.hidden = false;
  elements.promptModal.hidden = false;
  closeDrawer();
  elements.titleInput.focus();
}


function closeModal() {
  elements.promptModal.hidden = true;
}


function savePromptFromForm(event) {
  event.preventDefault();

  const formPrompt = {
    id: elements.promptId.value || crypto.randomUUID(),
    title: elements.titleInput.value.trim(),
    category: elements.categoryInput.value.trim(),
    description: elements.descriptionInput.value.trim(),
    tags: parseTags(elements.tagsInput.value),
    body: elements.bodyInput.value.trim(),
    favorite: findPrompt(elements.promptId.value)?.favorite || false,
    createdAt: findPrompt(elements.promptId.value)?.createdAt || Date.now()
  };


  if (elements.promptId.value) {
    prompts = prompts.map((prompt) => prompt.id === formPrompt.id ? formPrompt : prompt);
    showToast("Prompt updated");
  } else {
    prompts.unshift(formPrompt);
    showToast("Prompt saved");
  }

  savePrompts();
  closeModal();
  render();
}

function deleteActivePrompt() {
  const id = elements.promptId.value;
  if (!id) return;

  prompts = prompts.filter((prompt) => prompt.id !== id);
  savePrompts();
  closeModal();
  closeDrawer();
  render();
  showToast("Prompt deleted");
}
