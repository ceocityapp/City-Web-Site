"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-black mb-2">Algo salió mal</h1>
        <p className="text-muted-foreground mb-8">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando en solucionarlo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} className="rounded-full bg-primary font-bold h-11 px-6">
            <RefreshCw className="w-4 h-4 mr-2" /> Intentar de nuevo
          </Button>
          <Link href="/feed">
            <Button variant="outline" className="rounded-full font-bold h-11 px-6">
              <Home className="w-4 h-4 mr-2" /> Ir al tablón
            </Button>
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-muted-foreground mt-6">
            Código de error: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
