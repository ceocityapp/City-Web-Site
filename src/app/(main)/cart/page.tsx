"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { imageFallback } from "@/lib/image-fallback";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearConfirm = () => {
    clearCart();
    setConfirmClear(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h1 className="text-2xl font-black mb-2">Tu cesta está vacía</h1>
        <p className="text-muted-foreground mb-6">Explora el mercado y añade productos</p>
        <Link href="/marketplace">
          <Button className="rounded-full bg-primary font-bold gap-2">
            <ShoppingBag className="w-4 h-4" /> Explorar mercado
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black">Mi Cesta</h1>
          <span className="text-sm text-muted-foreground">({totalItems} productos)</span>
        </div>
        {confirmClear ? (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
            <span className="text-sm font-semibold">¿Vaciar carrito?</span>
            <button
              onClick={handleClearConfirm}
              className="text-sm text-destructive font-bold hover:underline"
            >
              Sí, vaciar
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-sm text-muted-foreground font-semibold hover:underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmClear(true)} className="text-sm text-destructive font-semibold hover:underline flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Vaciar
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4">
            {item.product.image_url && (
              <img src={item.product.image_url} alt={item.product.name} loading="lazy" decoding="async" className="w-16 h-16 rounded-xl object-cover shrink-0" onError={imageFallback} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">{item.shop.name}</p>
              <p className="text-sm font-bold text-primary mt-1">{item.product.price.toFixed(2)}€</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => removeItem(item.product.id)} aria-label="Eliminar" className="text-muted-foreground hover:text-destructive p-1">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Disminuir cantidad" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Aumentar cantidad" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div className="bg-card rounded-2xl border border-border p-5 sticky bottom-20 lg:bottom-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-black">Total</span>
          <span className="text-2xl font-black text-primary">{totalPrice.toFixed(2)}€</span>
        </div>
        <Link href="/checkout" className="block">
          <Button className="w-full h-12 rounded-full bg-foreground text-white font-bold text-base hover:bg-foreground/90">
            Realizar pedido
          </Button>
        </Link>
      </div>
    </div>
  );
}
