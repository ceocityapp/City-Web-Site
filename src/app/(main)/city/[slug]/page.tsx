"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCityBySlug } from "@/lib/cities";
import { useCity } from "@/context/CityContext";
import { HUESCA_SHOPS, HUESCA_COMMUNITIES, HUESCA_EVENTS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";
import {
  MapPin, Users, ShoppingBag, Calendar, ArrowRight, Star,
  Globe, TrendingUp, Building2, ArrowLeft, Check,
} from "lucide-react";

export default function CityPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { setSelectedCity } = useCity();
  const city = getCityBySlug(slug as string);

  if (!city) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Ciudad no encontrada</h1>
        <p className="text-muted-foreground mb-6">No tenemos esta ciudad en nuestra plataforma aún.</p>
        <Link href="/explore"><Button className="rounded-full bg-primary font-bold">Explorar ciudades</Button></Link>
      </div>
    );
  }

  const isHuesca = city.slug === "huesca";

  const hashCity = (s: string): number => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i);
    return Math.abs(hash);
  };
  const cityHash = hashCity(slug as string);

  const handleSelectCity = () => {
    setSelectedCity(city);
    router.push("/feed");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Explorar
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 mb-6">
        <img src={city.image} alt={city.name} onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white border-0 font-bold text-xs backdrop-blur-sm">
              <MapPin className="w-3 h-3 mr-1" /> {city.region}, {city.country}
            </Badge>
            {city.population && (
              <Badge className="bg-white/20 text-white border-0 font-bold text-xs backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" /> {city.population} hab.
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-black text-white">{city.name}</h1>
          <p className="text-white/70 mt-1">{city.description}</p>
        </div>
      </div>

      {/* Action */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-black">Explorar {city.name}</h2>
          <p className="text-sm text-muted-foreground">Descubre todo lo que {city.name} tiene para ofrecer</p>
        </div>
        <Button className="rounded-full bg-primary font-bold" onClick={handleSelectCity}>
          <Check className="w-4 h-4 mr-1.5" /> Cambiar a {city.name}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-black">{isHuesca ? "87" : (cityHash % 80) + 20}</p>
          <p className="text-xs text-muted-foreground">Negocios</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-violet-600" />
          <p className="text-2xl font-black">{isHuesca ? "24" : (cityHash % 25) + 5}</p>
          <p className="text-xs text-muted-foreground">Eventos</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-amber-600" />
          <p className="text-2xl font-black">{isHuesca ? "3.2K" : `${((cityHash % 50) / 10 + 0.5).toFixed(1)}K`}</p>
          <p className="text-xs text-muted-foreground">Usuarios</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <Building2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-black">{isHuesca ? "15" : (cityHash % 17) + 3}</p>
          <p className="text-xs text-muted-foreground">Comunidades</p>
        </div>
      </div>

      {isHuesca && (
        <>
          {/* Featured shops */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Negocios destacados</h2>
              <Link href="/marketplace" className="text-xs text-primary font-bold">Ver todos <ArrowRight className="w-3 h-3 inline" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {HUESCA_SHOPS.filter((s) => s.is_featured).map((shop) => (
                <Link key={shop.id} href={`/marketplace/${shop.id}`}>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                    <div className="h-32 overflow-hidden">
                      <img src={shop.image_url || ""} alt={shop.name} onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm">{shop.name}</h3>
                      <p className="text-xs text-muted-foreground">{shop.category}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold">{shop.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Events */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2"><Calendar className="w-5 h-5" /> Próximos eventos</h2>
              <Link href="/events" className="text-xs text-primary font-bold">Ver todos <ArrowRight className="w-3 h-3 inline" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {HUESCA_EVENTS.slice(0, 3).map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-28 overflow-hidden">
                      <img src={event.image} alt={event.title} onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> {event.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Communities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2"><Users className="w-5 h-5" /> Comunidades activas</h2>
              <Link href="/communities" className="text-xs text-primary font-bold">Ver todas <ArrowRight className="w-3 h-3 inline" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HUESCA_COMMUNITIES.slice(0, 4).map((com) => (
                <Link key={com.id} href={`/communities/${com.id}`}>
                  <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">{com.name}</h3>
                      <p className="text-xs text-muted-foreground">{com.members_count} miembros · {com.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {!isHuesca && (
        <div className="bg-muted/50 rounded-2xl p-12 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-black mb-2">{city.name} está creciendo</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Estamos expandiéndonos a {city.name}. Pronto tendrás negocios, eventos y comunidades de tu ciudad.
          </p>
          <Button className="rounded-full bg-primary font-bold" onClick={handleSelectCity}>
            Activar {city.name}
          </Button>
        </div>
      )}
    </div>
  );
}
