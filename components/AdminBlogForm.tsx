"use client";

import { useMemo, useState } from "react";
import AdminImageUploader from "@/components/AdminImageUploader";

type BlogFormProps = {
  initialValues?: Record<string, unknown>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
};

const CATEGORIES = ["Writing", "Design", "Coding", "Productivity", "Marketing", "General"];

function slugify(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminBlogForm({ initialValues, onSubmit, submitLabel = "Save Post" }: BlogFormProps) {
  const [form, setForm] = useState<Record<string, unknown>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    tags: "",
    author: "AI Directory Editorial Team",
    cover_image: "",
    thumbnail_image: "",
    published: false,
    featured: false,
    seo_title: "",
    seo_description: "",
    focus_keyword: "",
    canonical_url: "",
    og_image: "",
    twitter_image: "",
    reading_time: 4,
    publish_date: "",
    updated_date: "",
    status: "draft",
    ...initialValues,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const readingTime = useMemo(() => {
    const words = String(form.content || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [form.content]);

  function updateField(name: string, value: unknown) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload: Record<string, unknown> = {
      ...form,
      title: String(form.title || "").trim(),
      slug: String(form.slug || slugify(String(form.title || ""))).trim(),
      excerpt: String(form.excerpt || "").trim(),
      content: String(form.content || "").trim(),
      category: String(form.category || "General").trim(),
      tags: String(form.tags || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      author: String(form.author || "AI Directory Editorial Team").trim(),
      cover_image: String(form.cover_image || "").trim(),
      thumbnail_image: String(form.thumbnail_image || "").trim(),
      reading_time: Number(form.reading_time || readingTime),
      published: Boolean(form.published),
      featured: Boolean(form.featured),
      seo_title: String(form.seo_title || "").trim(),
      seo_description: String(form.seo_description || "").trim(),
      focus_keyword: String(form.focus_keyword || "").trim(),
      canonical_url: String(form.canonical_url || "").trim(),
      og_image: String(form.og_image || "").trim(),
      twitter_image: String(form.twitter_image || "").trim(),
      publish_date: String(form.publish_date || "").trim(),
      updated_date: String(form.updated_date || "").trim(),
      status: Boolean(form.published) ? "published" : String(form.status || "draft"),
    };

    if (!payload.title || !payload.content || !payload.excerpt) {
      setError("Title, excerpt, and content are required.");
      setSaving(false);
      return;
    }

    if (!payload.slug) {
      payload.slug = slugify(String(payload.title));
    }

    await onSubmit(payload);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Title *</span>
          <input
            value={String(form.title || "")}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Why AI tools are reshaping product teams"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Slug</span>
          <input
            value={String(form.slug || "")}
            onChange={(event) => updateField("slug", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            placeholder="ai-tools-product-teams"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Excerpt *</span>
          <textarea
            value={String(form.excerpt || "")}
            onChange={(event) => updateField("excerpt", event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Author</span>
          <input
            value={String(form.author || "")}
            onChange={(event) => updateField("author", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Category</span>
          <select
            value={String(form.category || "General")}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Tags</span>
          <input
            value={String(form.tags || "")}
            onChange={(event) => updateField("tags", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            placeholder="ai, product, automation"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Publish Date</span>
          <input
            type="datetime-local"
            value={String(form.publish_date || "")}
            onChange={(event) => updateField("publish_date", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Updated Date</span>
          <input
            type="datetime-local"
            value={String(form.updated_date || "")}
            onChange={(event) => updateField("updated_date", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminImageUploader label="Cover Image" value={String(form.cover_image || "")} onChange={(url) => updateField("cover_image", url)} />
        <AdminImageUploader label="Thumbnail Image" value={String(form.thumbnail_image || "")} onChange={(url) => updateField("thumbnail_image", url)} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Full Content *</h3>
            <p className="text-sm text-slate-500">Supports headings, lists, tables, code blocks, images, and quotes.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">{readingTime} min read</span>
        </div>
        <textarea
          value={String(form.content || "")}
          onChange={(event) => updateField("content", event.target.value)}
          rows={14}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm"
          placeholder="# Title\n\n- Bullet list\n\n## Section\n\n> Quote"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">SEO Title</span>
          <input
            value={String(form.seo_title || "")}
            onChange={(event) => updateField("seo_title", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Focus Keyword</span>
          <input
            value={String(form.focus_keyword || "")}
            onChange={(event) => updateField("focus_keyword", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
      </div>

      <label className="block text-sm text-slate-700">
        <span className="mb-2 block font-semibold text-slate-900">SEO Description</span>
        <textarea
          value={String(form.seo_description || "")}
          onChange={(event) => updateField("seo_description", event.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
        />
      </label>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">Canonical URL</span>
          <input
            value={String(form.canonical_url || "")}
            onChange={(event) => updateField("canonical_url", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-semibold text-slate-900">OpenGraph Image</span>
          <input
            value={String(form.og_image || "")}
            onChange={(event) => updateField("og_image", event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
      </div>

      <label className="block text-sm text-slate-700">
        <span className="mb-2 block font-semibold text-slate-900">Twitter Image</span>
        <input
          value={String(form.twitter_image || "")}
          onChange={(event) => updateField("twitter_image", event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={Boolean(form.published)} onChange={(event) => updateField("published", event.target.checked)} />
          Published
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => updateField("featured", event.target.checked)} />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
