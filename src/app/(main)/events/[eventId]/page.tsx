"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart,
  MessageCircle, Check, Ticket, ExternalLink, ChevronRight,
} from "lucide-react";
import { HUESCA_EVENTS, HUESCA_USERS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";

const categoryColors: Record<string, string> = {
  Fiestas: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
  Música: "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400",
  Comunidad: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  Deportes: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
  Arte: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400",
  Tecnología: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400",
};

const DEMO_COMMENTS = [
  { id: 1, user_id: 1, body: "No puedo esperar! Va a ser increible este año!", time: "hace 2h" },
  { id: 2, user_id: 2, body: "Alguien sabe si habrá zona de food trucks?", time: "hace 5h" },
  { id: 3, user_id: 5, body: "El año pasado fue espectacular, repetimos seguro!", time: "hace 1d" },
  { id: 4, user_id: 7, body: "Nos vemos allí! Quedaremos el grupo de runners antes?", time: "hace 2d" },
];

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [attending, setAttending] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(DEMO_COMMENTS);
  const [shared, setShared] = useState(false);

  const event = HUESCA_EVENTS.find((e) => e.id === Number(eventId));

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Evento no encontrado</h1>
        <p className="text-muted-foreground mb-6">El evento que buscas no existe o ha sido eliminado.</p>
        <Link href="/events">
          <Button className="rounded-full bg-primary font-bold">Ver todos los eventos</Button>
        </Link>
      </div>
    );
  }

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments([
      { id: Date.now(), user_id: 0, body: comment, time: "ahora" },
      ...comments,
    ]);
    setComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const attendeeUsers = HUESCA_USERS.slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a eventos
      </Link>
      <nav aria-label="breadcrumb" className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <Link href="/events" className="hover:text-foreground">Eventos</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-bold truncate">{event.title}</span>
      </nav>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-64 sm:h-80">
        <img src={event.image} alt={event.title} onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className={`mb-2 border-0 font-bold ${categoryColors[event.category] || "bg-primary/10 text-primary"}`}>
            {event.category}
          </Badge>
          <h1 className="text-3xl font-black text-white drop-shadow-lg">{event.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="text-sm font-bold">{event.date}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horario</p>
                  <p className="text-sm font-bold">{event.time}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ubicacion</p>
                  <p className="text-sm font-bold">{event.location}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Asistentes</p>
                  <p className="text-sm font-bold">{event.attendees.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black mb-3">Sobre el evento</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>
          </div>

          {/* Comments section */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Comentarios
              <Badge variant="secondary" className="text-xs">{comments.length}</Badge>
            </h2>

            {/* Comment input */}
            <div className="flex gap-3 mb-6">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">T</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="flex-1 h-10 px-4 rounded-full bg-muted border-0 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleComment(); }}
                />
                <Button size="sm" className="rounded-full bg-primary font-bold" disabled={!comment.trim()} onClick={handleComment}>
                  Enviar
                </Button>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              {comments.map((c) => {
                const user = HUESCA_USERS.find((u) => u.id === c.user_id);
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-muted text-xs font-bold">
                        {user?.name.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{c.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions card */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 sticky top-20">
            <Button
              className={`w-full rounded-full font-bold h-12 ${
                attending
                  ? "bg-card text-primary border-2 border-primary hover:bg-primary/5"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
              onClick={() => setAttending(!attending)}
            >
              {attending ? <><Check className="w-5 h-5 mr-2" /> Asistiré</> : <><Ticket className="w-5 h-5 mr-2" /> Asistir al evento</>}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`flex-1 rounded-full font-bold ${liked ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-4 h-4 mr-1.5 ${liked ? "fill-current" : ""}`} />
                {liked ? "Te gusta" : "Me gusta"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-full font-bold" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1.5" /> {shared ? "Enlace copiado" : "Compartir"}
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Asistentes destacados</p>
              <div className="space-y-2">
                {attendeeUsers.slice(0, 4).map((u) => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-2 hover:bg-muted rounded-lg p-1.5 -mx-1.5 transition-colors">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{u.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{u.name}</span>
                    {u.is_verified && <Check className="w-3 h-3 text-primary" />}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">y {event.attendees - 4} personas más</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="h-40 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-medium">{event.location}</p>
              </div>
            </div>
            <div className="p-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(event.location + " Huesca España")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-xs font-bold text-primary h-8 inline-flex items-center justify-center hover:bg-muted rounded-md transition-colors"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
