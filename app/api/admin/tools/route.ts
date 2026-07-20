import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";
import { slugify, normalizeTextList, normalizeFaqs } from "@/lib/admin-utils";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, message: "Server not configured." }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("tools")
    .select("slug, id, name, category, pricing_type, description, tool_url")
    .order("name", { ascending: true })
    .limit(500);

  if (error) {
    console.error("[admin/tools] read error:", error);
    return NextResponse.json({ success: false, message: "Unable to load published tools." }, { status: 500 });
  }

  const formatted = (data ?? []).map((tool: any) => ({
    slug: tool.slug || String(tool.id),
    id: tool.id ? String(tool.id) : undefined,
    name: String(tool.name ?? ""),
    category: String(tool.category ?? "Other"),
    pricing: String(tool.pricing_type ?? tool.pricing ?? "Free"),
    description: String(tool.description ?? ""),
    website: String(tool.tool_url ?? tool.website ?? ""),
  }));

  return NextResponse.json({ success: true, data: formatted });
}

export async function POST(request: NextRequest) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, message: "Server not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const name = String((body as Record<string, unknown>).name || "").trim();
  const website = String((body as Record<string, unknown>).website || "").trim();
  const category = String((body as Record<string, unknown>).category || "Other").trim();
  const pricing = String((body as Record<string, unknown>).pricing || "Free").trim();
  const shortDescription = String((body as Record<string, unknown>).shortDescription || "").trim();

  if (!name || !website || !category || !pricing || !shortDescription) {
    return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
  }

  const slug = slugify(String((body as Record<string, unknown>).slug || name));
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const toolData = {
    slug,
    name,
    category,
    pricing_type: pricing,
    description: shortDescription,
    full_description: (body as Record<string, unknown>).fullDescription || null,
    tool_url: website,
    logo_url: (body as Record<string, unknown>).logoUrl || null,
    tags: normalizeTextList((body as Record<string, unknown>).tags),
    features: normalizeTextList((body as Record<string, unknown>).features),
    pros: normalizeTextList((body as Record<string, unknown>).pros),
    cons: normalizeTextList((body as Record<string, unknown>).cons),
    best_use_cases: normalizeTextList((body as Record<string, unknown>).bestUseCases),
    alternatives: normalizeTextList((body as Record<string, unknown>).alternatives),
    faq: normalizeFaqs((body as Record<string, unknown>).faq),
    seo_title: (body as Record<string, unknown>).seoTitle || null,
    seo_description: (body as Record<string, unknown>).seoDescription || null,
    featured: Boolean((body as Record<string, unknown>).featured),
    published: (body as Record<string, unknown>).published !== false,
  };

  const { data, error } = await supabase.from("tools").insert([toolData]).select().limit(1).maybeSingle();

  if (error) {
    console.error("[admin/tools] create error:", error);
    return NextResponse.json({ success: false, message: error.message || "Unable to create tool." }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
