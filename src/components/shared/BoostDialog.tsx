"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Target, TrendingUp, Users, Clock, Star, ChevronRight, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = [
  { days: 1, label: "1 día" },
  { days: 3, label: "3 días" },
  { days: 7, label: "7 días" },
  { days: 14, label: "14 días" },
  { days: 30, label: "1 mes" },
];

const AUDIENCE_OPTIONS = [
  { id: "city", label: "Ciudad completa", desc: "Todos los usuarios activos de la ciudad", icon: Target, mult: 1.0 },
  { id: "followers", label: "Mis seguidores", desc: "Llega a personas que ya te conocen", icon: Users, mult: 0.6 },
  { id: "category", label: "Categoría específica", desc: "Usuarios interesados en tu tema", icon: Sparkles, mult: 1.3 },
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const diff = end - start;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) { clearInterval(timer); prev.current = end; }
    }, 18);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString("es-ES")}</>;
}

export function BoostDialog({ trigger, targetType = "post" }: { trigger?: React.ReactNode; targetType?: "post" | "page" | "profile" }) {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(25);
  const [duration, setDuration] = useState(7);
  const [audience, setAudience] = useState("city");
  const [paying, setPaying] = useState(false);

  const audienceMult = AUDIENCE_OPTIONS.find(a => a.id === audience)?.mult ?? 1;
  const reach = Math.round(budget * duration * 180 * audienceMult);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1200));
    setPaying(false);
    setOpen(false);
    success("¡Impulso activado!", `Tu ${targetType === "post" ? "publicación" : targetType === "page" ? "página" : "perfil"} llegará a más de ${reach.toLocaleString("es-ES")} personas`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="inline-flex cursor-pointer">
          {trigger}
        </span>
      ) : (
        <DialogTrigger className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 boost-glow cursor-pointer">
          <Zap className="w-4 h-4" /> Impulsar
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-3xl overflow-hidden border-0 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 px-6 py-5 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Impulsar {targetType === "post" ? "publicación" : targetType === "page" ? "página" : "perfil"}</h2>
              <p className="text-sm text-white/80">Llega a más personas de tu ciudad</p>
            </div>
          </div>
          {/* Reach preview */}
          <div className="relative mt-4 bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-xs text-white/70 uppercase tracking-wider font-bold mb-1">Alcance estimado</p>
            <p className="text-3xl font-black tabular-nums">
              <AnimatedNumber value={reach} />
            </p>
            <p className="text-xs text-white/70 mt-1">personas en {duration} {duration === 1 ? "día" : "días"}</p>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Presupuesto</label>
              <span className="text-lg font-black text-amber-500">€{budget}</span>
            </div>
            <input
              type="range" min={5} max={200} step={5} value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #F59E0B ${((budget - 5) / 195) * 100}%, #E5E7EB ${((budget - 5) / 195) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>€5</span>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map(v => (
                  <button key={v} onClick={() => setBudget(v)}
                    className={cn("px-2 py-0.5 rounded-full text-xs font-bold transition-colors", budget === v ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground hover:bg-amber-100 dark:hover:bg-amber-950/30")}>
                    €{v}
                  </button>
                ))}
              </div>
              <span>€200</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-bold flex items-center gap-1.5 mb-3"><Clock className="w-4 h-4 text-amber-500" /> Duración</label>
            <div className="flex gap-2 flex-wrap">
              {DURATION_OPTIONS.map(opt => (
                <button key={opt.days} onClick={() => setDuration(opt.days)}
                  className={cn("px-3 py-2 rounded-xl text-sm font-bold transition-all border-2",
                    duration === opt.days
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 scale-105 shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-amber-200")}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="text-sm font-bold flex items-center gap-1.5 mb-3"><Target className="w-4 h-4 text-amber-500" /> Audiencia</label>
            <div className="space-y-2">
              {AUDIENCE_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setAudience(opt.id)}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                    audience === opt.id ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-border bg-card hover:border-amber-200 dark:hover:border-amber-800")}>
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", audience === opt.id ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground")}>
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {audience === opt.id && <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Coste por día</span>
              <span className="font-bold">€{(budget / duration).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Duración</span>
              <span className="font-bold">{duration} {duration === 1 ? "día" : "días"}</span>
            </div>
            <div className="border-t border-amber-200 pt-2 flex justify-between">
              <span className="font-black">Total</span>
              <span className="text-lg font-black text-amber-600">€{budget}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-base shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 glow-primary"
          >
            {paying ? (
              <>
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Impulsar por €{budget}
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-2">El impulso se activa de inmediato. Sin permanencia.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
