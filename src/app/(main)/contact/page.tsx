"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail, Phone, MapPin, Send, Check, MessageCircle,
  Clock, HelpCircle, Bug, Lightbulb, AlertTriangle,
} from "lucide-react";

const TOPICS = [
  { id: "general", label: "Consulta general", icon: MessageCircle },
  { id: "bug", label: "Reportar error", icon: Bug },
  { id: "suggestion", label: "Sugerencia", icon: Lightbulb },
  { id: "business", label: "Negocios", icon: MapPin },
  { id: "complaint", label: "Reclamación", icon: AlertTriangle },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Introduce un email válido";
    if (!message.trim()) newErrors.message = "El mensaje es obligatorio";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-black mb-2">Mensaje enviado</h1>
        <p className="text-muted-foreground mb-6">Hemos recibido tu mensaje. Te responderemos en un plazo de 24-48 horas.</p>
        <Button className="rounded-full bg-primary font-bold" onClick={() => setSent(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-black">Contacto</h1>
        <p className="text-muted-foreground mt-1">Estamos aquí para ayudarte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold mb-1.5 block">Nombre</label>
                  <Input autoComplete="name" className="rounded-xl h-11" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold mb-1.5 block">Email</label>
                  <Input autoComplete="email" className="rounded-xl h-11" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">Tema</label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                        topic === t.id ? "bg-foreground text-white" : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">
                  Mensaje <span className="font-normal text-muted-foreground">({message.length}/1000)</span>
                </label>
                <textarea
                  className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none h-36"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                  maxLength={1000}
                  required
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" disabled={sending} className="rounded-full bg-primary font-bold h-12 px-8">
                {sending ? "Enviando..." : <><Send className="w-4 h-4 mr-2" /> Enviar mensaje</>}
              </Button>
            </form>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-black mb-4">Información de contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">hola@cityapp.es</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium">+34 974 000 000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="text-sm font-medium">Huesca, España</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horario de atención</p>
                  <p className="text-sm font-medium">Lun-Vie 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-5 text-center">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm font-bold mb-1">¿Preguntas frecuentes?</p>
            <p className="text-xs text-muted-foreground mb-3">Consulta nuestro centro de ayuda</p>
            <Link href="/help">
              <Button variant="outline" size="sm" className="rounded-full font-bold text-xs">
                Ver FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
