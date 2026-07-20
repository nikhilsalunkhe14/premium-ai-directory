import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminToolForm from "@/components/AdminToolForm";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Create Tool",
  description: "Add a new AI tool to the directory.",
};

export default async function AdminCreateToolPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Tool</h1>
          <p className="mt-2 text-sm text-slate-600">Add a new AI tool to your directory.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <AdminToolForm mode="create" />
        </div>
      </div>
    </div>
  );
}
