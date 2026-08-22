"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Home, ShoppingBag, Users, MessageCircle, Briefcase, Calendar,
  Bell, User, Settings, LogOut, MapPin, ShoppingCart, Store,
  Train, Wrench, PackageSearch, Tag, Compass, Map, Package, Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";

const navItems = [
  { href: "/feed", label: "Tablón", icon: Home },
  { href: "/marketplace", label: "Mercado", icon: ShoppingBag },
  { href: "/communities", label: "Comunidades", icon: Users },
  { href: "/chat", label: "Mensajes", icon: MessageCircle },
  { href: "/jobs", label: "Trabajo", icon: Briefcase },
  { href: "/events", label: "Eventos", icon: Calendar },
];

const featureItems = [
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/transport", label: "Transporte", icon: Train },
  { href: "/services", label: "Servicios", icon: Wrench },
  { href: "/classifieds", label: "Compraventa", icon: Tag },
  { href: "/lost-found", label: "Obj. perdidos", icon: PackageSearch },
  { href: "/map", label: "Mapa", icon: Map },
];

const secondaryItems = [
  { href: "/notifications", label: "Notificaciones", icon: Bell },
  { href: "/orders", label: "Pedidos", icon: Package },
  { href: "/saved", label: "Guardados", icon: Bookmark },
  { href: "/business", label: "Mi negocio", icon: Store },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/profile/settings", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { selectedCity } = useCity();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background h-screen sticky top-0" suppressHydrationWarning>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border shrink-0">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="text-primary">
          <circle cx="14" cy="14" r="4" fill="currentColor"/><circle cx="14" cy="3" r="2.5" fill="currentColor"/><circle cx="14" cy="25" r="2.5" fill="currentColor"/><circle cx="3" cy="14" r="2.5" fill="currentColor"/><circle cx="25" cy="14" r="2.5" fill="currentColor"/><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="22" cy="6" r="2" fill="currentColor"/><circle cx="6" cy="22" r="2" fill="currentColor"/><circle cx="22" cy="22" r="2" fill="currentColor"/>
        </svg>
        <span className="text-lg font-black">City App</span>
      </div>

      {selectedCity && (
        <div className="px-4 pt-4 pb-2">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/25 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{selectedCity.name}</span>
          </Link>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-foreground text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="my-4 px-1">
          <CreatePostDialog variant="sidebar" />
        </div>

        {mounted && totalItems > 0 && (
          <div suppressHydrationWarning>
            <Link href="/cart" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mx-1 mb-2">
              <ShoppingCart className="w-5 h-5" /> Carrito
              <Badge className="ml-auto bg-primary text-white border-0">{totalItems}</Badge>
            </Link>
          </div>
        )}

        <div className="border-t border-border my-3" />

        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-4 mb-1">Ciudad</p>
        <div className="space-y-0.5 mb-3">
          {featureItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-foreground text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border my-3" />

        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-foreground text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border p-4 shrink-0">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name || user.username}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
            <button onClick={signOut} aria-label="Cerrar sesión" className="text-muted-foreground hover:text-foreground transition-colors" title="Cerrar sesión"><LogOut className="w-4 h-4" /></button>
          </div>
        ) : (
          <Link href="/login"><Button variant="outline" className="w-full rounded-full font-bold">Iniciar sesión</Button></Link>
        )}
      </div>
    </aside>
  );
}
