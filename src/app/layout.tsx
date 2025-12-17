import type { Metadata } from "next";
import type React from "react";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "devicon/devicon.min.css";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.kurisari.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cristian Aragón Salazar | Portfolio",
  description:
    "Artificial Intelligence Engineer specialized in building modern web applications, data-driven systems, and user-centric experiences. Explore projects, professional experience, training, and recognitions.",
  keywords: [
    "Cristian Aragón Salazar",
    "Kurisari",
    "Artificial Intelligence Engineer",
    "AI Engineer",
    "Software Developer",
    "Portfolio",
    "Next.js",
  ],
  authors: [{ name: "Cristian Aragón Salazar", url: siteUrl }],
  creator: "Cristian Aragón Salazar",
  publisher: "Cristian Aragón Salazar",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cristian Aragón Salazar | Portfolio",
    description:
      "Artificial Intelligence Engineer specialized in building modern web applications, data-driven systems, and user-centric experiences. Explore projects, professional experience, training, and recognitions.",
    url: siteUrl,
    siteName: "Cristian Aragón Salazar",
    images: [
      {
        url: "/portfolio-new.png",
        width: 1200,
        height: 630,
        alt: "Cristian Aragón Salazar Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian Aragón Salazar | Portfolio",
    description:
      "Artificial Intelligence Engineer specialized in building modern web applications, data-driven systems, and user-centric experiences.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <I18nProvider>
          {/* Optional: Google Analytics (GA4) */}
          {process.env.NEXT_PUBLIC_GA_ID ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga4" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `}
              </Script>
            </>
          ) : null}
          {/* JSON-LD Structured Data */}
          <Script id="ld-json-person" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Cristian Aragón Salazar",
              jobTitle: "Artificial Intelligence Engineer",
              url: siteUrl,
              image: new URL("/avatar.jpg", siteUrl).toString(),
              email: "mailto:crisarag8.sal@gmail.com",
              sameAs: [
                "https://github.com/Kurisari",
                "https://www.linkedin.com/in/cristian-aragon-salazar/",
              ],
            })}
          </Script>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.12),transparent_30%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
            {children}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
