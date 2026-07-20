import { NextResponse, type NextRequest } from "next/server";
import { requireAdminAuth, getAdminSupabase } from "@/lib/admin-utils";
import { createBlogPost, getBlogPosts } from "@/lib/blog-utils";

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const posts = await getBlogPosts({ includeDrafts: true, publishedOnly: false });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("[admin/blog] read error", error);
    return NextResponse.json({ success: false, message: "Unable to load blog posts." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const post = await createBlogPost(body as Record<string, unknown>);
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("[admin/blog] create error", error);
    return NextResponse.json({ success: false, message: "Unable to save blog post." }, { status: 500 });
  }
}
