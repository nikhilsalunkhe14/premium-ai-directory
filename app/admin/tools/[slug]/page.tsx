import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminToolForm from "@/components/AdminToolForm";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/admin-utils";

export const metadata: Metadata = {
  title: "Edit Tool",
  description: "Edit an AI tool in the directory.",
};

async function getTool(slug: string) {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase.from("tools").select("*").eq("slug", slug).limit(1).maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export default async function AdminEditToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    redirect("/admin/tools");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Tool</h1>
          <p className="mt-2 text-sm text-slate-600">Update tool information, pricing, and metadata.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <AdminToolForm mode="edit" initialData={tool} />
        </div>
      </div>
    </div>
  );
}
