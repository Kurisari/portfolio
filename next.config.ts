import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Force canonical domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.kurisari.dev",
          },
        ],
        destination: "https://kurisari.dev/:path*",
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
        destination: "https://kurisari.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
