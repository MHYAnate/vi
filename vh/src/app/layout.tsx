import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sspot1 qq ai",
  description: "service spot 1 quick question artificial intelligence ",
};

const ProtestGuerrilla = localFont({
  src: "./fonts/ProtestGuerrilla-Regular.ttf",
  variable: "--ProtestGuerrilla",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ProtestGuerrilla.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
