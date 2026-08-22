"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, User, Check, Lock } from "lucide-react";
import { imageFallback } from "@/lib/image-fallback";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { success } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<"info" | "payment" | "done">("info");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Huesca");
  const [postal, setPostal] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const shipping = 2.99;
  const total = totalPrice + shipping;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setStep("done");
    success("¡Pedido confirmado!", "Recibirás un email con los detalles");
    setTimeout(() => {
      clearCart();
      router.push("/marketplace");
    }, 3000);
  };

  if (items.length === 0 && step !== "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-bold mb-2">Tu cesta está vacía</p>
        <Link href="/marketplace">
          <Button className="rounded-full bg-primary font-bold">Ir al mercado</Button>
        </Link>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-black mb-2">¡Pedido confirmado!</h1>
        <p className="text-muted-foreground mb-6">Gracias por apoyar a los negocios locales de Huesca.</p>
        <Link href="/marketplace">
          <Button className="rounded-full bg-foreground text-white font-bold">Volver al mercado</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-semibold">
        <ArrowLeft className="w-4 h-4" /> Volver a la cesta
      </Link>

      <h1 className="text-2xl font-black mb-6">Finalizar pedido</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center gap-2 ${step === "info" ? "text-primary font-bold" : "text-muted-foreground"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "info" ? "bg-primary text-white" : "bg-primary text-white"}`}>
                {step === "info" ? "1" : <Check className="w-4 h-4" />}
              </div>
              <span className="text-sm">Datos</span>
            </div>
            <div className="flex-1 h-[2px] bg-border" />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary font-bold" : "text-muted-foreground"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "bg-primary text-white" : "bg-muted"}`}>2</div>
              <span className="text-sm">Pago</span>
            </div>
          </div>

          {/* Info step */}
          {step === "info" && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="font-black">Datos de envío</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold block mb-1">Nombre completo</label>
                  <Input autoComplete="name" className={`rounded-xl ${errors.name ? "border-red-500" : ""}`} value={name} onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold block mb-1">Email</label>
                  <Input type="email" autoComplete="email" className={`rounded-xl ${errors.email ? "border-red-500" : ""}`} value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold block mb-1">Dirección</label>
                  <Input autoComplete="street-address" className={`rounded-xl ${errors.address ? "border-red-500" : ""}`} value={address} onChange={(e) => { setAddress(e.target.value); setErrors((prev) => ({ ...prev, address: "" })); }} />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Ciudad</label>
                  <Input autoComplete="address-level2" className="rounded-xl" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Código postal</label>
                  <Input autoComplete="postal-code" inputMode="numeric" className="rounded-xl" value={postal} onChange={(e) => setPostal(e.target.value)} />
                </div>
              </div>
              <Button onClick={() => {
                const newErrors: Record<string, string> = {};
                if (!name.trim()) newErrors.name = "El nombre es obligatorio";
                if (!email.trim()) {
                  newErrors.email = "El email es obligatorio";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  newErrors.email = "El email no es válido";
                }
                if (!address.trim()) newErrors.address = "La dirección es obligatoria";
                setErrors(newErrors);
                if (Object.keys(newErrors).length === 0) setStep("payment");
              }} className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-11">
                Continuar al pago
              </Button>
            </div>
          )}

          {/* Payment step */}
          {step === "payment" && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-black">Método de pago</h2>
              </div>

              <div className="space-y-2">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold">Tarjeta de crédito</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Número de tarjeta</label>
                  <Input autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" className={`rounded-xl ${paymentErrors.cardNumber ? "border-red-500" : ""}`} value={cardNumber} onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
                    setCardNumber(formatted);
                    setPaymentErrors((prev) => ({ ...prev, cardNumber: "" }));
                  }} />
                  {paymentErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Caducidad</label>
                    <Input autoComplete="cc-exp" inputMode="numeric" placeholder="MM/AA" className={`rounded-xl ${paymentErrors.expiry ? "border-red-500" : ""}`} value={expiry} onChange={(e) => {
                      let raw = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                      if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
                      setExpiry(raw);
                      setPaymentErrors((prev) => ({ ...prev, expiry: "" }));
                    }} />
                    {paymentErrors.expiry && <p className="text-xs text-red-500 mt-1">{paymentErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">CVV</label>
                    <Input autoComplete="cc-csc" inputMode="numeric" placeholder="123" className={`rounded-xl ${paymentErrors.cvv ? "border-red-500" : ""}`} value={cvv} onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCvv(raw);
                      setPaymentErrors((prev) => ({ ...prev, cvv: "" }));
                    }} />
                    {paymentErrors.cvv && <p className="text-xs text-red-500 mt-1">{paymentErrors.cvv}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Pago seguro cifrado</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("info")} className="rounded-full font-bold flex-1">Atrás</Button>
                <Button onClick={() => {
                  const newErrors: Record<string, string> = {};
                  if (cardNumber.length < 19) newErrors.cardNumber = "Número de tarjeta incompleto";
                  if (expiry.length < 5) newErrors.expiry = "Caducidad incompleta";
                  if (cvv.length < 3) newErrors.cvv = "CVV incompleto";
                  setPaymentErrors(newErrors);
                  if (Object.keys(newErrors).length === 0) handlePlaceOrder();
                }} disabled={submitting} className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold flex-1 h-11">
                  {submitting ? "Procesando..." : `Pagar ${total.toFixed(2)}€`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
            <h3 className="font-black mb-4">Resumen del pedido</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  {item.product.image_url && <img src={item.product.image_url} alt="" loading="lazy" decoding="async" className="w-12 h-12 rounded-lg object-cover" onError={imageFallback} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{(item.product.price * item.quantity).toFixed(2)}€</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{totalPrice.toFixed(2)}€</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Envío</span><span>{shipping.toFixed(2)}€</span></div>
              <div className="flex justify-between font-black text-lg pt-2 border-t border-border"><span>Total</span><span className="text-primary">{total.toFixed(2)}€</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
