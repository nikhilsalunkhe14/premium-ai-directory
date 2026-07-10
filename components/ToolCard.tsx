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
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md">
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
          href={`/tools/${tool.id}`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
