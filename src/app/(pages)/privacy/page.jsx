"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-600 text-center mb-10">
          Last updated: June 16, 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">1. Your Privacy Matters</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we handle the information you provide when using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">2. What We Collect</h2>
            <p>
              We only collect information necessary to operate our services. This may include:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Uploaded bank statements (temporarily, for processing only)</li>
              <li>File metadata (type, size, format)</li>
              <li>Basic contact information (if you register or contact us)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">3. How We Use Your Data</h2>
            <p>
              Uploaded files are used solely to convert and return readable financial data.
              We do not sell, share, or store your data permanently unless you request it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">4. File Retention</h2>
            <p>
              All uploaded files are automatically deleted after processing. No files are stored on our servers beyond what is required for the conversion process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">5. Cookies & Tracking</h2>
            <p>
              We may use basic cookies to enhance your browsing experience. We do not use invasive tracking technologies or third-party ads.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">6. Third-Party Tools</h2>
            <p>
              Some analytics or hosting services we use (e.g., Vercel, Google Analytics) may process anonymized usage data. We do not share your personal files with these tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">7. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Request deletion of your data</li>
              <li>Access or export your information (if applicable)</li>
              <li>Use our service without registration or tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">8. Contact Us</h2>
            <p>
              If you have any questions or requests related to privacy, contact us via the{" "}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
