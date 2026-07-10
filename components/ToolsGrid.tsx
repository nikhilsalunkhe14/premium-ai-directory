"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/lib/mockup-tools";

const CATEGORIES = [
  "All",
  "Writing",
  "Design",
  "Coding",
  "Productivity",
] as const;

export default function ToolsGrid({
  tools,
  query,
  onQueryChange,
}: {
  tools: Tool[];
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const [active, setActive] = useState<string>("All");

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

    return result;
  }, [tools, query, active]);

  return (
    <>
      {/* ── Category Filter Bar ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
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
            <p className="text-lg font-semibold">No tools found</p>
            <p className="mt-1 text-sm">Try a different search or category.</p>
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
