import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";
import { slugify, normalizeTextList, normalizeFaqs } from "@/lib/admin-utils";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, message: "Server not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const website = String(body.website || "").trim();
  const category = String(body.category || "Other").trim();
  const pricing = String(body.pricing || "Free").trim();
  const shortDescription = String(body.shortDescription || "").trim();

  if (!name || !website || !category || !pricing || !shortDescription) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  const slug = slugify(body.slug || name);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const toolData = {
    slug,
    name,
    category,
    pricing_type: pricing,
    description: shortDescription,
    full_description: body.fullDescription || null,
    tool_url: website,
    logo_url: body.logoUrl || null,
    tags: normalizeTextList(body.tags),
    features: normalizeTextList(body.features),
    pros: normalizeTextList(body.pros),
    cons: normalizeTextList(body.cons),
    best_use_cases: normalizeTextList(body.bestUseCases),
    alternatives: normalizeTextList(body.alternatives),
    faq: normalizeFaqs(body.faq),
    seo_title: body.seoTitle || null,
    seo_description: body.seoDescription || null,
    featured: Boolean(body.featured),
    published: body.published !== false,
  };

  const { data, error } = await supabase
    .from("tools")
    .insert([toolData])
    .select()
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[admin/tools] create error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unable to create tool." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
