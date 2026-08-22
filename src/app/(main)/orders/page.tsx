"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Package, ShoppingBag, Clock, Check, Truck, XCircle,
  ChevronDown, Star, RotateCcw, Eye, MapPin, Receipt,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { BackToTop } from "@/components/shared/BackToTop";
import { useToast } from "@/context/ToastContext";
import { avatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";

type OrderStatus = "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado";
type FilterTab = "todos" | "pendientes" | "enviados" | "entregados" | "cancelados";

const STATUS_CONFIG: Record<OrderStatus, { icon: React.ElementType; bg: string; text: string; label: string; dot: string }> = {
  pendiente:  { icon: Clock,   bg: "bg-amber-50 dark:bg-amber-950/20",    text: "text-amber-600 dark:text-amber-400",  label: "Pendiente",  dot: "bg-amber-500" },
  preparando: { icon: Package, bg: "bg-blue-50 dark:bg-blue-950/20",     text: "text-blue-600 dark:text-blue-400",   label: "Preparando", dot: "bg-blue-500" },
  enviado:    { icon: Truck,   bg: "bg-violet-50 dark:bg-violet-950/20",   text: "text-violet-600 dark:text-violet-400", label: "Enviado",    dot: "bg-violet-500" },
  entregado:  { icon: Check,   bg: "bg-emerald-50 dark:bg-emerald-950/20",  text: "text-emerald-600 dark:text-emerald-400",label: "Entregado",  dot: "bg-emerald-500" },
  cancelado:  { icon: XCircle, bg: "bg-red-50 dark:bg-red-950/20",      text: "text-red-600 dark:text-red-400",    label: "Cancelado",  dot: "bg-red-500" },
};

const FILTER_MAP: Record<FilterTab, OrderStatus | null> = {
  todos: null,
  pendientes: "pendiente",
  enviados: "enviado",
  entregados: "entregado",
  cancelados: "cancelado",
};

const ORDERS = [
  {
    id: "ORD-2026-001", shop: "Tatau Bistro", date: "17 mayo 2026, 14:30",
    status: "preparando" as OrderStatus, total: 37.40, address: "Calle Coso Alto 12",
    items: [
      { name: "Croquetas de rabo de toro", qty: 2, price: 12.50 },
      { name: "Ensalada Cesar Tatau", qty: 1, price: 9.50 },
      { name: "Tarta de chocolate", qty: 1, price: 7.50 },
    ],
  },
  {
    id: "ORD-2026-002", shop: "Cafe Vienes", date: "15 mayo 2026, 09:15",
    status: "entregado" as OrderStatus, total: 12.80, address: "Plaza Lopez Allue 4",
    items: [
      { name: "Chocolate con churros", qty: 2, price: 4.90 },
      { name: "Zumo natural", qty: 1, price: 3.00 },
    ],
  },
  {
    id: "ORD-2026-003", shop: "Panaderia La Confianza", date: "12 mayo 2026, 08:00",
    status: "entregado" as OrderStatus, total: 8.70, address: "Calle Ramon y Cajal 17",
    items: [
      { name: "Pan artesano", qty: 1, price: 3.20 },
      { name: "Empanada de atun", qty: 2, price: 2.75 },
    ],
  },
  {
    id: "ORD-2026-004", shop: "Libreria Anonima", date: "8 mayo 2026, 17:45",
    status: "cancelado" as OrderStatus, total: 22.90, address: "Calle Cabestany 19",
    items: [
      { name: "El infinito en un junco", qty: 1, price: 22.90 },
    ],
  },
  {
    id: "ORD-2026-005", shop: "El Rincon del Jamon", date: "5 mayo 2026, 11:00",
    status: "enviado" as OrderStatus, total: 54.20, address: "Plaza Navarra 8",
    items: [
      { name: "Jamon iberico 100g", qty: 2, price: 18.50 },
      { name: "Queso curado Radiquero", qty: 1, price: 12.00 },
      { name: "Aceite oliva Somontano", qty: 1, price: 5.20 },
    ],
  },
  {
    id: "ORD-2026-006", shop: "Tatau Bistro", date: "1 mayo 2026, 21:00",
    status: "entregado" as OrderStatus, total: 28.50, address: "Calle Coso Alto 12",
    items: [
      { name: "Tabla de ibéricos", qty: 1, price: 16.00 },
      { name: "Vino Somontano copa", qty: 2, price: 6.25 },
    ],
  },
];

const TIMELINE_STEPS: OrderStatus[] = ["pendiente", "preparando", "enviado", "entregado"];

export default function OrdersPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("todos");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(new Set());
  const [submittingReview, setSubmittingReview] = useState(false);
  const { success } = useToast();

  const filteredOrders = ORDERS.filter((o) => {
    const target = FILTER_MAP[filterTab];
    if (!target) return true;
    if (target === "pendiente") return o.status === "pendiente" || o.status === "preparando";
    return o.status === target;
  });

  const filterTabs: Array<{ id: FilterTab; label: string; count: number }> = [
    { id: "todos", label: "Todos", count: ORDERS.length },
    { id: "pendientes", label: "Pendientes", count: ORDERS.filter((o) => o.status === "pendiente" || o.status === "preparando").length },
    { id: "enviados", label: "Enviados", count: ORDERS.filter((o) => o.status === "enviado").length },
    { id: "entregados", label: "Entregados", count: ORDERS.filter((o) => o.status === "entregado").length },
    { id: "cancelados", label: "Cancelados", count: ORDERS.filter((o) => o.status === "cancelado").length },
  ];

  const handleRepeatOrder = (orderId: string) => {
    success("Pedido agregado al carrito");
  };

  const handleSubmitReview = (orderId: string) => {
    setSubmittingReview(true);
    setTimeout(() => {
      setSubmittedReviews((prev) => new Set(prev).add(orderId));
      setReviewingOrder(null);
      setReviewRating(0);
      setReviewText("");
      setSubmittingReview(false);
      success("Gracias por tu valoracion");
    }, 600);
  };

  const totalSpent = ORDERS.filter((o) => o.status === "entregado").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <AnimatedSection animation="fade-up">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Mis pedidos</h1>
              <p className="text-sm text-muted-foreground">Historial y seguimiento de pedidos</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection animation="fade-up" delay={80}>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-foreground">{ORDERS.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Total</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-primary">
              {ORDERS.filter((o) => o.status === "entregado").length}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Entregados</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-foreground">{totalSpent.toFixed(2).replace(".", ",")}&#8364;</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Gastado</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection animation="fade-up" delay={140}>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all btn-press",
                filterTab === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "text-[10px] min-w-[18px] h-[18px] rounded-full inline-flex items-center justify-center font-bold",
                  filterTab === t.id
                    ? "bg-white/20 text-white"
                    : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Orders list */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order, idx) => {
            const config = STATUS_CONFIG[order.status];
            const isExpanded = expandedOrder === order.id;
            const stepIndex = TIMELINE_STEPS.indexOf(order.status);

            return (
              <AnimatedSection key={order.id} animation="fade-up" delay={180 + idx * 60}>
                <div
                  className={cn(
                    "bg-card rounded-2xl border transition-all",
                    isExpanded ? "border-primary/30 shadow-lg" : "border-border hover:shadow-md hover:border-primary/10"
                  )}
                >
                  {/* Order header row */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-11 h-11 shrink-0">
                        <AvatarFallback className={cn(avatarColor(order.shop), "font-bold text-sm")}>
                          {order.shop.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="font-black text-sm">{order.shop}</h3>
                          <Badge className={cn("text-[10px] border-0 font-bold", config.bg, config.text)}>
                            <config.icon className="w-3 h-3 mr-0.5" /> {config.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.id} · {order.date} · {order.items.length} {order.items.length === 1 ? "articulo" : "articulos"}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className="font-black text-sm">{order.total.toFixed(2).replace(".", ",")}&#8364;</p>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 slide-up">
                      <div className="border-t border-border pt-4">
                        {/* Status timeline */}
                        {order.status !== "cancelado" && (
                          <div className="flex items-center gap-1 mb-5">
                            {TIMELINE_STEPS.map((step, i) => {
                              const isActive = i <= stepIndex;
                              const stepConfig = STATUS_CONFIG[step];
                              return (
                                <div key={step} className="flex-1 flex items-center gap-1">
                                  <div
                                    className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                      isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    <stepConfig.icon className="w-4 h-4" />
                                  </div>
                                  {i < TIMELINE_STEPS.length - 1 && (
                                    <div
                                      className={cn(
                                        "flex-1 h-0.5 rounded-full transition-colors",
                                        isActive && i < stepIndex ? "bg-primary" : "bg-muted"
                                      )}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Cancelled banner */}
                        {order.status === "cancelado" && (
                          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold text-red-600">Este pedido fue cancelado</span>
                          </div>
                        )}

                        {/* Delivery address */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{order.address}</span>
                        </div>

                        {/* Items */}
                        <div className="bg-muted/40 rounded-xl p-3 mb-4">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center justify-between py-2.5",
                                i < order.items.length - 1 && "border-b border-border/50"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">x{item.qty} · {item.price.toFixed(2).replace(".", ",")}&#8364;/ud</p>
                              </div>
                              <p className="text-sm font-bold shrink-0 ml-3">
                                {(item.price * item.qty).toFixed(2).replace(".", ",")}&#8364;
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between py-3 border-t border-border">
                          <p className="font-black text-sm flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-muted-foreground" /> Total
                          </p>
                          <p className="text-lg font-black text-primary">
                            {order.total.toFixed(2).replace(".", ",")}&#8364;
                          </p>
                        </div>

                        {/* Actions for delivered orders */}
                        {order.status === "entregado" && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-bold flex-1 btn-press"
                              onClick={() => handleRepeatOrder(order.id)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" /> Repetir
                            </Button>
                            {submittedReviews.has(order.id) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full font-bold flex-1 text-primary border-primary/30"
                                disabled
                              >
                                <Check className="w-4 h-4 mr-1" /> Valorado
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full font-bold flex-1 btn-press"
                                onClick={() =>
                                  setReviewingOrder(reviewingOrder === order.id ? null : order.id)
                                }
                              >
                                <Star className="w-4 h-4 mr-1" /> Valorar
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Review form */}
                        {reviewingOrder === order.id && (
                          <div className="mt-4 pt-4 border-t border-border slide-up">
                            <p className="font-bold text-sm mb-2">Tu valoracion</p>
                            <div className="flex gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className="p-0.5 btn-press"
                                >
                                  <Star
                                    className={cn(
                                      "w-7 h-7 transition-colors",
                                      star <= reviewRating
                                        ? "text-amber-500 fill-amber-500"
                                        : "text-muted-foreground/20"
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                            <Input
                              placeholder="Escribe tu comentario..."
                              className="rounded-xl mb-3"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="rounded-full bg-primary font-bold flex-1 btn-press"
                                disabled={reviewRating === 0 || submittingReview}
                                onClick={() => handleSubmitReview(order.id)}
                              >
                                {submittingReview ? "Enviando..." : "Enviar valoracion"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full font-bold btn-press"
                                onClick={() => { setReviewingOrder(null); setReviewRating(0); setReviewText(""); }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      ) : (
        <AnimatedSection animation="scale-up">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Package className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-black text-foreground">
              {filterTab === "todos" ? "No tienes pedidos" : "Sin pedidos en esta categoria"}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              {filterTab === "todos"
                ? "Cuando hagas tu primer pedido, aparecera aqui"
                : "No hay pedidos que coincidan con este filtro"}
            </p>
            {filterTab === "todos" && (
              <Link href="/marketplace">
                <Button className="rounded-full bg-primary font-bold mt-5 btn-press">
                  <ShoppingBag className="w-4 h-4 mr-1.5" /> Ir al mercado
                </Button>
              </Link>
            )}
            {filterTab !== "todos" && (
              <Button
                variant="outline"
                className="rounded-full font-bold mt-5 btn-press"
                onClick={() => setFilterTab("todos")}
              >
                Ver todos los pedidos
              </Button>
            )}
          </div>
        </AnimatedSection>
      )}

      <BackToTop />
    </div>
  );
}
