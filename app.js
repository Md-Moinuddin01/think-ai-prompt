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

