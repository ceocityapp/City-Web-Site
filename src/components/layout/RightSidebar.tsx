"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { HuescaWidget } from "@/components/layout/HuescaWidget";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";

const SUGGESTED_USERS = [
  { id: 1, name: "Elena Ruiz", username: "elenaruiz", bio: "Diseñadora gráfica" },
  { id: 2, name: "Pablo Torres", username: "pablotorres", bio: "Senderista" },
  { id: 3, name: "Café Central", username: "cafecentral", bio: "El mejor café", verified: true },
];

const UPCOMING_EVENTS = [
  { id: 1, title: "Mercadillo del Finde", date: "Sáb, 6 Abr", location: "Plaza Mayor", attendees: 47 },
  { id: 2, title: "Noche de Jazz", date: "Vie, 5 Abr", location: "Café del Teatro", attendees: 32 },
];

const TRENDING = ["#MercadilloLocal", "#CaféArtesano", "#SenderismoHuesca", "#TechMeetup", "#NuevoEnLaCiudad"];

export function RightSidebar() {
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());

  const toggleFollow = (id: number) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="hidden xl:block w-80 shrink-0 py-6 pr-6 space-y-5">
      {/* Huesca city info */}
      <HuescaWidget />

      {/* Trending */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-black">Tendencia</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-primary/8 text-primary text-xs font-semibold rounded-full hover:bg-primary/15 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested users */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-black">Personas sugeridas</h3>
        </div>
        <div className="space-y-3">
          {SUGGESTED_USERS.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Link href={`/profile/${user.id}`}>
                <Avatar className="w-9 h-9">
                  <AvatarFallback className={`${avatarColor(user.username)} text-xs font-bold`}>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${user.id}`} className="text-sm font-semibold hover:underline truncate block">
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleFollow(user.id)}
                className={
                  followedUsers.has(user.id)
                    ? "rounded-full h-7 text-xs font-bold bg-foreground text-white hover:bg-red-500"
                    : "rounded-full h-7 text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-transparent"
                }
              >
                {followedUsers.has(user.id) ? "Siguiendo" : "Seguir"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black">Próximos eventos</h3>
          </div>
          <Link href="/events" className="text-xs text-primary font-semibold hover:underline">Ver todo</Link>
        </div>
        <div className="space-y-3">
          {UPCOMING_EVENTS.map((event) => (
            <Link key={event.id} href={"/events/" + event.id} className="block group">
              <p className="text-sm font-semibold group-hover:text-primary transition-colors">{event.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Users className="w-3 h-3" /> {formatCount(event.attendees)} asistentes
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="text-xs text-muted-foreground/60 px-1 space-x-3">
        <Link href="/terms" className="hover:text-muted-foreground">Términos</Link>
        <Link href="/privacy" className="hover:text-muted-foreground">Privacidad</Link>
        <span>&copy; {new Date().getFullYear()} City App</span>
      </div>
    </aside>
  );
}
