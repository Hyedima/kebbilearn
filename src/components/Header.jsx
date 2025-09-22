"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    // { name: "Pricing", href: "/pricing" },
    // { name: "Credits (1)", href: "/credits" },
    // { name: "Documents", href: "/documents" },
    { name: "Blog", href: "/blog" },
  ];

  const handleCloseMenu = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-indigo-600"
          onClick={handleCloseMenu}
        >
          OfficeMate AI
        </Link> */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-indigo-600"
          onClick={handleCloseMenu}
        >
          🎓 C-assistant
          🎓 C-Assistant
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))} */}
          {/* <SignedIn>
            <div className="ml-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <button className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all">
                Sign In
              </button>
            </Link>
          </SignedOut> */}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleCloseMenu}
              className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <SignedIn>
            <div className="pt-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <button
                onClick={handleCloseMenu}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-all"
              >
                Sign In
              </button>
            </Link>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
