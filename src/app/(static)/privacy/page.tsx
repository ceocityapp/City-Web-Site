import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad y tratamiento de datos personales de City App conforme al RGPD.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Política de Privacidad</h1>
            <p className="text-sm text-muted-foreground">Última actualización: Mayo 2026</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">1. Responsable del tratamiento</h2>
            <p className="text-foreground/80 leading-relaxed">
              City App S.L. (en adelante, &quot;City App&quot;) es la responsable del tratamiento de los datos personales recogidos a través de la plataforma City App y sus servicios asociados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">2. Datos que recopilamos</h2>
            <p className="text-foreground/80 leading-relaxed mb-3">Recopilamos los siguientes datos personales:</p>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Datos de registro: nombre, email, foto de perfil</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Datos de perfil: bio, intereses, ubicación</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Contenido publicado: posts, comentarios, fotos</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Datos de uso: interacciones, búsquedas, preferencias</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Datos de pago: procesados de forma segura a través de Stripe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">3. Finalidad del tratamiento</h2>
            <p className="text-foreground/80 leading-relaxed">
              Utilizamos tus datos para proporcionar y mejorar nuestros servicios, personalizar tu experiencia, facilitar la comunicación entre usuarios y negocios locales, procesar transacciones y enviarte notificaciones relevantes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">4. Bases legales</h2>
            <p className="text-foreground/80 leading-relaxed">
              El tratamiento de tus datos se basa en: tu consentimiento explícito, la ejecución del contrato de servicio, el cumplimiento de obligaciones legales, y nuestro interés legítimo en mejorar la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">5. Tus derechos</h2>
            <p className="text-foreground/80 leading-relaxed mb-3">Conforme al RGPD, tienes derecho a:</p>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Acceder a tus datos personales</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Rectificar datos inexactos</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Solicitar la supresión de tus datos</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Oponerte al tratamiento</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> Portar tus datos a otro servicio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">6. Contacto</h2>
            <p className="text-foreground/80 leading-relaxed">
              Para cualquier consulta sobre privacidad, puedes contactarnos en{" "}
              <a href="mailto:privacidad@cityapp.es" className="text-primary font-medium hover:underline">privacidad@cityapp.es</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
