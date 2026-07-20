import type { Metadata } from "next";

export const SITE_NAME = "AI Directory";
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://premium-ai-directory-mu.vercel.app";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function buildCanonicalUrl(path: string) {
  const normalizedPath = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  return normalizedPath.replace(/([^:]\/)(\/)+/g, "$1");
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";
}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: buildCanonicalUrl(path),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
