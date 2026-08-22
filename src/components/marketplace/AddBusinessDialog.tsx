"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Store, ImageIcon, X, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { imageFallback } from "@/lib/image-fallback";

const SHOP_CATEGORIES = [
  "Restaurantes", "Cafetería", "Tiendas", "Librería", "Panadería",
  "Servicios", "Ocio", "Salud", "Belleza", "Peluquería", "Alimentación",
  "Deportes", "Educación", "Otro",
];

export function AddBusinessDialog() {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Restaurantes");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setStep(1); setName(""); setCategory("Restaurantes"); setDescription("");
    setAddress(""); setPhone(""); setEmail(""); setHours(""); setBanner(null); setError("");
  };

  const close = () => { setOpen(false); reset(); };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) { setError("Añade el nombre del negocio"); return; }
      if (!description.trim()) { setError("Añade una descripción"); return; }
    }
    setStep(step + 1);
  };

  const canAdvance = step === 1 ? name.trim() !== "" && description.trim() !== "" : step === 2 ? address.trim() !== "" : true;

  const handleSubmit = async () => {
    setError("");
    if (!address.trim()) { setError("Añade la dirección"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    close();
    success("Negocio publicado", "Tu negocio ya está visible en el mercado");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else setOpen(true); }}>
      <DialogTrigger className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 h-10 inline-flex items-center text-sm shadow-md transition-colors">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Añadir negocio</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-black">Añadir negocio</h2>
            <p className="text-xs text-muted-foreground">Paso {step} de 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-8 h-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{error}</div>}

          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Nombre del negocio <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Ej: Tatau Bistro"
                  className="rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && canAdvance) nextStep(); }}
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {SHOP_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        category === cat ? "bg-foreground text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Descripción <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">({description.length}/300)</span></label>
                <Textarea placeholder="Describe tu negocio..." className="rounded-xl min-h-[100px] resize-none" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 300))} maxLength={300} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Foto del negocio</label>
                {banner ? (
                  <div className="relative rounded-xl overflow-hidden h-40">
                    <img src={banner} alt="" onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <button onClick={() => setBanner(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setBanner("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=60")}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                    <span className="text-sm text-muted-foreground font-medium">Añade una foto destacada</span>
                  </button>
                )}
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej: Calle Coso Alto 12, Huesca"
                    className="pl-9 rounded-xl"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && canAdvance) nextStep(); }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Horario</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej: Lun-Vie 9:00-21:00"
                    className="pl-9 rounded-xl"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && canAdvance) nextStep(); }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Teléfono de contacto</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="tel" placeholder="+34 974 000 000" className="pl-9 rounded-xl" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Email (opcional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="contacto@negocio.es" className="pl-9 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <p className="text-sm font-bold mb-1">¿Listo para publicar?</p>
                <p className="text-xs text-muted-foreground">Tu negocio aparecerá en el mercado de Huesca y podrás añadir productos y servicios después.</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/30">
          <button
            onClick={() => step === 1 ? close() : setStep(step - 1)}
            className="text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            {step === 1 ? "Cancelar" : "Atrás"}
          </button>
          {step < 3 ? (
            <Button onClick={nextStep} className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold">Siguiente</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
              {submitting ? "Publicando..." : <><Store className="w-4 h-4" /> Publicar negocio</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
