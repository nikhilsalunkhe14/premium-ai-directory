"use client";

import { useEffect, useState } from "react";

type Tool = {
  slug?: string;
  id?: string;
  name: string;
  category: string;
  pricing: string;
  description: string;
  website?: string;
};

export default function AdminToolsList() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>(
    { type: "idle", message: "" }
  );

  async function loadTools() {
    setLoading(true);
    setError(null);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/admin/tools");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Unable to load published tools.");
        return;
      }
      setTools(json.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load published tools.");
    } finally {
      setLoading(false);
    }
  }

  async function removeTool(slug: string) {
    if (!window.confirm("Remove this tool from the directory? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/tools/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatus({ type: "error", message: json.message || "Unable to remove the tool." });
        return;
      }

      setTools((current) => current.filter((tool) => tool.slug !== slug && tool.id !== slug));
      setStatus({ type: "success", message: "Tool removed successfully." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Network error while removing the tool." });
    }
  }

  useEffect(() => {
    loadTools();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Published Tools</h2>
          <p className="mt-1 text-sm text-slate-600">
            Remove any live tool from the directory if it should no longer appear on the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={loadTools}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-6 text-sm text-slate-500">Loading published tools…</div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <>
          {status.type !== "idle" && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {status.message}
            </div>
          )}

          {tools.length === 0 ? (
            <div className="mt-6 text-sm text-slate-500">No published tools found.</div>
          ) : (
            <div className="mt-6 space-y-4">
              {tools.map((tool) => (
                <div key={tool.slug || tool.id || tool.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span>{tool.category}</span>
                        <span>•</span>
                        <span>{tool.pricing}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTool(tool.slug || tool.id || tool.name)}
                      className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                    >
                      Remove Tool
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {tool.description}
                  </p>
                  {tool.website ? (
                    <div className="mt-4 text-sm text-slate-500">
                      Website: <a href={tool.website} target="_blank" rel="noreferrer noopener" className="text-slate-900 underline">{tool.website}</a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
