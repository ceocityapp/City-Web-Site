"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, User, AtSign, FileText, ArrowRight, Check, X } from "lucide-react";
import { imageFallback } from "@/lib/image-fallback";

const INTERESTS = [
  "Gastronomía", "Senderismo", "Running", "Escalada", "Fotografía",
  "Música", "Lectura", "Tecnología", "Familia", "Cultura",
  "Deportes", "Emprendimiento", "Arte", "Viajes", "Naturaleza",
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest); else next.add(interest);
      return next;
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // TODO: Wire to backend
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/feed");
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s <= step ? "bg-primary w-12" : "bg-muted w-8"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-black">Completa tu perfil</h1>
              <p className="text-muted-foreground mt-1">Cuéntanos un poco sobre ti</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xl shadow-black/5 space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-center mb-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground/40" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvatarInput((prev) => !prev);
                      setAvatarInput(avatarUrl);
                    }}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    {showAvatarInput ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  </button>
                </div>
                {showAvatarInput && (
                  <div className="flex items-center gap-2 mt-3 w-full max-w-xs">
                    <Input
                      placeholder="URL de tu foto"
                      className="h-9 rounded-xl text-sm flex-1"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-xl bg-primary font-bold h-9 px-3"
                      disabled={!avatarInput.trim()}
                      onClick={() => {
                        setAvatarUrl(avatarInput.trim());
                        setShowAvatarInput(false);
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">Nombre completo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input autoComplete="name" placeholder="Tu nombre" className="pl-9 h-11 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">Nombre de usuario <span className="text-red-500">*</span></label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input autoComplete="username" placeholder="tu_usuario" className="pl-9 h-11 rounded-xl" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block">Bio <span className="font-normal text-muted-foreground">({bio.length}/160)</span></label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    placeholder="Cuéntanos algo sobre ti..."
                    className="flex w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none h-20"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    maxLength={160}
                  />
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-full bg-primary font-bold"
                disabled={!name.trim() || !username.trim()}
                onClick={() => setStep(2)}
              >
                Siguiente <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl font-black">¿Qué te interesa?</h1>
              <p className="text-muted-foreground mt-1">Selecciona tus intereses para personalizar tu experiencia</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xl shadow-black/5">
              <div className="flex flex-wrap gap-2 mb-6">
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.has(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        selected
                          ? "bg-foreground text-white"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 inline mr-1" />}
                      {interest}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground text-center mb-4">
                Seleccionados: {selectedInterests.size} / {INTERESTS.length}
              </p>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-full font-bold" onClick={() => setStep(1)}>
                  Atrás
                </Button>
                <Button
                  className="flex-1 h-12 rounded-full bg-primary font-bold"
                  disabled={selectedInterests.size === 0}
                  onClick={() => setStep(3)}
                >
                  Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-black">¡Todo listo!</h1>
              <p className="text-muted-foreground mt-1">Tu perfil está listo para empezar</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xl shadow-black/5 text-center">
              {/* Profile preview */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>
              <h2 className="text-lg font-black">{name}</h2>
              <p className="text-sm text-muted-foreground mb-2">@{username}</p>
              {bio && <p className="text-sm text-foreground/80 mb-4">{bio}</p>}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {Array.from(selectedInterests).slice(0, 5).map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
                {selectedInterests.size > 5 && (
                  <Badge variant="secondary" className="text-xs">+{selectedInterests.size - 5}</Badge>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-full font-bold" onClick={() => setStep(2)}>
                  Atrás
                </Button>
                <Button className="flex-1 h-12 rounded-full bg-primary font-bold" onClick={handleComplete} disabled={loading}>
                  {loading ? "Guardando..." : "Empezar a explorar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
