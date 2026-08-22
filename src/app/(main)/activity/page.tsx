"use client";

import { useState } from "react";
import {
  Heart, MessageCircle, UserPlus, Calendar, ShoppingBag,
  Star, Bookmark, Users, Activity, Clock,
} from "lucide-react";

const ACTIVITY_ITEMS = [
  { id: 1, type: "like", text: "Te ha gustado el post de", actor: "María García", target: "Croquetas de Tatau Bistro", time: "Hace 5 min", icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
  { id: 2, type: "comment", text: "Has comentado en el post de", actor: "Pablo Torres", target: "Ruta al Salto de Roldán", time: "Hace 20 min", icon: MessageCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
  { id: 3, type: "follow", text: "Has empezado a seguir a", actor: "Café Vienés", target: null, time: "Hace 1 hora", icon: UserPlus, color: "text-primary bg-primary/10" },
  { id: 4, type: "rsvp", text: "Te has apuntado al evento", actor: null, target: "Fiestas de San Lorenzo", time: "Hace 2 horas", icon: Calendar, color: "text-violet-500 bg-violet-50 dark:bg-violet-950/20" },
  { id: 5, type: "order", text: "Has realizado un pedido en", actor: "Tatau Bistro", target: "37,40€", time: "Hace 3 horas", icon: ShoppingBag, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  { id: 6, type: "review", text: "Has dejado una reseña en", actor: "Café Vienés", target: "5 estrellas", time: "Hace 5 horas", icon: Star, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  { id: 7, type: "save", text: "Has guardado el post de", actor: "Elena Ruiz", target: "Atardecer en los Mallos", time: "Hace 8 horas", icon: Bookmark, color: "text-violet-500 bg-violet-50 dark:bg-violet-950/20" },
  { id: 8, type: "join", text: "Te has unido a la comunidad", actor: null, target: "Senderistas de Huesca", time: "Hace 1 día", icon: Users, color: "text-primary bg-primary/10" },
  { id: 9, type: "like", text: "Te ha gustado el post de", actor: "Ayuntamiento de Huesca", target: "Programa San Lorenzo 2026", time: "Hace 1 día", icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
  { id: 10, type: "follow", text: "Has empezado a seguir a", actor: "Restaurante Las Torres", target: null, time: "Hace 2 días", icon: UserPlus, color: "text-primary bg-primary/10" },
  { id: 11, type: "comment", text: "Has comentado en", actor: null, target: "¿Chocolate con churros?", time: "Hace 2 días", icon: MessageCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
  { id: 12, type: "order", text: "Has realizado un pedido en", actor: "Panadería La Confianza", target: "8,70€", time: "Hace 5 días", icon: ShoppingBag, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
];

function groupByDate(items: typeof ACTIVITY_ITEMS) {
  const groups: Record<string, typeof ACTIVITY_ITEMS> = {};
  items.forEach((item) => {
    let group: string;
    if (item.time.includes("min") || item.time.includes("hora")) {
      group = "Hoy";
    } else if (item.time === "Hace 1 día") {
      group = "Ayer";
    } else {
      group = "Esta semana";
    }
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  });
  return groups;
}

const FILTERS = [
  { id: "all", label: "Todo" },
  { id: "like", label: "Me gusta" },
  { id: "comment", label: "Comentarios" },
  { id: "follow", label: "Seguidos" },
  { id: "order", label: "Pedidos" },
  { id: "rsvp", label: "Eventos" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function ActivityPage() {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = filter === "all"
    ? ACTIVITY_ITEMS
    : ACTIVITY_ITEMS.filter((i) => i.type === filter);

  const grouped = groupByDate(filtered);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6" /> Actividad
        </h1>
        <p className="text-sm text-muted-foreground">Tu historial de actividad reciente</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? ACTIVITY_ITEMS.length : ACTIVITY_ITEMS.filter((i) => i.type === f.id).length;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filter === f.id ? "bg-foreground text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-white/20" : "bg-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-bold">Sin actividad</p>
          <p className="text-sm mt-1">No hay actividad en esta categoría todavía</p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-bold text-muted-foreground uppercase mb-3 px-1">{group}</p>
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="text-foreground/80">{item.text} </span>
                      {item.actor && <strong>{item.actor}</strong>}
                      {item.target && (
                        <>
                          {item.actor && <span className="text-foreground/80"> · </span>}
                          <span className="text-primary font-medium">{item.target}</span>
                        </>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
