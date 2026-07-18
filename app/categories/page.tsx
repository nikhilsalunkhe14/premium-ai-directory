import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { MOCKUP_TOOLS, CATEGORIES, type Tool } from "@/lib/mockup-tools";

export const metadata: Metadata = {
  title: "AI Tool Categories | AI Directory",
  description:
    "Browse AI tools by category. Find the best AI apps for writing, design, coding, productivity, image generation, and marketing.",
};

async function getCategoryCounts(): Promise<Record<string, number>> {
  const db = getSupabase();
  let categories: string[] = [];

  if (db) {
    const { data, error } = await db
      .from("tools")
      .select("category");

    if (!error && data && data.length > 0) {
      categories = data.map((row: { category: string }) => row.category);
    }
  }

  if (categories.length === 0) {
    categories = MOCKUP_TOOLS.map((t) => t.category);
  }

  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            AI Tool Categories
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-500">
            Find the right AI tools organized by what they do best.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/tools?category=${encodeURIComponent(cat.name)}`}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} text-white`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={cat.icon}
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {counts[cat.name] ?? 0} tools available
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
