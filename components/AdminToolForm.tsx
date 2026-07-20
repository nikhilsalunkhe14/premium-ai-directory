"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminImageUploader from "./AdminImageUploader";

const CATEGORIES = [
  "Writing",
  "Design",
  "Coding",
  "Productivity",
  "Image Generation",
  "Marketing",
  "Other",
];

type ToolFormProps = {
  mode: "create" | "edit";
  initialData?: Record<string, any>;
};

export default function AdminToolForm({ mode, initialData }: ToolFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    website: initialData?.tool_url || initialData?.website || "",
    logoUrl: initialData?.logo_url || "",
    shortDescription: initialData?.description || initialData?.short_description || "",
    fullDescription: initialData?.full_description || "",
    category: initialData?.category || "Other",
    pricing: initialData?.pricing_type || initialData?.pricing || "Free",
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : "",
    features: Array.isArray(initialData?.features) ? initialData.features.join(", ") : "",
    pros: Array.isArray(initialData?.pros) ? initialData.pros.join(", ") : "",
    cons: Array.isArray(initialData?.cons) ? initialData.cons.join(", ") : "",
    bestUseCases: Array.isArray(initialData?.best_use_cases) ? initialData.best_use_cases.join(", ") : "",
    alternatives: Array.isArray(initialData?.alternatives) ? initialData.alternatives.join(", ") : "",
    seoTitle: initialData?.seo_title || "",
    seoDescription: initialData?.seo_description || "",
    featured: initialData?.featured || false,
    published: initialData?.published !== false,
  });

  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>(
    Array.isArray(initialData?.faq) ? initialData.faq : []
  );

  function addFaqItem() {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  }

  function updateFaqItem(index: number, question: string, answer: string) {
    const updated = [...faqItems];
    updated[index] = { question, answer };
    setFaqItems(updated);
  }

  function removeFaqItem(index: number) {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        features: form.features.split(",").map((t) => t.trim()).filter(Boolean),
        pros: form.pros.split(",").map((t) => t.trim()).filter(Boolean),
        cons: form.cons.split(",").map((t) => t.trim()).filter(Boolean),
        bestUseCases: form.bestUseCases.split(",").map((t) => t.trim()).filter(Boolean),
        alternatives: form.alternatives.split(",").map((t) => t.trim()).filter(Boolean),
        faq: faqItems,
      };

      const url =
        mode === "edit"
          ? `/api/admin/tools/${encodeURIComponent(initialData?.slug)}`
          : "/api/admin/tools";
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setError(json?.message || "Unable to save tool.");
        return;
      }

      setSuccess(mode === "create" ? "Tool created successfully." : "Tool updated successfully.");
      setTimeout(() => router.push("/admin/tools"), 1500);
    } catch (err) {
      console.error(err);
      setError("Unable to save tool. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <fieldset className="space-y-4 border-b border-slate-200 pb-8">
        <legend className="text-lg font-semibold text-slate-900">Basic Information</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tool Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Website URL *</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Pricing *</label>
          <input
            type="text"
            value={form.pricing}
            onChange={(e) => setForm({ ...form, pricing: e.target.value })}
            placeholder="e.g., Free, Freemium, Paid"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Short Description *</label>
          <textarea
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            maxLength={160}
            rows={2}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
          <p className="mt-1 text-xs text-slate-500">{form.shortDescription.length}/160</p>
        </div>
      </fieldset>

      {/* Full Description & Logo */}
      <fieldset className="space-y-4 border-b border-slate-200 pb-8">
        <legend className="text-lg font-semibold text-slate-900">Content & Media</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Description</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            rows={6}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <AdminImageUploader
          label="Logo URL"
          value={form.logoUrl}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
        />
      </fieldset>

      {/* Tags & Lists */}
      <fieldset className="space-y-4 border-b border-slate-200 pb-8">
        <legend className="text-lg font-semibold text-slate-900">Tags & Features</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="AI, Writing, Tools"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Features (comma-separated)</label>
          <input
            type="text"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Pros (comma-separated)</label>
          <input
            type="text"
            value={form.pros}
            onChange={(e) => setForm({ ...form, pros: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Cons (comma-separated)</label>
          <input
            type="text"
            value={form.cons}
            onChange={(e) => setForm({ ...form, cons: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Best Use Cases (comma-separated)</label>
          <input
            type="text"
            value={form.bestUseCases}
            onChange={(e) => setForm({ ...form, bestUseCases: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Alternatives (comma-separated)</label>
          <input
            type="text"
            value={form.alternatives}
            onChange={(e) => setForm({ ...form, alternatives: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </fieldset>

      {/* FAQ */}
      <fieldset className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center justify-between">
          <legend className="text-lg font-semibold text-slate-900">FAQ</legend>
          <button
            type="button"
            onClick={addFaqItem}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-200"
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateFaqItem(idx, e.target.value, item.answer)}
                placeholder="Question"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateFaqItem(idx, item.question, e.target.value)}
                placeholder="Answer"
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <button
                type="button"
                onClick={() => removeFaqItem(idx)}
                className="text-sm font-semibold text-rose-600 hover:text-rose-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {/* SEO */}
      <fieldset className="space-y-4 border-b border-slate-200 pb-8">
        <legend className="text-lg font-semibold text-slate-900">SEO Metadata</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700">SEO Title</label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            maxLength={60}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="mt-1 text-xs text-slate-500">{form.seoTitle.length}/60</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">SEO Description</label>
          <textarea
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            maxLength={160}
            rows={2}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="mt-1 text-xs text-slate-500">{form.seoDescription.length}/160</p>
        </div>
      </fieldset>

      {/* Status */}
      <fieldset className="space-y-4 pb-8">
        <legend className="text-lg font-semibold text-slate-900">Status</legend>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 bg-white accent-indigo-600"
          />
          <span className="text-sm text-slate-700">Published</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 bg-white accent-indigo-600"
          />
          <span className="text-sm text-slate-700">Featured</span>
        </label>
      </fieldset>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-2xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Tool" : "Update Tool"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-2xl border border-slate-300 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
