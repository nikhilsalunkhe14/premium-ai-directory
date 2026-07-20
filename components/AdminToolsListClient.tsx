"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

type Tool = {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  pricing: string;
  description: string;
  website?: string;
  featured?: boolean;
  published?: boolean;
};

export default function AdminToolsListClient() {
  const { refreshVersion, latestEvent } = useAdminRealtime();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadTools() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/tools");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json?.message || "Unable to load tools.");
        return;
      }
      setTools(json.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load tools.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTool(slug: string) {
    if (!window.confirm("Delete this tool? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/tools/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json?.message || "Unable to delete tool.");
        return;
      }

      setTools((current) => current.filter((t) => t.slug !== slug && t.id !== slug));
    } catch (err) {
      console.error(err);
      alert("Unable to delete tool.");
    }
  }

  useEffect(() => {
    loadTools();
  }, [refreshVersion]);

  const filtered = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-sm text-slate-500">Loading tools...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={loadTools}
          className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center text-sm text-slate-500 py-8">
          No tools found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Pricing</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((tool) => (
                <tr key={tool.slug || tool.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{tool.name}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{tool.category}</td>
                  <td className="px-4 py-3 text-slate-600">{tool.pricing}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {tool.published && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Published
                        </span>
                      )}
                      {tool.featured && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/tools/${tool.slug || tool.id}`}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteTool(tool.slug || tool.id || tool.name)}
                        className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
