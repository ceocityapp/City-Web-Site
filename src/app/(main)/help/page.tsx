"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, ChevronDown, HelpCircle, ShoppingBag, Users, MessageCircle,
  Shield, User, Briefcase, Mail,
} from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Primeros pasos",
    icon: User,
    faqs: [
      { q: "¿Cómo creo una cuenta en City App?", a: "Puedes registrarte con tu email o con Google. Ve a la página de registro, introduce tus datos y confirma tu email. Una vez registrado, completa tu perfil para personalizar tu experiencia." },
      { q: "¿City App es gratuito?", a: "Sí, City App es totalmente gratuito para los usuarios. Puedes explorar negocios, unirte a comunidades, chatear y participar en eventos sin coste alguno." },
      { q: "¿En qué ciudades está disponible?", a: "Actualmente estamos centrados en Huesca, con planes de expansión a otras ciudades españolas como Zaragoza, Barcelona, Madrid y más. Puedes consultar todas las ciudades disponibles en la sección Explorar." },
      { q: "¿Cómo cambio mi ciudad?", a: "Puedes cambiar de ciudad desde el selector en la barra superior o desde la página de Explorar. Tu selección se guardará automáticamente." },
    ],
  },
  {
    title: "Mercado y compras",
    icon: ShoppingBag,
    faqs: [
      { q: "¿Cómo compro productos?", a: "Navega al Mercado, elige una tienda, añade productos al carrito y procede al pago. Aceptamos pagos seguros con tarjeta a través de Stripe." },
      { q: "¿Puedo hacer devoluciones?", a: "Las políticas de devolución dependen de cada negocio. Contacta directamente con la tienda a través de la plataforma para gestionar tu devolución." },
      { q: "¿Los precios incluyen IVA?", a: "Sí, todos los precios mostrados en City App incluyen IVA salvo que se indique lo contrario en la ficha del producto." },
    ],
  },
  {
    title: "Comunidades",
    icon: Users,
    faqs: [
      { q: "¿Cómo me uno a una comunidad?", a: "Ve a la sección Comunidades, encuentra una que te interese y pulsa 'Unirme'. Las comunidades públicas son de acceso libre, las privadas requieren aprobación del administrador." },
      { q: "¿Puedo crear mi propia comunidad?", a: "Sí, cualquier usuario puede crear una comunidad. Ve a Comunidades y pulsa el botón 'Crear comunidad'. Elige nombre, categoría y si será pública o privada." },
    ],
  },
  {
    title: "Negocios",
    icon: Briefcase,
    faqs: [
      { q: "¿Cómo registro mi negocio?", a: "Ve a 'Mi negocio' en el menú lateral y pulsa 'Añadir negocio'. Completa la información de tu negocio incluyendo nombre, categoría, dirección, horarios y fotos." },
      { q: "¿City App cobra comisión?", a: "City App cobra una pequeña comisión por las transacciones realizadas a través del marketplace. El porcentaje exacto se detalla al registrar tu negocio." },
      { q: "¿Cómo gestiono mis productos?", a: "Desde el dashboard de tu negocio puedes añadir, editar y eliminar productos. También puedes gestionar pedidos y ver estadísticas." },
    ],
  },
  {
    title: "Privacidad y seguridad",
    icon: Shield,
    faqs: [
      { q: "¿Mis datos están seguros?", a: "Sí, utilizamos encriptación SSL y cumplimos con el RGPD. Tus datos de pago son procesados de forma segura por Stripe y nunca almacenamos información de tarjetas." },
      { q: "¿Puedo eliminar mi cuenta?", a: "Sí, puedes solicitar la eliminación de tu cuenta y todos tus datos desde Ajustes > Cuenta > Eliminar cuenta. El proceso es irreversible." },
      { q: "¿Cómo reporto contenido inapropiado?", a: "Puedes reportar cualquier contenido o usuario usando el botón de reporte (tres puntos > Reportar) en cualquier publicación, comentario o perfil." },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const allFaqs = FAQ_SECTIONS.flatMap((section) =>
    section.faqs.map((faq) => ({ ...faq, section: section.title }))
  );

  const filteredSections = search
    ? [{ title: "Resultados", icon: Search, faqs: allFaqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) }]
    : FAQ_SECTIONS;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-black">Centro de ayuda</h1>
        <p className="text-muted-foreground mt-1">¿En qué podemos ayudarte?</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar en las preguntas frecuentes..."
          className="pl-12 h-12 rounded-full text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <h2 className="font-black text-lg flex items-center gap-2 mb-3">
              <section.icon className="w-5 h-5 text-primary" /> {section.title}
            </h2>
            <div className="space-y-2">
              {section.faqs.map((faq) => {
                const key = `${section.title}-${faq.q}`;
                const isOpen = openItems.has(key);
                return (
                  <div key={key} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-bold text-sm pr-4">{faq.q}</p>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 animate-in slide-in-from-top-1">
                        <p className="text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {search && filteredSections[0].faqs.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
          <p className="font-bold">No se encontraron resultados</p>
          <p className="text-sm text-muted-foreground mt-1">Prueba con otras palabras o contacta con nosotros</p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="bg-foreground rounded-2xl p-6 text-white text-center mt-8">
        <h3 className="font-black text-lg mb-1">¿No encuentras lo que buscas?</h3>
        <p className="text-white/60 text-sm mb-4">Nuestro equipo está aquí para ayudarte</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/contact">
            <Button className="rounded-full bg-primary font-bold">
              <Mail className="w-4 h-4 mr-1.5" /> Contactar
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-full font-bold border-white/20 text-white hover:bg-white/10"
            onClick={() => window.dispatchEvent(new Event("open-city-ai"))}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" /> Chat con City AI
          </Button>
        </div>
      </div>

      {/* JSON-LD FAQPage structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_SECTIONS.flatMap((section) =>
              section.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  );
}
