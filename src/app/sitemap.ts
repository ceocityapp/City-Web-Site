import type { MetadataRoute } from "next";

const BASE_URL = "https://cityapp.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/feed",
    "/marketplace",
    "/communities",
    "/events",
    "/jobs",
    "/chat",
    "/explore",
    "/about",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ];

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/feed" ? 0.9 : 0.7,
  }));
}
