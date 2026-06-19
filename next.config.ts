import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* La protection des routes est gérée par proxy.ts (auth Strava). */
  output: 'standalone',
  turbopack: {
    root: path.join(__dirname),
  },
  // Le venv Python (scan IA) contient des symlinks Homebrew hors du projet :
  // le traçage de fichiers ne doit pas tenter de les suivre.
  outputFileTracingExcludes: {
    '/*': ['./.venv/**/*'],
  },
};

export default nextConfig;
