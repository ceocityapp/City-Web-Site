"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin, Users, ShoppingBag, MessageCircle, Calendar, Briefcase,
  ArrowRight, ArrowLeft, Sparkles, Home,
} from "lucide-react";

const STEPS = [
  {
    title: "Bienvenido a City App",
    subtitle: "Tu ciudad, conectada",
    description: "City App es la plataforma que conecta a los residentes con su ciudad. Descubre negocios locales, únete a comunidades y participa en eventos.",
    icon: MapPin,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Explora el Tablón",
    subtitle: "Tu feed local",
    description: "Descubre qué está pasando en tu ciudad. Posts, fotos, foros de discusión, ofertas de trabajo y eventos, todo en un solo lugar.",
    icon: Home,
    color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Descubre negocios",
    subtitle: "Comercio local a tu alcance",
    description: "Encuentra restaurantes, tiendas y servicios cerca de ti. Haz pedidos directamente desde la app y apoya al comercio de tu barrio.",
    icon: ShoppingBag,
    color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Únete a comunidades",
    subtitle: "Conecta con tus vecinos",
    description: "Senderismo, gastronomía, running, lectura... Encuentra grupos de personas con tus mismos intereses en tu ciudad.",
    icon: Users,
    color: "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400",
  },
  {
    title: "No te pierdas nada",
    subtitle: "Eventos y mensajes",
    description: "Descubre eventos locales, chatea con amigos y vecinos, y mantente al día de todo lo que pasa a tu alrededor.",
    icon: Calendar,
    color: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "bg-primary w-10" : i < step ? "bg-primary/40 w-6" : "bg-muted w-6"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300" key={step}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${current.color} flex items-center justify-center`}>
            <current.icon className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-2">{current.title}</h1>
          <p className="text-primary font-bold mb-4">{current.subtitle}</p>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">{current.description}</p>

          {/* Feature highlights for last step */}
          {isLast && (
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] font-bold">Mercado</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <MessageCircle className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] font-bold">Chat</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] font-bold">Trabajo</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" className="rounded-full font-bold" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
            </Button>
          ) : (
            <Button variant="ghost" className="rounded-full font-bold text-muted-foreground" onClick={() => router.push("/feed")}>
              Saltar
            </Button>
          )}

          {isLast ? (
            <Button className="rounded-full bg-primary font-bold h-12 px-8" onClick={() => router.push("/feed")}>
              <Sparkles className="w-4 h-4 mr-2" /> Empezar a explorar
            </Button>
          ) : (
            <Button className="rounded-full bg-primary font-bold" onClick={() => setStep(step + 1)}>
              Siguiente <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
