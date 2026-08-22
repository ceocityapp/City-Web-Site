"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Camera, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface EditProfileDialogProps {
  profile: {
    name: string;
    username: string;
    bio: string;
    website_url: string | null;
  };
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [website, setWebsite] = useState(profile.website_url || "");
  const [submitting, setSubmitting] = useState(false);
  const { success } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setOpen(false);
    success("Perfil actualizado", "Tus cambios se han guardado");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-full gap-1 bg-primary hover:bg-primary/90 text-white font-bold px-4 h-9 inline-flex items-center text-sm shadow-sm transition-colors">
        <Edit className="w-4 h-4" /> Editar perfil
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-black">Editar perfil</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner */}
        <div className="relative h-32 bg-primary/10">
          <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors opacity-0 hover:opacity-100 text-white">
            <Camera className="w-8 h-8" />
          </button>
        </div>

        {/* Avatar */}
        <div className="px-5 -mt-10 mb-4 relative">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary text-white text-xl font-black">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-foreground text-white flex items-center justify-center border-2 border-background">
              <Camera className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-5 pt-0 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-sm font-bold mb-1.5 block">Nombre</label>
            <Input className="rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Nombre de usuario</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <Input className="pl-7 rounded-xl" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Biografía</label>
            <Textarea placeholder="Cuéntanos algo sobre ti..." className="rounded-xl resize-none min-h-[80px]" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} />
            <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/160</p>
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Sitio web</label>
            <Input placeholder="ejemplo.com" className="rounded-xl" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30">
          <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground font-medium px-4">Cancelar</button>
          <Button onClick={handleSubmit} disabled={submitting} className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold">
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
