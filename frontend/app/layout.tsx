import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EdgeStoreProvider } from '../lib/edgestore';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://careers.chaitanya-lohani.me"),

  title: {
    default: "CampusConnect",
    template: "%s | CampusConnect",
  },

  description:
    "Modern internship and career management platform for students and recruiters.",

  keywords: [
    "internships",
    "student jobs",
    "career platform",
    "campus hiring",
    "job portal",
    "students",
  ],

  openGraph: {
    title: "CampusConnect",
    description:
      "Modern internship and career management platform for students and recruiters.",
    url: "https://careers.chaitanya-lohani.me",
    siteName: "CampusConnect",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <EdgeStoreProvider>
      {children}
      </EdgeStoreProvider>
      </body>
    </html>
  );
}
