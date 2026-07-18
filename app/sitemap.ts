import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";
import { MOCKUP_TOOLS } from "@/lib/mockup-tools";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://your-domain.com";

async function fetchToolSlugs(): Promise<string[]> {
  const db = getSupabase();

  if (db) {
    const { data, error } = await db
      .from("tools")
      .select("id");

    if (!error && data && data.length > 0) {
      return data.map((row) => String(row.id));
    }
  }

  return MOCKUP_TOOLS.map((t) => t.id);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchToolSlugs();

  const toolEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/tool/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolEntries,
  ];
}
