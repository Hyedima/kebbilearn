export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        {/* Left Side - Dynamic Year */}
        <div className="mb-2 sm:mb-0 text-center sm:text-left">
          &copy; {currentYear}{" "}
          <span className="font-semibold">C-Assistance.</span>
        </div>

        {/* Right Side - Links */}
        <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
          <a href="/about" className="hover:text-indigo-600 transition">
            About
          </a>
          <a href="/terms" className="hover:text-indigo-600 transition">
            Terms
          </a>
          <a href="/privacy" className="hover:text-indigo-600 transition">
            Privacy
          </a>
          <a href="/blog" className="hover:text-indigo-600 transition">
            Blog
          </a>
        </div>
      </div>
    </footer>
  );
}
