import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
