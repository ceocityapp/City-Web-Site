"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      // TODO: Wire to Supabase resetPasswordForEmail
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black mb-2">Email enviado</h1>
          <p className="text-muted-foreground mb-6">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link href="/login">
            <Button className="rounded-full bg-primary font-bold h-12 px-8">Volver a iniciar sesión</Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            ¿No recibiste el email?{" "}
            <button onClick={() => setSent(false)} className="text-primary font-medium hover:underline">Reenviar</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">City App</span>
          </Link>
          <h1 className="text-2xl font-black">Recuperar contraseña</h1>
          <p className="text-muted-foreground mt-1">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xl shadow-black/5">
          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                autoComplete="email"
                placeholder="Tu email"
                className="pl-10 h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-full bg-primary font-bold" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
