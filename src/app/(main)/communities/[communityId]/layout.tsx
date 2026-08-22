import type { Metadata } from "next";
import { HUESCA_COMMUNITIES } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ communityId: string }>;
}): Promise<Metadata> {
  const { communityId } = await params;
  const community = HUESCA_COMMUNITIES.find((c) => c.id === Number(communityId));
  return {
    title: community ? `${community.name} - City App` : "Comunidad - City App",
    description: community?.description || "Descubre comunidades en City App",
    openGraph: {
      title: community?.name || "Comunidad",
      description: community?.description || "",
      type: "website",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
