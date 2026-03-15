import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export', // Mandatory for GitHub Pages
  images: {
    unoptimized: true, // Mandatory for static exports
  },
  // This ensures your CSS and JS files load from the correct subfolder on GitHub
  basePath: '/hc-workout-planner', 
  assetPrefix: '/hc-workout-planner', 
};

export default nextConfig;