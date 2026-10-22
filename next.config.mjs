/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allows a QA/production build to run alongside `next dev` without the two
  // processes fighting over the same build directory.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
