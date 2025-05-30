import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import Navbar from "@/components/Navbar";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 flex flex-col min-h-screen`}
      >
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow bg-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}