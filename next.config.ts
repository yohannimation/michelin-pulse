import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* La protection des routes est gérée par proxy.ts (auth Strava). */
  output: 'standalone',
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
