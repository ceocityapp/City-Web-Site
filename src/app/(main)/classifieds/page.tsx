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
  Search, MapPin, Clock, Heart, Plus, Grid3X3, List,
  Tag, MessageCircle, Eye, X, ShoppingBag, ArrowLeftRight,
} from "lucide-react";

type ViewMode = "grid" | "list";
type ListingType = "Todos" | "Vendo" | "Compro" | "Intercambio";

const LISTING_TYPES: Array<{ id: ListingType; label: string; icon: React.ElementType }> = [
  { id: "Todos", label: "Todos", icon: Tag },
  { id: "Vendo", label: "Vendo", icon: ShoppingBag },
  { id: "Compro", label: "Compro", icon: Search },
  { id: "Intercambio", label: "Intercambio", icon: ArrowLeftRight },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Electrónica": "💻", "Hogar": "🏠", "Motor": "🚗", "Deportes": "⚽",
  "Moda": "👗", "Libros": "📚", "Música": "🎸", "Otros": "📦",
};

const LISTINGS = [
  {
    id: 1, title: "Sofá esquinero gris - como nuevo", type: "Vendo" as ListingType,
    description: "Sofá de 3 plazas con chaise longue, color gris claro. Solo 6 meses de uso, sin manchas ni desgaste.",
    price: 350, negotiable: true, category: "Hogar", condition: "Como nuevo",
    location: "Centro, Huesca", date: "Hace 3 horas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    user: "María García", views: 67, likes: 8,
  },
  {
    id: 2, title: "MacBook Pro 2024 M3 - 14\"", type: "Vendo" as ListingType,
    description: "MacBook Pro 14 pulgadas con chip M3, 16GB RAM, 512GB SSD. Con caja original y cargador. En perfecto estado.",
    price: 1200, negotiable: false, category: "Electrónica", condition: "Perfecto estado",
    location: "San Lorenzo, Huesca", date: "Hace 5 horas",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    user: "Carlos Mendez", views: 234, likes: 15,
  },
  {
    id: 3, title: "Bicicleta de montaña Orbea talla M", type: "Vendo" as ListingType,
    description: "Bicicleta de montaña Orbea MX 29, cuadro aluminio talla M. Frenos de disco hidráulicos, 21 velocidades.",
    price: 280, negotiable: true, category: "Deportes", condition: "Buen estado",
    location: "Perpetuo Socorro, Huesca", date: "Hace 1 día",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80",
    user: "Pablo Torres", views: 156, likes: 12,
  },
  {
    id: 4, title: "Colección libros Harry Potter completa", type: "Vendo" as ListingType,
    description: "Los 7 libros de Harry Potter en español, edición de bolsillo. Buen estado, sin subrayar.",
    price: 25, negotiable: false, category: "Libros", condition: "Buen estado",
    location: "Casco Antiguo, Huesca", date: "Hace 1 día",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    user: "Elena Ruiz", views: 89, likes: 6,
  },
  {
    id: 5, title: "Guitarra española Alhambra 4P", type: "Intercambio" as ListingType,
    description: "Guitarra clásica Alhambra 4P, tapa maciza de cedro. Incluye funda rígida. Sonido espectacular.",
    price: 180, negotiable: true, category: "Música", condition: "Buen estado",
    location: "Centro, Huesca", date: "Hace 2 días",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
    user: "María García", views: 98, likes: 9,
  },
  {
    id: 6, title: "Mesa de comedor extensible roble", type: "Vendo" as ListingType,
    description: "Mesa de comedor de roble macizo, extensible de 120 a 180cm. 4 sillas incluidas. Pequeñas marcas de uso.",
    price: 200, negotiable: true, category: "Hogar", condition: "Usado",
    location: "Santiago, Huesca", date: "Hace 3 días",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
    user: "Carlos Mendez", views: 45, likes: 3,
  },
  {
    id: 7, title: "Zapatillas Nike Air Max 90 - talla 43", type: "Vendo" as ListingType,
    description: "Nike Air Max 90 blancas y negras, talla 43. Solo usadas un par de veces, prácticamente nuevas.",
    price: 55, negotiable: false, category: "Moda", condition: "Como nuevo",
    location: "Centro, Huesca", date: "Hace 3 días",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    user: "Pablo Torres", views: 78, likes: 5,
  },
  {
    id: 8, title: "PS5 con 2 mandos y 3 juegos", type: "Vendo" as ListingType,
    description: "PlayStation 5 disc edition con 2 mandos DualSense y FIFA 25, Spider-Man 2 y God of War Ragnarok. Todo perfecto.",
    price: 380, negotiable: true, category: "Electrónica", condition: "Perfecto estado",
    location: "Perpetuo Socorro, Huesca", date: "Hace 4 días",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    user: "Elena Ruiz", views: 312, likes: 22,
  },
];

const conditionColors: Record<string, string> = {
  "Perfecto estado": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  "Como nuevo": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  "Buen estado": "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  "Usado": "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
};

export default function ClassifiedsPage() {
  const { selectedCity } = useCity();
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState<ListingType>("Todos");
  const [category, setCategory] = useState("Todos");
  const [view, setView] = useState<ViewMode>("grid");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [listings, setListings] = useState(LISTINGS);
  const [showNewListing, setShowNewListing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newListing, setNewListing] = useState({
    title: "", description: "", price: "", category: "Electrónica", image: "",
  });

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleNewListing = () => {
    if (!newListing.title || !newListing.price) return;
    const item = {
      id: Date.now(),
      title: newListing.title,
      description: newListing.description,
      price: Number(newListing.price),
      negotiable: false,
      category: newListing.category,
      condition: "Buen estado",
      type: "Vendo" as ListingType,
      location: selectedCity?.name ? `Centro, ${selectedCity.name}` : "Centro, Huesca",
      date: "Ahora mismo",
      image: newListing.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      user: "Tú",
      views: 0,
      likes: 0,
    };
    setListings((prev) => [item, ...prev]);
    setNewListing({ title: "", description: "", price: "", category: "Electrónica", image: "" });
    setShowNewListing(false);
  };

  const filtered = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || item.category === category;
    const matchesType = listingType === "Todos" || item.type === listingType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const cityName = selectedCity?.name || "Huesca";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero banner */}
      <AnimatedSection animation="fade-up">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-emerald-400 px-6 py-10 rounded-none sm:rounded-2xl sm:mx-4 sm:mt-4">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest mb-1">
                {cityName}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Compraventa en {cityName}
              </h1>
              <p className="text-emerald-100 text-sm mt-2">
                Compra, vende e intercambia en tu ciudad
              </p>
            </div>
            <div className="shrink-0 ml-4 flex items-center gap-3">
              <Button
                className="btn-press rounded-full bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 backdrop-blur-sm"
                onClick={() => setShowNewListing(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Vender algo
              </Button>
              <div className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm hidden sm:flex">
                <Tag className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-6">
        {/* Search + view toggle */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar artículos..." className="pl-10 h-11 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex bg-card border border-border rounded-full overflow-hidden">
              <button onClick={() => setView("grid")} className={cn("btn-press px-3 py-2 transition-all", view === "grid" ? "bg-foreground text-white" : "text-muted-foreground hover:text-foreground")}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={cn("btn-press px-3 py-2 transition-all", view === "list" ? "bg-foreground text-white" : "text-muted-foreground hover:text-foreground")}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Type filter chips (Vendo/Compro/Intercambio) */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {LISTING_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setListingType(t.id)}
                className={cn(
                  "btn-press shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  listingType === t.id
                    ? "bg-foreground text-white border-transparent"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
            <div className="border-l border-border mx-1 shrink-0" />
            {Object.entries(CATEGORY_ICONS).map(([name, icon]) => (
              <button
                key={name}
                onClick={() => setCategory(category === name ? "Todos" : name)}
                className={cn(
                  "btn-press shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  category === name
                    ? "bg-primary/10 dark:bg-primary/20 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                )}
              >
                <span>{icon}</span> {name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Results count */}
        <p className="text-xs font-bold text-muted-foreground uppercase px-1">
          {filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}
        </p>

        {/* New listing modal */}
        {showNewListing && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNewListing(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black">Nuevo anuncio</h2>
                <button onClick={() => setShowNewListing(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Título del artículo"
                  className="rounded-xl"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                />
                <textarea
                  placeholder="Descripción..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                />
                <Input
                  placeholder="Precio (€)"
                  type="number"
                  className="rounded-xl"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                />
                <select
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newListing.category}
                  onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                >
                  {Object.keys(CATEGORY_ICONS).map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                  ))}
                </select>
                <Input
                  placeholder="URL de la foto (opcional)"
                  className="rounded-xl"
                  value={newListing.image}
                  onChange={(e) => setNewListing({ ...newListing, image: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="btn-press flex-1 rounded-full font-bold" onClick={() => setShowNewListing(false)}>
                  Cancelar
                </Button>
                <Button className="btn-press flex-1 rounded-full bg-primary font-bold" onClick={handleNewListing}>
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Grid view */}
        {view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 60} animation="scale-up">
                <div
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={imageFallback} />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className={cn(
                        "btn-press absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        likedItems.has(item.id) ? "bg-red-500 text-white" : "bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", likedItems.has(item.id) && "fill-current")} />
                    </button>
                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.negotiable && (
                        <Badge className="bg-foreground/80 text-white border-0 text-[10px] font-bold backdrop-blur-sm">Negociable</Badge>
                      )}
                      {item.condition && (
                        <Badge className={cn("border-0 text-[10px] font-bold", conditionColors[item.condition] || "bg-muted text-muted-foreground")}>
                          {item.condition}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{item.price}€</p>
                    <h3 className="text-sm font-bold line-clamp-2 leading-tight mt-0.5">{item.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {item.location}
                    </p>
                    {expandedId === item.id && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <p className="text-xs text-foreground/70">{item.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {item.date}</span>
                          <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {item.views}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Vendido por <strong className="text-foreground">{item.user}</strong></p>
                        <Link href="/chat" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="btn-press w-full rounded-full bg-primary font-bold text-xs mt-1">
                            <MessageCircle className="w-3 h-3 mr-1" /> Contactar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="space-y-3">
            {filtered.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 60} animation="fade-up">
                <div
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex">
                    <div className="w-32 h-32 overflow-hidden shrink-0 relative">
                      <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                      {item.negotiable && (
                        <Badge className="absolute top-2 left-2 bg-foreground/80 text-white border-0 text-[9px] font-bold backdrop-blur-sm">Negociable</Badge>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{item.price}€</p>
                          {item.condition && (
                            <Badge className={cn("border-0 text-[10px] font-bold", conditionColors[item.condition] || "bg-muted text-muted-foreground")}>
                              {item.condition}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{item.title}</h3>
                        <p className={cn("text-xs text-foreground/70 mt-0.5", expandedId !== item.id && "line-clamp-1")}>{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }} className="btn-press text-muted-foreground hover:text-red-500 transition-colors">
                          <Heart className={cn("w-4 h-4", likedItems.has(item.id) && "fill-red-500 text-red-500")} />
                        </button>
                      </div>
                      {expandedId === item.id && (
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Vendido por <strong className="text-foreground">{item.user}</strong> &middot; <Eye className="w-3 h-3 inline" /> {item.views}</p>
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
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No se encontraron artículos</p>
            <p className="text-sm mt-1">Prueba con otros filtros o publica el tuyo</p>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
