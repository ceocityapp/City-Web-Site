"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, BarChart3, Eye, ShoppingCart, Star, TrendingUp,
  TrendingDown, Users, Package, Clock, MessageCircle, DollarSign,
} from "lucide-react";
import { HUESCA_SHOPS } from "@/lib/huesca-data";

const DEMO_ORDERS = [
  { id: 1, customer: "María García", items: 2, total: 24.50, status: "completado", time: "hace 2h" },
  { id: 2, customer: "Pablo Torres", items: 1, total: 8.90, status: "preparando", time: "hace 4h" },
  { id: 3, customer: "Elena Ruiz", items: 3, total: 42.00, status: "completado", time: "Ayer" },
  { id: 4, customer: "Carlos Mendez", items: 1, total: 15.00, status: "completado", time: "Ayer" },
];

const DEMO_REVIEWS = [
  { id: 1, customer: "María García", rating: 5, text: "Increíble calidad y servicio!", time: "hace 1d" },
  { id: 2, customer: "Elena Ruiz", rating: 4, text: "Muy buena experiencia, volvería sin duda", time: "hace 3d" },
];

const statusColors: Record<string, string> = {
  completado: "bg-primary/10 text-primary",
  preparando: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  pendiente: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
  cancelado: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400",
};

const DEMO_CUSTOMERS = [
  { name: "María García", orders: 8, total: 196.50, lastOrder: "hace 2 días" },
  { name: "Pablo Torres", orders: 3, total: 67.20, lastOrder: "hace 4 días" },
  { name: "Elena Ruiz", orders: 12, total: 340.00, lastOrder: "Ayer" },
  { name: "Carlos Mendez", orders: 5, total: 125.00, lastOrder: "hace 1 semana" },
  { name: "Lucía Fernández", orders: 2, total: 45.80, lastOrder: "hace 2 semanas" },
];

const DEMO_STATS = [
  { label: "Tasa de conversión", value: "3.2%", change: "+0.4%" },
  { label: "Ticket medio", value: "18.50€", change: "+1.20€" },
  { label: "Clientes recurrentes", value: "42%", change: "+5%" },
  { label: "Tiempo medio de preparación", value: "12 min", change: "-2 min" },
];

export default function BusinessDashboardPage() {
  const { shopId } = useParams();
  const shop = HUESCA_SHOPS.find((s) => s.id === Number(shopId));

  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activePanel, setActivePanel] = useState<"clientes" | "estadisticas" | null>(null);

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Negocio no encontrado</h1>
        <Link href="/business"><Button className="rounded-full bg-primary font-bold mt-4">Mis negocios</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/business" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Mis negocios
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">{shop.name}</h1>
          <p className="text-sm text-muted-foreground">Dashboard de gestión</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/business/${shopId}/products`}>
            <Button variant="outline" className="rounded-full font-bold">
              <Package className="w-4 h-4 mr-1.5" /> Productos
            </Button>
          </Link>
          <Link href={`/marketplace/${shopId}`}>
            <Button className="rounded-full bg-primary font-bold">Ver tienda</Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +18%</span>
          </div>
          <p className="text-2xl font-black mt-2">847</p>
          <p className="text-xs text-muted-foreground">Visitas este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +5%</span>
          </div>
          <p className="text-2xl font-black mt-2">23</p>
          <p className="text-xs text-muted-foreground">Pedidos este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-xs text-red-500 font-bold flex items-center gap-0.5"><TrendingDown className="w-3 h-3" /> -3%</span>
          </div>
          <p className="text-2xl font-black mt-2">1.456€</p>
          <p className="text-xs text-muted-foreground">Ingresos este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2">{shop.rating}</p>
          <p className="text-xs text-muted-foreground">{8 + (Number(shopId) * 3) % 24} reseñas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Pedidos recientes
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold" onClick={() => setShowAllOrders(!showAllOrders)}>
              {showAllOrders ? "Mostrar menos" : "Ver todos"}
            </Button>
          </div>
          <div className="space-y-3">
            {DEMO_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-bold">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.items} artículos · {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">{order.total.toFixed(2)}€</p>
                  <Badge className={`text-[10px] border-0 font-bold ${statusColors[order.status]}`}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          {showAllOrders && (
            <p className="text-xs text-muted-foreground text-center pt-3 border-t border-border mt-3">Mostrando todos los pedidos</p>
          )}
        </div>

        {/* Recent reviews */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Últimas reseñas
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold" onClick={() => setShowAllReviews(!showAllReviews)}>
              {showAllReviews ? "Mostrar menos" : "Ver todas"}
            </Button>
          </div>
          <div className="space-y-4">
            {DEMO_REVIEWS.map((review) => (
              <div key={review.id} className="pb-3 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold">{review.customer}</p>
                  <span className="text-xs text-muted-foreground">{review.time}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground/80">{review.text}</p>
              </div>
            ))}
          </div>
          {showAllReviews && (
            <p className="text-xs text-muted-foreground text-center pt-3 border-t border-border mt-3">Mostrando todas las reseñas</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-2xl border border-border p-5 lg:col-span-2">
          <h2 className="font-black mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href={`/business/${shopId}/products`}>
              <div className="rounded-xl border border-border p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-bold">Gestionar productos</p>
              </div>
            </Link>
            <div
              onClick={() => setActivePanel(activePanel === "clientes" ? null : "clientes")}
              className={`rounded-xl border p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer ${activePanel === "clientes" ? "border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20" : "border-border"}`}
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
              <p className="text-xs font-bold">Ver clientes</p>
            </div>
            <div
              onClick={() => setActivePanel(activePanel === "estadisticas" ? null : "estadisticas")}
              className={`rounded-xl border p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer ${activePanel === "estadisticas" ? "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20" : "border-border"}`}
            >
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-bold">Estadísticas</p>
            </div>
            <Link href={`/business/${shopId}/settings`}>
              <div className="rounded-xl border border-border p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <Clock className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-xs font-bold">Horarios</p>
              </div>
            </Link>
          </div>

          {/* Customers panel */}
          {activePanel === "clientes" && (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" /> Clientes frecuentes
              </h3>
              <div className="space-y-2">
                {DEMO_CUSTOMERS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.orders} pedidos · Último: {c.lastOrder}</p>
                    </div>
                    <p className="text-sm font-black">{c.total.toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats panel */}
          {activePanel === "estadisticas" && (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Estadísticas detalladas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEMO_STATS.map((s) => (
                  <div key={s.label} className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-lg font-black">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground mb-1">{s.label}</p>
                    <span className="text-[10px] font-bold text-primary">{s.change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
