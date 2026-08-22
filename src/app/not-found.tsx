import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[120px] font-black text-muted/50 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-black mb-2">Página no encontrada</h1>
        <p className="text-muted-foreground mb-8">
          La página que buscas no existe o ha sido movida. Puede que el enlace esté roto o que hayas escrito la dirección incorrectamente.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/feed">
            <Button className="rounded-full bg-primary font-bold h-11 px-6">
              <Home className="w-4 h-4 mr-2" /> Ir al tablón
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full font-bold h-11 px-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Página principal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
