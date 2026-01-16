import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karma Task RPG - Freelancer Ops Coach",
  description: "Turn your freelance week into outcome-based daily quests. Revenue, Delivery, and Ops - with built-in anti-guilt features.",
  openGraph: {
    title: "Karma Task RPG - Freelancer Ops Coach",
    description: "Turn your freelance week into outcome-based daily quests. Revenue, Delivery, and Ops - with built-in anti-guilt features.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f1a] text-[#e8e8f0]`}
      >
        {children}
      </body>
    </html>
  );
}
