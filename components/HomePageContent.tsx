"use client";

import { useState } from "react";
import ToolsGrid from "@/components/ToolsGrid";
import type { Tool } from "@/lib/mockup-tools";

export default function HomePageContent({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");

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

      {/* ── Interactive Grid ────────────────────────────── */}
      <ToolsGrid tools={tools} query={query} onQueryChange={setQuery} />
    </>
  );
}
