"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, FileText, MessageSquare, Briefcase, Calendar, Image, Video, X, Send, BarChart3,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { imageFallback } from "@/lib/image-fallback";

const postTypes = [
  { id: "post", label: "Post", icon: FileText, desc: "Comparte algo", color: "from-blue-500 to-blue-600" },
  { id: "forum", label: "Foro", icon: MessageSquare, desc: "Inicia un debate", color: "from-violet-500 to-purple-600" },
  { id: "job", label: "Trabajo", icon: Briefcase, desc: "Publica una oferta", color: "from-amber-500 to-orange-600" },
  { id: "event", label: "Evento", icon: Calendar, desc: "Crea un evento", color: "from-rose-500 to-pink-600" },
];

export function CreatePostDialog({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [eventDateFrom, setEventDateFrom] = useState("");
  const [eventDateTo, setEventDateTo] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const reset = () => {
    setSelectedType(null); setTitle(""); setBody(""); setLocation(""); setSalary("");
    setQualifications(""); setEventDateFrom(""); setEventDateTo(""); setImagePreview(null);
    setImageUrl(""); setShowImageInput(false);
    setPollEnabled(false); setPollOptions(["", ""]); setError("");
  };

  const handleClose = () => { setOpen(false); reset(); };

  const handleSubmit = async () => {
    if (!title.trim() && selectedType !== "post") { setError("Añade un título"); return; }
    if (!body.trim() && !title.trim()) { setError("Escribe algo para publicar"); return; }
    setSubmitting(true);
    // Simulate publish
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    handleClose();
    success("Publicado", "Tu publicación se ha compartido");
    // In production: api.createPost(data)
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger
        className={
          variant === "sidebar"
            ? "w-full rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-10 inline-flex items-center justify-center text-sm shadow-md transition-colors"
            : "rounded-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-5 h-10 inline-flex items-center text-sm shadow-md transition-colors"
        }
      >
        <Plus className="w-4 h-4" /> Publicar
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-lg font-bold">
            {selectedType ? postTypes.find((t) => t.id === selectedType)?.label : "¿Qué quieres publicar?"}
          </h2>
          {selectedType && (
            <button onClick={() => setSelectedType(null)} className="text-sm text-primary font-medium hover:underline">Cambiar tipo</button>
          )}
        </div>

        {/* Type Selector */}
        {!selectedType ? (
          <div className="p-5 grid grid-cols-2 gap-3">
            {postTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/60 hover:border-primary/30 hover:shadow-md transition-all text-center group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{error}</div>}

            {/* Title */}
            {selectedType !== "post" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Título</label>
                <Input
                  placeholder={selectedType === "forum" ? "Tema del foro" : selectedType === "job" ? "Puesto de trabajo" : "Nombre del evento"}
                  className="rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (title.trim() && body.trim()) {
                        handleSubmit();
                      } else {
                        bodyRef.current?.focus();
                      }
                    }
                  }}
                />
              </div>
            )}

            {/* Body */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {selectedType === "post" ? "¿Qué quieres compartir?" : "Descripción"} <span className="text-red-500">*</span> <span className="font-normal text-muted-foreground">({body.length}/500)</span>
              </label>
              <Textarea
                ref={bodyRef}
                placeholder={selectedType === "post" ? "Comparte algo con tu ciudad..." : selectedType === "forum" ? "Describe el tema a debatir..." : "Descripción..."}
                className="rounded-xl min-h-[100px] resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 500))}
                maxLength={500}
              />
            </div>

            {/* Forum poll */}
            {selectedType === "forum" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Añadir encuesta
                  </label>
                  <button
                    onClick={() => setPollEnabled(!pollEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${pollEnabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${pollEnabled ? "translate-x-4" : ""}`} />
                  </button>
                </div>
                {pollEnabled && (
                  <div className="space-y-2">
                    {pollOptions.map((opt, i) => (
                      <Input key={i} placeholder={`Opción ${i + 1}`} className="rounded-lg" value={opt} onChange={(e) => { const n = [...pollOptions]; n[i] = e.target.value; setPollOptions(n); }} />
                    ))}
                    {pollOptions.length < 4 && (
                      <button onClick={addPollOption} className="text-sm text-primary font-medium hover:underline">+ Añadir opción</button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Job fields */}
            {selectedType === "job" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ubicación</label>
                  <Input placeholder="Ej: Centro" className="rounded-xl" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Salario</label>
                  <Input placeholder="Ej: €25/h" className="rounded-xl" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Cualidades requeridas</label>
                  <Textarea placeholder="Experiencia necesaria, habilidades..." className="rounded-xl resize-none" value={qualifications} onChange={(e) => setQualifications(e.target.value)} />
                </div>
              </div>
            )}

            {/* Event fields */}
            {selectedType === "event" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fecha inicio</label>
                  <Input type="date" className="rounded-xl" value={eventDateFrom} onChange={(e) => setEventDateFrom(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fecha fin</label>
                  <Input type="date" className="rounded-xl" value={eventDateTo} onChange={(e) => setEventDateTo(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Ubicación</label>
                  <Input placeholder="Ej: Plaza Mayor" className="rounded-xl" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
            )}

            {/* Media */}
            {(selectedType === "post" || selectedType === "event") && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Media (opcional)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="" loading="lazy" decoding="async" className="w-full h-40 object-cover" onError={imageFallback} />
                    <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-sm ${showImageInput ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}
                      >
                        <Image className="w-4 h-4 text-primary" /> Imagen
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm">
                        <Video className="w-4 h-4 text-primary" /> Vídeo
                      </button>
                    </div>
                    {showImageInput && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Pega la URL de una imagen..."
                          className="rounded-xl text-sm"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        {imageUrl.trim() && (
                          <div className="relative rounded-xl overflow-hidden">
                            <img src={imageUrl} alt="" loading="lazy" decoding="async" className="w-full h-40 object-cover" onLoad={() => {}} onError={() => {}} />
                            <button
                              onClick={() => { setImagePreview(imageUrl); setImageUrl(""); setShowImageInput(false); }}
                              className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow hover:bg-primary/90 transition-colors"
                            >
                              Usar imagen
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {selectedType && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/60 bg-muted/30">
            <button onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
            <Button onClick={handleSubmit} disabled={submitting} className="rounded-full gap-2 bg-primary font-bold">
              {submitting ? "Publicando..." : <><Send className="w-4 h-4" /> Publicar</>}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
