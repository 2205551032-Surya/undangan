import type { Metadata } from "next";

import {
  Allura,
  Montserrat,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Undangan Metatah",
  description: "Undangan Upacara Metatah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`
          ${montserrat.variable}
          ${allura.variable}
          ${playfair.variable}
          min-h-screen
          bg-[#151515]
          text-white
          antialiased
        `}
        style={{
          fontFamily: "var(--font-montserrat)",
        }}
      >
        {children}
      </body>
    </html>
  );
}