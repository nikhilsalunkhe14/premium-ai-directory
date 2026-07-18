import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";
import { getSupabase, getSupabaseService } from "@/lib/supabase";

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeToolRow(row: Record<string, any>): Tool {
  const name = String(row.name ?? "Untitled");
  const slug = String((row.slug ?? slugify(name)) || `tool-${Date.now()}`);
  const website = String(row.tool_url ?? row.website ?? "https://example.com");
  const affiliateUrl = String(row.affiliate_url ?? row.affiliateUrl ?? "").trim() || undefined;

  return {
    id: slug,
    name,
    category: String(row.category ?? "Other"),
    description: String(row.description ?? ""),
    pricing: String(row.pricing_type ?? row.pricing ?? "Free"),
    website: website || "https://example.com",
    affiliateUrl,
    featured: Boolean(row.featured),
    sponsored: Boolean(row.sponsored),
  };
}

export async function getPublicTools(): Promise<Tool[]> {
  const db = getSupabaseService() ?? getSupabase();
  const toolsById = new Map<string, Tool>();

  // Start with the original directory content so the homepage always shows the AI catalog.
  for (const tool of MOCKUP_TOOLS) {
    toolsById.set(tool.id, tool);
  }

  if (!db) {
    return Array.from(toolsById.values());
  }

  const [toolResult, submissionResult] = await Promise.all([
    db.from("tools").select("*").limit(500),
    db.from("tool_submissions").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(500),
  ]);

  if (!toolResult.error && toolResult.data) {
    for (const row of toolResult.data) {
      const normalized = normalizeToolRow(row);
      toolsById.set(normalized.id, normalized);
    }
  }

  if (!submissionResult.error && submissionResult.data) {
    for (const row of submissionResult.data) {
      const normalized = normalizeToolRow(row);
      const existing = toolsById.get(normalized.id);

      if (existing) {
        toolsById.set(normalized.id, {
          ...existing,
          ...normalized,
          website: normalized.website || existing.website,
          affiliateUrl: normalized.affiliateUrl ?? existing.affiliateUrl,
          pricing: normalized.pricing || existing.pricing,
          description: normalized.description || existing.description,
          category: normalized.category || existing.category,
        });
      } else {
        toolsById.set(normalized.id, normalized);
      }
    }
  }

  return Array.from(toolsById.values());
}

export async function getPublicToolBySlugOrId(slug: string): Promise<Tool | null> {
  const tools = await getPublicTools();
  const candidate = tools.find(
    (tool) =>
      String(tool.id) === slug ||
      slugify(tool.name) === slug ||
      slugify(tool.id) === slug
  );

  return candidate ?? null;
}
