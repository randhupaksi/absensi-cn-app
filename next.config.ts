import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (process.env.VERCEL === "1") {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required for Vercel deployments.");
  }
  const parsedApiUrl = new URL(apiBaseUrl);
  if (parsedApiUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must use HTTPS on Vercel.");
  }
}

const apiImageOrigin = (() => {
  if (!apiBaseUrl) return null;
  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "recharts", "motion"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Project-Creator",
            value: "Randhu Paksi Membumi - Creator & Lead Fullstack Developer",
          },
          {
            key: "X-Project-Team",
            value: "RBAR Team",
          },
          {
            key: "X-Project-Copyright",
            value: "Copyright 2026 RBAR Team. All rights reserved.",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      ...(apiImageOrigin
        ? [
            {
              protocol: new URL(apiImageOrigin).protocol.replace(":", "") as "http" | "https",
              hostname: new URL(apiImageOrigin).hostname,
              port: new URL(apiImageOrigin).port,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
