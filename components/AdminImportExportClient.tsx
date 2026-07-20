"use client";

import { useMemo, useState } from "react";
import { autoMapColumns, buildCsvExport, buildJsonExport, buildImportPayload, parseImportText, validateImportRow } from "@/lib/import-export-utils";

type ImportResult = {
  rowIndex: number;
  payload: Record<string, unknown>;
  errors: string[];
  status: "ready" | "valid" | "invalid";
};

export default function AdminImportExportClient() {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [text, setText] = useState("");
  const [fieldMap, setFieldMap] = useState<Record<string, string | undefined>>({});
  const [results, setResults] = useState<ImportResult[]>([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set());
  const [existingWebsites, setExistingWebsites] = useState<Set<string>>(new Set());

  const parsed = useMemo(() => {
    if (!text.trim()) return { headers: [], rows: [] as Array<Record<string, string | undefined>> };
    try {
      return parseImportText(format, text);
    } catch {
      return { headers: [], rows: [] as Array<Record<string, string | undefined>> };
    }
  }, [format, text]);

  const mappedColumns = useMemo(() => autoMapColumns(parsed.headers), [parsed.headers]);

  function handlePreview() {
    const fieldMapValues = Object.fromEntries(Object.entries(mappedColumns).filter(([, value]) => Boolean(value)));
    setFieldMap(fieldMapValues);

    const nextResults: ImportResult[] = [];
    const batchSlugs = new Set<string>();
    const batchWebsites = new Set<string>();

    parsed.rows.forEach((row, index) => {
      const payload = buildImportPayload(row, mappedColumns);
      const validation = validateImportRow(payload, existingSlugs, existingWebsites, batchSlugs, batchWebsites);
      if (validation.errors.length === 0) {
        batchSlugs.add(payload.slug);
        batchWebsites.add(payload.tool_url);
        nextResults.push({ rowIndex: index + 2, payload, errors: [], status: "valid" });
      } else {
        nextResults.push({ rowIndex: index + 2, payload, errors: validation.errors, status: "invalid" });
      }
    });

    setResults(nextResults);
    setMessage(`Previewed ${nextResults.length} rows.`);
  }

  async function handleImport() {
    setImporting(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/import-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, rows: results.map((item) => item.payload), mode: "create" }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        setMessage(json.message || "Import failed.");
        return;
      }
      setMessage(`Imported ${json.imported} tools successfully.`);
    } catch (error) {
      console.error(error);
      setMessage("Import failed unexpectedly.");
    } finally {
      setImporting(false);
    }
  }

  function handleExport(formatValue: "csv" | "json") {
    const sampleRows = results.map((item) => ({
      name: String(item.payload.name ?? ""),
      slug: String(item.payload.slug ?? ""),
      website: String(item.payload.tool_url ?? ""),
      category: String(item.payload.category ?? ""),
      pricing: String(item.payload.pricing_type ?? ""),
      description: String(item.payload.description ?? ""),
      tags: Array.isArray(item.payload.tags) ? item.payload.tags.join(",") : "",
      featured: item.payload.featured ? "true" : "false",
      published: item.payload.published ? "true" : "false",
    }));
    const blob = new Blob([formatValue === "json" ? buildJsonExport(sampleRows) : buildCsvExport(sampleRows)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tools-export.${formatValue}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-slate-900">Format</span>
          <select value={format} onChange={(event) => setFormat(event.target.value as "csv" | "json")} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </label>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Detected columns</p>
          <p className="mt-2">{parsed.headers.length ? parsed.headers.join(", ") : "Upload a file to preview columns."}</p>
        </div>
      </div>

      <textarea value={text} onChange={(event) => setText(event.target.value)} rows={10} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm" placeholder={format === "csv" ? "name,slug,website,category,..." : '[{"name":"Example", "slug":"example"}]'} />

      <div className="flex flex-wrap gap-3">
        <button onClick={handlePreview} className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Preview data</button>
        <button onClick={() => handleImport()} disabled={importing || results.length === 0} className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{importing ? "Importing..." : "Import rows"}</button>
        <button onClick={() => handleExport("csv")} className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Export CSV</button>
        <button onClick={() => handleExport("json")} className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Export JSON</button>
      </div>

      {message ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{message}</div> : null}

      <div className="space-y-4">
        {results.map((result) => (
          <div key={`${result.rowIndex}-${result.payload.slug}`} className={`rounded-2xl border p-4 ${result.status === "valid" ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Row {result.rowIndex}: {String(result.payload.name || result.payload.slug || "Untitled")}</p>
                <p className="text-sm text-slate-600">{String(result.payload.tool_url || "No website provided")}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${result.status === "valid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {result.status === "valid" ? "Ready" : "Needs attention"}
              </span>
            </div>
            {result.errors.length > 0 ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-rose-700">{result.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
