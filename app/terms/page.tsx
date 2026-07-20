import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadata: Metadata = {
  title: "Terms of Service | AI Directory",
  description: "Review the terms of service for using the AI Directory website.",
  keywords: ["terms of service", "tos", "ai directory"],
  openGraph: { images: [`${BASE_URL}/og-image.png`] },
  twitter: { images: [`${BASE_URL}/og-image.png`] },
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          By using AI Directory, you agree to our terms for submissions, content usage, and responsible behavior.
        </p>

        <section className="mt-10 space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Content Submissions</h2>
            <p className="mt-3 text-gray-600">
              Submitted tools should be lawful, accurate, and not infringe the rights of third parties. We reserve the right to reject or remove any submission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Affiliate Links</h2>
            <p className="mt-3 text-gray-600">
              Some links on this site are affiliate links. If you purchase through those links, we may earn a commission at no additional cost to you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Disclaimer</h2>
            <p className="mt-3 text-gray-600">
              AI Directory does not guarantee the availability, performance, or pricing of third-party tools listed on the site.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
