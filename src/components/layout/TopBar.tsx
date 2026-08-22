"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/shared/SearchOverlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, MapPin, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const { selectedCity, allCities, setSelectedCity } = useCity();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-40 px-4 flex items-center gap-4">
      <div className="group/tip relative lg:hidden">
        <button onClick={onMenuToggle} aria-label="Abrir menú" className="text-muted-foreground hover:text-foreground"><Menu className="w-6 h-6" /></button>
        <span className="pointer-events-none absolute top-full left-0 mt-1 px-2 py-1 text-[10px] font-bold bg-foreground text-white rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-50">Abrir menú</span>
      </div>
      <div className="lg:hidden flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" className="text-primary"><circle cx="14" cy="14" r="4" fill="currentColor"/><circle cx="14" cy="3" r="2.5" fill="currentColor"/><circle cx="14" cy="25" r="2.5" fill="currentColor"/><circle cx="3" cy="14" r="2.5" fill="currentColor"/><circle cx="25" cy="14" r="2.5" fill="currentColor"/><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="22" cy="6" r="2" fill="currentColor"/><circle cx="6" cy="22" r="2" fill="currentColor"/><circle cx="22" cy="22" r="2" fill="currentColor"/></svg>
      </div>

      <div className="relative">
        <button onClick={() => setShowCityPicker(!showCityPicker)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold hidden sm:inline">{selectedCity?.name || "Seleccionar ciudad"}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
        {showCityPicker && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowCityPicker(false)} />
            <div className="absolute top-full left-0 mt-1 w-64 bg-popover rounded-xl border border-border shadow-xl z-40 p-2 max-h-80 overflow-y-auto">
              <p className="text-xs font-bold text-muted-foreground px-3 py-1.5 uppercase tracking-wide">Seleccionar ciudad</p>
              {allCities.map((city) => (
                <button key={city.id} onClick={() => { setSelectedCity(city); setShowCityPicker(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-muted transition-colors ${selectedCity?.id === city.id ? "bg-primary/5 text-primary font-bold" : ""}`}>
                  <MapPin className="w-4 h-4 shrink-0" />
                  <div><p className="font-semibold">{city.name}</p><p className="text-xs text-muted-foreground">{city.region}</p></div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 max-w-md hidden sm:block">
        <button onClick={() => setShowSearch(true)} className="w-full relative text-left">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <div className="pl-9 pr-3 h-9 rounded-full bg-muted flex items-center text-sm text-muted-foreground font-medium">
            <span className="flex-1">Buscar posts, tiendas, personas...</span>
            <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-background border border-border rounded">⌘K</kbd>
          </div>
        </button>
      </div>
      <SearchOverlay open={showSearch} onClose={() => setShowSearch(false)} />

      <div className="ml-auto flex items-center gap-2">
        <div className="group/tip relative sm:hidden">
          <button onClick={() => setShowSearch(true)} aria-label="Buscar" className="text-muted-foreground hover:text-foreground p-2"><Search className="w-5 h-5" /></button>
          <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-[10px] font-bold bg-foreground text-white rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-50">Buscar (⌘K)</span>
        </div>
        <div className="group/tip relative">
          <Link href="/notifications" aria-label="Notificaciones" className="text-muted-foreground hover:text-foreground p-2 relative block">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-[10px] font-bold bg-foreground text-white rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-50">Notificaciones</span>
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Menú de cuenta" className="group/tip relative flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors">
              <Avatar className="w-8 h-8"><AvatarImage src={user.avatar_url || undefined} /><AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user.name?.charAt(0) || "U"}</AvatarFallback></Avatar>
              <span className="pointer-events-none absolute top-full right-0 mt-1 px-2 py-1 text-[10px] font-bold bg-foreground text-white rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-50">Tu cuenta</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5"><p className="text-sm font-bold">{user.name}</p><p className="text-xs text-muted-foreground">@{user.username}</p></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => router.push("/profile")}><User className="w-4 h-4 mr-2" /> Perfil</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => router.push("/profile/settings")}><Settings className="w-4 h-4 mr-2" /> Ajustes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive font-medium"><LogOut className="w-4 h-4 mr-2" /> Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login"><Button size="sm" className="rounded-full bg-primary text-white font-bold">Acceder</Button></Link>
        )}
      </div>
    </header>
  );
}
