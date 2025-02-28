import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ['s.gravatar.com', 'cdn.auth0.com'], // Dominios permitidos para cargar imágenes externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.auth0.com',
      },
    ],
  },
};

export default nextConfig;
