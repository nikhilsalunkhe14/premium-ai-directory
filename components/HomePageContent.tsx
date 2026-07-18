"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";
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

export default function HomePageContent({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const filtered = sortToolsByPriority(
    tools.filter((t) => {
      if (active !== "All" && t.category !== active) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
  );

  const categories = ALL_CATEGORIES.filter(
    (c) => c === "All" || new Set(tools.map((t) => t.category)).has(c)
  );

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            Trusted by 10,000+ creators
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the Perfect Free AI Tool Instantly
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            Browse the most comprehensive directory of AI tools. Search by
            category, compare features, and discover the perfect solution for
            your workflow.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <div className="flex overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
              <input
                type="text"
                placeholder="Search AI tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                className="bg-indigo-600 px-8 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ad Banner ───────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" />
      </div>

      {/* ── Category Filter Bar ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
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

      {/* ── Tool Grid ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="text-lg font-semibold">No tools found</p>
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
