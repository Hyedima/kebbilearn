"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import OfficeTutor from "../components/OfficeTutor";

export default function Home() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <main className="pt-16 min-h-screen bg-white text-gray-800 px-4">
      {/* Hero Section */}
      <section className="mx-auto text-center mb-20 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
          Meet <span className="text-indigo-600">C-assistant</span> —
          <br />
          Your AI-Powered Tutor
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
          C-assistant is your professional companion for mastering Word,
          Excel, and PowerPoint. Whether you're a civil servant preparing
          official reports or a student working on assignments, it provides
          step-by-step guidance, real-time feedback, and instant support to help
          you achieve more with ease.
        </p>

        {/* <Link
          href="/get-started"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300"
        >
          🚀 Start Learning Now
        </Link> */}

        <p className="text-sm text-gray-500 mt-3">
          No credit card required. Learn at your own pace.
          
        </p>
        <OfficeTutor />
      </section>

      {/* Core Office Packages */}
      {/* <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Learn Microsoft Office Like a Pro
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            From formatting documents in Word to creating powerful dashboards in
            Excel — master all the essential Office tools with confidence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Word",
              "Excel",
              "PowerPoint",
              "Outlook",
              "OneNote",
              "Access",
              "Publisher",
              "Teams",
            ].map((app, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border hover:shadow-lg transition text-center"
              >
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  {app}
                </h3>
                <p className="text-sm text-gray-600">
                  Interactive lessons and AI feedback to help you master {app}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Microsoft 365 Tools */}
      
      {/* <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Other Microsoft 365 Tools & Services
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Expand your productivity with smart learning support for all
            Microsoft 365 tools.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "OneDrive",
              "Forms",
              "Planner",
              "Sway",
              "Whiteboard",
              "Stream",
              "Loop",
            ].map((tool, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-xl border hover:shadow-lg transition text-center"
              >
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  {tool}
                </h3>
                <p className="text-sm text-gray-600">
                  Learn {tool} from scratch — with practical guides, templates,
                  and AI help.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="bg-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            See What Learners Are Saying
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">
                “OfficeMate helped me finally understand Excel formulas — no
                more YouTube rabbit holes!”
              </p>
              <p className="text-sm font-semibold text-indigo-700">
                — Grace O., Business Analyst
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">
                “I used to be scared of PowerPoint. Now I present like a pro.
                This is a game-changer.”
              </p>
              <p className="text-sm font-semibold text-indigo-700">
                — Chuka I., Student
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      {/* <FAQSection /> */}

      {/* Final CTA */}
      {/* <section className="bg-indigo-600 text-white text-center py-14 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to Supercharge Your Microsoft Office Skills?
        </h2>
        <p className="mb-6 text-sm sm:text-base">
          Get personalized AI support, progress tracking, and hands-on learning
          — all in one place.
        </p>
        <Link
          href="/get-started"
          className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Start Learning with OfficeMate AI
        </Link>
      </section> */}
    </main>
  );
}
