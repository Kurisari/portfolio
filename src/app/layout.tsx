import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "devicon/devicon.min.css";
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
  title: "Cristian Aragón Salazar | Portfolio",
  description: "Artificial Intelligence Engineer",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cristian Aragón Salazar | Portfolio",
    description: "Artificial Intelligence Engineer",
    url: "https://cristian-aragon-salazar.vercel.app",
    siteName: "Cristian Aragón Salazar",
    images: [
      {
        url: "/avatar.jpg",
        width: 800,
        height: 600,
        alt: "Cristian Aragón Salazar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian Aragón Salazar | Portfolio",
    description: "Artificial Intelligence Engineer",
    images: ["/avatar.jpg"],
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
        {children}
      </body>
    </html>
  );
}
