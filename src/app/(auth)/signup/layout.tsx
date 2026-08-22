import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta en City App y únete a la comunidad de tu ciudad",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
