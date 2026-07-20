"use client";

import { useEffect, useState } from "react";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

type Submission = {
  id: string;
  name: string;
  website: string;
  category: string;
  pricing: string;
  description: string;
  email?: string;
  submitter_name?: string;
  tags?: string[];
  affiliate_url?: string;
  created_at?: string;
};

export default function AdminSubmissionQueue() {
  const { refreshVersion } = useAdminRealtime();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const json = await res.json();
      if (json?.success) setItems(json.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshVersion]);

  async function updateStatus(id: string, approved: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const json = await res.json();
      if (json?.success) {
        setItems((current) => current.filter((item) => item.id !== id));
      } else {
        alert(json?.message || "Unable to update submission.");
      }
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading pending queue…</div>;

  if (!items.length) return <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No pending submissions.</div>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">{item.category}</span>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.pricing}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {item.submitter_name ? <span>By {item.submitter_name}</span> : null}
                {item.tags?.length ? <span>Tags: {item.tags.join(", ")}</span> : null}
                {item.email ? <span>{item.email}</span> : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={item.website} target="_blank" rel="noreferrer" className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">Visit site</a>
              <button onClick={() => updateStatus(item.id, true)} disabled={busyId === item.id} className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Approve</button>
              <button onClick={() => updateStatus(item.id, false)} disabled={busyId === item.id} className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
