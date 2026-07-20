import AdminSubmissionsList from "@/components/AdminSubmissionsList";
import AdminToolsList from "@/components/AdminToolsList";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin - Submissions",
  description: "Review and approve submitted AI tools.",
};

export default async function AdminSubmissionsPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  return (
    <AdminRealtimeProvider>
      <div className="min-h-screen bg-slate-100 px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/80">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Submissions Review</h1>
                <p className="mt-2 text-sm text-slate-600">Approve or reject submitted tools before they go live.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:mt-0">
                <Link
                  href="/admin/dashboard"
                  className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Admin Dashboard
                </Link>
                <AdminLogoutButton />
              </div>
            </div>
            <div className="mt-6">
              <AdminSubmissionsList />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/80">
            <AdminToolsList />
          </div>
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
