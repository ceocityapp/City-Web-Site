import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completar perfil",
  description: "Completa tu perfil para empezar a usar City App",
};

export default function CompleteProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
