import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export', // Mandatory for GitHub Pages / Static hosting
  images: {
    unoptimized: true, // Mandatory for static exports
  },
  // If your repo is NOT a custom domain (e.g., username.github.io/repo-name)
  // basepath: '/repo-name', 
};

export default nextConfig;