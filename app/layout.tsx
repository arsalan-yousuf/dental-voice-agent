import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Happy Root Dental — Voice Assistant",
  description:
    "Talk to our front desk. Book, reschedule, or ask questions using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`min-h-screen antialiased ${inter.className}`}>{children}</body>
    </html>
  );
}
