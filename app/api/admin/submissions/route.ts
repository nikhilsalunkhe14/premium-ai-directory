import { NextResponse, NextRequest } from "next/server";
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
    .from("tool_submissions")
    .select("id, name, website, category, pricing, description, email, affiliate_url, created_at, approved")
    .neq("approved", true)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[admin/submissions] read error:", error);
    return NextResponse.json({ success: false, message: "Unable to load submissions." }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
