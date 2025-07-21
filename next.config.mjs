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
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/sitemap-:slug.xml", // untuk sitemap-0.xml, sitemap-1.xml, dst
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
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
