import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de la plataforma City App.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Términos y Condiciones</h1>
            <p className="text-sm text-muted-foreground">Última actualización: Mayo 2026</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">1. Aceptación de los términos</h2>
            <p className="text-foreground/80 leading-relaxed">
              Al acceder y utilizar City App, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no deberás utilizar la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">2. Descripción del servicio</h2>
            <p className="text-foreground/80 leading-relaxed">
              City App es una plataforma de comercio social que conecta a residentes y visitantes con negocios locales, comunidades y eventos de su ciudad. Los servicios incluyen: feed social, marketplace, comunidades, mensajería, ofertas de empleo y eventos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">3. Registro y cuenta</h2>
            <p className="text-foreground/80 leading-relaxed">
              Para utilizar City App necesitas crear una cuenta proporcionando información veraz y actualizada. Eres responsable de mantener la seguridad de tu cuenta y contraseña. Debes ser mayor de 16 años para registrarte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">4. Contenido del usuario</h2>
            <p className="text-foreground/80 leading-relaxed">
              Eres responsable del contenido que publicas. No se permite contenido ilegal, ofensivo, difamatorio o que viole derechos de terceros. City App se reserva el derecho de eliminar contenido que viole estas normas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">5. Negocios y marketplace</h2>
            <p className="text-foreground/80 leading-relaxed">
              Los negocios registrados en City App son responsables de la veracidad de su información, productos y servicios. City App actúa como intermediario y no se hace responsable de las transacciones entre usuarios y negocios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">6. Pagos y transacciones</h2>
            <p className="text-foreground/80 leading-relaxed">
              Los pagos se procesan de forma segura a través de proveedores de pago certificados. City App puede cobrar comisiones por transacciones realizadas a través del marketplace. Los precios incluyen IVA salvo indicación contraria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">7. Propiedad intelectual</h2>
            <p className="text-foreground/80 leading-relaxed">
              La marca City App, el diseño, código y contenido original de la plataforma son propiedad de City App S.L. El contenido generado por usuarios sigue siendo de su propiedad, otorgando a City App una licencia de uso limitada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-black mb-3">8. Contacto</h2>
            <p className="text-foreground/80 leading-relaxed">
              Para consultas legales:{" "}
              <a href="mailto:legal@cityapp.es" className="text-primary font-medium hover:underline">legal@cityapp.es</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
