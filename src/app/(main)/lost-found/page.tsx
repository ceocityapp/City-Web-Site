"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/context/CityContext";
import { imageFallback } from "@/lib/image-fallback";
import { BackToTop } from "@/components/shared/BackToTop";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Clock, Eye, MessageCircle, Plus,
  PackageSearch, AlertTriangle, Check, X, CircleDot,
} from "lucide-react";

type ItemStatus = "perdido" | "encontrado" | "devuelto";
type FilterTab = "todos" | "perdido" | "encontrado" | "devuelto";

const STATUS_STYLES: Record<ItemStatus, { bg: string; text: string; label: string; dot: string }> = {
  perdido: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    label: "Perdido",
    dot: "bg-red-500",
  },
  encontrado: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    label: "Encontrado",
    dot: "bg-amber-500",
  },
  devuelto: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Devuelto",
    dot: "bg-emerald-500",
  },
};

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
  { id: "todos", label: "Todo" },
  { id: "perdido", label: "Perdidos" },
  { id: "encontrado", label: "Encontrados" },
  { id: "devuelto", label: "Devueltos" },
];

const ITEMS = [
  {
    id: 1, title: "Llaves con llavero de cuero marrón",
    description: "Perdí mis llaves ayer por la tarde en la zona de la Plaza Navarra o Coso Alto. Tienen un llavero de cuero marrón con mis iniciales MG.",
    status: "perdido" as ItemStatus, category: "Llaves", location: "Plaza Navarra",
    date: "Hace 2 horas", user: "María García", image: null,
    views: 45, replies: 3,
  },
  {
    id: 2, title: "iPhone 15 negro encontrado en Parque Servet",
    description: "He encontrado un iPhone 15 negro con funda transparente en un banco del Parque Miguel Servet, cerca de la fuente. Está bloqueado.",
    status: "encontrado" as ItemStatus, category: "Electrónica", location: "Parque Miguel Servet",
    date: "Hace 5 horas", user: "Pablo Torres", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
    views: 128, replies: 7,
  },
  {
    id: 3, title: "Gato atigrado gris perdido - zona Santiago",
    description: "Se nos ha escapado nuestro gato Miso, es atigrado gris con ojos verdes, lleva collar azul. Se perdió en la zona del barrio Santiago. Si lo veis por favor contactadnos, es muy asustadizo.",
    status: "perdido" as ItemStatus, category: "Mascotas", location: "Barrio Santiago",
    date: "Hace 1 día", user: "Elena Ruiz", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80",
    views: 312, replies: 18,
  },
  {
    id: 4, title: "Cartera encontrada en Café Vienés",
    description: "He encontrado una cartera negra en una mesa del Café Vienés. Tiene documentación dentro. La he dejado en la barra del café.",
    status: "encontrado" as ItemStatus, category: "Documentos", location: "Café Vienés, Plaza López Allué",
    date: "Hace 1 día", user: "Carlos Mendez", image: null,
    views: 89, replies: 2,
  },
  {
    id: 5, title: "Bicicleta robada - Giant azul",
    description: "Me han robado la bicicleta de montaña Giant Talon azul y negra que tenía atada en la Calle Coso Bajo. Si alguien la ve por favor avisadme.",
    status: "perdido" as ItemStatus, category: "Vehículos", location: "Coso Bajo",
    date: "Hace 2 días", user: "Pablo Torres", image: null,
    views: 156, replies: 5,
  },
  {
    id: 6, title: "Mochila de niño encontrada en la Catedral",
    description: "Encontrada mochila azul de niño con material escolar dentro, en los bancos de la plaza de la Catedral. La he llevado a la Oficina de Turismo.",
    status: "devuelto" as ItemStatus, category: "Ropa y accesorios", location: "Plaza de la Catedral",
    date: "Hace 3 días", user: "Ayuntamiento de Huesca", image: null,
    views: 67, replies: 4,
  },
];

const CATEGORIES = ["Todos", "Llaves", "Electrónica", "Mascotas", "Documentos", "Ropa y accesorios", "Vehículos", "Otros"];

export default function LostFoundPage() {
  const { selectedCity } = useCity();
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("todos");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [items, setItems] = useState(ITEMS);
  const [showNewItem, setShowNewItem] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    title: "", description: "", status: "perdido" as ItemStatus, category: "Llaves", location: "", image: "",
  });

  const handleNewItem = () => {
    if (!newItem.title || !newItem.description) return;
    const item = {
      id: Date.now(),
      title: newItem.title,
      description: newItem.description,
      status: newItem.status,
      category: newItem.category,
      location: newItem.location || (selectedCity?.name || "Huesca"),
      date: "Ahora mismo",
      user: "Tú",
      image: newItem.image || null,
      views: 0,
      replies: 0,
    };
    setItems((prev) => [item, ...prev]);
    setNewItem({ title: "", description: "", status: "perdido", category: "Llaves", location: "", image: "" });
    setShowNewItem(false);
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = filterTab === "todos" || item.status === filterTab;
    const matchesCategory = categoryFilter === "Todos" || item.category === categoryFilter;
    return matchesSearch && matchesTab && matchesCategory;
  });

  const cityName = selectedCity?.name || "Huesca";
  const countByStatus = (s: ItemStatus) => items.filter((i) => i.status === s).length;

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
                Objetos perdidos en {cityName}
              </h1>
              <p className="text-emerald-100 text-sm mt-2">
                Encuentra o reporta objetos perdidos
              </p>
            </div>
            <div className="shrink-0 ml-4 flex items-center gap-3">
              <Button
                className="btn-press rounded-full bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 backdrop-blur-sm"
                onClick={() => setShowNewItem(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Publicar
              </Button>
              <div className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm hidden sm:flex">
                <PackageSearch className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-6">
        {/* Stats row */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-500 dark:text-red-400" />
              <p className="text-xl font-black text-red-600 dark:text-red-400">{countByStatus("perdido")}</p>
              <p className="text-[10px] text-red-500 dark:text-red-400 font-medium">Perdidos</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
              <Eye className="w-5 h-5 mx-auto mb-1 text-amber-500 dark:text-amber-400" />
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">{countByStatus("encontrado")}</p>
              <p className="text-[10px] text-amber-500 dark:text-amber-400 font-medium">Encontrados</p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-4 text-center hover:shadow-lg transition-all">
              <Check className="w-5 h-5 mx-auto mb-1 text-emerald-500 dark:text-emerald-400" />
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{countByStatus("devuelto")}</p>
              <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Devueltos</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Search */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar objetos..." className="pl-10 h-11 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </AnimatedSection>

        {/* Status filter chips + category chips */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map((f) => {
              const statusStyle = f.id !== "todos" ? STATUS_STYLES[f.id as ItemStatus] : null;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilterTab(f.id)}
                  className={cn(
                    "btn-press shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                    filterTab === f.id
                      ? "bg-foreground text-white border-transparent"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {statusStyle && (
                    <span className={cn("w-2 h-2 rounded-full", filterTab === f.id ? "bg-white" : statusStyle.dot)} />
                  )}
                  {f.label}
                </button>
              );
            })}
            <div className="border-l border-border mx-1 shrink-0" />
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "Todos" : cat)}
                className={cn(
                  "btn-press shrink-0 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  categoryFilter === cat
                    ? "bg-primary/10 dark:bg-primary/20 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* New item modal */}
        {showNewItem && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNewItem(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black">Publicar objeto</h2>
                <button onClick={() => setShowNewItem(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Título"
                  className="rounded-xl"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
                <textarea
                  placeholder="Descripción detallada..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <select
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value as ItemStatus })}
                >
                  <option value="perdido">Perdido</option>
                  <option value="encontrado">Encontrado</option>
                </select>
                <select
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  {CATEGORIES.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Input
                  placeholder="Ubicación (ej: Plaza Mayor)"
                  className="rounded-xl"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
                <Input
                  placeholder="URL de imagen (opcional)"
                  className="rounded-xl"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="btn-press flex-1 rounded-full font-bold" onClick={() => setShowNewItem(false)}>
                  Cancelar
                </Button>
                <Button className="btn-press flex-1 rounded-full bg-primary font-bold" onClick={handleNewItem}>
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="space-y-3">
          {filtered.map((item, index) => {
            const status = STATUS_STYLES[item.status];
            const isExpanded = expandedId === item.id;
            return (
              <AnimatedSection key={item.id} delay={index * 60} animation="scale-up">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex gap-4">
                    {/* Status indicator bar */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={cn("w-3 h-3 rounded-full", status.dot)} />
                      <div className={cn("w-0.5 flex-1 rounded-full", status.dot, "opacity-30")} />
                    </div>

                    {/* Image (if any) */}
                    {item.image && (
                      <div className={cn("rounded-xl overflow-hidden shrink-0 transition-all", isExpanded ? "w-32 h-32" : "w-20 h-20")}>
                        <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={cn("text-[10px] border-0 font-bold", status.bg, status.text)}>
                          <CircleDot className="w-2.5 h-2.5 mr-0.5" /> {status.label}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                      </div>
                      <h3 className="font-black text-sm mb-1">{item.title}</h3>
                      <p className={cn("text-sm text-foreground/70 mb-2", !isExpanded && "line-clamp-2")}>{item.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </span>
                        <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                          <Clock className="w-3 h-3" /> {item.date}
                        </span>
                        <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                          <Eye className="w-3 h-3" /> {item.views}
                        </span>
                        <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                          <MessageCircle className="w-3 h-3" /> {item.replies}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Publicado por <strong className="text-foreground">{item.user}</strong>
                      </p>

                      {/* Expanded actions */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border animate-in slide-in-from-top-2">
                          <Link href="/chat" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" className="btn-press rounded-full bg-primary font-bold text-xs">
                              <MessageCircle className="w-3 h-3 mr-1" /> Contactar
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <PackageSearch className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No se encontraron objetos</p>
            <p className="text-sm mt-1">Prueba con otros filtros o publica uno nuevo</p>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
