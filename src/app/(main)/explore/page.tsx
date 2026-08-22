"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  Compass,
  Star,
  Flame,
  ArrowUp,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { useCity } from "@/context/CityContext";
import { useToast } from "@/context/ToastContext";
import {
  HUESCA_SHOPS,
  HUESCA_COMMUNITIES,
  HUESCA_EVENTS,
  HUESCA_USERS,
} from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const TRENDING_TAGS = [
  { tag: "#SanLorenzo2026", posts: 1247 },
  { tag: "#HuescaGastro", posts: 856 },
  { tag: "#MallosDeRiglos", posts: 634 },
  { tag: "#RunningHuesca", posts: 423 },
  { tag: "#FestivalPeriferias", posts: 312 },
  { tag: "#CascoAntiguo", posts: 289 },
];

const CATEGORIES = [
  { name: "Restaurantes", icon: "🍽️", count: 24, color: "bg-orange-50 dark:bg-orange-950/20", textColor: "text-orange-700 dark:text-orange-300" },
  { name: "Deportes", icon: "⛰️", count: 18, color: "bg-blue-50 dark:bg-blue-950/20", textColor: "text-blue-700 dark:text-blue-300" },
  { name: "Cultura", icon: "🎭", count: 15, color: "bg-purple-50 dark:bg-purple-950/20", textColor: "text-purple-700 dark:text-purple-300" },
  { name: "Compras", icon: "🛍️", count: 32, color: "bg-pink-50 dark:bg-pink-950/20", textColor: "text-pink-700 dark:text-pink-300" },
  { name: "Servicios", icon: "🔧", count: 21, color: "bg-amber-50 dark:bg-amber-950/20", textColor: "text-amber-700 dark:text-amber-300" },
  { name: "Salud", icon: "💊", count: 12, color: "bg-green-50 dark:bg-green-950/20", textColor: "text-green-700 dark:text-green-300" },
];

const CATEGORY_COMMUNITY: Record<string, string> = {
  Deportes: "from-emerald-400 to-emerald-600",
  Gastronomía: "from-amber-400 to-orange-500",
  "Arte y Cultura": "from-violet-400 to-purple-600",
  Familia: "from-rose-400 to-pink-600",
  Negocios: "from-blue-400 to-blue-600",
  Educación: "from-cyan-400 to-cyan-600",
};
const CATEGORY_COMMUNITY_EMOJI: Record<string, string> = {
  Deportes: "🏅",
  Gastronomía: "🍕",
  "Arte y Cultura": "🎨",
  Familia: "👨‍👩‍👧",
  Negocios: "💼",
  Educación: "📚",
};

export default function ExplorePage() {
  const { selectedCity } = useCity();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const cityName = selectedCity?.name || "tu ciudad";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero search */}
      <AnimatedSection animation="fade-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-emerald-50 to-primary/5 px-4 pt-8 pb-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 60%, #0F7A3C 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-6 h-6 text-primary transition-transform duration-300 hover:rotate-45" />
            <h1 className="text-2xl font-black text-foreground">
              Explorar {cityName}
            </h1>
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar negocios, comunidades, eventos..."
              className="pl-13 h-14 rounded-full text-base shadow-lg border-0 bg-card/90 backdrop-blur-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim())
                  router.push(`/search?q=${encodeURIComponent(search.trim())}`);
              }}
            />
          </div>
        </div>
      </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-10">
        {/* Categories */}
        <section>
          <AnimatedSection animation="fade-left">
          <SectionHeader
            icon={<span className="text-base">🗂️</span>}
            title="Categorías"
          />
          </AnimatedSection>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
            {CATEGORIES.map((cat, index) => (
              <AnimatedSection key={cat.name} delay={index * 40} animation="scale-up">
              <Link
                href={`/search?q=${encodeURIComponent(cat.name)}`}
                className={cn(
                  "rounded-2xl p-5 text-center hover:shadow-md transition-all block btn-press hover:scale-[1.02]",
                  cat.color
                )}
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <p className={cn("text-xs font-black", cat.textColor)}>
                  {cat.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {cat.count} negocios
                </p>
              </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <AnimatedSection animation="fade-left">
          <SectionHeader
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            title="Tendencias"
          />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {TRENDING_TAGS.map((trend, i) => {
              const isTop3 = i < 3;
              const isFirst = i === 0;
              return (
                <Link
                  key={trend.tag}
                  href={`/search?q=${encodeURIComponent(trend.tag)}`}
                  className="bg-card rounded-xl border border-border p-3 hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    {isFirst ? (
                      <Flame className="w-4 h-4 text-orange-500" />
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-black",
                          isTop3 ? "text-gradient-green" : "text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate">{trend.tag}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCount(trend.posts)} publicaciones
                    </p>
                  </div>
                  {!isFirst && (
                    <ArrowUp
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isTop3 ? "text-emerald-500" : "text-muted-foreground"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular shops — horizontal scroll */}
        <section>
          <SectionHeader
            icon={<ShoppingBag className="w-5 h-5 text-foreground" />}
            title="Negocios populares"
            href="/marketplace"
          />
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar mt-4 -mx-1 px-1">
            {HUESCA_SHOPS.filter((s) => s.is_featured)
              .slice(0, 6)
              .map((shop) => (
                <Link
                  key={shop.id}
                  href={`/marketplace/${shop.id}`}
                  className="shrink-0 w-40 bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group block"
                >
                  <div className="h-24 overflow-hidden">
                    <img
                      src={shop.image_url || ""}
                      alt={shop.name}
                      onError={imageFallback}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-black text-xs line-clamp-1">{shop.name}</h3>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {shop.category}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold">{shop.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* Active communities — horizontal scroll */}
        <section>
          <SectionHeader
            icon={<Users className="w-5 h-5 text-foreground" />}
            title="Comunidades activas"
            href="/communities"
          />
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar mt-4 -mx-1 px-1">
            {HUESCA_COMMUNITIES.slice(0, 6).map((com) => {
              const grad =
                CATEGORY_COMMUNITY[com.category] ?? "from-primary to-emerald-600";
              const emoji = CATEGORY_COMMUNITY_EMOJI[com.category] ?? "🌐";
              return (
                <Link
                  key={com.id}
                  href={`/communities/${com.id}`}
                  className="shrink-0 w-40 bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group block"
                >
                  <div
                    className={cn(
                      "h-16 bg-gradient-to-br flex items-center justify-center",
                      grad
                    )}
                  >
                    <span className="text-2xl">{emoji}</span>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-black text-xs line-clamp-1">{com.name}</h3>
                    <p className="text-[10px] text-muted-foreground">
                      {formatCount(com.members_count)} miembros
                    </p>
                    <Badge variant="secondary" className="text-[9px] mt-1 px-1.5 py-0">
                      {com.category}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Events — 3-col grid */}
        <section>
          <SectionHeader
            icon={<Calendar className="w-5 h-5 text-foreground" />}
            title="Próximos eventos"
            href="/events"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {HUESCA_EVENTS.slice(0, 3).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      onError={imageFallback}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Attending count chip */}
                    <div className="absolute bottom-2 right-2">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold">
                        <Users className="w-2.5 h-2.5" />
                        {formatCount(event.attendees)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <Badge className="text-[10px] mb-1.5 border-0 font-bold bg-primary/10 text-primary">
                      {event.category}
                    </Badge>
                    <h3 className="font-black text-sm line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Suggested users */}
        <section>
          <AnimatedSection animation="fade-left">
          <SectionHeader
            icon={<UserPlus className="w-5 h-5 text-foreground" />}
            title="Personas sugeridas"
          />
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {HUESCA_USERS.slice(0, 4).map((user, index) => (
              <AnimatedSection key={user.id} delay={index * 60}>
                <SuggestedUserCard user={user} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-black flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5"
        >
          Ver todos <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function SuggestedUserCard({
  user,
}: {
  user: (typeof HUESCA_USERS)[0];
}) {
  const [following, setFollowing] = useState(false);
  const { success } = useToast();

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!following) {
      setFollowing(true);
      success("Siguiendo", `Ahora sigues a ${user.name}`);
    }
  };

  return (
    <Link href={`/profile/${user.id}`}>
      <div className="bg-card rounded-2xl border border-border p-4 text-center hover:shadow-md hover:border-primary/20 transition-all">
        <Avatar className="w-14 h-14 mx-auto mb-2">
          <AvatarFallback
            className={cn(avatarColor(user.username), "text-white text-lg font-bold")}
          >
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-black text-sm line-clamp-1">{user.name}</h3>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatCount(user.followers_count)} seguidores
        </p>
        <button
          onClick={handleFollow}
          className={cn(
            "mt-3 w-full h-8 rounded-full text-xs font-bold transition-all btn-press",
            following
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {following ? "Siguiendo ✓" : "Seguir"}
        </button>
      </div>
    </Link>
  );
}
