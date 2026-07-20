import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, BASE_URL } from "@/lib/seo";

const POSTS: Record<
  string,
  {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    updated: string;
    author: string;
    readTime: string;
    content: string[];
    takeaways: string[];
  }
> = {
  "best-free-ai-writing-tools-2026": {
    title: "10 Best Free AI Writing Tools in 2026",
    excerpt: "We tested dozens of AI writing assistants to find the ones that actually deliver. Here are our top picks for bloggers, marketers, and students.",
    category: "Writing",
    date: "Jul 8, 2026",
    updated: "Jul 9, 2026",
    author: "AI Directory Editorial Team",
    readTime: "6 min read",
    content: [
      "The AI writing landscape has evolved dramatically over the past year. With large language models becoming more capable and accessible, there has never been a better time to leverage AI for your writing tasks.",
      "We tested over 30 AI writing tools across different categories, including blog writing, email drafting, academic writing, and creative fiction. Here are the 10 that stood out.",
      "ChatGPT remains the gold standard for general-purpose writing. Its conversational interface makes it easy to iterate on drafts, and the GPT-4 model produces remarkably polished prose. The free tier gives you access to GPT-3.5, which is still excellent for most writing tasks.",
      "Grammarly has evolved beyond a simple grammar checker. Its new generative AI features let you rewrite sentences, adjust tone, and even draft entire paragraphs. The free version covers the essentials, while Premium unlocks the full AI suite.",
      "For marketers, Jasper AI offers specialized templates for ad copy, product descriptions, and email campaigns. It learns your brand voice over time, ensuring consistency across all your content.",
      "The key takeaway: you no longer need to choose between speed and quality. These AI tools handle the heavy lifting while you focus on adding your unique perspective and expertise.",
    ],
    takeaways: [
      "Free AI writing tools are now viable for everyday content creation.",
      "Choose a tool based on your workflow: drafting, editing, or publishing.",
      "Upgrade only if you need team collaboration and advanced workflow features.",
    ],
  },
  "ai-design-tools-for-non-designers": {
    title: "AI Design Tools That Make Anyone Look Like a Pro",
    excerpt: "You don't need a design degree anymore. These AI tools generate stunning graphics, logos, and presentations from simple text prompts.",
    category: "Design",
    date: "Jul 5, 2026",
    updated: "Jul 6, 2026",
    author: "AI Directory Editorial Team",
    readTime: "5 min read",
    content: [
      "Design used to require years of training and expensive software. Not anymore. AI design tools have democratized visual creation, allowing anyone to produce professional-quality graphics.",
      "Canva's Magic Design feature lets you describe what you want in plain English, and it generates a polished template in seconds. You can then customize colors, fonts, and layout with intuitive drag-and-drop controls.",
      "Midjourney continues to push the boundaries of AI art generation. Its latest model produces images with incredible detail and artistic coherence. Designers use it for mood boards, concept art, and even final production assets.",
      "For web design, Framer AI stands out by generating complete, responsive websites from a text prompt. It handles layout, copy, and even basic animations, giving you a publishable site in minutes.",
      "The future of design is collaborative: AI handles the technical execution while humans provide creative direction and emotional insight.",
    ],
    takeaways: [
      "AI design tools remove the need for expensive software and deep technical skill.",
      "Use AI for concept creation, then fine-tune with your own creative direction.",
      "Pick tools that match your output: social graphics, web pages, or artwork.",
    ],
  },
  "github-copilot-vs-cursor-2026": {
    title: "GitHub Copilot vs Cursor: Which AI Code Editor Wins?",
    excerpt: "An in-depth comparison of the two most popular AI coding assistants. We benchmark speed, accuracy, and developer experience.",
    category: "Coding",
    date: "Jul 1, 2026",
    updated: "Jul 2, 2026",
    author: "AI Directory Editorial Team",
    readTime: "8 min read",
    content: [
      "The battle for the best AI coding assistant has intensified. GitHub Copilot and Cursor represent two different philosophies: Copilot as an extension to your existing editor, and Cursor as a purpose-built AI-first editor.",
      "GitHub Copilot excels at inline code completion. It integrates seamlessly with VS Code, JetBrains, and Neovim, suggesting entire functions as you type. Its training on billions of lines of public code gives it broad language coverage.",
      "Cursor takes a different approach. Built on VS Code, it adds a chat interface that understands your entire codebase. You can ask it to refactor functions, explain complex logic, or generate tests, and it handles multi-file changes.",
      "Performance-wise, Cursor generally produces more accurate results for complex tasks because it has full project context. Copilot, however, is faster for quick inline suggestions.",
      "Our recommendation: if you prefer staying in your current editor, Copilot is excellent. If you are open to switching, Cursor offers a more integrated AI experience.",
    ],
    takeaways: [
      "Copilot is ideal for inline completion inside existing editors.",
      "Cursor is better when you want a full project-aware AI workflow.",
      "Try both if you work across different coding tasks or teams.",
    ],
  },
  "ai-productivity-tools-remote-work": {
    title: "AI Productivity Tools Every Remote Worker Needs",
    excerpt:
      "From meeting transcription to automated scheduling, these AI tools will save you hours every week while working from home.",
    category: "Productivity",
    date: "Jun 28, 2026",
    updated: "Jun 29, 2026",
    author: "AI Directory Editorial Team",
    readTime: "5 min read",
    content: [
      "Remote work is here to stay, and AI tools are making it more productive than ever. From meeting transcription to automated scheduling, these tools eliminate the friction of distributed teams.",
      "Otter.ai has become indispensable for remote meetings. It transcribes Zoom and Google Meet calls in real time, identifies speakers, and generates summaries with action items. The free tier handles 300 minutes per month.",
      "Notion AI transforms your workspace into an intelligent knowledge base. It summarizes long documents, generates templates, and answers questions about your notes using natural language.",
      "For email management, tools like Superhuman use AI to prioritize your inbox, suggest replies, and automate follow-ups. It learns from your habits to surface the messages that matter most.",
      "The best part is that many of these tools work together, creating a seamless AI-powered workflow that saves hours every week.",
    ],
    takeaways: [
      "AI tools can simplify meeting notes, planning, and communication.",
      "Choose tools that integrate with your existing workflow.",
      "Start with free tiers and upgrade when you need more automation.",
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

  return buildMetadata({
    title: `${post.title} | AI Directory Blog`,
    description: post.content[0],
    path: `/blog/${slug}`,
    keywords: ["AI blog", post.category, "AI tools", "AI trends"],
    type: "article",
  });
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

  const relatedPosts = Object.entries(POSTS)
    .filter(([, item]) => item.category === post.category && item.title !== post.title)
    .slice(0, 3)
    .map(([slug, item]) => ({ slug, ...item }));

  return (
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            image: `${BASE_URL}/og-image.png`,
            author: {
              "@type": "Organization",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: "AI Directory",
              logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/og-image.png`,
              },
            },
            datePublished: post.date,
            dateModified: post.updated,
            description: post.content[0],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/blog/${slug}`,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
            ],
          }),
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-gray-900">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700">{post.title}</li>
          </ol>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="rounded-full bg-indigo-50 px-3 py-0.5 font-medium text-indigo-600">
                {post.category}
              </span>
              <span>Published {post.date}</span>
              <span>Updated {post.updated}</span>
              <span>{post.readTime}</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">By {post.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${post.title} - Read more on AI Directory: ${BASE_URL}/blog/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `${BASE_URL}/blog/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="prose prose-gray mt-8 max-w-none">
          {post.content.map((paragraph, i) => (
            <p key={i} className="mb-6 text-base leading-relaxed text-gray-600">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Key takeaways</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            {post.takeaways.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Related articles</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900">{relatedPost.title}</h3>
                  <p className="mt-2 text-gray-500">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
