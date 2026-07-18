"use client";

export default function AdBanner({
  size = "leaderboard",
}: {
  size?: "leaderboard" | "sidebar" | "in-article";
}) {
  if (size === "sidebar") {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Advertisement
        </p>
        <div className="mt-4 flex h-[250px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <span className="text-sm text-gray-300">300 x 250</span>
        </div>
      </div>
    );
  }

  if (size === "in-article") {
    return (
      <div className="my-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Advertisement
        </p>
        <div className="mx-auto mt-4 flex h-[280px] max-w-[336px] items-center justify-center rounded-xl border border-gray-200 bg-white">
          <span className="text-sm text-gray-300">336 x 280</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Advertisement
      </p>
      <div className="mx-auto mt-4 flex h-[90px] max-w-[728px] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <span className="text-sm text-gray-300">728 x 90</span>
      </div>
    </div>
  );
}
