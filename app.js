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

