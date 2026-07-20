const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadata = {
  title: "Cookie Policy — Premium AI Directory",
  description: "Learn about cookies, analytics, third-party cookies, and how to manage them.",
  keywords: ["cookies", "cookie policy", "tracking", "analytics"],
  openGraph: { images: [`${BASE_URL}/og-image.png`] },
  twitter: { images: [`${BASE_URL}/og-image.png`] },
  alternates: { canonical: `${BASE_URL}/cookie-policy` },
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Cookie Policy</h1>

      <p className="mt-6 text-gray-700 dark:text-gray-300">
        This Cookie Policy explains how Premium AI Directory uses cookies and similar
        technologies on our website. By using our site, you agree to the use of cookies as
        described here.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">What are cookies?</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        Cookies are small text files stored on your device that help websites remember information
        about your visit. They are widely used to make websites work more efficiently and provide
        information to site owners.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        We may use analytics services to understand how visitors use our site. These services set
        cookies that collect anonymous usage information (for example, pages visited and time on
        page) to help us improve content and performance.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">Google AdSense cookies</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        If we display ads through Google AdSense or other advertising networks, those services may
        set cookies to deliver relevant ads and measure ad performance. Google’s advertising
        services may include remarketing, demographic reporting, and ad personalization.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">Third-party cookies</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        Third-party services (such as analytics providers and advertising networks) may set their
        own cookies. We do not control these cookies. Please consult the third party’s privacy
        policies for more information about their cookie practices.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">User consent & managing cookies</h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        You can manage or disable cookies through your browser settings. Note that disabling
        certain cookies may impact site functionality. For information about managing cookies in
        popular browsers, see the browser’s help documentation.
      </p>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Last updated: 2026-07-18
      </p>
    </div>
  );
}
