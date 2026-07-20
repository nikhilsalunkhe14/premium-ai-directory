export default function GoogleAdsPlaceholder({
  size = "leaderboard",
}: {
  size?: "leaderboard" | "sidebar" | "in-article";
}) {
  const sizeConfig = {
    leaderboard: {
      label: "Leaderboard Ad",
      width: "728",
      height: "90",
      className: "h-[90px] max-w-[728px]",
    },
    sidebar: {
      label: "Sidebar Ad",
      width: "300",
      height: "250",
      className: "h-[250px] w-full max-w-[300px]",
    },
    "in-article": {
      label: "In-Article Ad",
      width: "336",
      height: "280",
      className: "h-[280px] max-w-[336px]",
    },
  }[size];

  return (
    <div
      className={`mx-auto rounded-3xl border border-dashed border-gray-300 bg-white/80 p-4 text-center shadow-sm ${sizeConfig.className}`}
      role="complementary"
      aria-label={`${sizeConfig.label} placeholder`}
    >
      <p className="text-sm font-semibold text-gray-500">Advertisement</p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-400">
        {sizeConfig.label}
      </p>
      <p className="mt-4 text-sm text-gray-400">
        This area is reserved for Google Ads. The design is kept placeholder-only until AdSense code is inserted.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
        {sizeConfig.width} x {sizeConfig.height}
      </div>
    </div>
  );
}
