"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/context/CityContext";
import { Calendar, MapPin, Users, Clock, Check, Compass, Zap } from "lucide-react";
import { HUESCA_EVENTS } from "@/lib/huesca-data";
import Link from "next/link";
import { BackToTop } from "@/components/shared/BackToTop";
import { imageFallback } from "@/lib/image-fallback";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/format-number";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const CATEGORIES = ["Todos", "Fiestas", "Música", "Deportes", "Arte", "Tecnología", "Comunidad"] as const;
type Category = (typeof CATEGORIES)[number];

const categoryColors: Record<string, string> = {
  Fiestas: "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
  Música: "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
  Comunidad: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  Deportes: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  Arte: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
  Tecnología: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
};

export default function EventsPage() {
  const { selectedCity } = useCity();
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [attending, setAttending] = useState<Set<number>>(new Set());
  const [attendingAnimating, setAttendingAnimating] = useState<Set<number>>(new Set());

  const toggleAttending = (id: number) => {
    setAttending((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setAttendingAnimating((a) => {
          const aa = new Set(a);
          aa.add(id);
          return aa;
        });
        setTimeout(() => {
          setAttendingAnimating((a) => {
            const aa = new Set(a);
            aa.delete(id);
            return aa;
          });
        }, 600);
      }
      return next;
    });
  };

  const filtered =
    activeCategory === "Todos"
      ? HUESCA_EVENTS
      : HUESCA_EVENTS.filter((e) => e.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero strip */}
      <AnimatedSection animation="fade-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-emerald-400 px-6 py-10 mb-0 rounded-none sm:rounded-2xl sm:mx-4 sm:mt-4">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1 uppercase tracking-widest">
              {selectedCity?.name || "Huesca"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Próximos eventos
            </h1>
            <p className="text-emerald-100 text-sm mt-2">
              Descubre lo que pasa en tu ciudad
            </p>
          </div>
          <div className="shrink-0 ml-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-4 w-32 h-32 rounded-full bg-white/10" />
      </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-6">
        {/* Category filter chips */}
        <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                activeCategory === cat
                  ? "bg-foreground text-white border-transparent"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        </AnimatedSection>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Compass className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No hay eventos en esta categoría</p>
            <p className="text-sm mt-1">Prueba con otra categoría</p>
          </div>
        )}

        {/* Featured event (first card) */}
        {featured && (
          <AnimatedSection animation="fade-up" delay={100}>
          <div className="relative rounded-2xl overflow-hidden border border-border group shadow-md">
            <Link href={`/events/${featured.id}`}>
              <div className="relative h-64 sm:h-80">
                <img
                  src={featured.image}
                  alt={featured.title}
                  onError={imageFallback}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Attendees badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                  <Users className="w-3.5 h-3.5" />
                  {formatCount(featured.attendees + (attending.has(featured.id) ? 1 : 0))} asistentes
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={cn("border-0 font-bold text-xs", categoryColors[featured.category] || "bg-primary/10 text-primary")}>
                    {featured.category}
                  </Badge>
                </div>
              </div>
            </Link>
            <div className="p-5 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/events/${featured.id}`} className="hover:text-primary transition-colors">
                    <h2 className="text-xl font-black leading-snug mb-1">{featured.title}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{featured.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {featured.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {featured.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {featured.location}</span>
                  </div>
                </div>
                <BoostDialog
                  targetType="post"
                  trigger={
                    <button className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-500 transition-colors px-2 py-1 rounded-lg border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                      <Zap className="w-3 h-3" />
                      Impulsar
                    </button>
                  }
                />
              </div>
              <Button
                size="sm"
                onClick={() => toggleAttending(featured.id)}
                className={cn(
                  "rounded-full font-bold btn-press transition-all",
                  attending.has(featured.id)
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {attending.has(featured.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Asistiré ✓
                  </>
                ) : (
                  "Asistir"
                )}
                {attendingAnimating.has(featured.id) && (
                  <span className="ml-1 text-emerald-500 font-black text-xs" style={{ animation: "var(--animate-success-pop)" }}>+1</span>
                )}
              </Button>
            </div>
          </div>
          </AnimatedSection>
        )}

        {/* Regular event cards */}
        <div className="space-y-3">
          {rest.map((event, index) => (
            <AnimatedSection
              key={event.id}
              delay={index * 80}
              animation="scale-up"
            >
            <div
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col sm:flex-row">
                <Link href={`/events/${event.id}`} className="sm:w-48 h-36 sm:h-auto overflow-hidden shrink-0 block">
                  <img
                    src={event.image}
                    alt={event.title}
                    onError={imageFallback}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <Badge className={cn("border-0 font-bold text-xs mb-1.5", categoryColors[event.category] || "bg-primary/10 text-primary")}>
                        {event.category}
                      </Badge>
                      <Link href={`/events/${event.id}`} className="hover:text-primary transition-colors block">
                        <h3 className="text-base font-black leading-snug">{event.title}</h3>
                      </Link>
                    </div>
                    <BoostDialog
                      targetType="post"
                      trigger={
                        <button className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-500 transition-colors px-2 py-1 rounded-lg border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                          <Zap className="w-3 h-3" />
                          <span className="hidden sm:inline">Impulsar</span>
                        </button>
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                      <Calendar className="w-3 h-3" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                      <Clock className="w-3 h-3" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </span>
                    <span className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
                      <Users className="w-3 h-3" />
                      {formatCount(event.attendees + (attending.has(event.id) ? 1 : 0))}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleAttending(event.id)}
                    className={cn(
                      "rounded-full font-bold btn-press h-8 text-xs transition-all",
                      attending.has(event.id)
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    {attending.has(event.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Asistiré ✓
                      </>
                    ) : (
                      "Asistir"
                    )}
                    {attendingAnimating.has(event.id) && (
                      <span className="ml-1 text-emerald-400 font-black animate-bounce">+1</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <BackToTop />
    </div>
  );
}
