"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

type AnalyticsData = {
  cards: Record<string, number | string>;
  charts: Array<{ key: string; label: string; values: Array<{ label: string; value: number }> }>;
  topPages: Array<{ path: string; count: number }>;
  topTools: Array<{ toolId: string; count: number }>;
  topBlogs: Array<{ slug: string; count: number }>;
  topSearchQueries: Array<{ query: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  trafficSources: Array<{ referrer: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  outboundClicks: Array<{ toolId: string | null; slug: string | null; createdAt: string; country: string | null; device: string | null }>;
};

export default function AdminAnalyticsDashboard() {
  const { refreshVersion } = useAdminRealtime();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("range", range);
        const response = await fetch(`/api/admin/analytics?${params.toString()}`);
        const json = await response.json();
        if (!cancelled && json?.success) setData(json.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [range, refreshVersion]);

  const cards = useMemo(() => data?.cards || {}, [data]);

  async function exportCsv() {
    if (!data) return;
    const rows = [
      ["eventType", "toolId", "slug", "path", "referrer", "country", "device", "createdAt"],
      ...((data.outboundClicks || []).map((item) => ["outbound_click", item.toolId || "", item.slug || "", "", "", item.country || "", item.device || "", item.createdAt || ""])),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Analytics Overview</h2>
          <p className="text-sm text-slate-600">Lightweight analytics for visits, clicks, searches, and traffic patterns.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button onClick={exportCsv} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Export CSV</button>
        </div>
      </div>

      {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading analytics…</div> : null}

      {!loading && data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total Visitors", cards.totalVisitors || 0],
              ["Returning Visitors", cards.returningVisitors || 0],
              ["Tool Views", cards.toolViews || 0],
              ["Blog Views", cards.blogViews || 0],
              ["Searches", cards.searches || 0],
              ["Outbound Clicks", cards.outboundClicks || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">{label}</div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Top Pages</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.topPages.map((item) => <li key={item.path} className="flex justify-between"><span>{item.path}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Top Search Queries</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.topSearchQueries.map((item) => <li key={item.query} className="flex justify-between"><span>{item.query}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Top Tools</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.topTools.map((item) => <li key={item.toolId} className="flex justify-between"><span>{item.toolId}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Top Blogs</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.topBlogs.map((item) => <li key={item.slug} className="flex justify-between"><span>{item.slug}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Traffic Sources & Devices</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.trafficSources.map((item) => <li key={item.referrer} className="flex justify-between"><span>{item.referrer}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
                {data.devices.map((item) => <li key={item.device} className="flex justify-between"><span>{item.device}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Countries & Outbound Clicks</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {data.countries.map((item) => <li key={item.country} className="flex justify-between"><span>{item.country}</span><span className="font-semibold text-slate-900">{item.count}</span></li>)}
                {data.outboundClicks.map((item) => <li key={`${item.toolId}-${item.createdAt}`} className="flex justify-between"><span>{item.slug || item.toolId || "Outbound"}</span><span className="font-semibold text-slate-900">{item.country || "Unknown"}</span></li>)}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
