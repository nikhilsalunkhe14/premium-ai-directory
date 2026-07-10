export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  website: string;
}

export const MOCKUP_TOOLS: Tool[] = [
  {
    id: "mock-1",
    name: "ChatGenius",
    category: "Writing",
    description:
      "An AI-powered writing assistant that helps you craft blog posts, emails, and marketing copy in seconds. Powered by the latest language models, it understands context, tone, and style to deliver polished content on demand. Whether you are drafting a newsletter or a technical article, ChatGenius adapts to your voice and accelerates your workflow.",
    pricing: "Free",
    website: "https://example.com/chatgenius",
  },
  {
    id: "mock-2",
    name: "PixelCraft AI",
    category: "Design",
    description:
      "Generate stunning UI mockups, logos, and illustrations from a simple text prompt. Perfect for designers and non-designers alike. PixelCraft AI leverages diffusion models trained on millions of high-quality assets to produce publication-ready visuals in under a minute.",
    pricing: "Paid",
    website: "https://example.com/pixelcraft",
  },
  {
    id: "mock-3",
    name: "CodePilot",
    category: "Coding",
    description:
      "Your AI pair-programmer. Get intelligent code completions, bug detection, and refactoring suggestions across 50+ languages. CodePilot integrates directly into your IDE, learning from your codebase to provide context-aware suggestions that feel natural and boost productivity.",
    pricing: "Free",
    website: "https://example.com/codepilot",
  },
];
