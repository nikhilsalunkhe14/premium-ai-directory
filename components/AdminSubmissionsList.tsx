"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  name: string;
  website: string;
  category: string;
  pricing: string;
  description: string;
  email?: string;
  affiliate_url?: string;
  created_at?: string;
  approved?: boolean;
};

export default function AdminSubmissionsList() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  async function setApproved(id: string, val: boolean) {
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
    }
  }

  if (loading) return <div>Loading submissions…</div>;

  if (!items || items.length === 0)
    return <div className="p-6 text-gray-500">No pending submissions.</div>;

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div key={s.id} className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-lg shadow-slate-200/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-lg font-semibold text-white">{s.name}</div>
              <div className="mt-1 text-sm text-slate-300">{s.category} • {s.pricing}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setApproved(s.id, true)}
                className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Approve
              </button>
              <button
                onClick={() => setApproved(s.id, false)}
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Reject
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-200">{s.description}</p>
          <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Submitted: {s.created_at}</span>
            {s.website ? (
              <a
                href={s.website}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Visit submitted site
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
