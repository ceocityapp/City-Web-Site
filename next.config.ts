import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root to this project so Next.js doesn't pick up a parent lockfile
    root: path.resolve(__dirname),
  },
  images: {
    // Next 16 rejects any `quality` not listed here. The landing uses a
    // deliberately small ladder: 55 for phone-screen thumbnails, 72 for
    // in-page cards, 85 for the few full-bleed photographs.
    qualities: [55, 72, 75, 85],
    // Marketing photography is served from Unsplash. Landing images normally go
    // through the custom loader in `src/lib/marketing/media.ts` so the resizing
    // happens on Unsplash's own CDN, but this keeps a plain
    // <Image src="https://images.unsplash.com/…"> working too.
    // `search` is deliberately omitted so Unsplash's ?w=&q=&fm= params pass.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
