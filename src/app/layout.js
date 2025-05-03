// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog Platform",
  description: "Next.js Blog with Authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // Added flex column layout to push footer down if content is short
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 flex flex-col min-h-screen`}
      >
        <Providers>
          <Navbar /> {/* <-- Add the Navbar component here */}
          <main className="container mx-auto px-4 py-8 flex-grow"> {/* Added flex-grow */}
             {children}
          </main>
          {/* Optional: Add a Footer component here later */}
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}