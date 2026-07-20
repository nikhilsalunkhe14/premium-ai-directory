"use client";

import React from "react";

type Props = {
  href: string;
  toolId?: string;
  slug?: string;
  path?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function VisitButton({ href, toolId, slug, path, className, children }: Props) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();

    // Open link in a new tab immediately
    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch (err) {
      // fallback: let the anchor navigate
      window.location.href = href;
    }

    // Fire-and-forget analytics call to server route
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "outbound_click",
          toolId: toolId || null,
          slug: slug || null,
          path: path || null,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  return (
    <a href={href} onClick={handleClick} target="_blank" rel="noopener noreferrer sponsored" className={className}>
      {children}
    </a>
  );
}
