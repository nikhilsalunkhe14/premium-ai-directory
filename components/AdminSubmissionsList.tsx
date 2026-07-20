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
  approved?: boolean;
};

export default function AdminSubmissionsList() {
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshVersion]);

  async function setApproved(id: string, val: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: val }),
      });
      const json = await res.json();
      if (json?.success) {
        setItems((s) => s.filter((x) => x.id !== id));
      } else {
        alert(json?.message || "Unable to update");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Loading submissions…</div>;

  if (!items || items.length === 0)
    return <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No pending submissions.</div>;

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div key={s.id} className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-lg shadow-slate-200/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold text-white">{s.name}</div>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">{s.category}</span>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">{s.pricing}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{s.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                {s.submitter_name ? <span>By {s.submitter_name}</span> : null}
                {s.tags?.length ? <span>Tags: {s.tags.join(", ")}</span> : null}
                {s.email ? <span>{s.email}</span> : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.website ? (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-slate-700"
                >
                  Visit site
                </a>
              ) : null}
              <button
                onClick={() => setApproved(s.id, true)}
                disabled={busyId === s.id}
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {busyId === s.id ? "Working…" : "Approve"}
              </button>
              <button
                onClick={() => setApproved(s.id, false)}
                disabled={busyId === s.id}
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Submitted: {s.created_at || "Recently"}</span>
            {s.affiliate_url ? <span>Affiliate: {s.affiliate_url}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
