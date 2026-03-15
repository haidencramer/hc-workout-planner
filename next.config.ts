import type { NextConfig } from "next";

// This checks if we are running 'npm run build' (Production) or 'npm run dev' (Development)
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only use the subpath if we are in Production (GitHub Pages)
  basePath: isProd ? '/hc-workout-planner' : '', 
  assetPrefix: isProd ? '/hc-workout-planner' : '', 
  reactStrictMode: true,
};

export default nextConfig;