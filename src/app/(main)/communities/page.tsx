"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCity } from "@/context/CityContext";
import { useToast } from "@/context/ToastContext";
import { Search, Users, Lock, Globe, Radio } from "lucide-react";
import { HUESCA_COMMUNITIES } from "@/lib/huesca-data";
import { CreateCommunityDialog } from "@/components/community/CreateCommunityDialog";
import { BackToTop } from "@/components/shared/BackToTop";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const CATEGORIES = [
  { label: "Todos", emoji: "🌐" },
  { label: "Deportes", emoji: "🏅" },
  { label: "Gastronomía", emoji: "🍕" },
  { label: "Arte y Cultura", emoji: "🎨" },
  { label: "Familia", emoji: "👨‍👩‍👧" },
  { label: "Negocios", emoji: "💼" },
  { label: "Educación", emoji: "📚" },
];

// Gradient configs per category
const CATEGORY_GRADIENT: Record<string, { gradient: string; emoji: string }> = {
  Deportes: { gradient: "from-emerald-400 to-emerald-600", emoji: "🏅" },
  Gastronomía: { gradient: "from-amber-400 to-orange-500", emoji: "🍕" },
  "Arte y Cultura": { gradient: "from-violet-400 to-purple-600", emoji: "🎨" },
  Familia: { gradient: "from-rose-400 to-pink-600", emoji: "👨‍👩‍👧" },
  Negocios: { gradient: "from-blue-400 to-blue-600", emoji: "💼" },
  Educación: { gradient: "from-cyan-400 to-cyan-600", emoji: "📚" },
};

const FAKE_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];

// Estimated online members
const ONLINE_COUNT = 142;

export default function CommunitiesPage() {
  const { selectedCity } = useCity();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const cityName = selectedCity?.name || "tu ciudad";

  const filtered = HUESCA_COMMUNITIES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "Todos" || c.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = filtered.filter((c) => c.featured);
  const others = filtered.filter((c) => !c.featured);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <AnimatedSection animation="fade-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-emerald-50 to-primary/5 px-6 py-10 mb-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 50%, #0F7A3C 0%, transparent 55%)",
          }}
        />
        <div className="relative flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground leading-tight">
                Comunidades de {cityName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Encuentra tu tribu, comparte y conecta con vecinos
              </p>
              {/* Online chip */}
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                {ONLINE_COUNT} miembros en línea ahora
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <CreateCommunityDialog />
          </div>
        </div>
      </div>
      </AnimatedSection>

      <div className="px-4 pt-6">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar comunidades..."
            className="pl-9 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category chips */}
        <AnimatedSection animation="fade-up" delay={100}>
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
        </AnimatedSection>

        {/* Featured communities */}
        {featured.length > 0 && (
          <div className="mb-10">
            <AnimatedSection animation="fade-left">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <span className="text-amber-500">★</span> Comunidades destacadas
            </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((c, index) => (
                <AnimatedSection key={c.id} delay={index * 80} animation="scale-up">
                  <FeaturedCommunityCard community={c} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* All communities */}
        {(featured.length > 0 ? others : filtered).length > 0 && (
          <div className="mb-8">
            <AnimatedSection animation="fade-left">
            <h2 className="text-lg font-black mb-4">Todas las comunidades</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featured.length > 0 ? others : filtered).map((c, index) => (
                <AnimatedSection key={c.id} delay={index * 60}>
                  <CommunityCard community={c} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
              <Users className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-xl font-black text-foreground mb-1">
              No se encontraron comunidades
            </p>
            <p className="text-sm mb-6">Crea una y empieza a construir tu grupo</p>
            <CreateCommunityDialog />
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}

function FeaturedCommunityCard({
  community,
}: {
  community: (typeof HUESCA_COMMUNITIES)[0];
}) {
  const config = CATEGORY_GRADIENT[community.category] ?? {
    gradient: "from-primary to-emerald-600",
    emoji: "🌐",
  };

  const isVeryActive = community.members_count > 500;

  return (
    <Link
      href={`/communities/${community.id}`}
      className="group bg-card rounded-2xl border border-primary/20 ring-1 ring-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300 block"
    >
      {/* Gradient hero */}
      <div
        className={cn(
          "relative h-32 bg-gradient-to-br flex items-center justify-center",
          config.gradient
        )}
      >
        <span className="text-5xl drop-shadow-lg">{config.emoji}</span>

        {/* Activity badge */}
        <div className="absolute top-3 right-3">
          {isVeryActive ? (
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold">
              Muy activo 🔥
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold">
              Activo
            </span>
          )}
        </div>

        {/* Private badge */}
        {community.status === "private" && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur text-white text-xs font-bold">
              <Lock className="w-3 h-3" /> Privada
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-black leading-tight">{community.name}</h3>
          {community.status === "public" && (
            <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {community.description}
        </p>

        <div className="flex items-center justify-between">
          <MemberAvatarStack count={community.members_count} communityId={community.id} />
          <Badge variant="secondary" className="text-xs">
            {config.emoji} {community.category}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

function CommunityCard({
  community,
}: {
  community: (typeof HUESCA_COMMUNITIES)[0];
}) {
  const [joined, setJoined] = useState(false);
  const { success } = useToast();
  const config = CATEGORY_GRADIENT[community.category] ?? {
    gradient: "from-primary to-emerald-600",
    emoji: "🌐",
  };
  const isVeryActive = community.members_count > 500;

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!joined) {
      setJoined(true);
      success("Te has unido", `Bienvenido/a a ${community.name}`);
    }
  };

  return (
    <Link
      href={`/communities/${community.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300 block"
    >
      {/* Category accent bar */}
      <div className={cn("h-1 bg-gradient-to-r", config.gradient)} />

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-xl",
              config.gradient
            )}
          >
            {config.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-sm truncate">{community.name}</h3>
              {community.status === "private" ? (
                <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
              ) : (
                <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {formatCount(community.members_count)} miembros
            </p>
          </div>
          {/* Activity badge */}
          {isVeryActive && (
            <span className="text-xs font-bold text-orange-500 shrink-0">🔥</span>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {community.description}
        </p>

        <div className="flex items-center justify-between">
          <MemberAvatarStack count={community.members_count} communityId={community.id} />

          <button
            onClick={handleJoin}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all btn-press",
              joined
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {joined ? "Miembro ✓" : "Unirse"}
          </button>
        </div>
      </div>
    </Link>
  );
}

function MemberAvatarStack({
  count,
  communityId,
}: {
  count: number;
  communityId: number;
}) {
  const fakeUsernames = ["user_a", "user_b", "user_c"].map(
    (u) => u + communityId
  );
  const show = Math.min(3, count);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1.5">
        {fakeUsernames.slice(0, show).map((username, i) => (
          <Avatar key={i} className="w-6 h-6 border-2 border-background">
            <AvatarFallback
              className={cn(avatarColor(username), "text-white text-[8px] font-bold")}
            >
              {FAKE_NAMES[i]}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {count > 3 && (
        <span className="text-[10px] text-muted-foreground font-bold">
          +{formatCount(count - 3)}
        </span>
      )}
    </div>
  );
}
