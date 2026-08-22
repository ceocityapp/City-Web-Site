import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, MapPin, Users, Store, Calendar, Heart, Zap,
  Shield, Globe, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Conoce más sobre City App: nuestra misión, valores y el equipo detrás de la plataforma que conecta tu ciudad.",
};

const STATS = [
  { label: "Ciudades", value: "12+", icon: Globe },
  { label: "Negocios", value: "500+", icon: Store },
  { label: "Usuarios", value: "10K+", icon: Users },
  { label: "Eventos", value: "200+", icon: Calendar },
];

const VALUES = [
  { title: "Comercio local", description: "Conectamos a residentes con los negocios de su ciudad, fomentando la economía local y las relaciones de confianza.", icon: Store, color: "bg-primary/10 text-primary" },
  { title: "Comunidad", description: "Creamos espacios para que los vecinos se conozcan, compartan intereses y construyan relaciones significativas.", icon: Heart, color: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400" },
  { title: "Innovación", description: "Usamos la tecnología para mejorar la vida en la ciudad, desde IA hasta experiencias personalizadas.", icon: Zap, color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400" },
  { title: "Confianza", description: "Verificamos negocios, moderamos contenido y protegemos los datos de nuestros usuarios.", icon: Shield, color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400" },
];

const TEAM = [
  { name: "David de la Fuente", role: "Fundador & CEO", bio: "Apasionado por las ciudades inteligentes y el comercio local." },
  { name: "Equipo City App", role: "Desarrollo & Diseño", bio: "Un equipo multidisciplinar comprometido con transformar las ciudades." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Sobre City App</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Estamos construyendo la plataforma que conecta a las personas con su ciudad. Comercio local, comunidad y cultura en un solo lugar.
          </p>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Nuestra misión</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hacer que cada ciudad sea más conectada, más viva y más accesible para todos sus habitantes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">El equipo</h2>
            <p className="text-muted-foreground">Las personas detrás de City App</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-black text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-black">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">¿Listo para conectar con tu ciudad?</h2>
          <p className="text-muted-foreground mb-8">Únete a miles de personas que ya están usando City App</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button className="rounded-full bg-primary font-bold h-12 px-8">
                Crear cuenta gratis <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" className="rounded-full font-bold h-12 px-8">
                Explorar la plataforma
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 City App. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            <Link href="/about" className="hover:text-foreground transition-colors font-medium text-foreground">Sobre nosotros</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
