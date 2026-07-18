import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const POSTS: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    readTime: string;
    content: string[];
  }
> = {
  "best-free-ai-writing-tools-2026": {
    title: "10 Best Free AI Writing Tools in 2026",
    category: "Writing",
    date: "Jul 8, 2026",
    readTime: "6 min read",
    content: [
      "The AI writing landscape has evolved dramatically over the past year. With large language models becoming more capable and accessible, there has never been a better time to leverage AI for your writing tasks.",
      "We tested over 30 AI writing tools across different categories, including blog writing, email drafting, academic writing, and creative fiction. Here are the 10 that stood out.",
      "ChatGPT remains the gold standard for general-purpose writing. Its conversational interface makes it easy to iterate on drafts, and the GPT-4 model produces remarkably polished prose. The free tier gives you access to GPT-3.5, which is still excellent for most writing tasks.",
      "Grammarly has evolved beyond a simple grammar checker. Its new generative AI features let you rewrite sentences, adjust tone, and even draft entire paragraphs. The free version covers the essentials, while Premium unlocks the full AI suite.",
      "For marketers, Jasper AI offers specialized templates for ad copy, product descriptions, and email campaigns. It learns your brand voice over time, ensuring consistency across all your content.",
      "The key takeaway: you no longer need to choose between speed and quality. These AI tools handle the heavy lifting while you focus on adding your unique perspective and expertise.",
    ],
  },
  "ai-design-tools-for-non-designers": {
    title: "AI Design Tools That Make Anyone Look Like a Pro",
    category: "Design",
    date: "Jul 5, 2026",
    readTime: "5 min read",
    content: [
      "Design used to require years of training and expensive software. Not anymore. AI design tools have democratized visual creation, allowing anyone to produce professional-quality graphics.",
      "Canva's Magic Design feature lets you describe what you want in plain English, and it generates a polished template in seconds. You can then customize colors, fonts, and layout with intuitive drag-and-drop controls.",
      "Midjourney continues to push the boundaries of AI art generation. Its latest model produces images with incredible detail and artistic coherence. Designers use it for mood boards, concept art, and even final production assets.",
      "For web design, Framer AI stands out by generating complete, responsive websites from a text prompt. It handles layout, copy, and even basic animations, giving you a publishable site in minutes.",
      "The future of design is collaborative: AI handles the technical execution while humans provide creative direction and emotional insight.",
    ],
  },
  "github-copilot-vs-cursor-2026": {
    title: "GitHub Copilot vs Cursor: Which AI Code Editor Wins?",
    category: "Coding",
    date: "Jul 1, 2026",
    readTime: "8 min read",
    content: [
      "The battle for the best AI coding assistant has intensified. GitHub Copilot and Cursor represent two different philosophies: Copilot as an extension to your existing editor, and Cursor as a purpose-built AI-first editor.",
      "GitHub Copilot excels at inline code completion. It integrates seamlessly with VS Code, JetBrains, and Neovim, suggesting entire functions as you type. Its training on billions of lines of public code gives it broad language coverage.",
      "Cursor takes a different approach. Built on VS Code, it adds a chat interface that understands your entire codebase. You can ask it to refactor functions, explain complex logic, or generate tests, and it handles multi-file changes.",
      "Performance-wise, Cursor generally produces more accurate results for complex tasks because it has full project context. Copilot, however, is faster for quick inline suggestions.",
      "Our recommendation: if you prefer staying in your current editor, Copilot is excellent. If you are open to switching, Cursor offers a more integrated AI experience.",
    ],
  },
  "ai-productivity-tools-remote-work": {
    title: "AI Productivity Tools Every Remote Worker Needs",
    category: "Productivity",
    date: "Jun 28, 2026",
    readTime: "5 min read",
    content: [
      "Remote work is here to stay, and AI tools are making it more productive than ever. From meeting transcription to automated scheduling, these tools eliminate the friction of distributed teams.",
      "Otter.ai has become indispensable for remote meetings. It transcribes Zoom and Google Meet calls in real time, identifies speakers, and generates summaries with action items. The free tier handles 300 minutes per month.",
      "Notion AI transforms your workspace into an intelligent knowledge base. It summarizes long documents, generates templates, and answers questions about your notes using natural language.",
      "For email management, tools like Superhuman use AI to prioritize your inbox, suggest replies, and automate follow-ups. It learns from your habits to surface the messages that matter most.",
      "The best part is that many of these tools work together, creating a seamless AI-powered workflow that saves hours every week.",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | AI Directory Blog`,
    description: post.content[0],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-gray-50">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Blog
        </Link>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 font-medium text-indigo-600">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="prose prose-gray mt-8 max-w-none">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="mb-6 text-base leading-relaxed text-gray-600"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
