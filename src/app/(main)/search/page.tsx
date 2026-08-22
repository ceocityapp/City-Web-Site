"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search, X, Star, MapPin, Users, Calendar, ShoppingBag,
  Briefcase, MessageCircle, Heart, Check, Compass, TrendingUp,
  UserPlus, Clock,
} from "lucide-react";
import {
  HUESCA_POSTS, HUESCA_SHOPS, HUESCA_COMMUNITIES,
  HUESCA_EVENTS, HUESCA_JOBS, HUESCA_USERS,
} from "@/lib/huesca-data";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { BackToTop } from "@/components/shared/BackToTop";
import { PostCard } from "@/components/feed/PostCard";
import { imageFallback } from "@/lib/image-fallback";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

type SearchTab = "todo" | "posts" | "negocios" | "comunidades" | "eventos" | "personas";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState<SearchTab>("todo");
  const [displayCount, setDisplayCount] = useState(10);
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const [resetKey, setResetKey] = useState(`${query}|${tab}`);

  // Reset pagination when query or tab changes
  const currentKey = `${query}|${tab}`;
  if (resetKey !== currentKey) {
    setResetKey(currentKey);
    setDisplayCount(10);
  }

  const q = query.toLowerCase().trim();
  const hasQuery = q.length > 0;

  // Search results
  const posts = useMemo(() => {
    if (!hasQuery) return [];
    return HUESCA_POSTS.filter(
      (p) => p.body.toLowerCase().includes(q) || (p.title && p.title.toLowerCase().includes(q))
    ).map((p) => {
      const user = HUESCA_USERS.find((u) => u.id === p.user_id);
      return {
        ...p,
        user: user
          ? {
              ...user,
              supabase_id: String(user.id),
              email: "",
              banner_url: null,
              website_url: null,
              instagram_url: null,
              profile_completed: true,
              is_private: false,
              is_admin: false,
              created_at: "",
            }
          : undefined,
      } as Post;
    });
  }, [q, hasQuery]);

  const shops = useMemo(() => {
    if (!hasQuery) return [];
    return HUESCA_SHOPS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );
  }, [q, hasQuery]);

  const communities = useMemo(() => {
    if (!hasQuery) return [];
    return HUESCA_COMMUNITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
    );
  }, [q, hasQuery]);

  const events = useMemo(() => {
    if (!hasQuery) return [];
    return HUESCA_EVENTS.filter(
      (e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
  }, [q, hasQuery]);

  const users = useMemo(() => {
    if (!hasQuery) return [];
    return HUESCA_USERS.filter(
      (u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }, [q, hasQuery]);

  const totalResults = posts.length + shops.length + communities.length + events.length + users.length;

  const TABS: Array<{ id: SearchTab; label: string; icon: React.ElementType; count: number }> = [
    { id: "todo", label: "Todo", icon: Search, count: totalResults },
    { id: "posts", label: "Publicaciones", icon: MessageCircle, count: posts.length },
    { id: "negocios", label: "Negocios", icon: ShoppingBag, count: shops.length },
    { id: "comunidades", label: "Comunidades", icon: Users, count: communities.length },
    { id: "eventos", label: "Eventos", icon: Calendar, count: events.length },
    { id: "personas", label: "Personas", icon: Users, count: users.length },
  ];

  const toggleFollow = (userId: number) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const showPosts = (tab === "todo" || tab === "posts") && posts.length > 0;
  const showShops = (tab === "todo" || tab === "negocios") && shops.length > 0;
  const showCommunities = (tab === "todo" || tab === "comunidades") && communities.length > 0;
  const showEvents = (tab === "todo" || tab === "eventos") && events.length > 0;
  const showUsers = (tab === "todo" || tab === "personas") && users.length > 0;

  // For single-tab view, check if specific tab has no results
  const tabHasNoResults = hasQuery && tab !== "todo" && (
    (tab === "posts" && posts.length === 0) ||
    (tab === "negocios" && shops.length === 0) ||
    (tab === "comunidades" && communities.length === 0) ||
    (tab === "eventos" && events.length === 0) ||
    (tab === "personas" && users.length === 0)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Search hero */}
      <AnimatedSection animation="fade-up">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar en City App..."
              className="pl-12 pr-10 h-12 rounded-2xl text-base bg-card border-border shadow-sm focus-visible:shadow-md transition-shadow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      {hasQuery && (
        <AnimatedSection animation="fade-up" delay={60}>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all btn-press",
                  tab === t.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
                {hasQuery && t.count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] min-w-[16px] h-[16px] rounded-full inline-flex items-center justify-center font-bold",
                      tab === t.id
                        ? "bg-white/20 text-white"
                        : "bg-foreground/10 text-muted-foreground"
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Results summary */}
      {hasQuery && totalResults > 0 && (
        <AnimatedSection animation="fade-in" delay={100}>
          <p className="text-sm text-muted-foreground mb-5">
            {totalResults} {totalResults === 1 ? "resultado" : "resultados"} para &ldquo;{query}&rdquo;
          </p>
        </AnimatedSection>
      )}

      {/* Empty query state */}
      {!hasQuery && (
        <AnimatedSection animation="scale-up">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-muted/50 flex items-center justify-center">
              <Search className="w-9 h-9 text-muted-foreground/20" />
            </div>
            <h2 className="text-xl font-black mb-1">Busca en City App</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Publicaciones, negocios, comunidades, eventos y personas de Huesca
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Restaurantes", "Senderismo", "San Lorenzo", "Cafe"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-muted text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors btn-press"
                >
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Results */}
      {hasQuery && (
        <div className="space-y-8">
          {/* Posts */}
          {showPosts && (
            <section>
              <AnimatedSection animation="fade-up" delay={120}>
                <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Publicaciones
                  <span className="text-xs text-muted-foreground font-medium">({posts.length})</span>
                </h3>
              </AnimatedSection>
              <div className="space-y-4">
                {posts.slice(0, tab === "todo" ? 3 : displayCount).map((post, i) => (
                  <AnimatedSection key={post.id} animation="fade-up" delay={160 + i * 50}>
                    <PostCard post={post} />
                  </AnimatedSection>
                ))}
              </div>
              {tab === "todo" && posts.length > 3 && (
                <div className="mt-3">
                  <button
                    onClick={() => setTab("posts")}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Ver las {posts.length} publicaciones
                  </button>
                </div>
              )}
              {tab === "posts" && posts.length > displayCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="rounded-full font-bold btn-press"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Cargar mas resultados
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Shops */}
          {showShops && (
            <section>
              <AnimatedSection animation="fade-up" delay={120}>
                <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  Negocios
                  <span className="text-xs text-muted-foreground font-medium">({shops.length})</span>
                </h3>
              </AnimatedSection>
              <div className="space-y-3">
                {shops.slice(0, tab === "todo" ? 3 : displayCount).map((shop, i) => (
                  <AnimatedSection key={shop.id} animation="fade-up" delay={160 + i * 50}>
                    <Link href={`/marketplace/${shop.id}`}>
                      <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                        <div className="flex">
                          <div className="w-24 h-24 overflow-hidden shrink-0">
                            <img
                              src={shop.image_url || ""}
                              alt={shop.name}
                              onError={imageFallback}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 p-3.5 min-w-0 flex flex-col justify-between">
                            <div>
                              <Badge className="text-[10px] mb-1 border-0 font-bold bg-primary/10 text-primary">
                                {shop.category}
                              </Badge>
                              <p className="font-black text-sm line-clamp-1">{shop.name}</p>
                              {shop.address && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0" /> {shop.address}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-bold">{shop.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
              {tab === "todo" && shops.length > 3 && (
                <div className="mt-3">
                  <button
                    onClick={() => setTab("negocios")}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Ver los {shops.length} negocios
                  </button>
                </div>
              )}
              {tab === "negocios" && shops.length > displayCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="rounded-full font-bold btn-press"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Cargar mas resultados
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Communities */}
          {showCommunities && (
            <section>
              <AnimatedSection animation="fade-up" delay={120}>
                <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Comunidades
                  <span className="text-xs text-muted-foreground font-medium">({communities.length})</span>
                </h3>
              </AnimatedSection>
              <div className="space-y-3">
                {communities.slice(0, tab === "todo" ? 3 : displayCount).map((com, i) => (
                  <AnimatedSection key={com.id} animation="fade-up" delay={160 + i * 50}>
                    <Link href={`/communities/${com.id}`}>
                      <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm line-clamp-1">{com.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatCount(com.members_count)} miembros
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] font-bold shrink-0">
                            {com.category}
                          </Badge>
                        </div>
                        {com.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 ml-14">
                            {com.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
              {tab === "todo" && communities.length > 3 && (
                <div className="mt-3">
                  <button
                    onClick={() => setTab("comunidades")}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Ver las {communities.length} comunidades
                  </button>
                </div>
              )}
              {tab === "comunidades" && communities.length > displayCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="rounded-full font-bold btn-press"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Cargar mas resultados
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Events */}
          {showEvents && (
            <section>
              <AnimatedSection animation="fade-up" delay={120}>
                <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Eventos
                  <span className="text-xs text-muted-foreground font-medium">({events.length})</span>
                </h3>
              </AnimatedSection>
              <div className="space-y-3">
                {events.slice(0, tab === "todo" ? 3 : displayCount).map((event, i) => (
                  <AnimatedSection key={event.id} animation="fade-up" delay={160 + i * 50}>
                    <Link href={`/events/${event.id}`}>
                      <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                        <div className="flex">
                          <div className="w-24 h-24 overflow-hidden shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              onError={imageFallback}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 p-3.5 min-w-0 flex flex-col justify-between">
                            <div>
                              <Badge className="text-[10px] mb-1 border-0 font-bold bg-rose-100 text-rose-700">
                                {event.category}
                              </Badge>
                              <p className="font-black text-sm line-clamp-1">{event.title}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
              {tab === "todo" && events.length > 3 && (
                <div className="mt-3">
                  <button
                    onClick={() => setTab("eventos")}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Ver los {events.length} eventos
                  </button>
                </div>
              )}
              {tab === "eventos" && events.length > displayCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="rounded-full font-bold btn-press"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Cargar mas resultados
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* People */}
          {showUsers && (
            <section>
              <AnimatedSection animation="fade-up" delay={120}>
                <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Personas
                  <span className="text-xs text-muted-foreground font-medium">({users.length})</span>
                </h3>
              </AnimatedSection>
              <div className="space-y-3">
                {users.slice(0, tab === "todo" ? 4 : displayCount).map((user, i) => {
                  const isFollowed = followedUsers.has(user.id);
                  return (
                    <AnimatedSection key={user.id} animation="fade-up" delay={160 + i * 50}>
                      <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <Link href={`/profile/${user.id}`}>
                            <Avatar className="w-11 h-11 shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all">
                              <AvatarFallback className={cn(avatarColor(user.username), "font-bold")}>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/profile/${user.id}`}>
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-sm hover:text-primary transition-colors">{user.name}</p>
                                {user.is_verified && (
                                  <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  </span>
                                )}
                              </div>
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              @{user.username} · {formatCount(user.followers_count)} seguidores
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isFollowed ? "outline" : "default"}
                            className={cn(
                              "rounded-full font-bold text-xs h-8 px-4 btn-press shrink-0",
                              isFollowed
                                ? "border-primary/30 text-primary"
                                : "bg-primary"
                            )}
                            onClick={() => toggleFollow(user.id)}
                          >
                            {isFollowed ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" /> Siguiendo
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5 mr-1" /> Seguir
                              </>
                            )}
                          </Button>
                        </div>
                        {user.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-2 ml-14">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
              {tab === "todo" && users.length > 4 && (
                <div className="mt-3">
                  <button
                    onClick={() => setTab("personas")}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Ver las {users.length} personas
                  </button>
                </div>
              )}
              {tab === "personas" && users.length > displayCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="rounded-full font-bold btn-press"
                    onClick={() => setDisplayCount((c) => c + 10)}
                  >
                    Cargar mas resultados
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* No results at all */}
          {hasQuery && totalResults === 0 && (
            <AnimatedSection animation="scale-up">
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Search className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-lg font-black text-foreground">Sin resultados</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                  No se encontro nada para &ldquo;{query}&rdquo;. Prueba con otro termino
                </p>
                <Link href="/feed">
                  <Button className="rounded-full bg-primary font-bold mt-5 btn-press">
                    <Compass className="w-4 h-4 mr-1.5" /> Volver al inicio
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          )}

          {/* Tab-specific empty state */}
          {tabHasNoResults && (
            <AnimatedSection animation="scale-up">
              <div className="text-center py-16">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-base font-black text-foreground">Sin resultados en esta categoria</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  No hay coincidencias para &ldquo;{query}&rdquo; en esta seccion
                </p>
                <Button
                  variant="outline"
                  className="rounded-full font-bold mt-4 btn-press"
                  onClick={() => setTab("todo")}
                >
                  Ver todos los resultados
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      )}

      <BackToTop />
    </div>
  );
}
