import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Bank2Excel",
//   description: "Bank statement converter from PDF file to Ecxel and CSV file",
// };

export const metadata = {
  title:
    "Master Microsoft Office Online – AI-Powered Tutor for Word, Excel, PowerPoint & More",
  description:
    "Effortlessly convert your bank statement PDF to Excel or CSV. Free online tool powered by AI for fast, accurate results. Supports password-protected statements. No software required.",

  keywords: [
    "convert bank statement pdf to excel",
    "convert bank statement pdf to excel online",
    "convert bank statement pdf to excel free download",
    "convert pdf bank statement to csv free",
    "convert bank statement pdf to excel sbi",
    "free bank statement converter",
    "bank statement pdf to csv",
    "convert bank statement pdf to excel python",
    "bank statement converter ai",
    "convert bank statement pdf to excel ilovepdf",
    "convert bank statement pdf to excel reddit",
    "how to convert bank statement pdf to excel in dext",
    "can i convert a pdf bank statement to excel",
    "can you convert pdf bank statement to excel",
    "convert kotak bank statement pdf to excel",
    "how to convert password protected bank statement pdf to excel",
    "how do i convert a pdf bank statement to excel",
    "best way to convert bank statement pdf to excel",
    "convert icici bank statement pdf to excel",
    "how to convert bank statement pdf to excel",
    "converting bank statements to excel",
    "how to convert pdf statement to excel",
    "how to convert bank statement to excel",
    "extract bank statement data to excel",
    "pdf to excel financial statement converter",
    "bank statement pdf to csv accurate",
    "bank statement extractor tool",
    "bank statement AI converter",
    "online bank statement to excel",
  ],

  openGraph: {
    title: "Convert Bank Statements to Excel or CSV Instantly | Bank2Excel",
    description:
      "Fast, free AI-powered bank statement converter. Extract transactions from PDF bank statements to Excel or CSV with ease.",
    url: "https://www.bank2excel.com", // Replace with your actual domain
    siteName: "Bank2Excel",
    images: [
      {
        url: "https://www.bank2excel.com/og-image.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Bank2Excel - Bank Statement PDF to Excel Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bank Statement PDF to Excel or CSV | Fast, Free & Accurate",
    description:
      "Convert your bank statement PDF to Excel or CSV in seconds. Free AI-powered bank statement converter with high accuracy.",
    images: ["https://www.bank2excel.com/og-image.png"], // Replace with your actual image
  },

  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <Head /> */}
          {/* <Header /> */}
          {/* <HeaderWrapper /> */}
          <main
            className="pt-[4rem]"
            style={{ minHeight: "calc(100vh - 80px)" }}
          >
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
