import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal configuration to get the server running
  // We can add optimizations back once the server is stable
  
  // Ensure JWT_SECRET is available to middleware
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
