import "dotenv/config";
/** @type {import('next').NextConfig} */
const nextConfig = {
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
