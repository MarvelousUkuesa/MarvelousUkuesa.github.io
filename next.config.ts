import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for GitHub Pages (static hosting — no Node server).
  output: "export",
  images: { unoptimized: true },
  // Helps GitHub Pages resolve nested routes consistently.
  trailingSlash: true,
};

export default nextConfig;
