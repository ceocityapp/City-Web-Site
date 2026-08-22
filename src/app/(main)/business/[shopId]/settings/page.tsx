"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Store, Clock, Phone, Mail, MapPin, Camera,
  Save, Trash2,
} from "lucide-react";
import { HUESCA_SHOPS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";

export default function BusinessSettingsPage() {
  const { shopId } = useParams();
  const router = useRouter();
  const shop = HUESCA_SHOPS.find((s) => s.id === Number(shopId));

  const [name, setName] = useState(shop?.name || "");
  const [description, setDescription] = useState(shop?.description || "");
  const [address, setAddress] = useState(shop?.address || "");
  const [phone, setPhone] = useState(shop?.phone || "");
  const [email, setEmail] = useState(shop?.email || "");
  const [hours, setHours] = useState(shop?.opening_hours || "");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initialValues = useMemo(() => ({
    name: shop?.name || "",
    description: shop?.description || "",
    address: shop?.address || "",
    phone: shop?.phone || "",
    email: shop?.email || "",
    hours: shop?.opening_hours || "",
  }), [shop]);

  const isDirty = name !== initialValues.name || description !== initialValues.description || address !== initialValues.address || phone !== initialValues.phone || email !== initialValues.email || hours !== initialValues.hours;

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Negocio no encontrado</h1>
        <Link href="/business"><Button className="rounded-full bg-primary font-bold mt-4">Mis negocios</Button></Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!isDirty) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteBusiness = () => {
    setShowDeleteConfirm(false);
    router.push("/business");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href={`/business/${shopId}/dashboard`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard de {shop.name}
      </Link>

      <h1 className="text-2xl font-black mb-6">Ajustes del negocio</h1>

      {/* Cover image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-40 bg-muted">
        {shop.image_url && <img src={shop.image_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />}
        <button className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-black/70 transition-colors">
          <Camera className="w-3 h-3" /> Cambiar portada
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-black mb-4 flex items-center gap-2"><Store className="w-5 h-5" /> Información básica</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">Nombre del negocio</label>
              <Input className="rounded-xl h-11" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Descripción</label>
              <textarea
                className="flex w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-black mb-4 flex items-center gap-2"><Phone className="w-5 h-5" /> Contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 rounded-xl h-11" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-1.5 block">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 rounded-xl h-11" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 rounded-xl h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-black mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Horario de apertura</h2>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Horarios</label>
            <Input className="rounded-xl h-11" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Ej: Lun-Vie 9:00-20:00, Sáb 10:00-14:00" />
            <p className="text-xs text-muted-foreground mt-1.5">Describe tus horarios de apertura</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="rounded-full font-bold text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar negocio
          </Button>
          <Button className="rounded-full bg-primary font-bold px-8" onClick={handleSave} disabled={!isDirty || saved}>
            <Save className="w-4 h-4 mr-1.5" /> {saved ? "Guardado!" : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Save toast */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg animate-in fade-in slide-in-from-bottom-4">
          Cambios guardados correctamente
        </div>
      )}

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-black mb-2">Eliminar negocio</h2>
            <p className="text-sm text-muted-foreground mb-5">Estas seguro de que quieres eliminar {shop.name}? Esta accion no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded-full font-bold" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button className="rounded-full bg-red-500 hover:bg-red-600 text-white font-bold" onClick={handleDeleteBusiness}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
