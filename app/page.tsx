export const dynamic = "force-dynamic";

import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";
import { getPublicTools } from "@/lib/public-tools";
import HomePageContent from "@/components/HomePageContent";

async function fetchTools(): Promise<Tool[]> {
  const tools = await getPublicTools();
  return tools.length > 0 ? tools : MOCKUP_TOOLS;
}

export const metadata = {
  title: "Premium AI Directory — Find the Best Free AI Tools",
  description:
    "Discover and compare the best free AI tools across categories like writing, design, coding, and productivity.",
  keywords: ["AI tools", "free AI tools", "AI directory", "best AI apps"],
  openGraph: { images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app"}/og-image.png`] },
  twitter: { images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app"}/og-image.png`] },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app"}/` },
  robots: { index: true, follow: true },
};

export default async function Home() {
  const tools = await fetchTools();

  return <HomePageContent tools={tools} />;
}
