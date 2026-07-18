"use client";

import { useState } from "react";

const CATEGORIES = [
  "Writing",
  "Design",
  "Coding",
  "Productivity",
  "Image Generation",
  "Marketing",
];

export default function SubmitForm() {
  const [formState, setFormState] = useState({
    toolName: "",
    website: "",
    category: "",
    pricing: "Free",
    description: "",
    email: "",
    affiliateUrl: "",
    websiteUrl: "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>(
    { type: "idle", message: "" }
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setLoading(true);

    const payload = {
      toolName: formState.toolName.trim(),
      website: formState.website.trim(),
      category: formState.category,
      pricing: formState.pricing,
      description: formState.description.trim(),
      email: formState.email.trim(),
      affiliateUrl: formState.affiliateUrl.trim(),
      honeypot: formState.websiteUrl.trim(),
    };

    try {
      const response = await fetch("/api/submit-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setStatus({
          type: "error",
          message: result.message || "Unable to submit the tool right now. Please try again later.",
        });
      } else {
        setStatus({
          type: "success",
          message: "Thanks! Your tool submission has been received. We’ll review it shortly.",
        });
        setFormState({
          toolName: "",
          website: "",
          category: "",
          pricing: "Free",
          description: "",
          email: "",
          affiliateUrl: "",
          websiteUrl: "",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "A network error occurred. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Submit Your AI Tool</h2>
      <p className="mt-2 text-sm text-gray-500">
        Share a new AI tool with our audience. We screen every submission for quality before it appears in the directory.
      </p>

      <form
        className="mt-8 space-y-6"
        action="/api/submit-tool"
        method="post"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="websiteUrl"
          value={formState.websiteUrl}
          onChange={handleChange}
          className="hidden"
          autoComplete="off"
          tabIndex={-1}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-900">Tool Name *</span>
            <input
              name="toolName"
              value={formState.toolName}
              onChange={handleChange}
              required
              maxLength={100}
              className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="ChatGPT"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-900">Website URL *</span>
            <input
              name="website"
              value={formState.website}
              onChange={handleChange}
              required
              type="url"
              maxLength={200}
              className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://example.com"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-900">Category *</span>
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-900">Pricing *</span>
            <select
              name="pricing"
              value={formState.pricing}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option>Free</option>
              <option>Freemium</option>
              <option>Paid</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-900">Short Description *</span>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            required
            maxLength={1200}
            rows={5}
            className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="A short summary of what the tool does and who it helps."
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-900">Affiliate / Referral URL</span>
          <input
            name="affiliateUrl"
            value={formState.affiliateUrl}
            onChange={handleChange}
            type="url"
            maxLength={200}
            className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="https://example.com/referral"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-900">Your Email (optional)</span>
          <input
            name="email"
            value={formState.email}
            onChange={handleChange}
            type="email"
            maxLength={100}
            className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </label>

        {status.type !== "idle" && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          onClick={() => console.log('submit clicked', formState)}
        >
          {loading ? "Submitting…" : "Submit Tool"}
        </button>
      </form>
    </div>
  );
}
