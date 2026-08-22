import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/business/", "/chat/", "/checkout/"],
    },
    sitemap: "https://cityapp.es/sitemap.xml",
  };
}
