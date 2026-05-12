import os from "node:os";
import type { NextConfig } from "next";

const frontendPort = process.env.PORT || "3000";
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:3001";

function getAllowedDevOrigins() {
  const hosts = new Set(["localhost", "127.0.0.1"]);

  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === "IPv4" && !address.internal) {
        hosts.add(address.address);
      }
    }
  }

  const manualOrigins = (process.env.ALLOWED_DEV_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...Array.from(hosts).map((host) => `${host}:${frontendPort}`), ...manualOrigins])];
}

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: getAllowedDevOrigins(),
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api-backend/:path*",
          destination: `${backendInternalUrl}/:path*`,
        },
      ]
    };
  },
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
