"use client";

import { useEffect, useState } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adsense_consent");
      setConsent(stored);
      if (stored === "accepted") loadScript();
    } catch (e) {
      setConsent(null);
    }
  }, []);

  function loadScript() {
    if (!ADSENSE_CLIENT) return;
    if (document.querySelector("script[data-adsense-client]")) return;

    const s = document.createElement("script");
    s.setAttribute("async", "true");
    s.setAttribute("src", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`);
    s.setAttribute("data-adsense-client", ADSENSE_CLIENT);
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  function accept() {
    try {
      localStorage.setItem("adsense_consent", "accepted");
      setConsent("accepted");
      loadScript();
    } catch (e) {}
  }

  function decline() {
    try {
      localStorage.setItem("adsense_consent", "denied");
      setConsent("denied");
    } catch (e) {}
  }

  if (consent === "accepted") return null;

  if (consent === "denied") return null;

  // show consent banner
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border bg-white p-4 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Ads & privacy</p>
          <p className="mt-1 text-sm text-gray-600">We use Google AdSense to support the site. Accept to show relevant ads. You can change this later.</p>
        </div>
        <div className="mt-2 flex gap-2 sm:mt-0">
          <button onClick={decline} className="rounded-md border px-4 py-2 text-sm">Decline</button>
          <button onClick={accept} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Accept</button>
        </div>
      </div>
    </div>
  );
}
