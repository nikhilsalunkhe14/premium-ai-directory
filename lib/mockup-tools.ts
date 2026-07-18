export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  website: string;
  affiliateUrl?: string;
  featured?: boolean;
  sponsored?: boolean;
}

export const MOCKUP_TOOLS: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Writing",
    description:
      "OpenAI's flagship conversational AI. Write essays, brainstorm ideas, debug code, and have natural conversations powered by GPT-4. Used by millions for creative writing, research, and everyday productivity tasks.",
    pricing: "Free",
    website: "https://chat.openai.com",
    affiliateUrl: "https://chat.openai.com/?ref=aidirectory",
    featured: true,
  },
  {
    id: "jasper",
    name: "Jasper AI",
    category: "Writing",
    description:
      "Enterprise-grade AI content platform for marketing teams. Generate blog posts, social media captions, ad copy, and email campaigns at scale with brand voice customization and team collaboration tools.",
    pricing: "Paid",
    website: "https://www.jasper.ai",
    affiliateUrl: "https://www.jasper.ai/?fpr=aidirectory",
    sponsored: true,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Design",
    description:
      "Create breathtaking AI-generated artwork from text descriptions. Known for its photorealistic style and artistic versatility, Midjourney produces gallery-quality images for designers, artists, and creative professionals.",
    pricing: "Paid",
    website: "https://www.midjourney.com",
    affiliateUrl: "https://www.midjourney.com/?ref=aidirectory",
    featured: true,
  },
  {
    id: "canva-ai",
    name: "Canva AI",
    category: "Design",
    description:
      "AI-powered design suite built into Canva. Generate presentations, social media graphics, logos, and marketing materials with Magic Design, text-to-image generation, and one-click background removal.",
    pricing: "Free",
    website: "https://www.canva.com",
    affiliateUrl: "https://www.canva.com/?aff=aidirectory",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "Coding",
    description:
      "Your AI pair programmer inside VS Code and JetBrains. Suggests whole lines and functions, helps with tests, and learns your coding patterns. Supports Python, JavaScript, TypeScript, Go, Ruby, and 50+ languages.",
    pricing: "Paid",
    website: "https://github.com/features/copilot",
    affiliateUrl: "https://github.com/features/copilot?ref=aidirectory",
    featured: true,
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "Coding",
    description:
      "The AI-first code editor built on VS Code. Chat with your codebase, generate files from natural language, and leverage multi-file editing with GPT-4 and Claude. Designed for developers who want to move faster.",
    pricing: "Free",
    website: "https://cursor.sh",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Productivity",
    description:
      "AI assistant integrated directly into your Notion workspace. Summarize meeting notes, draft documents, translate content, and manage databases with natural language commands. Seamlessly embedded in your workflow.",
    pricing: "Paid",
    website: "https://www.notion.so/product/ai",
    affiliateUrl: "https://www.notion.so/product/ai?ref=aidirectory",
    sponsored: true,
  },
  {
    id: "otter-ai",
    name: "Otter.ai",
    category: "Productivity",
    description:
      "AI meeting assistant that records, transcribes, and summarizes meetings in real time. Integrates with Zoom, Google Meet, and Teams. Automatically assigns action items and extracts key decisions.",
    pricing: "Free",
    website: "https://otter.ai",
    affiliateUrl: "https://otter.ai/?via=aidirectory",
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    category: "Image Generation",
    description:
      "OpenAI's latest text-to-image model. Generate highly detailed and accurate images from natural language prompts. Available through ChatGPT and the API with improved text rendering and composition.",
    pricing: "Free",
    website: "https://openai.com/dall-e-3",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    category: "Image Generation",
    description:
      "Open-source AI image generation model. Run locally or in the cloud to create images from text. Highly customizable with community-trained models, LoRAs, and ControlNet for precise artistic control.",
    pricing: "Free",
    website: "https://stability.ai",
  },
  {
    id: "hubspot-ai",
    name: "HubSpot AI",
    category: "Marketing",
    description:
      "AI-powered CRM and marketing automation platform. Generate blog ideas, write SEO content, personalize email campaigns, and analyze customer data with built-in machine learning and predictive analytics.",
    pricing: "Free",
    website: "https://www.hubspot.com/products/ai",
    affiliateUrl: "https://www.hubspot.com/products/ai?ref=aidirectory",
  },
  {
    id: "surfer-seo",
    name: "Surfer SEO",
    category: "Marketing",
    description:
      "AI-driven content optimization tool for search engines. Analyzes top-ranking pages, suggests content structure, keyword density, and NLP entities to help you write SEO articles that rank on Google.",
    pricing: "Paid",
    website: "https://surferseo.com",
    affiliateUrl: "https://surferseo.com/?ref=aidirectory",
    sponsored: true,
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: "Writing",
    description:
      "AI writing assistant that checks grammar, spelling, punctuation, and clarity in real time. Now includes generative AI for drafting, rewriting, and tone adjustment across email, docs, and social media.",
    pricing: "Free",
    website: "https://www.grammarly.com",
    affiliateUrl: "https://www.grammarly.com/?aff=aidirectory",
  },
  {
    id: "framer-ai",
    name: "Framer AI",
    category: "Design",
    description:
      "Build and publish websites in seconds with AI. Describe your site and Framer generates a fully responsive, production-ready website with animations, custom fonts, and CMS integration. No coding required.",
    pricing: "Free",
    website: "https://www.framer.com",
  },
  {
    id: "replit-ai",
    name: "Replit AI",
    category: "Coding",
    description:
      "Cloud-based coding environment with a built-in AI assistant. Generate code, debug errors, and deploy apps directly from your browser. Supports 50+ languages with collaborative editing and instant deployment.",
    pricing: "Free",
    website: "https://replit.com",
  },
];

export const CATEGORIES = [
  {
    name: "Writing",
    icon: "M16.5 3.75a2.121 2.121 0 013 3L7.5 19.5 3 21l1.5-4.5L16.5 3.75z",
    count: 0,
    color: "bg-blue-500",
  },
  {
    name: "Design",
    icon: "M4.5 16.5l3-3L15 6l3 3L7.5 21H4.5v-3z",
    count: 0,
    color: "bg-purple-500",
  },
  {
    name: "Coding",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    count: 0,
    color: "bg-green-500",
  },
  {
    name: "Productivity",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    count: 0,
    color: "bg-amber-500",
  },
  {
    name: "Image Generation",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    count: 0,
    color: "bg-rose-500",
  },
  {
    name: "Marketing",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    count: 0,
    color: "bg-pink-500",
  },
];

export function sortToolsByPriority(tools: Tool[]): Tool[] {
  return [...tools].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1;
    if (!a.sponsored && b.sponsored) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}
