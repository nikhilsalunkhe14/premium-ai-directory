import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit an AI Tool | AI Directory",
  description:
    "Submit your AI tool to be featured in our directory. Reach thousands of developers, designers, and creators looking for the best AI apps.",
};

export default function SubmitPage() {
  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Submit an AI Tool
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-500">
            Have an AI tool that deserves to be discovered? Choose a plan and
            submit it for review.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" />
        <SubmitForm />
      </section>
    </div>
  );
}
