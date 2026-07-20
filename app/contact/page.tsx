import ContactForm from "./ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premium-ai-directory-mu.vercel.app";

export const metadata = {
  title: "Contact — Premium AI Directory",
  description: "Contact Premium AI Directory for support, partnerships, or press.",
  keywords: ["contact", "support", "partnerships", "premium ai directory"],
  openGraph: { images: [`${BASE_URL}/og-image.png`] },
  twitter: { images: [`${BASE_URL}/og-image.png`] },
  alternates: { canonical: `${BASE_URL}/contact` },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Contact Us</h1>

      <p className="mt-4 text-gray-700 dark:text-gray-300">Have questions or partnership inquiries? Fill out the form below.</p>

      <ContactForm />
    </div>
  );
}
