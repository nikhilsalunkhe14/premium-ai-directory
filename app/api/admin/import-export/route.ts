import { NextResponse, type NextRequest } from "next/server";
import { requireAdminAuth, getAdminSupabase } from "@/lib/admin-utils";

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.rows)) {
      return NextResponse.json({ success: false, message: "Invalid payload." }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const rows = body.rows.filter((row: Record<string, unknown>) => row && typeof row === "object");
    const imported = [] as Array<Record<string, unknown>>;

    for (const row of rows) {
      const payload = {
        slug: String(row.slug || "").trim(),
        name: String(row.name || "").trim(),
        category: String(row.category || "Other").trim(),
        pricing_type: String(row.pricing_type || row.pricing || "Free").trim(),
        description: String(row.description || "").trim(),
        tool_url: String(row.tool_url || row.website || "").trim(),
        logo_url: String(row.logo_url || "").trim(),
        tags: Array.isArray(row.tags) ? row.tags : [],
        features: Array.isArray(row.features) ? row.features : [],
        pros: Array.isArray(row.pros) ? row.pros : [],
        cons: Array.isArray(row.cons) ? row.cons : [],
        alternatives: Array.isArray(row.alternatives) ? row.alternatives : [],
        faq: Array.isArray(row.faq) ? row.faq : [],
        seo_title: String(row.seo_title || "").trim(),
        seo_description: String(row.seo_description || "").trim(),
        featured: Boolean(row.featured),
        published: Boolean(row.published),
      };

      if (!payload.slug || !payload.name || !payload.tool_url || !payload.description) {
        continue;
      }

      const { error } = await supabase.from("tools").upsert(payload, { onConflict: "slug" });
      if (!error) {
        imported.push(payload);
      }
    }

    return NextResponse.json({ success: true, imported: imported.length, data: imported });
  } catch (error) {
    console.error("[admin/import-export] error", error);
    return NextResponse.json({ success: false, message: "Import failed." }, { status: 500 });
  }
}
