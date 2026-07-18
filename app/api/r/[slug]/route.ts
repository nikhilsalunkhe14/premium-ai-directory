function slugify(text: string) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicToolBySlugOrId } from "@/lib/public-tools";
import { MOCKUP_TOOLS } from "@/lib/mockup-tools";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function ensureAbsoluteUrl(url: string) {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  let tool = await getPublicToolBySlugOrId(slug);

  // Fallback: try matching the mockup list directly (case-insensitive id or name slug)
  if (!tool) {
    const s = String(slug).toLowerCase();
    tool = MOCKUP_TOOLS.find(
      (t) => String(t.id).toLowerCase() === s || String(t.name).toLowerCase() === s || slugify(t.name) === s
    ) ?? null;
  }

  // Final fallback: if Supabase is available, try querying submissions and tools directly for loose matches
  if (!tool && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      // try submissions by id or name
      const sub = await supabase
        .from("tool_submissions")
        .select("*")
        .or(`id.eq.${slug},name.ilike.%${slug}%`)
        .eq("approved", true)
        .limit(1)
        .maybeSingle();

      if (!sub.error && sub.data) {
        const d = sub.data;
        tool = {
          id: String(d.id),
          name: String(d.name ?? ""),
          category: String(d.category ?? "Other"),
          description: String(d.description ?? ""),
          pricing: String(d.pricing ?? "Free"),
          website: String(d.website ?? ""),
          affiliateUrl: String(d.affiliate_url ?? d.affiliateUrl ?? "") || undefined,
          featured: false,
          sponsored: false,
        };
      }

      if (!tool) {
        const t = await supabase.from("tools").select("*").or(`id.eq.${slug},slug.eq.${slug}`).limit(1).maybeSingle();
        if (!t.error && t.data) {
          const d = t.data;
          tool = {
            id: String(d.id),
            name: String(d.name ?? ""),
            category: String(d.category ?? "Other"),
            description: String(d.description ?? ""),
            pricing: String(d.pricing ?? d.pricing_type ?? "Free"),
            website: String(d.website ?? d.tool_url ?? ""),
            affiliateUrl: String(d.affiliate_url ?? d.affiliateUrl ?? "") || undefined,
            featured: Boolean(d.featured),
            sponsored: Boolean(d.sponsored),
          };
        }
      }
    } catch (e) {
      console.error("/r fallback supabase lookup failed", e);
    }
  }

  if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });

  const targetRaw = (tool.affiliateUrl || tool.website || "").toString();
  const target = ensureAbsoluteUrl(targetRaw);
  if (!target) return NextResponse.json({ error: "No target URL" }, { status: 404 });

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    try {
      await supabase.from("affiliate_clicks").insert([
        {
          tool_id: tool.id,
          affiliate_url: target,
          user_agent: request.headers.get("user-agent") || null,
          referrer: request.headers.get("referer") || null,
        },
      ]);
    } catch (e) {
      console.error("affiliate click record failed", e);
    }
  }

  return NextResponse.redirect(target);
}
