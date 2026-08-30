// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // ajusta según lo que necesites
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
};

module.exports = nextConfig;