import type { Metadata } from "next";

import { SiteShell } from "@/components/site/SiteShell";
import { Vision } from "@/components/site/Vision";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Why City App exists: the smartest cities are not the most technological, they are the most connected.",
  alternates: { canonical: "/vision" },
};

export default function VisionPage() {
  return (
    <SiteShell>
      <Vision />
    </SiteShell>
  );
}