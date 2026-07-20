"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import AdminStatCard from "@/components/AdminStatCard";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

type DashboardStats = {
  totalTools: number;
  totalCategories: number;
  totalBlogPosts: number;
  featuredTools: number;
  recentlyAdded: number;
  pendingSubmissions: number;
};

export default function AdminDashboardClient({ initialStats }: { initialStats: DashboardStats }) {
  const { refreshVersion, connectionStatus } = useAdminRealtime();
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!cancelled && response.ok) {
        const json = await response.json();
        setStats(json.data || initialStats);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [refreshVersion, initialStats]);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNav />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Manage tools, blog posts, categories, and submissions.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            Realtime: <span className="ml-2 font-semibold text-slate-900">{connectionStatus}</span>
          </div>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard label="Total Tools" value={stats.totalTools} detail="Published tools in your directory." />
          <AdminStatCard label="Categories" value={stats.totalCategories} detail="Tool categories available." />
          <AdminStatCard label="Blog Posts" value={stats.totalBlogPosts} detail="Published blog articles." />
          <AdminStatCard label="Featured Tools" value={stats.featuredTools} detail="Tools marked as featured." />
          <AdminStatCard label="Recently Added" value={stats.recentlyAdded} detail="Tools added in last 30 days." />
          <AdminStatCard label="Pending Submissions" value={stats.pendingSubmissions} detail="Awaiting approval." />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <p className="mt-2 text-sm text-slate-600">Get started managing your content.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/tools/create" className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-4 text-center font-semibold text-indigo-600 transition hover:bg-indigo-100">
              + New Tool
            </Link>
            <Link href="/admin/tools" className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center font-semibold text-slate-900 transition hover:bg-slate-100">
              Manage Tools
            </Link>
            <Link href="/admin/blog/create" className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center font-semibold text-slate-900 transition hover:bg-slate-100">
              + New Post
            </Link>
            <Link href="/admin/submissions" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-center font-semibold text-rose-600 transition hover:bg-rose-100">
              Review Submissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
