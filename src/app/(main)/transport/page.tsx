"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCity } from "@/context/CityContext";
import { BackToTop } from "@/components/shared/BackToTop";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";
import {
  Train, Bus, Bike, Car, Clock, MapPin, Search,
  Navigation, ChevronRight, AlertCircle, Zap, Check, Phone,
} from "lucide-react";

type TransportTab = "trenes" | "buses" | "bici" | "taxi";

const TABS: Array<{ id: TransportTab; label: string; icon: React.ElementType }> = [
  { id: "trenes", label: "Trenes", icon: Train },
  { id: "buses", label: "Autobuses", icon: Bus },
  { id: "bici", label: "Bicicleta", icon: Bike },
  { id: "taxi", label: "Taxi", icon: Car },
];

const TRAIN_ROUTES = [
  { id: 1, origin: "Huesca", destination: "Zaragoza", departure: "06:45", arrival: "07:50", duration: "1h 05min", price: "8,55€", operator: "Renfe Media Distancia", status: "en-hora" },
  { id: 2, origin: "Huesca", destination: "Zaragoza", departure: "08:15", arrival: "09:18", duration: "1h 03min", price: "8,55€", operator: "Renfe Media Distancia", status: "en-hora" },
  { id: 3, origin: "Huesca", destination: "Zaragoza", departure: "10:30", arrival: "11:35", duration: "1h 05min", price: "8,55€", operator: "Renfe Media Distancia", status: "retraso" },
  { id: 4, origin: "Huesca", destination: "Jaca", departure: "07:00", arrival: "08:15", duration: "1h 15min", price: "7,30€", operator: "Renfe Regional", status: "en-hora" },
  { id: 5, origin: "Huesca", destination: "Lérida", departure: "12:00", arrival: "13:45", duration: "1h 45min", price: "12,90€", operator: "Renfe Media Distancia", status: "en-hora" },
  { id: 6, origin: "Huesca", destination: "Madrid", departure: "06:20", arrival: "09:50", duration: "3h 30min", price: "32,00€", operator: "Renfe AVE (vía Zaragoza)", status: "en-hora" },
];

const BUS_ROUTES = [
  { id: 1, line: "L1", name: "Circular Centro", frequency: "Cada 15 min", hours: "7:00 - 22:30", stops: 18, status: "activo" },
  { id: 2, line: "L2", name: "Perpetuo Socorro - Hospital", frequency: "Cada 20 min", hours: "6:30 - 22:00", stops: 24, status: "activo" },
  { id: 3, line: "L3", name: "San Lorenzo - Universidad", frequency: "Cada 15 min", hours: "7:00 - 22:00", stops: 16, status: "activo" },
  { id: 4, line: "L4", name: "Estación - Polígono", frequency: "Cada 30 min", hours: "6:45 - 21:30", stops: 12, status: "activo" },
  { id: 5, line: "Interurbano", name: "Huesca - Barbastro", frequency: "4 salidas/día", hours: "8:00 - 19:00", stops: 6, status: "activo" },
  { id: 6, line: "Interurbano", name: "Huesca - Monzón", frequency: "3 salidas/día", hours: "9:00 - 18:00", stops: 5, status: "activo" },
];

const BIKE_STATIONS = [
  { id: 1, name: "Plaza Navarra", bikes: 8, docks: 12, distance: "0.2 km" },
  { id: 2, name: "Parque Miguel Servet", bikes: 5, docks: 10, distance: "0.4 km" },
  { id: 3, name: "Estación de tren", bikes: 3, docks: 8, distance: "0.8 km" },
  { id: 4, name: "Campus Universitario", bikes: 12, docks: 15, distance: "1.2 km" },
  { id: 5, name: "Hospital San Jorge", bikes: 6, docks: 10, distance: "1.5 km" },
];

const TAXI_COMPANIES = [
  { id: 1, name: "Radio Taxi Huesca", phone: "+34 974 210 210", available: true, price: "Bajada de bandera: 2,50€" },
  { id: 2, name: "Taxi Huesca 24h", phone: "+34 974 225 225", available: true, price: "Bajada de bandera: 2,50€" },
  { id: 3, name: "Tele Taxi Oscense", phone: "+34 974 231 231", available: false, price: "Bajada de bandera: 2,50€" },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  "en-hora": { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", label: "En hora" },
  "retraso": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", label: "Retraso" },
  "cancelado": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", label: "Cancelado" },
};

export default function TransportPage() {
  const { selectedCity } = useCity();
  const [tab, setTab] = useState<TransportTab>("trenes");
  const [trainSearch, setTrainSearch] = useState("");
  const [busSearch, setBusSearch] = useState("");
  const [expandedTrain, setExpandedTrain] = useState<number | null>(null);
  const [expandedBike, setExpandedBike] = useState<number | null>(null);
  const [taxiBooked, setTaxiBooked] = useState(false);
  const [trainOrigin, setTrainOrigin] = useState("Huesca");
  const [trainSearched, setTrainSearched] = useState(false);

  const filteredTrains = trainSearch
    ? TRAIN_ROUTES.filter((r) =>
        r.destination.toLowerCase().includes(trainSearch.toLowerCase()) ||
        r.origin.toLowerCase().includes(trainSearch.toLowerCase())
      )
    : TRAIN_ROUTES;

  const filteredBuses = busSearch
    ? BUS_ROUTES.filter((r) =>
        r.name.toLowerCase().includes(busSearch.toLowerCase()) ||
        r.line.toLowerCase().includes(busSearch.toLowerCase())
      )
    : BUS_ROUTES;

  const cityName = selectedCity?.name || "Huesca";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero banner */}
      <AnimatedSection animation="fade-up">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-emerald-400 px-6 py-10 rounded-none sm:rounded-2xl sm:mx-4 sm:mt-4">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest mb-1">
                {cityName}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Transporte en {cityName}
              </h1>
              <p className="text-emerald-100 text-sm mt-2">
                Muévete por tu ciudad y alrededores
              </p>
            </div>
            <div className="shrink-0 ml-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Train className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-6">
        {/* Tab chips */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "btn-press shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                  tab === t.id
                    ? "bg-foreground text-white border-transparent"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* ========== TRAINS ========== */}
        {tab === "trenes" && (
          <div className="space-y-4">
            {/* Quick search card */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="bg-card rounded-2xl border border-border p-5">
                <h2 className="font-black mb-3 flex items-center gap-2">
                  <Train className="w-5 h-5 text-primary" /> Buscar tren
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Origen</label>
                    <Input className="rounded-xl h-10" value={trainOrigin} onChange={(e) => setTrainOrigin(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Destino</label>
                    <Input className="rounded-xl h-10" placeholder="¿A dónde vas?" value={trainSearch} onChange={(e) => { setTrainSearch(e.target.value); setTrainSearched(false); }} />
                  </div>
                  <div className="flex items-end">
                    <Button className="btn-press rounded-full bg-primary font-bold w-full h-10" onClick={() => setTrainSearched(true)}>
                      <Search className="w-4 h-4 mr-1.5" /> Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Search result summary */}
            {trainSearched && (
              <AnimatedSection animation="fade-up">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">
                    {filteredTrains.length} {filteredTrains.length === 1 ? "tren encontrado" : "trenes encontrados"} {trainSearch && `a ${trainSearch}`} desde {trainOrigin}
                  </p>
                  {trainSearch && (
                    <button className="btn-press text-xs text-primary/70 hover:text-primary font-bold" onClick={() => { setTrainSearch(""); setTrainSearched(false); }}>
                      Limpiar
                    </button>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Train list */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase px-1">
                Próximas salidas desde {trainOrigin || "Huesca"}
              </p>

              {/* Empty state */}
              {filteredTrains.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Train className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-semibold">No se encontraron trenes</p>
                  <p className="text-sm mt-1">Prueba con otro destino</p>
                </div>
              )}

              {filteredTrains.map((route, index) => {
                const status = statusColors[route.status];
                return (
                  <AnimatedSection key={route.id} delay={index * 60} animation="fade-up">
                    <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-black">{route.departure}</p>
                            <p className="text-[10px] text-muted-foreground">{route.origin}</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-12 sm:w-16 h-px bg-border" />
                            <p className="text-[10px] font-bold">{route.duration}</p>
                            <div className="w-12 sm:w-16 h-px bg-border" />
                            <div className="w-2 h-2 rounded-full border-2 border-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-black">{route.arrival}</p>
                            <p className="text-[10px] text-muted-foreground">{route.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-primary">{route.price}</p>
                          <Badge className={cn("text-[10px] border-0 font-bold", status.bg, status.text)}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{route.operator}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="btn-press text-xs text-primary font-bold h-7 rounded-full"
                          onClick={() => setExpandedTrain(expandedTrain === route.id ? null : route.id)}
                        >
                          {expandedTrain === route.id ? "Ocultar" : "Ver detalles"}
                          <ChevronRight className={cn("w-3 h-3 ml-0.5 transition-transform", expandedTrain === route.id && "rotate-90")} />
                        </Button>
                      </div>
                      {expandedTrain === route.id && (
                        <div className="mt-3 pt-3 border-t border-border text-sm space-y-2 animate-in slide-in-from-top-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-muted/50 rounded-lg p-2"><span className="text-muted-foreground">Operador:</span> <span className="font-bold">{route.operator}</span></div>
                            <div className="bg-muted/50 rounded-lg p-2"><span className="text-muted-foreground">Duración:</span> <span className="font-bold">{route.duration}</span></div>
                            <div className="bg-muted/50 rounded-lg p-2"><span className="text-muted-foreground">Precio:</span> <span className="font-bold text-primary">{route.price}</span></div>
                            <div className="bg-muted/50 rounded-lg p-2"><span className="text-muted-foreground">Estado:</span> <Badge className={cn("text-[10px] border-0 font-bold ml-1", status.bg, status.text)}>{status.label}</Badge></div>
                          </div>
                          <p className="text-xs text-muted-foreground">Salida desde estación de {route.origin}. Compra tu billete en renfe.com o en taquilla.</p>
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Info banner */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200">Información en tiempo real</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Los horarios pueden variar. Consulta siempre renfe.com para información actualizada.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* ========== BUSES ========== */}
        {tab === "buses" && (
          <div className="space-y-4">
            {/* Stats row */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-black">6</p>
                  <p className="text-xs text-muted-foreground">Líneas activas</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-2xl font-black">1,20€</p>
                  <p className="text-xs text-muted-foreground">Billete sencillo</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Search */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar línea o ruta..."
                  className="pl-10 h-10 rounded-full"
                  value={busSearch}
                  onChange={(e) => setBusSearch(e.target.value)}
                />
              </div>
            </AnimatedSection>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase px-1">Líneas urbanas e interurbanas</p>

              {/* Empty state */}
              {filteredBuses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bus className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-semibold">No se encontraron líneas</p>
                  <p className="text-sm mt-1">Prueba con otro nombre</p>
                </div>
              )}

              {filteredBuses.map((route, index) => (
                <AnimatedSection key={route.id} delay={index * 60} animation="fade-up">
                  <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0",
                        route.line.startsWith("L")
                          ? "bg-primary/10 dark:bg-primary/20 text-primary"
                          : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                      )}>
                        {route.line}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm">{route.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {route.frequency}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {route.stops} paradas</span>
                          <span>{route.hours}</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold shrink-0">
                        {route.status}
                      </Badge>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* ========== BIKE ========== */}
        {tab === "bici" && (
          <div className="space-y-4">
            {/* Info card */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Bike className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-black">BiciHuesca</h2>
                    <p className="text-xs text-muted-foreground">Sistema público de bicicletas compartidas</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-3">
                    <p className="text-lg font-black text-primary">34</p>
                    <p className="text-[10px] text-muted-foreground">Bicis disponibles</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-lg font-black">5</p>
                    <p className="text-[10px] text-muted-foreground">Estaciones</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-lg font-black">25€</p>
                    <p className="text-[10px] text-muted-foreground">Abono anual</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <p className="text-xs font-bold text-muted-foreground uppercase px-1">Estaciones cercanas</p>
            <div className="space-y-2">
              {BIKE_STATIONS.map((station, index) => (
                <AnimatedSection key={station.id} delay={index * 60} animation="fade-up">
                  <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                          station.bikes > 3
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        )}>
                          {station.bikes}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{station.name}</h3>
                          <p className="text-xs text-muted-foreground">{station.bikes} bicis &middot; {station.docks} anclajes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-muted-foreground">{station.distance}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="btn-press text-xs text-primary font-bold h-7 rounded-full mt-0.5"
                          onClick={() => setExpandedBike(expandedBike === station.id ? null : station.id)}
                        >
                          <Navigation className="w-3 h-3 mr-1" /> {expandedBike === station.id ? "Cerrar" : "Ir"}
                        </Button>
                      </div>
                    </div>
                    {expandedBike === station.id && (
                      <div className="mt-3 pt-3 border-t border-border animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
                          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-2">
                            <p className="font-black text-primary">{station.bikes}</p>
                            <p className="text-muted-foreground">Disponibles</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="font-black">{station.docks - station.bikes}</p>
                            <p className="text-muted-foreground">Anclajes libres</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="font-black">{station.distance}</p>
                            <p className="text-muted-foreground">Distancia</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Dirección: {station.name}, Huesca. Abre Google Maps para navegar hasta la estación.</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* ========== TAXI ========== */}
        {tab === "taxi" && (
          <div className="space-y-4">
            {/* CTA card */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="bg-foreground rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg">Pedir taxi ahora</h2>
                    <p className="text-xs text-white/60">Servicio disponible 24 horas</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Recogida</label>
                    <Input className="rounded-xl h-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" placeholder="Tu ubicación" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Destino</label>
                    <Input className="rounded-xl h-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" placeholder="¿A dónde?" />
                  </div>
                </div>
                {!taxiBooked ? (
                  <Button className="btn-press w-full mt-4 rounded-full bg-primary font-bold h-11" onClick={() => setTaxiBooked(true)}>
                    <Car className="w-4 h-4 mr-2" /> Solicitar taxi
                  </Button>
                ) : (
                  <div className="mt-4 bg-primary/20 rounded-2xl p-4 text-center animate-in slide-in-from-top-2">
                    <Check className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="font-black text-white">Taxi confirmado</p>
                    <p className="text-xs text-white/70">Llegada estimada: 5 minutos</p>
                    <Button variant="ghost" className="btn-press mt-2 text-white/80 text-xs font-bold" onClick={() => setTaxiBooked(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </AnimatedSection>

            <p className="text-xs font-bold text-muted-foreground uppercase px-1">Compañías de taxi</p>
            <div className="space-y-2">
              {TAXI_COMPANIES.map((company, index) => (
                <AnimatedSection key={company.id} delay={index * 60} animation="fade-up">
                  <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{company.name}</h3>
                          <p className="text-xs text-muted-foreground">{company.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-[10px] border-0 font-bold",
                          company.available
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {company.available ? "Disponible" : "No disponible"}
                        </Badge>
                        <a href={`tel:${company.phone}`}>
                          <Button size="sm" className="btn-press rounded-full bg-primary font-bold h-8 text-xs">
                            <Phone className="w-3 h-3 mr-1" /> Llamar
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Tariff info */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="bg-muted/50 rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Tarifas: Bajada de bandera 2,50€ &middot; Km diurno 0,95€ &middot; Km nocturno 1,20€
                </p>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
