"use client";

import { useState } from "react";

type AdminImageUploaderProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export default function AdminImageUploader({ label, value, onChange }: AdminImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5_242_880) {
      setError("Upload must be smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    setUploading(true);
    try {
      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        setError(json?.message || "Image upload failed.");
        return;
      }

      onChange(String(json.url));
    } catch (cause) {
      console.error(cause);
      setError("Unable to upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900"
        />
        <span className="text-sm text-slate-500">{uploading ? "Uploading…" : "Max 5MB"}</span>
      </div>
      {value ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-3">
          <img src={value} alt="Preview" className="h-24 w-full max-w-xs rounded-2xl object-cover" />
        </div>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
