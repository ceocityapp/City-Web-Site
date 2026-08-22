import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";
import { FeatureRail } from "@/components/site/FeatureRail";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Everything a city already does — local businesses, communities, posts, forums, jobs, events, messaging and profiles in one product.",
  alternates: { canonical: "/platform" },
};

export default function PlatformPage() {
  return (
    <SiteShell>
      <FeatureRail />
    </SiteShell>
  );
}