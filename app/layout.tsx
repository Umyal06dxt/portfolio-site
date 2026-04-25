import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/cursor";
import LenisProvider from "@/components/lenis-provider";
import ScrollProgress from "@/components/scroll-progress";
import { JsonLd } from "@/components/json-ld";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const siteUrl = "https://www.dixitumyal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Umyal Dixit — AI Researcher & Builder",
    template: "%s | Umyal Dixit",
  },
  description:
    "CS student from Gurugram building at the intersection of AI and human emotion. Maker of Veris (deepfake detection), Sukku (AI companion), and 26-class emotion AI. 10× hackathon winner.",
  keywords: [
    "Umyal Dixit",
    "AI researcher India",
    "CS student portfolio",
    "Gurugram developer",
    "Veris deepfake detection",
    "Sukku AI companion",
    "emotion AI research",
    "ML intern India",
    "AI research intern",
    "hackathon winner India",
    "machine learning India",
    "computer vision researcher",
    "Web3 developer India",
    "hardware builder",
    "PyTorch researcher",
  ],
  authors: [{ name: "Umyal Dixit", url: siteUrl }],
  creator: "Umyal Dixit",
  publisher: "Umyal Dixit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Umyal Dixit",
    title: "Umyal Dixit — AI Researcher & Builder",
    description:
      "Building at the edge of AI and human emotion. Veris, Sukku, and systems that matter. CS student, 10× hackathon winner, Gurugram.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Umyal Dixit — AI Researcher & Builder",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umyal Dixit — AI Researcher & Builder",
    description:
      "Building at the edge of AI and human emotion. Veris, Sukku, and systems that matter.",
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff5f1f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <JsonLd />
        <LenisProvider>
          <Cursor />
          <ScrollProgress />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
