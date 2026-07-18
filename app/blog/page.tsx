import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | AI Directory",
  description:
    "Stay up to date with the latest AI tools, trends, and tutorials. Read our guides on choosing the best AI apps for your workflow.",
};

const POSTS = [
  {
    slug: "best-free-ai-writing-tools-2026",
    title: "10 Best Free AI Writing Tools in 2026",
    excerpt:
      "We tested dozens of AI writing assistants to find the ones that actually deliver. Here are our top picks for bloggers, marketers, and students.",
    category: "Writing",
    date: "Jul 8, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ai-design-tools-for-non-designers",
    title: "AI Design Tools That Make Anyone Look Like a Pro",
    excerpt:
      "You don't need a design degree anymore. These AI tools generate stunning graphics, logos, and presentations from simple text prompts.",
    category: "Design",
    date: "Jul 5, 2026",
    readTime: "5 min read",
  },
  {
    slug: "github-copilot-vs-cursor-2026",
    title: "GitHub Copilot vs Cursor: Which AI Code Editor Wins?",
    excerpt:
      "An in-depth comparison of the two most popular AI coding assistants. We benchmark speed, accuracy, and developer experience.",
    category: "Coding",
    date: "Jul 1, 2026",
    readTime: "8 min read",
  },
  {
    slug: "ai-productivity-tools-remote-work",
    title: "AI Productivity Tools Every Remote Worker Needs",
    excerpt:
      "From meeting transcription to automated scheduling, these AI tools will save you hours every week while working from home.",
    category: "Productivity",
    date: "Jun 28, 2026",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-500">
            Guides, reviews, and the latest news from the AI tools landscape.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="rounded-full bg-indigo-50 px-3 py-0.5 font-medium text-indigo-600">
                  {post.category}
                </span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-indigo-600">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
