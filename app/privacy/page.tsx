import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Directory",
  description: "Read our privacy policy for the AI Directory site, including data handling and user submission practices.",
  keywords: ["privacy", "data", "cookie policy", "ai directory"],
  openGraph: { images: [`${BASE_URL}/og-image.png`] },
  twitter: { images: [`${BASE_URL}/og-image.png`] },
  alternates: { canonical: `${BASE_URL}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          AI Directory respects your privacy. We do not sell personal information and only collect the minimum data required to review tool submissions.
        </p>

        <section className="mt-10 space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
            <p className="mt-3 text-gray-600">
              We collect submission details such as tool name, website, category, pricing, and optional email address when you submit a tool through our form.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">How We Use It</h2>
            <p className="mt-3 text-gray-600">
              Submitted information is used to verify and publish tools in our directory. If you provide an email, we may contact you about your submission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Third-Party Services</h2>
            <p className="mt-3 text-gray-600">
              We may use third-party services like Supabase to store submissions and analytics tools to improve the website. We do not share personal data outside of these services without consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Cookies and Tracking</h2>
            <p className="mt-3 text-gray-600">
              This site uses standard website cookies for functional and performance purposes. We do not use cookies to track users across unrelated websites.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
