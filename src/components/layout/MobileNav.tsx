"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Users, MessageCircle, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const items = [
  { href: "/feed",        label: "Inicio",     icon: Home },
  { href: "/explore",     label: "Explorar",   icon: Compass },
  { href: "/marketplace", label: "Mercado",    icon: ShoppingBag },
  { href: "/communities", label: "Comunidades", icon: Users },
  { href: "/chat",        label: "Mensajes",   icon: MessageCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-xl border-t border-border/60",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <div className="flex items-center justify-around h-16 px-1 mobile-nav-safe">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const showBadge =
            mounted && item.href === "/marketplace" && totalItems > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}

              {/* Icon + optional cart badge */}
              <span className="relative">
                <item.icon
                  className={cn("w-5 h-5", isActive && "stroke-[2.5]")}
                />
                {showBadge && (
                  <Badge className="absolute -top-2 -right-2.5 h-4 min-w-4 px-0.5 text-[9px] font-bold leading-none flex items-center justify-center bg-primary text-primary-foreground border-0 rounded-full">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </span>

              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
