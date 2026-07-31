import type { NextConfig } from "next";

const API_UPSTREAM = process.env.API_UPSTREAM ?? "http://localhost:3333/api/v1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ged/ui", "@ged/lib"],
  // Avatares/imagens usam <img> comum (sem otimização), então não precisa de domínios.
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_UPSTREAM}/:path*`,
      },
    ];
  },
};

export default nextConfig;
