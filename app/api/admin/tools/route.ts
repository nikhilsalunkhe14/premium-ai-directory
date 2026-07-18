import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";

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
