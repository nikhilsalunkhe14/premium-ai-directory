import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";

const CATEGORY_COLORS: Record<string, string> = {
  Writing: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Coding: "bg-green-100 text-green-700",
  Productivity: "bg-amber-100 text-amber-700",
  Marketing: "bg-pink-100 text-pink-700",
  "Image Generation": "bg-rose-100 text-rose-700",
};

async function getTool(id: string): Promise<Tool | null> {
  const db = getSupabase();

  if (db) {
    const { data, error } = await db
      .from("tools")
      .select("id, name, category, description, pricing, website")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data;
    }
  }

  return MOCKUP_TOOLS.find((t) => t.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tool = await getTool(id);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: `${tool.name} Review - Features, Pricing, and Alternatives (2026)`,
    description: `Read our in-depth ${tool.name} review. Explore key features, pricing (${tool.pricing}), and discover top alternatives. Updated for 2026.`,
    openGraph: {
      title: `${tool.name} Review - Features, Pricing, and Alternatives (2026)`,
      description: `Read our in-depth ${tool.name} review. Explore key features, pricing (${tool.pricing}), and discover top alternatives.`,
      type: "article",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ToolProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getTool(id);

  if (!tool) {
    notFound();
  }

  const badge = CATEGORY_COLORS[tool.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-gray-50">
      {/* ── Header ──────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/"
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
            Back to Directory
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {tool.name}
            </h1>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badge}`}>
              {tool.category}
            </span>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-500">
            {tool.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Pricing Board */}
            <div
              className={`flex items-center gap-2 rounded-xl px-5 py-3 ${
                tool.pricing === "Free"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                {tool.pricing === "Free" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <span className="text-sm font-bold">
                {tool.pricing === "Free" ? "100% Free" : "Paid Plan"}
              </span>
            </div>

            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
            >
              Visit Website
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Features Overview ───────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">About {tool.name}</h2>

        <div className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-8">
          <p className="leading-relaxed text-gray-600">{tool.description}</p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "AI-Powered",
                desc: "Built on state-of-the-art machine learning models for intelligent results.",
              },
              {
                title: "Easy to Use",
                desc: "Intuitive interface designed for both beginners and power users.",
              },
              {
                title: "Fast Results",
                desc: "Get outputs in seconds with optimized inference pipelines.",
              },
              {
                title: "Constantly Updated",
                desc: "Regular improvements and new features based on user feedback.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-5"
              >
                <h3 className="font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
