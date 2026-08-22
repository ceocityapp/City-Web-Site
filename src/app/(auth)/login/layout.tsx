import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en City App para conectar con tu ciudad",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
