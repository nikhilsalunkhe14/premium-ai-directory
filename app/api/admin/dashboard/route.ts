import { NextResponse, type NextRequest } from "next/server";
import { requireAdminAuth, getAdminSupabase } from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getAdminSupabase();

    const [
      toolsResult,
      categoriesResult,
      submissionsResult,
      featuredResult,
      recentResult,
    ] = await Promise.all([
      supabase.from("tools").select("id", { count: "exact", head: true }),
      supabase.from("tools").select("DISTINCT category"),
      supabase
        .from("tool_submissions")
        .select("id", { count: "exact", head: true })
        .neq("approved", true),
      supabase.from("tools").select("id", { count: "exact", head: true }).eq("featured", true),
      supabase
        .from("tools")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const categories = new Set(
      (categoriesResult.data || [])
        .map((row: Record<string, any>) => row.category)
        .filter(Boolean)
    );

    return NextResponse.json({
      success: true,
      data: {
        totalTools: toolsResult.count ?? 0,
        totalCategories: categories.size,
        totalBlogPosts: 4, // Mock: static blog posts in code
        featuredTools: featuredResult.count ?? 0,
        recentlyAdded: recentResult.count ?? 0,
        pendingSubmissions: submissionsResult.count ?? 0,
      },
    });
  } catch (error) {
    console.error("[admin/dashboard] error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch dashboard stats." },
      { status: 500 }
    );
  }
}
