import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadataBase = new URL(BASE_URL);

export const metadata: Metadata = {
  title: "The Ultimate Free AI Tools Directory | Discover Best AI Apps",
  description:
    "Explore the largest curated directory of free AI tools. Find the best AI apps for writing, image generation, coding, productivity, and more — updated daily.",
  keywords: [
    "AI tools directory",
    "free AI tools",
    "best AI apps",
    "AI tool finder",
    "artificial intelligence tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.json" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Premium AI Directory",
              url: BASE_URL,
              logo: `${BASE_URL}/favicon.svg`,
              sameAs: [],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: BASE_URL,
              name: "Premium AI Directory",
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/tools?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Automatically load AdSense script when NEXT_PUBLIC_ADSENSE_CLIENT is set (no consent banner). */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
              process.env.NEXT_PUBLIC_ADSENSE_CLIENT.startsWith("ca-pub-")
                ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT
                : `ca-${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`
            }`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>

      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <Link href="/" className="text-lg font-bold text-gray-900">
                  AI<span className="text-indigo-600">Directory</span>
                </Link>
                <p className="mt-2 text-sm text-gray-500">Discover the best free AI tools, updated daily.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Directory</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/tools" className="text-sm text-gray-500 hover:text-gray-700">
                      Browse Tools
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-sm text-gray-500 hover:text-gray-700">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools?sort=new" className="text-sm text-gray-500 hover:text-gray-700">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools?sort=popular" className="text-sm text-gray-500 hover:text-gray-700">
                      Popular
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Company</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">About</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Contact</Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Follow</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a href="https://github.com/" className="text-sm text-gray-500 hover:text-gray-700">GitHub</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
