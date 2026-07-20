import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-500">
        This page could not be found. Try browsing our tools directory or returning to the homepage.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Back to Home
        </Link>
        <Link
          href="/tools"
          className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          Browse AI Tools
        </Link>
      </div>
    </div>
  );
}
