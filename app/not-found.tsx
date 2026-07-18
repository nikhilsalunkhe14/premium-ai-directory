import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-500">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
