"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  Users,
  Briefcase,
  CheckCheck,
  X,
  Bell,
} from "lucide-react";
import { useNotifications, AppNotification } from "@/context/NotificationContext";
import { useToast } from "@/context/ToastContext";
import { avatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const iconMap = {
  like: { icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
  comment: { icon: MessageCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
  follow: { icon: UserPlus, color: "text-primary bg-primary/10" },
  event: { icon: Calendar, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
  community: { icon: Users, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  job: { icon: Briefcase, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
};

const linkMap: Record<string, string> = {
  like: "/feed",
  comment: "/feed",
  follow: "/profile/followers",
  event: "/events",
  community: "/communities",
  job: "/jobs",
};

type FilterTab = "todas" | "noleidas" | "menciones";

const FILTER_LABELS: Record<FilterTab, string> = {
  todas: "Todas",
  noleidas: "Sin leer",
  menciones: "Menciones",
};

export default function NotificationsPage() {
  const { notifications, markRead: markOneRead, markAllRead, remove: deleteOne } = useNotifications();
  const { success } = useToast();
  const [filter, setFilter] = useState<FilterTab>("todas");

  const filtered = notifications.filter((n) => {
    if (filter === "noleidas") return !n.read;
    if (filter === "menciones") return n.type === "comment" || n.type === "follow";
    return true;
  });

  const unread = notifications.filter((n) => !n.read);
  const unreadFiltered = filtered.filter((n) => !n.read);
  const readFiltered = filtered.filter((n) => n.read);

  const handleMarkAllRead = () => {
    markAllRead();
    success("Todo marcado como leído");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <AnimatedSection animation="fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">
            Notificaciones
          </h1>
          {unread.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {unread.length} sin leer
            </p>
          )}
        </div>
        {unread.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary hover:text-primary font-bold rounded-full btn-press glow-primary"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Marcar todo como leído</span>
            <span className="sm:hidden">Marcar todo</span>
          </Button>
        )}
      </div>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection animation="fade-up" delay={100}>
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {(Object.keys(FILTER_LABELS) as FilterTab[]).map((tab) => {
          const count =
            tab === "todas"
              ? notifications.length
              : tab === "noleidas"
              ? unread.length
              : notifications.filter((n) => n.type === "comment" || n.type === "follow").length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 btn-press",
                filter === tab
                  ? "bg-foreground text-white"
                  : "bg-card border border-border hover:bg-muted"
              )}
            >
              {FILTER_LABELS[tab]}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  filter === tab ? "bg-white/20" : "bg-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      </AnimatedSection>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="relative inline-flex items-center justify-center mb-6">
            <span className="absolute w-16 h-16 rounded-full bg-primary/15 pulse-ring" />
            <span className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-8 h-8 text-primary/60" />
            </span>
          </div>
          <p className="text-lg font-semibold">No hay notificaciones</p>
          <p className="text-sm mt-1">
            {filter === "noleidas"
              ? "Estás al día con todas tus notificaciones"
              : "No hay actividad reciente en esta categoría"}
          </p>
        </div>
      )}

      <div className="space-y-1">
        {/* Unread section */}
        {unreadFiltered.length > 0 && (
          <div className="relative flex items-center gap-3 px-2 mb-3 pt-1 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Nuevo
            </span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
        )}
        {unreadFiltered.map((notif, index) => (
          <AnimatedSection key={notif.id} delay={index * 40} animation="fade-left">
            <NotificationItem
              notification={notif}
              onMarkRead={() => markOneRead(notif.id)}
              onDelete={() => deleteOne(notif.id)}
            />
          </AnimatedSection>
        ))}

        {/* Read section */}
        {readFiltered.length > 0 && (
          <div className="relative flex items-center gap-3 px-2 mb-3 pt-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Anteriores
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}
        {readFiltered.map((notif, index) => (
          <AnimatedSection key={notif.id} delay={index * 40} animation="fade-left">
            <NotificationItem
              notification={notif}
              onMarkRead={() => markOneRead(notif.id)}
              onDelete={() => deleteOne(notif.id)}
            />
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: AppNotification;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const config = iconMap[notification.type];
  const Icon = config.icon;

  // Derive a name from the first word of the notification text for the avatar
  const firstName = notification.text?.split(" ")[0] ?? "U";
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-xl transition-all relative",
        "hover:shadow-md hover:-translate-y-px",
        notification.read
          ? "hover:bg-muted"
          : "bg-primary/5 hover:bg-primary/10 border-l-[3px] border-primary shadow-sm slide-up"
      )}
    >
      <Link
        href={linkMap[notification.type] || "/"}
        onClick={onMarkRead}
        className="flex items-start gap-3 flex-1 min-w-0"
      >
        {/* Avatar with icon badge */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white",
              avatarColor(firstName)
            )}
          >
            {initials}
          </div>
          {/* Icon badge bottom-right */}
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background",
              config.color
            )}
          >
            <Icon className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm", notification.read ? "" : "font-bold")}>
            {notification.text}
            {!notification.read && (
              <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 align-middle" />
            )}
          </p>
          {notification.detail && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {notification.detail}
            </p>
          )}
          <span className="text-[10px] text-muted-foreground">
            {notification.time}
          </span>
        </div>
      </Link>
      <button
        onClick={onDelete}
        aria-label="Eliminar notificación"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
