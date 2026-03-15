import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: { unoptimized: true },
  // Only applies the subfolder path when you deploy to GitHub
  basePath: isProd ? '/hc-workout-planner' : '', 
  assetPrefix: isProd ? '/hc-workout-planner' : '', 
  reactStrictMode: true,
};

export default nextConfig;