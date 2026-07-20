"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900">Something went wrong</h1>
      <p className="mt-4 max-w-xl text-lg text-gray-500">
        We couldn’t load this page right now. Please try again or explore the directory while we fix the issue.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Back to Home
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          Browse AI Tools
        </Link>
      </div>
    </div>
  );
}
