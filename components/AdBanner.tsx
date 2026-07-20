"use client";

import { useEffect, useState } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE_SLOT_LEADERBOARD = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD;
const ADSENSE_SLOT_SIDEBAR = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
const ADSENSE_SLOT_INARTICLE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE;

function renderPlaceholder(size: "leaderboard" | "sidebar" | "in-article") {
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

export default function AdBanner({
  size = "leaderboard",
}: {
  size?: "leaderboard" | "sidebar" | "in-article";
}) {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adsense_consent");
      setConsent(stored === "accepted" ? true : stored === "denied" ? false : null);
    } catch (e) {
      setConsent(null);
    }
  }, []);

  // If we don't have consent or no client id, show placeholder
  if (!ADSENSE_CLIENT || consent !== true) {
    return renderPlaceholder(size);
  }

  // Determine slot
  const slot = size === "sidebar" ? ADSENSE_SLOT_SIDEBAR : size === "in-article" ? ADSENSE_SLOT_INARTICLE : ADSENSE_SLOT_LEADERBOARD;

  if (!slot) return renderPlaceholder(size);

  // Render a standard AdSense slot element
  return (
    <div className="my-8 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={size === "leaderboard" ? "auto" : "auto"}
        data-full-width-responsive={size === "leaderboard" ? "true" : "true"}
      />
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  );
}
