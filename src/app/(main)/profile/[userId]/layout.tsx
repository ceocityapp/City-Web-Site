import type { Metadata } from "next";
import { HUESCA_USERS } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = HUESCA_USERS.find((u) => u.id === Number(userId));
  return {
    title: user ? `${user.name} (@${user.username}) - City App` : "Perfil - City App",
    description: user?.bio || "Descubre perfiles de la comunidad City App",
    openGraph: {
      title: user?.name || "Perfil",
      description: user?.bio || "",
      type: "profile",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
