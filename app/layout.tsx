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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadataBase = new URL(BASE_URL);

export const metadata: Metadata = {
  title:
    "The Ultimate Free AI Tools Directory | Discover Best AI Apps",
  description:
    "Explore the largest curated directory of free AI tools. Find the best AI apps for writing, image generation, coding, productivity, and more — updated daily.",
  keywords: [
    "AI tools directory",
    "free AI tools",
    "best AI apps",
    "AI tool finder",
    "artificial intelligence tools",
    "AI software directory",
    "AI productivity tools",
    "AI image generator",
    "AI writing assistant",
  ],
  openGraph: {
    title: "The Ultimate Free AI Tools Directory | Discover Best AI Apps",
    description:
      "Explore the largest curated directory of free AI tools. Find the best AI apps for writing, image generation, coding, productivity, and more.",
    type: "website",
    siteName: "AI Tools Directory",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Premium AI Directory — Discover best AI tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ultimate Free AI Tools Directory | Discover Best AI Apps",
    description:
      "Explore the largest curated directory of free AI tools. Find the best AI apps for writing, image generation, coding, productivity, and more.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blog" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <Link
                  href="/"
                  className="text-lg font-bold text-gray-900"
                >
                  AI<span className="text-indigo-600">Directory</span>
                </Link>
                <p className="mt-2 text-sm text-gray-500">
                  Discover the best free AI tools, updated daily.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Directory
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link
                      href="/tools"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Browse Tools
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools?sort=new"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools?sort=popular"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Popular
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Company
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/submit"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Submit a Tool
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cookie-policy"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Stay Updated
                </h3>
                <p className="mt-3 text-sm text-gray-500">
                  Get the latest AI tools delivered to your inbox.
                </p>
                <form className="mt-3 flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AI Directory. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
