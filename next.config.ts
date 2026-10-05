import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the assistant orb lives in the bottom corner; the dev badge would sit on top of it
  devIndicators: false,
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/images/**" }],
    // thumbnails of linked YouTube videos
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  experimental: {
    serverActions: {
      // «شارك بالتوثيق» sends files with the form; the action enforces its own per-file limits.
      bodySizeLimit: "110mb",
    },
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
