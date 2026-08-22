import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";
import { CityNetwork } from "@/components/site/CityNetwork";

export const metadata: Metadata = {
  title: "Cities",
  description:
    "Each city runs its own app on one shared network — live in Huesca, next in Zaragoza. Our goal is every European city, town and community connected through it.",
  alternates: { canonical: "/cities" },
};

export default function CitiesPage() {
  return (
    <SiteShell>
      <CityNetwork />
    </SiteShell>
  );
}