import Link from "next/link";
import type { Tool } from "@/lib/mockup-tools";

const CATEGORY_COLORS: Record<string, string> = {
  Writing: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Coding: "bg-green-100 text-green-700",
  Productivity: "bg-amber-100 text-amber-700",
  Marketing: "bg-pink-100 text-pink-700",
  "Image Generation": "bg-rose-100 text-rose-700",
};

const DEFAULT_COLOR = "bg-gray-100 text-gray-700";

export default function ToolCard({ tool }: { tool: Tool }) {
  const badge = CATEGORY_COLORS[tool.category] ?? DEFAULT_COLOR;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        tool.sponsored
          ? "border-amber-200 hover:border-amber-300"
          : tool.featured
            ? "border-indigo-200 hover:border-indigo-300"
            : "border-gray-200 hover:border-indigo-200"
      }`}
    >
      {/* ── Sponsored / Featured Badges ──────────────── */}
      {tool.sponsored && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
            <svg
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Sponsored
          </span>
        </div>
      )}

      {!tool.sponsored && tool.featured && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
            <svg
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.12.513.503.713.988.426l4.243-2.581 4.243 2.581c.485.287.868.087.988-.426l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            Featured
          </span>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
            {tool.name}
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}
          >
            {tool.category}
          </span>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            tool.pricing === "Free"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {tool.pricing}
        </span>

        <Link
          href={`/tool/${tool.id}`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
