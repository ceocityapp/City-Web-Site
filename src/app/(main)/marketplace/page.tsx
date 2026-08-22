"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/context/CityContext";
import { Search, Star, MapPin, ShoppingBag, Filter, CheckCircle, Tag } from "lucide-react";
import { HUESCA_SHOPS } from "@/lib/huesca-data";
import { AddBusinessDialog } from "@/components/marketplace/AddBusinessDialog";
import { BackToTop } from "@/components/shared/BackToTop";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { imageFallback } from "@/lib/image-fallback";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const CATEGORIES = [
  { label: "Todos", emoji: "🏪" },
  { label: "Restaurantes", emoji: "🍽️" },
  { label: "Cafetería", emoji: "☕" },
  { label: "Tiendas", emoji: "🛍️" },
  { label: "Librería", emoji: "📚" },
  { label: "Panadería", emoji: "🥐" },
  { label: "Salud", emoji: "💊" },
  { label: "Alimentación", emoji: "🛒" },
  { label: "Deportes", emoji: "⚽" },
  { label: "Ocio", emoji: "🎭" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  Restaurantes: "🍽️",
  Cafetería: "☕",
  Tiendas: "🛍️",
  Librería: "📚",
  Panadería: "🥐",
  Salud: "💊",
  Alimentación: "🛒",
  Deportes: "⚽",
  Ocio: "🎭",
};

export default function MarketplacePage() {
  const { selectedCity } = useCity();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showFilters, setShowFilters] = useState(true);

  const cityName = selectedCity?.name || "tu ciudad";

  const filtered = HUESCA_SHOPS.filter((shop) => {
    const matchSearch =
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "Todos" || shop.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = filtered.filter((s) => s.is_featured);
  const regular = filtered.filter((s) => !s.is_featured);

  const totalCategories = new Set(HUESCA_SHOPS.map((s) => s.category)).size;
  const verifiedCount = HUESCA_SHOPS.filter((s) => s.rating >= 4.7).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero banner */}
      <AnimatedSection animation="fade-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-emerald-50 to-primary/5 px-6 py-10 mb-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 50%, #0F7A3C 0%, transparent 60%)",
          }}
        />
        <div className="relative flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground leading-tight">
                Mercado de {cityName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Apoya a los negocios locales y descubre lo mejor de tu ciudad
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <AddBusinessDialog />
          </div>
        </div>
      </div>
      </AnimatedSection>

      {/* Stats strip */}
      <AnimatedSection animation="fade-up" delay={200}>
      <div className="bg-card border-b border-border px-6 py-3 mb-6">
        <div className="max-w-6xl mx-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="font-black text-foreground">{HUESCA_SHOPS.length}</span>
            <span className="text-muted-foreground">negocios</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="font-black text-foreground">{totalCategories}</span>
            <span className="text-muted-foreground">categorías</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="font-black text-foreground">{verifiedCount}</span>
            <span className="text-muted-foreground">verificados</span>
          </div>
        </div>
      </div>
      </AnimatedSection>

      <div className="px-4">
        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar negocios..."
              className="pl-9 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className={cn(
              "rounded-full gap-2 font-bold",
              showFilters && "bg-foreground text-white hover:bg-foreground/90"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </Button>
        </div>

        {/* Category chips */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeCategory === cat.label
                    ? "bg-foreground text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Featured section */}
        {featured.length > 0 && (
          <div className="mb-10">
            <AnimatedSection animation="fade-left">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Empresas Destacadas
            </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((shop, index) => (
                <AnimatedSection key={shop.id} delay={index * 80} animation="scale-up">
                  <FeaturedShopCard shop={shop} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* Regular shops */}
        {(featured.length > 0 ? regular : filtered).length > 0 && (
          <div className="mb-8">
            <AnimatedSection animation="fade-left">
            <h2 className="text-lg font-black mb-4">Todas las tiendas</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featured.length > 0 ? regular : filtered).map((shop, index) => (
                <AnimatedSection key={shop.id} delay={index * 50}>
                  <RegularShopCard shop={shop} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-xl font-black text-foreground mb-1">
              No hay negocios aquí
            </p>
            <p className="text-sm mb-6">Prueba con otra búsqueda o categoría</p>
            <div className="inline-flex">
              <AddBusinessDialog />
            </div>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}

function FeaturedShopCard({
  shop,
}: {
  shop: (typeof HUESCA_SHOPS)[0];
}) {
  const emoji = CATEGORY_EMOJIS[shop.category] ?? "🏪";

  return (
    <div className="group relative bg-card rounded-2xl border border-primary/20 ring-1 ring-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Boost button */}
      <div className="absolute top-3 right-3 z-20">
        <BoostDialog
          targetType="page"
          trigger={
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 boost-glow">
              ⚡ Impulsar
            </button>
          }
        />
      </div>

      <Link href={`/marketplace/${shop.id}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={shop.image_url}
            alt={shop.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={imageFallback}
          />
          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Destacado badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-amber-400 text-amber-950 border-0 font-black text-xs">
              ★ Destacado
            </Badge>
          </div>

          {/* Rating pill */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-black">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {shop.rating}
            </div>
          </div>

          {/* Category emoji bottom-left of image */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="w-8 h-8 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center text-base">
              {emoji}
            </div>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6 z-10">
            <h3 className="font-black text-white text-base leading-tight drop-shadow-sm">
              {shop.name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" /> {shop.address}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shop.description}
          </p>
          <Badge variant="secondary" className="mt-3 text-xs">
            {emoji} {shop.category}
          </Badge>
        </div>
      </Link>
    </div>
  );
}

function RegularShopCard({ shop }: { shop: (typeof HUESCA_SHOPS)[0] }) {
  const emoji = CATEGORY_EMOJIS[shop.category] ?? "🏪";

  return (
    <Link
      href={`/marketplace/${shop.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300 btn-press block"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={shop.image_url}
          alt={shop.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={imageFallback}
        />
        {/* Rating top-right */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-card/95 text-foreground backdrop-blur-sm gap-1 font-bold border-0 text-xs">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            {shop.rating}
          </Badge>
        </div>

        {/* Category emoji bottom-left */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="w-7 h-7 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center text-sm">
            {emoji}
          </div>
        </div>

        {/* "Abrir tienda" on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 rounded-full bg-card text-foreground text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Abrir tienda →
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-black text-sm mb-1">{shop.name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3" /> {shop.address}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {shop.description}
        </p>
        <Badge variant="secondary" className="mt-3 text-xs">
          {emoji} {shop.category}
        </Badge>
      </div>
    </Link>
  );
}
