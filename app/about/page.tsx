import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadata = {
  title: "About — Premium AI Directory",
  description:
    "Learn about Premium AI Directory — our mission, how we select tools, and how to contact us.",
  keywords: ["About", "Premium AI Directory", "AI tools"],
  openGraph: { images: [`${BASE_URL}/og-image.png`] },
  twitter: { images: [`${BASE_URL}/og-image.png`] },
  alternates: { canonical: `${BASE_URL}/about` },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">About Premium AI Directory</h1>

      <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
        Premium AI Directory is a curated, searchable collection of high-quality AI tools and
        applications. We focus on discoverability and practical categorization to help users find
        the right AI tool for their needs — whether that's writing, image generation, developer
        productivity, or research.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-gray-100">Our Mission</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        Our mission is to make AI tools easy to find and evaluate. We aim to surface free and
        freemium tools that provide real value, and to present them transparently so users can
        quickly compare features, pricing, and use-cases.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-gray-100">How Tools Are Selected</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        Tools are selected through a combination of editorial review and community submissions. We
        evaluate tools for usefulness, reliability, and developer responsiveness. Submissions are
        reviewed by our editorial team before being published to ensure they meet our quality
        standards.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        For press, partnerships, or support please reach out: <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>.
      </p>

      <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-gray-100">Trust & Transparency</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        We value user privacy and transparency. We do not sell user data, and where third-party
        services (including advertising networks) are used, we disclose them in our Privacy and
        Cookie Policy pages. If a tool is promoted via an affiliate relationship, it will be
        clearly disclosed.
      </p>
    </div>
  );
}
