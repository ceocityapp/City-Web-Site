import type { Metadata } from "next";
import { Landing } from "@/components/site/Landing";

const SITE_URL = "https://cityapp.es";

export const metadata: Metadata = {
  // Absolute: the landing title already carries the brand, so skip the root
  // layout's "%s | City App" template.
  title: { absolute: "City App — The platform for smarter, connected cities" },
  description:
    "City App is the local platform for European cities — communities, shops, events and services in one place. What makes a city smart is its people.",
  alternates: { canonical: SITE_URL },
  keywords: [
    "smart city",
    "local community",
    "local businesses",
    "civic economy",
    "European cities",
    "social platform",
    "Huesca",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "City App",
    title: "City App — The platform for smarter, connected cities",
    description:
      "A new way to connect locally. One platform, every city — run by the people who live there.",
  },
  twitter: {
    card: "summary_large_image",
    title: "City App — The platform for smarter, connected cities",
    description:
      "A new way to connect locally. One platform, every city — run by the people who live there.",
  },
};

export default function Page() {
  return <Landing />;
}
