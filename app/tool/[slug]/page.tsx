export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicTools } from "@/lib/public-tools";
import { MOCKUP_TOOLS, type Tool, sortToolsByPriority } from "@/lib/mockup-tools";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";
import { BASE_URL, buildMetadata } from "@/lib/seo";
import VisitButton from "@/components/VisitButton";

function isThenable<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as { then: unknown }).then === "function"
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Writing: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Coding: "bg-green-100 text-green-700",
  Productivity: "bg-amber-100 text-amber-700",
  Marketing: "bg-pink-100 text-pink-700",
  "Image Generation": "bg-rose-100 text-rose-700",
};

async function getAllTools(): Promise<Tool[]> {
  const tools = await getPublicTools();
  return tools.length > 0 ? tools : MOCKUP_TOOLS;
}

async function getTool(slug: string): Promise<Tool | null> {
  const tools = await getAllTools();
  const normalize = (s: string) => String(s).toLowerCase();

  function slugify(text: string) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  return (
    tools.find((t) => normalize(t.id) === normalize(slug)) ||
    tools.find((t) => slugify(t.name) === normalize(slug)) ||
    null
  );
}

export async function generateStaticParams() {
  const tools = await getAllTools();

  function slugify(text: string) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const params: { slug: string }[] = [];

  for (const tool of tools) {
    params.push({ slug: String(tool.id) });
    const nameSlug = slugify(tool.name);
    if (nameSlug && nameSlug !== String(tool.id)) {
      params.push({ slug: nameSlug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = isThenable<{ slug: string }>(params)
    ? await params
    : params;

  const tool = await getTool(resolvedParams.slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return buildMetadata({
    title: `${tool.name} - Reviews, Features, and Pricing (2026)`,
    description: `Discover ${tool.name}. Explore its key features, pricing, categories, and best use cases in our curated AI tools directory.`,
    path: `/tool/${tool.id}`,
    keywords: [tool.name, tool.category, "AI tools", "AI directory"],
    type: "article",
  });
}

export default async function ToolPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = isThenable<{ slug: string }>(params)
    ? await params
    : params;

  const tool = await getTool(resolvedParams.slug);
  const allTools = await getAllTools();

  if (!tool) {
    notFound();
  }

  const badge = CATEGORY_COLORS[tool.category] ?? "bg-gray-100 text-gray-700";
  const ctaUrl = tool.website || tool.affiliateUrl || "";

  const related = sortToolsByPriority(
    allTools.filter((item) => item.category === tool.category && item.id !== tool.id)
  ).slice(0, 3);

  return (
    <div className="bg-gray-50">
      {/* JSON-LD structured data for the tool (SoftwareApplication and Breadcrumb) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            description: tool.description,
            applicationCategory: tool.category,
            operatingSystem: "Web",
            url: `${BASE_URL}/tool/${tool.id}`,
            image: `${BASE_URL}/og-image.png`,
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
              { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
              { "@type": "ListItem", position: 3, name: tool.name, item: `${BASE_URL}/tool/${tool.id}` },
            ],
          }),
        }}
      />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/tools"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Tool Directory
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {tool.sponsored && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-700">
                Sponsored
              </span>
            )}
            {tool.featured && !tool.sponsored && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700">
                Featured
              </span>
            )}
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
            <div
              className={`flex items-center gap-2 rounded-xl px-5 py-3 ${
                tool.pricing === "Free"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <span className="text-sm font-bold">
                {tool.pricing === "Free"
                  ? "100% Free"
                  : tool.pricing === "Freemium"
                    ? "Freemium"
                    : "Paid Plan"}
              </span>
            </div>
            <VisitButton
              href={ctaUrl}
              toolId={tool.id}
              slug={resolvedParams.slug}
              path={`/tool/${resolvedParams.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
            >
              Visit Website
            </VisitButton>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">About {tool.name}</h2>

        <div className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-8">
          <p className="leading-relaxed text-gray-600">{tool.description}</p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "AI-Powered",
                desc: "Built on data-driven models to deliver smarter results with fewer clicks.",
              },
              {
                title: "Designed for Growth",
                desc: "Scales with your use case whether you’re a creator, marketer, or developer.",
              },
              {
                title: "Fast Access",
                desc: "Quickly open the tool from our directory and start building right away.",
              },
              {
                title: "Reliable Updates",
                desc: "We verify tool links and descriptions regularly so the directory stays fresh.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs leading-relaxed text-gray-400">
            <strong className="text-gray-500">Disclosure:</strong> Some links on this page may be affiliate links. We may earn a commission if you sign up through them at no extra cost to you. This helps keep the directory free and updated.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Related Tools</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <ToolCard key={item.id} tool={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
