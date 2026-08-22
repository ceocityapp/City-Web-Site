import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";
import { Team } from "@/components/site/Team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind City App — a small team with deep roots in the places we build for, going one city at a time.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <SiteShell>
      <Team />
    </SiteShell>
  );
}