"use client";

import { ReactNode } from "react";
import { CityProvider } from "@/context/CityContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CityProvider>
        <CartProvider>
          <NotificationProvider>
            <ToastProvider>{children}</ToastProvider>
          </NotificationProvider>
        </CartProvider>
      </CityProvider>
    </AuthProvider>
  );
}
