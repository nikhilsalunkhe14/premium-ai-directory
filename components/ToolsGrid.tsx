"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/lib/mockup-tools";
import { sortToolsByPriority } from "@/lib/mockup-tools";

const ALL_CATEGORIES = [
  "All",
  "Writing",
  "Design",
  "Coding",
  "Productivity",
  "Image Generation",
  "Marketing",
] as const;

export default function ToolsGrid({
  tools,
  initialQuery,
}: {
  tools: Tool[];
  initialQuery?: string;
}) {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState(initialQuery ?? "");

  const filtered = useMemo(() => {
    let result = tools;

    if (active !== "All") {
      result = result.filter((t) => t.category === active);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return sortToolsByPriority(result);
  }, [tools, query, active]);

  const categories = useMemo(() => {
    const present = new Set(tools.map((t) => t.category));
    return ALL_CATEGORIES.filter((c) => c === "All" || present.has(c));
  }, [tools]);

  return (
    <>
      {/* ── Search + Category Filter Bar ────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <svg
              className="mr-2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active === cat
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Tool Grid ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold">No tools found</p>
            <p className="mt-1 text-sm">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
