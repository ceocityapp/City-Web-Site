"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  ChevronRight,
  ChevronDown,
  MapPin,
  Sun,
  Moon,
  Check,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

type SettingsItem = {
  icon: typeof User;
  label: string;
  desc: string;
  href?: string;
  expandable?: boolean;
};

const sections: Array<{ title: string; items: SettingsItem[] }> = [
  {
    title: "Cuenta",
    items: [
      { icon: User, label: "Editar perfil", desc: "Nombre, biografía, avatar", href: "/profile" },
      { icon: Shield, label: "Privacidad", desc: "Visibilidad del perfil, usuarios bloqueados", expandable: true },
      { icon: Bell, label: "Notificaciones", desc: "Push, preferencias de email", href: "/notifications" },
      { icon: MapPin, label: "Ubicación", desc: "Ciudad y ajustes de localización", expandable: true },
    ],
  },
  {
    title: "Preferencias",
    items: [
      { icon: Palette, label: "Apariencia", desc: "Tema, idioma", expandable: true },
    ],
  },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [city, setCity] = useState("Huesca");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("city-theme") as "light" | "dark" | null;
      const savedCity = localStorage.getItem("city-pref-city");
      const savedPrivacy = localStorage.getItem("city-private-profile");
      if (savedTheme) setTheme(savedTheme);
      if (savedCity) setCity(savedCity);
      if (savedPrivacy === "true") setPrivateProfile(true);
    } catch {
      // localStorage not available
    }
  }, []);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem("city-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch { /* noop */ }
  }, [theme]);

  // Persist city
  useEffect(() => {
    try { localStorage.setItem("city-pref-city", city); } catch { /* noop */ }
  }, [city]);

  // Persist privacy
  useEffect(() => {
    try { localStorage.setItem("city-private-profile", String(privateProfile)); } catch { /* noop */ }
  }, [privateProfile]);

  const flashSaved = (label: string) => {
    setSaved(label);
    setTimeout(() => setSaved((s) => (s === label ? null : s)), 1500);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const toggleExpanded = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Page header */}
      <AnimatedSection animation="fade-up">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          aria-label="Volver al perfil"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black leading-tight">Ajustes</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu cuenta y preferencias</p>
        </div>
      </div>
      </AnimatedSection>

      {/* Verified banner */}
      {user && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">Cuenta verificada</p>
            <p className="text-xs text-muted-foreground">Tu identidad ha sido confirmada</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <AnimatedSection key={section.title} delay={sectionIndex * 80} animation="fade-up">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
              {section.items.map((item) => {
                const isExpanded = expanded === item.label;

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  );
                }

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* Inline expanded — Privacidad */}
                    {isExpanded && item.label === "Privacidad" && (
                      <div className="bg-muted/50 rounded-xl p-4 mx-4 mb-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="text-sm font-semibold">Perfil privado</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Solo tus seguidores podrán ver tus publicaciones
                            </p>
                          </div>
                          <button
                            aria-label="Activar perfil privado"
                            onClick={() => { setPrivateProfile((p) => !p); flashSaved("privacy"); }}
                            className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ml-4 ${
                              privateProfile ? "bg-primary" : "bg-muted-foreground/30"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                                privateProfile ? "translate-x-6" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </label>
                        {saved === "privacy" && (
                          <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Guardado
                          </p>
                        )}
                      </div>
                    )}

                    {/* Inline expanded — Ubicación */}
                    {isExpanded && item.label === "Ubicación" && (
                      <div className="bg-muted/50 rounded-xl p-4 mx-4 mb-3 space-y-2">
                        <p className="text-sm font-semibold">Ciudad</p>
                        <select
                          value={city}
                          onChange={(e) => { setCity(e.target.value); flashSaved("city"); }}
                          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option>Huesca</option>
                          <option>Zaragoza</option>
                          <option>Teruel</option>
                          <option>Madrid</option>
                          <option>Barcelona</option>
                        </select>
                        {saved === "city" && (
                          <p className="text-xs text-primary font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Guardado
                          </p>
                        )}
                      </div>
                    )}

                    {/* Inline expanded — Apariencia */}
                    {isExpanded && item.label === "Apariencia" && (
                      <div className="bg-muted/50 rounded-xl p-4 mx-4 mb-3 space-y-3">
                        <p className="text-sm font-semibold">Tema</p>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Light card */}
                          <button
                            onClick={() => { setTheme("light"); flashSaved("theme"); }}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              theme === "light"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/30 bg-card"
                            }`}
                          >
                            {theme === "light" && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </span>
                            )}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "light" ? "bg-primary/10" : "bg-muted"}`}>
                              <Sun className={`w-5 h-5 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`text-sm font-semibold ${theme === "light" ? "text-primary" : "text-foreground"}`}>Sol</span>
                          </button>

                          {/* Dark card */}
                          <button
                            onClick={() => { setTheme("dark"); flashSaved("theme"); }}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              theme === "dark"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/30 bg-card"
                            }`}
                          >
                            {theme === "dark" && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </span>
                            )}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-primary/10" : "bg-muted"}`}>
                              <Moon className={`w-5 h-5 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`text-sm font-semibold ${theme === "dark" ? "text-primary" : "text-foreground"}`}>Luna</span>
                          </button>
                        </div>
                        {saved === "theme" && (
                          <p className="text-xs text-primary font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Guardado
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </AnimatedSection>
        ))}

        {/* Danger zone — sign out */}
        <AnimatedSection delay={160} animation="fade-up">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Zona de cuenta
          </h2>
          <div className="border border-destructive/20 bg-destructive/5 rounded-2xl overflow-hidden">
            {!confirmingSignOut ? (
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-destructive/10 transition-colors text-left"
                onClick={() => setConfirmingSignOut(true)}
              >
                <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-destructive">Cerrar sesión</p>
                  <p className="text-xs text-muted-foreground">Salir de tu cuenta</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">¿Cerrar sesión?</p>
                    <p className="text-xs text-muted-foreground">Tendrás que volver a introducir tus credenciales</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl font-bold"
                    onClick={() => setConfirmingSignOut(false)}
                    disabled={signingOut}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 rounded-xl gap-1.5 font-bold"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    <LogOut className="w-4 h-4" />
                    {signingOut ? "Cerrando..." : "Sí, cerrar"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
