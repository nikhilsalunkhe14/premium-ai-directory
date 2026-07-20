import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import AdminAnalyticsDashboard from "@/components/AdminAnalyticsDashboard";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Analytics",
  description: "Analytics dashboard for visitors, searches, clicks, and traffic.",
};

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  return (
    <AdminRealtimeProvider>
      <div className="min-h-screen bg-slate-100 px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/80">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Analytics Dashboard</h1>
                <p className="mt-2 text-sm text-slate-600">Monitor visits, searches, outbound clicks, and popular content.</p>
              </div>
              <AdminLogoutButton />
            </div>
          </div>
          <AdminAnalyticsDashboard />
        </div>
      </div>
    </AdminRealtimeProvider>
  );
}
