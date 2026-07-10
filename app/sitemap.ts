import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";
import { MOCKUP_TOOLS } from "@/lib/mockup-tools";

const BASE_URL = "https://your-domain.com";

async function fetchToolIds(): Promise<string[]> {
  const db = getSupabase();

  if (db) {
    const { data, error } = await db
      .from("tools")
      .select("id");

    if (!error && data && data.length > 0) {
      return data.map((row) => row.id);
    }
  }

  return MOCKUP_TOOLS.map((t) => t.id);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolIds = await fetchToolIds();

  const toolEntries: MetadataRoute.Sitemap = toolIds.map((id) => ({
    url: `${BASE_URL}/tools/${id}`,
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
    ...toolEntries,
  ];
}
