"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCity } from "@/context/CityContext";
import { Search, MapPin, Briefcase, Clock, Bookmark, BookmarkCheck, Wifi, WifiOff } from "lucide-react";
import { HUESCA_JOBS } from "@/lib/huesca-data";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import Link from "next/link";
import { BackToTop } from "@/components/shared/BackToTop";
import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/avatar-color";
import { useToast } from "@/context/ToastContext";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const JOB_TYPES = ["Todos", "Jornada completa", "Media jornada", "Freelance", "Temporal"] as const;
type JobType = (typeof JOB_TYPES)[number];

const typeColors: Record<string, string> = {
  "Jornada completa": "bg-primary/10 text-primary",
  "Media jornada": "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  Freelance: "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400",
  Temporal: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
};

export default function JobsPage() {
  const { selectedCity } = useCity();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<JobType>("Todos");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const toggleSaved = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success("Oferta guardada");
      }
      return next;
    });
  };

  const filtered = HUESCA_JOBS.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "Todos" || j.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero strip */}
      <AnimatedSection animation="fade-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-zinc-700 px-6 py-10 mb-0 rounded-none sm:rounded-2xl sm:mx-4 sm:mt-4">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
              {selectedCity?.name || "Huesca"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Trabajo en {selectedCity?.name || "Huesca"}
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              {filtered.length} ofertas disponibles ahora mismo
            </p>
          </div>
          <div className="shrink-0 ml-4">
            <CreatePostDialog />
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-4 w-28 h-28 rounded-full bg-white/5" />
      </div>
      </AnimatedSection>

      <div className="px-4 py-6 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar trabajo o empresa..."
            className="pl-9 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips row */}
        <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap",
                activeType === type
                  ? "bg-foreground text-white border-transparent"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
          <button
            onClick={() => setRemoteOnly((v) => !v)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap",
              remoteOnly
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            )}
          >
            {remoteOnly ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            Remoto
          </button>
        </div>
        </AnimatedSection>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map((job, index) => (
            <AnimatedSection key={job.id} delay={index * 70} animation="scale-up">
            <Link
              href={`/jobs/${job.id}`}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer block group"
            >
              <div className="flex items-start gap-4">
                {/* Company avatar */}
                <Avatar className="w-12 h-12 shrink-0 rounded-xl">
                  <AvatarFallback className={cn("rounded-xl text-sm font-black", avatarColor(job.company))}>
                    {job.company.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-base leading-snug group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                    </div>
                    {/* Bookmark button */}
                    <button
                      onClick={(e) => toggleSaved(job.id, e)}
                      className={cn(
                        "shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all",
                        saved.has(job.id)
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {saved.has(job.id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-2 mb-3">{job.body}</p>

                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    {/* Salary badge — prominent green */}
                    {job.salary && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-0 font-bold text-xs px-2.5 py-1">
                        {job.salary}
                      </Badge>
                    )}
                    {/* Type badge */}
                    <Badge className={cn("border-0 font-bold text-xs", typeColors[job.type] || "bg-muted text-muted-foreground")}>
                      <Clock className="w-3 h-3 mr-1" />
                      {job.type}
                    </Badge>
                    {/* Location chip */}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    {/* Posted chip */}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                      <Clock className="w-3 h-3" />
                      {job.posted}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="rounded-full font-bold btn-press glow-primary text-xs h-8 bg-primary text-white hover:bg-primary/90"
                    onClick={(e) => e.preventDefault()}
                  >
                    Ver oferta
                  </Button>
                </div>
              </div>
            </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No se encontraron ofertas</p>
            <p className="text-sm mt-1">Prueba con otra búsqueda o categoría</p>
          </div>
        )}
      </div>
      <BackToTop />
    </div>
  );
}
