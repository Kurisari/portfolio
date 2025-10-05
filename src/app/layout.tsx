import type { Metadata } from "next";
import Script from "next/script";
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

const siteUrl = "https://www.kurisari.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cristian Aragón Salazar | Portfolio",
  description: "Artificial Intelligence Engineer",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cristian Aragón Salazar | Portfolio",
    description: "Artificial Intelligence Engineer",
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
        {children}
      </body>
    </html>
  );
}
