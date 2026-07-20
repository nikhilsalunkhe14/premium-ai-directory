import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminImportExportClient from "@/components/AdminImportExportClient";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Import & Export",
  description: "Bulk import and export tools.",
};

export default async function AdminImportExportPage() {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Bulk Import & Export</h1>
            <p className="mt-2 text-sm text-slate-600">Preview, validate, import, and export tool data in batches.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <AdminImportExportClient />
          </div>
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
