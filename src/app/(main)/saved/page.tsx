"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bookmark, Heart, MapPin, Calendar, Briefcase, ShoppingBag,
  MessageCircle, Compass, Star, Trash2, Clock, X,
} from "lucide-react";
import { HUESCA_POSTS, HUESCA_EVENTS, HUESCA_JOBS, HUESCA_SHOPS, HUESCA_USERS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";
import { PostCard } from "@/components/feed/PostCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { BackToTop } from "@/components/shared/BackToTop";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

type TabType = "todo" | "posts" | "tiendas" | "eventos" | "empleos";

function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <AnimatedSection animation="scale-up">
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-muted/60 flex items-center justify-center">
          <Icon className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <p className="text-lg font-black text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">{subtitle}</p>
        <Link href="/feed">
          <Button className="rounded-full bg-primary font-bold mt-5 btn-press">
            <Compass className="w-4 h-4 mr-1.5" /> Explorar
          </Button>
        </Link>
      </div>
    </AnimatedSection>
  );
}

export default function SavedPage() {
  const [tab, setTab] = useState<TabType>("todo");
  const { success } = useToast();

  // Demo saved items
  const savedPosts = useMemo(() => {
    return HUESCA_POSTS.slice(0, 3).map((p) => {
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
        is_bookmarked: true,
      } as Post;
    });
  }, []);
  const savedShops = HUESCA_SHOPS.slice(0, 3);
  const savedEvents = HUESCA_EVENTS.slice(0, 2);
  const savedJobs = HUESCA_JOBS.slice(0, 2);

  const [removedPosts, setRemovedPosts] = useState<Set<number>>(new Set());
  const [removedShops, setRemovedShops] = useState<Set<number>>(new Set());
  const [removedEvents, setRemovedEvents] = useState<Set<number>>(new Set());
  const [removedJobs, setRemovedJobs] = useState<Set<number>>(new Set());

  const activePosts = savedPosts.filter((p) => !removedPosts.has(p.id));
  const activeShops = savedShops.filter((s) => !removedShops.has(s.id));
  const activeEvents = savedEvents.filter((e) => !removedEvents.has(e.id));
  const activeJobs = savedJobs.filter((j) => !removedJobs.has(j.id));

  const counts = {
    todo: activePosts.length + activeShops.length + activeEvents.length + activeJobs.length,
    posts: activePosts.length,
    tiendas: activeShops.length,
    eventos: activeEvents.length,
    empleos: activeJobs.length,
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType }> = [
    { id: "todo", label: "Todo", icon: Bookmark },
    { id: "posts", label: "Publicaciones", icon: MessageCircle },
    { id: "tiendas", label: "Negocios", icon: ShoppingBag },
    { id: "eventos", label: "Eventos", icon: Calendar },
    { id: "empleos", label: "Ofertas", icon: Briefcase },
  ];

  const handleRemoveShop = (id: number) => {
    setRemovedShops((prev) => new Set(prev).add(id));
    success("Eliminado de guardados");
  };

  const handleRemoveEvent = (id: number) => {
    setRemovedEvents((prev) => new Set(prev).add(id));
    success("Eliminado de guardados");
  };

  const handleRemoveJob = (id: number) => {
    setRemovedJobs((prev) => new Set(prev).add(id));
    success("Eliminado de guardados");
  };

  const showPosts = tab === "todo" || tab === "posts";
  const showShops = tab === "todo" || tab === "tiendas";
  const showEvents = tab === "todo" || tab === "eventos";
  const showJobs = tab === "todo" || tab === "empleos";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <AnimatedSection animation="fade-up">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Guardados</h1>
              <p className="text-sm text-muted-foreground">
                {counts.todo} {counts.todo === 1 ? "elemento guardado" : "elementos guardados"}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection animation="fade-up" delay={80}>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all btn-press",
                tab === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span
                className={cn(
                  "text-[10px] min-w-[18px] h-[18px] rounded-full inline-flex items-center justify-center font-bold",
                  tab === t.id
                    ? "bg-white/20 text-white"
                    : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Empty state for entire page */}
      {counts.todo === 0 && (
        <EmptyState
          icon={Bookmark}
          title="No tienes nada guardado"
          subtitle="Explora el feed y guarda publicaciones, negocios, eventos y ofertas de empleo que te interesen"
        />
      )}

      {/* Posts section */}
      {showPosts && activePosts.length > 0 && (
        <section className="mb-8">
          {tab === "todo" && (
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black flex items-center gap-2 text-foreground">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Publicaciones
                  <span className="text-xs text-muted-foreground font-medium">({activePosts.length})</span>
                </h2>
                <button
                  onClick={() => setTab("posts")}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Ver todas
                </button>
              </div>
            </AnimatedSection>
          )}
          <div className="space-y-4">
            {activePosts.map((post, i) => (
              <AnimatedSection key={post.id} animation="fade-up" delay={160 + i * 60}>
                <PostCard post={post} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {showPosts && activePosts.length === 0 && tab === "posts" && (
        <EmptyState
          icon={MessageCircle}
          title="Sin publicaciones guardadas"
          subtitle="Cuando guardes publicaciones del feed, apareceran aqui"
        />
      )}

      {/* Shops section */}
      {showShops && activeShops.length > 0 && (
        <section className="mb-8">
          {tab === "todo" && (
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black flex items-center gap-2 text-foreground">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  Negocios
                  <span className="text-xs text-muted-foreground font-medium">({activeShops.length})</span>
                </h2>
                <button
                  onClick={() => setTab("tiendas")}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Ver todos
                </button>
              </div>
            </AnimatedSection>
          )}
          <div className="space-y-3">
            {activeShops.map((shop, i) => (
              <AnimatedSection key={shop.id} animation="fade-up" delay={160 + i * 60}>
                <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="flex">
                    <div className="w-28 h-28 overflow-hidden shrink-0 relative">
                      <img
                        src={shop.image_url || ""}
                        alt={shop.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={imageFallback}
                      />
                    </div>
                    <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                      <div>
                        <Badge className="text-[10px] mb-1.5 border-0 font-bold bg-primary/10 text-primary">
                          {shop.category}
                        </Badge>
                        <h3 className="text-sm font-black line-clamp-1">{shop.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{shop.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold">{shop.rating}</span>
                          </div>
                          {shop.address && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {shop.address}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); handleRemoveShop(shop.id); }}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10 btn-press"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {showShops && activeShops.length === 0 && tab === "tiendas" && (
        <EmptyState
          icon={ShoppingBag}
          title="Sin negocios guardados"
          subtitle="Guarda tus tiendas y restaurantes favoritos para acceder rapidamente"
        />
      )}

      {/* Events section */}
      {showEvents && activeEvents.length > 0 && (
        <section className="mb-8">
          {tab === "todo" && (
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  Eventos
                  <span className="text-xs text-muted-foreground font-medium">({activeEvents.length})</span>
                </h2>
                <button
                  onClick={() => setTab("eventos")}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Ver todos
                </button>
              </div>
            </AnimatedSection>
          )}
          <div className="space-y-3">
            {activeEvents.map((event, i) => (
              <AnimatedSection key={event.id} animation="fade-up" delay={160 + i * 60}>
                <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="flex">
                    <div className="w-28 h-28 overflow-hidden shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={imageFallback}
                      />
                    </div>
                    <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                      <div>
                        <Badge className="text-[10px] mb-1.5 border-0 font-bold bg-rose-100 text-rose-700">
                          {event.category}
                        </Badge>
                        <h3 className="text-sm font-black line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {formatCount(event.attendees)} asistentes
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); handleRemoveEvent(event.id); }}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10 btn-press"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {showEvents && activeEvents.length === 0 && tab === "eventos" && (
        <EmptyState
          icon={Calendar}
          title="Sin eventos guardados"
          subtitle="Guarda los eventos que te interesen para no perdertelos"
        />
      )}

      {/* Jobs section */}
      {showJobs && activeJobs.length > 0 && (
        <section className="mb-8">
          {tab === "todo" && (
            <AnimatedSection animation="fade-up" delay={120}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black flex items-center gap-2 text-foreground">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Ofertas de empleo
                  <span className="text-xs text-muted-foreground font-medium">({activeJobs.length})</span>
                </h2>
                <button
                  onClick={() => setTab("empleos")}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Ver todas
                </button>
              </div>
            </AnimatedSection>
          )}
          <div className="space-y-3">
            {activeJobs.map((job, i) => (
              <AnimatedSection key={job.id} animation="fade-up" delay={160 + i * 60}>
                <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-11 h-11 shrink-0">
                      <AvatarFallback className={cn(avatarColor(job.company), "text-sm font-bold")}>
                        {job.company.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-sm line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {job.company} · {job.location}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); handleRemoveJob(job.id); }}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10 btn-press shrink-0"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px] font-bold">{job.type}</Badge>
                        <Badge className="text-[10px] font-bold border-0 bg-emerald-100 text-emerald-700">{job.salary}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto">
                          <Clock className="w-2.5 h-2.5" /> {job.posted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {showJobs && activeJobs.length === 0 && tab === "empleos" && (
        <EmptyState
          icon={Briefcase}
          title="Sin ofertas guardadas"
          subtitle="Guarda ofertas de empleo para revisarlas cuando quieras"
        />
      )}

      <BackToTop />
    </div>
  );
}
