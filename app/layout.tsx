import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ultimate Free AI Tools Directory | Discover Best AI Apps",
    description:
      "Explore the largest curated directory of free AI tools. Find the best AI apps for writing, image generation, coding, productivity, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.example.com",
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
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              AI<span className="text-indigo-600">Directory</span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Submit Tool
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  AI<span className="text-indigo-600">Directory</span>
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  Discover the best free AI tools, updated daily.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Directory
                </h3>
                <ul className="mt-3 space-y-2">
                  {["Browse Tools", "Categories", "New Arrivals", "Popular"].map(
                    (item) => (
                      <li key={item}>
                        <Link
                          href="/"
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          {item}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Company
                </h3>
                <ul className="mt-3 space-y-2">
                  {["About", "Blog", "Contact", "Privacy Policy"].map((item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
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
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
