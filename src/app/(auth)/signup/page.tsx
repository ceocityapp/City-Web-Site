"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { translateAuthError } from "@/lib/auth-errors";

function getPasswordStrength(p: string) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
const STRENGTH_COLORS = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-primary"];

export default function SignupPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (!acceptTerms) { setError("Debes aceptar los términos y condiciones"); return; }
    setLoading(true);
    try { await signUpWithEmail(email, password); router.push("/feed"); } catch (err: unknown) {
      setError(translateAuthError(err, "No se pudo crear la cuenta"));
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); } catch (err: unknown) {
      setError(translateAuthError(err, "Error al registrarse con Google"));
    }
  };

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
          <h1 className="text-2xl font-black">Crea tu cuenta</h1>
          <p className="text-muted-foreground mt-1">Únete a la comunidad de tu ciudad</p>
        </div>
        <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xl shadow-black/5">
          <Button variant="outline" className="w-full h-12 rounded-full mb-6 font-bold" onClick={handleGoogle}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </Button>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">o continúa con email</span></div>
          </div>
          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input type="email" autoComplete="email" placeholder="Email" className="pl-10 h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Contraseña" className="pl-10 pr-10 h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLORS[strength] : "bg-muted"}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-muted-foreground">{STRENGTH_LABELS[Math.max(0, strength - 1)] || STRENGTH_LABELS[0]}</span>
                    <div className="flex gap-2 text-muted-foreground">
                      <span className={`flex items-center gap-0.5 ${passwordChecks.length ? "text-primary" : ""}`}>
                        {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8+
                      </span>
                      <span className={`flex items-center gap-0.5 ${passwordChecks.upper ? "text-primary" : ""}`}>
                        {passwordChecks.upper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} A-Z
                      </span>
                      <span className={`flex items-center gap-0.5 ${passwordChecks.number ? "text-primary" : ""}`}>
                        {passwordChecks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 0-9
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirmar contraseña" className={`pl-10 pr-10 h-12 rounded-xl ${confirmPassword.length > 0 && !passwordChecks.match ? "border-red-300" : ""}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {confirmPassword.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordChecks.match ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-red-500" />}
                  </span>
                )}
              </div>
              {confirmPassword.length > 0 && !passwordChecks.match && (
                <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">Las contraseñas no coinciden</p>
              )}
            </div>
            <label className="flex items-start gap-2 cursor-pointer select-none text-xs">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-muted-foreground">
                Acepto los <Link href="/terms" className="text-primary font-bold hover:underline">Términos y condiciones</Link> y la <Link href="/privacy" className="text-primary font-bold hover:underline">Política de privacidad</Link>
              </span>
            </label>
            <Button type="submit" className="w-full h-12 rounded-full bg-primary font-bold" disabled={loading || !acceptTerms}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes cuenta?{" "}<Link href="/login" className="text-primary font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
