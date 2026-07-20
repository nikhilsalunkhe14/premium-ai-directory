"use client";

import { useState, useEffect } from "react";
import { useAdminRealtime } from "@/components/AdminRealtimeProvider";

const DEFAULT_CATEGORIES = [
  "Writing",
  "Design",
  "Coding",
  "Productivity",
  "Image Generation",
  "Marketing",
];

export default function AdminCategoriesListClient() {
  const { refreshVersion } = useAdminRealtime();
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [refreshVersion]);

  if (loading) return <div className="text-sm text-slate-500">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">{category}</p>
              <p className="text-xs text-slate-500">Edit or manage</p>
            </div>
            <button className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-200">
              Edit
            </button>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-4">Categories are currently static in your directory. To add new categories, update them in the admin panel or contact support.</p>
    </div>
  );
}
