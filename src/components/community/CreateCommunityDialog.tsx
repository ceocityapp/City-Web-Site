"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Globe, Lock, ImageIcon, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { imageFallback } from "@/lib/image-fallback";

const CATEGORIES = [
  "Deportes", "Gastronomía", "Arte y Cultura", "Negocios",
  "Familia", "Educación", "Tecnología", "Otro",
];

export function CreateCommunityDialog() {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Deportes");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName(""); setDescription(""); setCategory("Deportes");
    setPrivacy("public"); setBanner(null); setError("");
  };

  const close = () => { setOpen(false); reset(); };

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Añade un nombre"); return; }
    if (!description.trim()) { setError("Añade una descripción"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    close();
    success("Comunidad creada", "Tu comunidad ya está disponible");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else setOpen(true); }}>
      <DialogTrigger className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 h-10 inline-flex items-center text-sm shadow-md transition-colors">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Crear comunidad</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-black">Crear comunidad</h2>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{error}</div>}

          {/* Banner */}
          <div>
            <label className="text-sm font-bold mb-1.5 block">Foto de portada</label>
            {banner ? (
              <div className="relative rounded-xl overflow-hidden h-32">
                <img src={banner} alt="" onError={imageFallback} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <button onClick={() => setBanner(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBanner("https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=60")}
                className="w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                <span className="text-sm text-muted-foreground font-medium">Añade una foto de portada</span>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-bold mb-1.5 block">Nombre de la comunidad</label>
            <Input placeholder="Ej: Runners Huesca" className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-bold mb-2 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
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

          {/* Privacy */}
          <div>
            <label className="text-sm font-bold mb-2 block">Privacidad</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPrivacy("public")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                  privacy === "public" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold">Pública</span>
              </button>
              <button
                onClick={() => setPrivacy("private")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                  privacy === "private" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-bold">Privada</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold mb-1.5 block">Descripción</label>
            <Textarea placeholder="Describe de qué trata tu comunidad..." className="rounded-xl min-h-[100px] resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/30">
          <button onClick={close} className="text-sm text-muted-foreground hover:text-foreground font-medium">Cancelar</button>
          <Button onClick={handleSubmit} disabled={submitting} className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
            {submitting ? "Creando..." : <><Users className="w-4 h-4" /> Crear</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
