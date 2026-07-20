import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import AdminBlogListClient from "@/components/AdminBlogListClient";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Manage Blog",
  description: "Create, edit, and manage blog posts.",
};

export default async function AdminBlogPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  return (
    <AdminRealtimeProvider>
      <div className="min-h-screen bg-slate-100">
        <AdminNav />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blog Posts</h1>
              <p className="mt-2 text-sm text-slate-600">Create, edit, and manage published articles.</p>
            </div>
            <Link
              href="/admin/blog/create"
              className="inline-flex justify-center rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              + New Post
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <AdminBlogListClient />
          </div>
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
