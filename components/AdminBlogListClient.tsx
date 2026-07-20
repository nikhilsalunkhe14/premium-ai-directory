"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

type BlogEntry = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  author?: string;
  reading_time?: number;
  updated_at?: string;
};

export default function AdminBlogListClient() {
  const { refreshVersion } = useAdminRealtime();
  const [items, setItems] = useState<BlogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json?.message || "Unable to load blog posts.");
        return;
      }
      setItems(json.data || []);
    } catch (cause) {
      console.error(cause);
      setError("Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshVersion]);

  async function removePost(slug: string) {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json?.message || "Unable to delete post.");
        return;
      }
      setItems((current) => current.filter((item) => item.slug !== slug));
    } catch (cause) {
      console.error(cause);
      alert("Unable to delete post.");
    }
  }

  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = `${item.title} ${item.excerpt}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      const matchesStatus = status === "All" || (status === "published" ? item.published : !item.published);
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  if (loading) return <div className="text-sm text-slate-500">Loading blog posts…</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm">
          {categories.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All categories" : option}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm">
          <option value="All">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No posts match your filters.</div> : null}

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.slug} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  {item.featured ? <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">Featured</span> : null}
                  {item.published ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Published</span> : <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Draft</span>}
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{item.category}</span>
                  <span>{item.reading_time || 4} min read</span>
                  <span>{item.author || "AI Directory Editorial Team"}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/blog/${encodeURIComponent(item.slug)}`} className="rounded-2xl bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200">Edit</Link>
                <button onClick={() => removePost(item.slug)} className="rounded-2xl bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
