import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foreigners-corner-up-ags.odoo.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      // Force canonical domain at www.kurisari.dev
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "kurisari.dev",
          },
        ],
        destination: "https://www.kurisari.dev/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "cristian-aragon-salazar.vercel.app",
          },
        ],
        destination: "https://www.kurisari.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
