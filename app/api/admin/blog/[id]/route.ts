import { NextResponse, type NextRequest } from "next/server";
import { requireAdminAuth } from "@/lib/admin-utils";
import { deleteBlogPost, updateBlogPost } from "@/lib/blog-utils";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const params = await context.params;
    const body = await request.json().catch(() => null);
    const post = await updateBlogPost(params.id, body || {});
    if (!post) {
      return NextResponse.json({ success: false, message: "Blog post not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("[admin/blog:id] update error", error);
    return NextResponse.json({ success: false, message: "Unable to update blog post." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const params = await context.params;
    await deleteBlogPost(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/blog:id] delete error", error);
    return NextResponse.json({ success: false, message: "Unable to delete blog post." }, { status: 500 });
  }
}
