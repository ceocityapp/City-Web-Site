"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useCity } from "@/context/CityContext";
import {
  MapPin, Search, Star, Calendar, Users, X, ExternalLink,
} from "lucide-react";

// ─── Dynamic import — SSR disabled (Leaflet needs window) ────────────────────

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm font-medium">Cargando mapa…</p>
      </div>
    </div>
  ),
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const MAP_PINS = [
  // SHOPS
  { id: "s1", type: "shop" as const, name: "Tatau Bistro", category: "Restaurantes", address: "Calle Coso Alto 12", lat: 42.1398, lng: -0.4082, rating: 4.7, emoji: "🍽️", href: "/marketplace/1" },
  { id: "s2", type: "shop" as const, name: "Café Vienés", category: "Cafetería", address: "Plaza López Allué 4", lat: 42.1392, lng: -0.4093, rating: 4.8, emoji: "☕", href: "/marketplace/2" },
  { id: "s3", type: "shop" as const, name: "Librería Anónima", category: "Librería", address: "Calle Cabestany 19", lat: 42.1385, lng: -0.4074, rating: 4.9, emoji: "📚", href: "/marketplace/3" },
  { id: "s4", type: "shop" as const, name: "Lillas Pastia", category: "Restaurantes", address: "Plaza de Navarra 4", lat: 42.1421, lng: -0.4098, rating: 4.9, emoji: "⭐", href: "/marketplace/4" },
  { id: "s5", type: "shop" as const, name: "Panadería La Confianza", category: "Panadería", address: "Calle Ramón y Cajal 17", lat: 42.1374, lng: -0.4111, rating: 4.6, emoji: "🥐", href: "/marketplace/5" },
  { id: "s6", type: "shop" as const, name: "El Rincón del Jamón", category: "Alimentación", address: "Plaza Navarra 8", lat: 42.1418, lng: -0.4101, rating: 4.5, emoji: "🍖", href: "/marketplace/7" },
  { id: "s7", type: "shop" as const, name: "Boulder Huesca", category: "Deportes", address: "Carretera Sabiñánigo", lat: 42.1510, lng: -0.4290, rating: 4.8, emoji: "🧗", href: "/marketplace/8" },
  // EVENTS
  { id: "e1", type: "event" as const, name: "Fiestas de San Lorenzo", category: "Fiestas", address: "Plaza López Allué", lat: 42.1392, lng: -0.4093, date: "9-15 Ago 2026", emoji: "🎉", href: "/events/1" },
  { id: "e2", type: "event" as const, name: "Periferias Festival", category: "Música", address: "Parque Miguel Servet", lat: 42.1365, lng: -0.4055, date: "15 Jun 2026", emoji: "🎵", href: "/events/2" },
  { id: "e3", type: "event" as const, name: "Feria del Libro", category: "Arte", address: "Coso Alto", lat: 42.1402, lng: -0.4078, date: "23 Abr 2026", emoji: "📖", href: "/events/3" },
  { id: "e4", type: "event" as const, name: "Ruta Senderismo Loarre", category: "Deportes", address: "Castillo de Loarre", lat: 42.3167, lng: -0.5467, date: "7 Jun 2026", emoji: "⛰️", href: "/events/4" },
  // COMMUNITIES
  { id: "c1", type: "community" as const, name: "Senderismo Huesca", category: "Deportes", address: "Parque Miguel Servet", lat: 42.1368, lng: -0.4060, members: 342, emoji: "🏃", href: "/communities/1" },
  { id: "c2", type: "community" as const, name: "Gastrónomos Oscenses", category: "Gastronomía", address: "Mercado Central", lat: 42.1410, lng: -0.4088, members: 218, emoji: "🍕", href: "/communities/2" },
  { id: "c3", type: "community" as const, name: "Padres y Madres Huesca", category: "Familia", address: "Centro Cívico", lat: 42.1380, lng: -0.4120, members: 567, emoji: "👨‍👩‍👧", href: "/communities/3" },
];

type FilterType = "all" | "shop" | "event" | "community";

const FILTERS: { value: FilterType; label: string; emoji: string; color: string; activeBg: string }[] = [
  { value: "all",       label: "Todos",       emoji: "🗺️", color: "text-foreground",     activeBg: "bg-foreground text-white" },
  { value: "shop",      label: "Tiendas",     emoji: "🛍️", color: "text-emerald-700",    activeBg: "bg-emerald-500 text-white" },
  { value: "event",     label: "Eventos",     emoji: "🎉", color: "text-violet-700",     activeBg: "bg-violet-500 text-white" },
  { value: "community", label: "Comunidades", emoji: "👥", color: "text-blue-700",       activeBg: "bg-blue-500 text-white" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(type: FilterType | "all"): string {
  return FILTERS.find((f) => f.value === type)?.label ?? "";
}

function PinMeta({ pin }: { pin: typeof MAP_PINS[number] }) {
  if (pin.type === "shop" && pin.rating)
    return (
      <span className="flex items-center gap-1 text-amber-600 font-semibold text-xs">
        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {pin.rating}
      </span>
    );
  if (pin.type === "event" && pin.date)
    return (
      <span className="flex items-center gap-1 text-violet-600 font-semibold text-xs">
        <Calendar className="w-3 h-3" /> {pin.date}
      </span>
    );
  if (pin.type === "community" && pin.members)
    return (
      <span className="flex items-center gap-1 text-blue-600 font-semibold text-xs">
        <Users className="w-3 h-3" /> {pin.members} miembros
      </span>
    );
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MapPage() {
  const { selectedCity } = useCity();
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cityName = selectedCity?.name || "Huesca";

  // Filtered pins (sidebar + map)
  const filteredPins = useMemo(() => {
    const byType = filter === "all" ? MAP_PINS : MAP_PINS.filter((p) => p.type === filter);
    if (!search.trim()) return byType;
    const q = search.toLowerCase();
    return byType.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [filter, search]);

  const selectedPin = MAP_PINS.find((p) => p.id === selectedId) ?? null;

  function handlePinSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    const pin = MAP_PINS.find((p) => p.id === id);
    if (pin) success(pin.name, pin.address);
  }

  function handleClearSelection() {
    setSelectedId(null);
  }

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 flex flex-col gap-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-tight">Mapa de {cityName}</h1>
              <p className="text-white/70 text-[10px] leading-tight">Descubre tiendas, eventos y comunidades</p>
            </div>
          </div>
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {filteredPins.length} lugar{filteredPins.length !== 1 ? "es" : ""}
          </span>
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en el mapa…"
              className="w-full bg-white/15 border border-white/25 text-white placeholder:text-white/55 rounded-xl pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:bg-white/25 focus:border-white/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 items-center overflow-x-auto no-scrollbar pb-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  filter === f.value
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "bg-white/15 text-white border border-white/20 hover:bg-white/25"
                )}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + map ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-border bg-background overflow-hidden">
          {/* Section label */}
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 shrink-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {filter === "all" ? "Todos los lugares" : typeLabel(filter)} · {filteredPins.length} resultado{filteredPins.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {filteredPins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <MapPin className="w-8 h-8 opacity-30" />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs opacity-60 text-center px-6">Prueba otro término o cambia el filtro.</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredPins.map((pin) => {
                  const isSelected = pin.id === selectedId;
                  return (
                    <div key={pin.id}>
                      <button
                        onClick={() => handlePinSelect(pin.id)}
                        className={cn(
                          "w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all group",
                          isSelected
                            ? "bg-primary/10 border border-primary/25 shadow-sm"
                            : "hover:bg-muted border border-transparent"
                        )}
                      >
                        {/* Emoji bubble */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110",
                            pin.type === "shop"      && "bg-emerald-100 dark:bg-emerald-900/20",
                            pin.type === "event"     && "bg-violet-100 dark:bg-violet-900/20",
                            pin.type === "community" && "bg-blue-100 dark:bg-blue-900/20"
                          )}
                        >
                          {pin.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-bold truncate", isSelected && "text-primary")}>
                            {pin.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {pin.address}
                          </p>
                          <div className="mt-1">
                            <PinMeta pin={pin} />
                          </div>
                        </div>

                        {/* Type badge */}
                        <span
                          className={cn(
                            "shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            pin.type === "shop"      && "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                            pin.type === "event"     && "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
                            pin.type === "community" && "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          )}
                        >
                          {pin.category}
                        </span>
                      </button>

                      {/* Expanded detail for selected item */}
                      {isSelected && (
                        <div className="mx-2 mb-2 px-3 py-2.5 bg-primary/5 rounded-xl border border-primary/15 flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground">Ver más detalles en City App</p>
                          <Link
                            href={pin.href}
                            className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            Abrir <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden">
          <MapClient
            pins={filteredPins}
            selectedId={selectedId}
            onPinSelect={handlePinSelect}
            filter={filter}
          />

          {/* Legend overlay (desktop) */}
          <div className="absolute bottom-6 left-4 hidden lg:flex flex-col gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2.5 shadow-md z-10">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Leyenda</p>
            {[
              { color: "#00D47E", label: "Tiendas" },
              { color: "#8B5CF6", label: "Eventos" },
              { color: "#3B82F6", label: "Comunidades" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                <span className="text-xs font-medium text-foreground">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Pin count badge (mobile) */}
          <div className="lg:hidden absolute top-3 left-3 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1 shadow-md z-10 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold">{filteredPins.length} lugares</span>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom sheet (slides up when pin selected) ──────────────── */}
      {selectedPin && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-20"
            onClick={handleClearSelection}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-background rounded-t-2xl shadow-2xl border-t border-border px-4 pt-3 pb-5 animate-in slide-in-from-bottom-4 duration-300"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />

            <div className="flex items-start gap-3">
              {/* Emoji bubble */}
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
                  selectedPin.type === "shop"      && "bg-emerald-100 dark:bg-emerald-900/20",
                  selectedPin.type === "event"     && "bg-violet-100 dark:bg-violet-900/20",
                  selectedPin.type === "community" && "bg-blue-100 dark:bg-blue-900/20"
                )}
              >
                {selectedPin.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-black text-base leading-tight truncate">{selectedPin.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {selectedPin.address}
                    </p>
                  </div>
                  <button
                    onClick={handleClearSelection}
                    className="shrink-0 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      selectedPin.type === "shop"      && "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                      selectedPin.type === "event"     && "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
                      selectedPin.type === "community" && "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    )}
                  >
                    {selectedPin.category}
                  </span>
                  <PinMeta pin={selectedPin} />
                </div>
              </div>
            </div>

            {/* CTA button */}
            <Link
              href={selectedPin.href}
              className={cn(
                "mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-opacity hover:opacity-90",
                selectedPin.type === "shop"      && "bg-emerald-500",
                selectedPin.type === "event"     && "bg-violet-500",
                selectedPin.type === "community" && "bg-blue-500"
              )}
            >
              Ver en City App <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
