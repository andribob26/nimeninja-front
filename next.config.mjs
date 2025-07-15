import dotenv from "dotenv";
dotenv.config();
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    CDN_WORKER_URL: process.env.CDN_WORKER_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  async rewrites() {
    return [
      {
        source: "/files/:path*",
        destination: `${process.env.API_BASE_URL}/files/:path*`,
      },
      {
        source: "/videos/:path*",
        destination: `${process.env.CDN_WORKER_URL}/videos/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.API_BASE_URL,
        pathname: "/files/images/**",
      },
      {
        protocol: "https",
        hostname: process.env.CDN_WORKER_URL,
        pathname: "/**", // pakai /** untuk izinkan semua path
      },
    ],
  },
};

export default nextConfig;
