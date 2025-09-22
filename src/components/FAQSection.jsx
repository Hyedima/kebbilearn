import { useState } from "react";

const faqs = [
  {
    question: "What is the AI Microsoft Office Tutor?",
    answer:
      "The AI Microsoft Office Tutor is an interactive learning platform that teaches you how to use Microsoft Word, Excel, PowerPoint, Outlook, and more — using simple lessons, real-world tasks, and personalized feedback powered by AI.",
  },
  {
    question: "Do I need to install Microsoft Office to use this platform?",
    answer:
      "No, you don't need to install anything. The tutorials cover both the desktop and online versions of Microsoft Office, so you can learn from any device with internet access.",
  },
  {
    question: "Can beginners with no tech background use this?",
    answer:
      "Absolutely! The platform is designed for total beginners. Lessons are step-by-step and beginner-friendly, with examples, videos, and instant AI assistance if you get stuck.",
  },
  {
    question: "Does this cover advanced topics like formulas or pivot tables?",
    answer:
      "Yes. In Excel, for example, we guide you from basic formatting to advanced concepts like functions, VLOOKUP, pivot tables, and automation — all with hands-on exercises.",
  },
  {
    question: "Is there a certificate after completion?",
    answer:
      "Yes, upon completing a full module (e.g. Word Essentials or Excel Pro), you’ll receive a digital certificate you can share on your CV or LinkedIn profile.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We offer both free and premium plans. You can start learning for free, and upgrade anytime to unlock advanced lessons, practice tasks, and live AI tutor support.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(idx === activeIndex ? null : idx);
  };

  return (
    <section className="bg-white py-16 px-4" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-6 py-4 flex justify-between items-center text-indigo-700 font-medium text-lg"
              >
                {item.question}
                <span
                  className={`transform transition-transform duration-300 ${
                    activeIndex === idx ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === idx
                    ? "max-h-40 opacity-100 py-2"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <p className="text-gray-700 text-sm">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
