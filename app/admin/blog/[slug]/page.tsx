import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import AdminBlogForm from "@/components/AdminBlogForm";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { getBlogPostBySlug, updateBlogPost } from "@/lib/blog-utils";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit an existing blog post.",
};

export default async function AdminEditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  async function handleUpdate(payload: Record<string, unknown>) {
    "use server";
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!isAdminSessionTokenValid(cookieValue)) {
      throw new Error("Unauthorized access.");
    }

    await updateBlogPost(String(payload.slug || slug), payload as Record<string, unknown>);
    redirect("/admin/blog");
  }

  return (
    <AdminRealtimeProvider>
      <div className="min-h-screen bg-slate-100">
        <AdminNav />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Blog Post</h1>
              <p className="mt-2 text-sm text-slate-600">Update content, SEO details, and publish settings.</p>
            </div>
            <Link href="/admin/blog" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Back to posts</Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {post ? <AdminBlogForm initialValues={post as Record<string, unknown>} onSubmit={handleUpdate} submitLabel="Update Post" /> : <p className="text-sm text-slate-600">Post not found.</p>}
          </div>
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
