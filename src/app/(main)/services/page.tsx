"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCity } from "@/context/CityContext";
import { BackToTop } from "@/components/shared/BackToTop";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/avatar-color";
import {
  Search, Star, Phone, MapPin, Check,
  Wrench, Zap, Droplets, Paintbrush, Scissors, Home,
  Shield, Car, GraduationCap, Stethoscope, Scale, Dog,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "Todos", icon: Search },
  { id: "hogar", name: "Hogar", icon: Home },
  { id: "electricidad", name: "Electricidad", icon: Zap },
  { id: "fontaneria", name: "Fontanería", icon: Droplets },
  { id: "pintura", name: "Pintura", icon: Paintbrush },
  { id: "peluqueria", name: "Peluquería", icon: Scissors },
  { id: "mecanica", name: "Mecánica", icon: Car },
  { id: "salud", name: "Salud", icon: Stethoscope },
  { id: "educacion", name: "Educación", icon: GraduationCap },
  { id: "legal", name: "Legal", icon: Scale },
  { id: "mascotas", name: "Mascotas", icon: Dog },
  { id: "seguridad", name: "Seguridad", icon: Shield },
];

const SERVICES = [
  {
    id: 1, name: "Electricidad Martínez", category: "electricidad",
    description: "Instalaciones eléctricas, averías urgentes y certificados. Más de 20 años de experiencia en Huesca.",
    rating: 4.9, reviews: 47, price: "Desde 30€/hora", phone: "+34 974 221 456",
    location: "Centro, Huesca", available: true, verified: true,
    tags: ["Urgencias 24h", "Certificados", "Reformas"],
  },
  {
    id: 2, name: "Fontanería Pirineos", category: "fontaneria",
    description: "Servicio de fontanería integral. Reparaciones, instalaciones y mantenimiento de calefacción.",
    rating: 4.8, reviews: 35, price: "Desde 35€/hora", phone: "+34 974 232 789",
    location: "San Lorenzo, Huesca", available: true, verified: true,
    tags: ["Calefacción", "Gas", "Urgencias"],
  },
  {
    id: 3, name: "Pinturas Oscense", category: "pintura",
    description: "Pintura de interiores y exteriores. Acabados profesionales, presupuesto sin compromiso.",
    rating: 4.7, reviews: 28, price: "Desde 8€/m²", phone: "+34 974 245 123",
    location: "Perpetuo Socorro, Huesca", available: true, verified: false,
    tags: ["Interiores", "Exteriores", "Impermeabilización"],
  },
  {
    id: 4, name: "Peluquería Luna", category: "peluqueria",
    description: "Corte, color, peinados y tratamientos capilares. Citas previas y walk-in.",
    rating: 4.9, reviews: 92, price: "Corte desde 15€", phone: "+34 974 210 567",
    location: "Coso Alto, Huesca", available: true, verified: true,
    tags: ["Mujer", "Hombre", "Tratamientos"],
  },
  {
    id: 5, name: "Taller Mecánico Aragón", category: "mecanica",
    description: "Reparación de vehículos, ITV, neumáticos y mantenimiento general. Todas las marcas.",
    rating: 4.6, reviews: 53, price: "Revisión desde 45€", phone: "+34 974 256 890",
    location: "Polígono Sepes, Huesca", available: true, verified: true,
    tags: ["ITV", "Neumáticos", "Diagnosis"],
  },
  {
    id: 6, name: "Clínica Dental Servet", category: "salud",
    description: "Odontología general, ortodoncia, implantes y estética dental. Primera visita gratuita.",
    rating: 4.8, reviews: 67, price: "Consulta desde 25€", phone: "+34 974 223 445",
    location: "Parque Servet, Huesca", available: false, verified: true,
    tags: ["Ortodoncia", "Implantes", "Niños"],
  },
  {
    id: 7, name: "Academia Pirineos", category: "educacion",
    description: "Clases particulares, refuerzo escolar, idiomas y preparación de oposiciones.",
    rating: 4.7, reviews: 41, price: "Desde 12€/hora", phone: "+34 974 267 890",
    location: "Centro, Huesca", available: true, verified: false,
    tags: ["Inglés", "Mates", "Oposiciones"],
  },
  {
    id: 8, name: "Veterinaria San Roque", category: "mascotas",
    description: "Consultas, vacunaciones, cirugía y peluquería canina. Urgencias veterinarias 24h.",
    rating: 4.9, reviews: 78, price: "Consulta desde 30€", phone: "+34 974 234 567",
    location: "Santiago, Huesca", available: true, verified: true,
    tags: ["Urgencias", "Cirugía", "Peluquería"],
  },
];

export default function ServicesPage() {
  const { selectedCity } = useCity();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = SERVICES.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || s.category === category;
    return matchesSearch && matchesCategory;
  });

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
                Servicios en {cityName}
              </h1>
              <p className="text-emerald-100 text-sm mt-2">
                Profesionales de confianza cerca de ti
              </p>
            </div>
            <div className="shrink-0 ml-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Wrench className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicio o profesional..."
              className="pl-10 h-11 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </AnimatedSection>

        {/* Category filter chips */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "btn-press shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  category === cat.id
                    ? "bg-foreground text-white border-transparent"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                <cat.icon className="w-3.5 h-3.5" /> {cat.name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Results count */}
        <p className="text-xs font-bold text-muted-foreground uppercase px-1">
          {filtered.length} {filtered.length === 1 ? "servicio" : "servicios"} {category !== "all" && "en esta categoría"}
        </p>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No se encontraron servicios</p>
            <p className="text-sm mt-1">Prueba con otra búsqueda o categoría</p>
          </div>
        )}

        {/* Services list */}
        <div className="space-y-3">
          {filtered.map((service, index) => {
            const color = avatarColor(service.name);
            return (
              <AnimatedSection key={service.id} delay={index * 60} animation="scale-up">
                <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarFallback className={cn("font-bold text-sm", color)}>
                        {service.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-black text-sm">{service.name}</h3>
                        {service.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary">
                            <Check className="w-3.5 h-3.5" /> Verificado
                          </span>
                        )}
                        {!service.available && (
                          <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">No disponible</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{service.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {service.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] font-medium">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <strong className="text-foreground">{service.rating}</strong> ({service.reviews})
                        </span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {service.location}</span>
                        <span className="font-bold text-primary">{service.price}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col gap-2">
                      <a href={`tel:${service.phone}`}>
                        <Button size="sm" className="btn-press rounded-full bg-primary font-bold text-xs w-full">
                          <Phone className="w-3 h-3 mr-1" /> Llamar
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-press rounded-full font-bold text-xs"
                        onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                      >
                        {expandedId === service.id ? "Cerrar" : "Ver perfil"}
                        <ChevronRight className={cn("w-3 h-3 ml-0.5 transition-transform", expandedId === service.id && "rotate-90")} />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedId === service.id && (
                    <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
                      <p className="text-sm text-foreground/80 mb-3">{service.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                          <Phone className="w-4 h-4 text-primary shrink-0" />
                          <div>
                            <p className="text-muted-foreground">Teléfono</p>
                            <p className="font-bold">{service.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <div>
                            <p className="text-muted-foreground">Dirección</p>
                            <p className="font-bold">{service.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <strong className="text-foreground">{service.rating}</strong> ({service.reviews} valoraciones)
                        </span>
                        <span className="font-bold text-primary">{service.price}</span>
                        {service.verified && (
                          <span className="flex items-center gap-1 text-primary"><Check className="w-3 h-3" /> Verificado</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a href={`tel:${service.phone}`}>
                          <Button size="sm" className="btn-press rounded-full bg-primary font-bold text-xs">
                            <Phone className="w-3 h-3 mr-1" /> Llamar
                          </Button>
                        </a>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(service.location)}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="btn-press rounded-full font-bold text-xs">
                            <MapPin className="w-3 h-3 mr-1" /> Ver en mapa
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
