"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
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

        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:inline-block"
          >
            Submit Tool
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((current) => !current)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${open ? "block" : "hidden"} border-t border-gray-200 bg-white md:hidden`}>
        <div className="space-y-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Submit Tool
          </Link>
        </div>
      </div>
    </header>
  );
}
