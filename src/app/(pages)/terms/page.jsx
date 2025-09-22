"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Terms of Service</h1>
        <p className="text-sm text-gray-600 text-center mb-10">
          Last updated: June 16, 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our website, services, or tools, you agree to be
              bound by these Terms of Service. If you do not agree to these terms, you
              may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">2. Description of Service</h2>
            <p>
              Our platform allows users to upload bank statements and convert them into
              machine-readable formats such as Excel. We strive to ensure accuracy and
              security throughout the process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">3. User Conduct</h2>
            <p>
              You agree not to use our service for any unlawful or harmful activities.
              You are solely responsible for the content you upload and any outcomes
              from using the converted data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">4. Data Privacy</h2>
            <p>
              We do not store your bank statements or extracted data unless explicitly
              requested by you. Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">5. Intellectual Property</h2>
            <p>
              All content on this site, including text, graphics, logos, and software,
              is the property of the company and protected by intellectual property
              laws. You may not copy or redistribute our tools or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">6. Limitation of Liability</h2>
            <p>
              We are not liable for any direct, indirect, incidental, or consequential
              damages resulting from the use of our service. Use our tools at your own
              risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of
              the service after changes means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">8. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <Link href="/contact" className="text-indigo-600 hover:underline">
                Contact Us
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
