import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Umyal Dixit | Creative Engineer",
  description: "Portfolio of Umyal Dixit — Fluid Interfaces & AI Agents. Delhi, IN.",
  openGraph: {
    title: "Umyal Dixit | Creative Engineer",
    description: "Fluid Interfaces & AI Agents",
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
        className={`${syne.variable} ${manrope.variable} antialiased font-sans bg-black text-white selection:bg-[#FF6B2B] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
