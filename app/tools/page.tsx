export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";
import { getPublicTools } from "@/lib/public-tools";
import ToolsGrid from "@/components/ToolsGrid";
import AdBanner from "@/components/AdBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse All AI Tools | AI Directory",
  description:
    "Browse our complete collection of AI tools across writing, design, coding, productivity, and more. Find the perfect AI app for your needs.",
  path: "/tools",
  keywords: [
    "AI tools",
    "AI directory",
    "free AI tools",
    "AI apps",
    "tool directory",
  ],
});

async function fetchTools(): Promise<Tool[]> {
  const tools = await getPublicTools();
  return tools.length > 0 ? tools : MOCKUP_TOOLS;
}

export default async function BrowseToolsPage() {
  const tools = await fetchTools();

  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Browse All AI Tools
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-500">
            Explore our complete collection of {tools.length} AI tools across every
            category.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" />
      </div>
      <ToolsGrid tools={tools} />
    </div>
  );
}
