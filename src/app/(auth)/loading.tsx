import { MapPin } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center animate-pulse">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-bold text-muted-foreground">Cargando City App...</p>
      </div>
    </div>
  );
}
