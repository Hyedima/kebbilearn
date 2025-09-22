"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are on a mission to simplify bank statement analysis and conversion
          for individuals, businesses, and financial institutions worldwide.
        </p>
      </section>

      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 text-gray-700 mb-20">
        <div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Who We Are
          </h2>
          <p className="text-sm leading-relaxed">
            Our platform is built by financial analysts and engineers who
            understand the complexity of bank statements. We built this tool to
            help users extract transactional data from PDFs effortlessly and
            accurately.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Why We Built This
          </h2>
          <p className="text-sm leading-relaxed">
            Many businesses and individuals struggle with poor quality or
            inconsistent PDF bank statements. Our tool enables fast and reliable
            conversion to Excel and CSV formats, so users can analyze, share, or
            import the data wherever they need it.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4">
            What Makes Us Different
          </h3>
          <ul className="text-gray-600 text-sm space-y-3">
            <li>✅ No signup required – convert instantly</li>
            <li>✅ Built with security and privacy in mind</li>
            <li>✅ Supports statements from 1000+ banks</li>
            <li>✅ Fast processing and accurate results</li>
            <li>✅ Free and flexible pricing tiers</li>
          </ul>
        </div>
      </section>

      <section className="py-12 text-center">
        <p className="text-sm text-gray-700 mb-4">
          Have questions or need a custom solution?
        </p>
        <Link
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
}
