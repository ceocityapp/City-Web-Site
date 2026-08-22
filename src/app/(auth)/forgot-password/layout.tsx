import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Recupera tu contraseña de City App",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
