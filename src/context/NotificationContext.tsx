"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AppNotification {
  id: number;
  type: "like" | "comment" | "follow" | "event" | "community" | "job";
  text: string;
  detail: string | null;
  read: boolean;
  time: string;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 1, type: "like", text: "Maria Garcia le dio like a tu post", detail: "Acabo de descubrir una cafeteria increible...", read: false, time: "hace 2m" },
  { id: 2, type: "comment", text: "Pablo Torres comento en tu foro", detail: "Buena pregunta! Te recomiendo la ruta cerca de...", read: false, time: "hace 15m" },
  { id: 3, type: "follow", text: "Elena Ruiz empezo a seguirte", detail: null, read: false, time: "hace 1h" },
  { id: 4, type: "event", text: "Mercadillo del Fin de Semana es manana", detail: "No te olvides! 47 personas van a asistir", read: true, time: "hace 3h" },
  { id: 5, type: "community", text: "Nueva publicacion en Amantes del Senderismo", detail: "Carlos compartio fotos de la ruta del finde", read: true, time: "hace 5h" },
  { id: 6, type: "job", text: "Nueva oferta que encaja con tus intereses", detail: "Desarrollador Web en Soluciones Digitales", read: true, time: "hace 1d" },
];

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  remove: (id: number) => void;
  add: (n: Omit<AppNotification, "id" | "time"> & { time?: string }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const add = useCallback(
    (n: Omit<AppNotification, "id" | "time"> & { time?: string }) => {
      setNotifications((prev) => [
        { id: Date.now(), time: n.time || "ahora", ...n },
        ...prev,
      ]);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, remove, add }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
