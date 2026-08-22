"use client";

import { useCity } from "@/context/CityContext";
import { imageFallback } from "@/lib/image-fallback";
import { MapPin } from "lucide-react";

export function HuescaWidget() {
  const { selectedCity } = useCity();
  if (!selectedCity) return null;

  // Mock weather data
  const weather = { temp: 18, condition: "Soleado", icon: "☀️" };
  const stats = {
    businesses: 247,
    events: 12,
    communities: 89,
    users: 1834,
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 overflow-hidden">
      {/* City header */}
      <div className="relative h-24 -mx-4 -mt-4 mb-3 overflow-hidden">
        <img src={selectedCity.image} alt={selectedCity.name} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white text-lg font-black">{selectedCity.name}</h3>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {selectedCity.region}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
              <span>{weather.icon}</span>
              <span>{weather.temp}°</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{selectedCity.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-primary/5 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-primary">{stats.businesses}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Negocios</p>
        </div>
        <div className="bg-primary/5 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-primary">{stats.events}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Eventos</p>
        </div>
        <div className="bg-primary/5 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-primary">{stats.communities}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Grupos</p>
        </div>
        <div className="bg-primary/5 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-primary">{stats.users}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Usuarios</p>
        </div>
      </div>
    </div>
  );
}
