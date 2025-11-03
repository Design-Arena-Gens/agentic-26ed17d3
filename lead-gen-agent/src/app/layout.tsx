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
  title: "Lead Generation Agent",
  description:
    "Intelligent lead generation workspace that prioritizes high-intent accounts, surfaces go-to-market signals, and recommends tailored outreach.",
  metadataBase: new URL("https://agentic-26ed17d3.vercel.app"),
  openGraph: {
    title: "Lead Generation Agent",
    description:
      "Run AI-assisted research to prioritize accounts, uncover buying signals, and orchestrate multi-channel outreach.",
    url: "https://agentic-26ed17d3.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Generation Agent",
    description:
      "AI-powered GTM workspace that surfaces ready-to-act accounts and recommends next steps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
