"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store, BarChart3, Package, ShoppingCart, Star, Eye,
  Settings, MoreHorizontal, TrendingUp, ArrowUpRight,
} from "lucide-react";
import { HUESCA_SHOPS } from "@/lib/huesca-data";
import { AddBusinessDialog } from "@/components/marketplace/AddBusinessDialog";
import { imageFallback } from "@/lib/image-fallback";

const MY_BUSINESSES = HUESCA_SHOPS.slice(0, 2);

const DEMO_STATS = {
  totalViews: 1247,
  totalOrders: 34,
  totalRevenue: 2890,
  avgRating: 4.85,
};

export default function BusinessPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Mis negocios</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus negocios en City App</p>
        </div>
        <AddBusinessDialog />
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +12%</span>
          </div>
          <p className="text-2xl font-black">{DEMO_STATS.totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Visitas este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +8%</span>
          </div>
          <p className="text-2xl font-black">{DEMO_STATS.totalOrders}</p>
          <p className="text-xs text-muted-foreground">Pedidos este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +15%</span>
          </div>
          <p className="text-2xl font-black">{DEMO_STATS.totalRevenue.toLocaleString()}€</p>
          <p className="text-xs text-muted-foreground">Ingresos este mes</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-black">{DEMO_STATS.avgRating}</p>
          <p className="text-xs text-muted-foreground">Valoración media</p>
        </div>
      </div>

      {/* My businesses list */}
      <div className="space-y-4">
        {MY_BUSINESSES.map((shop) => (
          <div key={shop.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-36 sm:h-auto overflow-hidden shrink-0">
                <img src={shop.image_url || ""} alt={shop.name} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-black">{shop.name}</h3>
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold">{shop.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{shop.description}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold">{shop.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>342 visitas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ShoppingCart className="w-4 h-4" />
                    <span>12 pedidos</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link href={`/business/${shop.id}/dashboard`}>
                    <Button size="sm" className="rounded-full bg-primary text-white font-bold hover:bg-primary/90">
                      <BarChart3 className="w-4 h-4 mr-1.5" /> Dashboard
                    </Button>
                  </Link>
                  <Link href={`/business/${shop.id}/products`}>
                    <Button size="sm" variant="outline" className="rounded-full font-bold">
                      <Package className="w-4 h-4 mr-1.5" /> Productos
                    </Button>
                  </Link>
                  <Link href={`/business/${shop.id}/settings`}>
                    <Button size="sm" variant="outline" className="rounded-full font-bold">
                      <Settings className="w-4 h-4 mr-1.5" /> Ajustes
                    </Button>
                  </Link>
                  <Link href={`/marketplace/${shop.id}`}>
                    <Button size="sm" variant="ghost" className="rounded-full font-bold text-primary">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> Ver tienda
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for additional businesses */}
      <div className="mt-6 border-2 border-dashed border-border rounded-2xl p-8 text-center">
        <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <h3 className="font-black mb-1">¿Tienes otro negocio?</h3>
        <p className="text-sm text-muted-foreground mb-4">Añádelo a City App y conecta con clientes de tu ciudad</p>
        <AddBusinessDialog />
      </div>
    </div>
  );
}
