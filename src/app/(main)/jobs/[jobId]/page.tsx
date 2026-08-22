"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft, MapPin, Briefcase, Clock, Building2, Mail, Share2,
  Bookmark, Check, Heart, Globe,
} from "lucide-react";
import { HUESCA_JOBS, HUESCA_SHOPS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";

function getJobRequirements(job: { title: string; company: string }): string[] {
  const t = job.title.toLowerCase();
  if (t.includes("camarero") || t.includes("camarera"))
    return [
      "Experiencia previa en hostelería o restauración",
      "Buena atención al cliente y don de gentes",
      "Capacidad de trabajo en equipo y bajo presión",
      "Carnet de manipulador de alimentos",
    ];
  if (t.includes("desarrollador") || t.includes("programador"))
    return [
      "Experiencia con React, Node.js o tecnologías similares",
      "Conocimientos de bases de datos SQL y NoSQL",
      "Capacidad de trabajo en equipo y metodologías ágiles",
      "Grado en Informática o experiencia demostrable equivalente",
    ];
  if (t.includes("monitor") && t.includes("escalada"))
    return [
      "Certificación de monitor/a de escalada deportiva",
      "Título de primeros auxilios en vigor",
      "Buena condición física y experiencia en escalada",
      "Capacidad para motivar y enseñar a grupos diversos",
    ];
  if (t.includes("dependient"))
    return [
      "Conocimiento del sector del producto (libros, moda, etc.)",
      "Experiencia en atención al público y ventas",
      "Capacidad de organización y gestión de inventario",
      "Residencia en Huesca o alrededores",
    ];
  if (t.includes("guía") || t.includes("guia"))
    return [
      "Dominio de inglés y francés (otros idiomas valorables)",
      "Conocimiento de la historia y patrimonio local de Huesca",
      "Experiencia previa como guía turístico/a",
      "Habilidades de comunicación y trato con el público",
    ];
  if (t.includes("fisioterapeuta"))
    return [
      "Grado en Fisioterapia y colegiación vigente",
      "Experiencia en rehabilitación deportiva",
      "Conocimientos de terapia manual y electroterapia",
      "Capacidad de trabajo en equipo multidisciplinar",
    ];
  return [
    "Experiencia previa en puesto similar",
    "Residencia en Huesca o alrededores",
    "Disponibilidad inmediata",
    "Don de gentes y trabajo en equipo",
  ];
}

function getJobOffers(job: { title: string; company: string; salary: string }): string[] {
  const t = job.title.toLowerCase();
  if (t.includes("camarero") || t.includes("camarera"))
    return [
      "Turnos rotativos con dos días libres semanales",
      `Salario competitivo: ${job.salary}`,
      "Comidas incluidas durante el turno",
      "Propinas compartidas y bonus por rendimiento",
    ];
  if (t.includes("desarrollador") || t.includes("programador"))
    return [
      "Teletrabajo parcial y horario flexible",
      `Salario competitivo: ${job.salary}`,
      "Presupuesto anual para formación y conferencias",
      "Equipo joven y proyectos innovadores",
    ];
  if (t.includes("monitor") && t.includes("escalada"))
    return [
      "Acceso gratuito a todas las instalaciones del rocódromo",
      `Salario competitivo: ${job.salary}`,
      "Material de escalada proporcionado por la empresa",
      "Horario compatible con práctica deportiva propia",
    ];
  if (t.includes("dependient"))
    return [
      "Descuento de empleado/a en productos de la tienda",
      `Salario competitivo: ${job.salary}`,
      "Horario estable y fines de semana alternos",
      "Buen ambiente de trabajo y equipo cercano",
    ];
  if (t.includes("guía") || t.includes("guia"))
    return [
      "Trabajo al aire libre y en contacto con la cultura local",
      `Salario competitivo: ${job.salary}`,
      "Formación continua en patrimonio e historia",
      "Flexibilidad horaria según temporada turística",
    ];
  if (t.includes("fisioterapeuta"))
    return [
      "Clínica moderna con equipamiento de última generación",
      `Salario competitivo: ${job.salary}`,
      "Formación continua y asistencia a congresos",
      "Horario de mañana y tarde con libre elección",
    ];
  return [
    "Contrato estable",
    `Salario competitivo: ${job.salary}`,
    "Buen ambiente de trabajo",
    "Formación continua",
  ];
}

const typeColors: Record<string, string> = {
  "Jornada completa": "bg-primary/10 text-primary",
  "Media jornada": "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  Freelance: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
  Temporal: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const job = HUESCA_JOBS.find((j) => j.id === Number(jobId));

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Oferta no encontrada</h1>
        <p className="text-muted-foreground mb-6">La oferta de empleo que buscas ya no está disponible.</p>
        <Link href="/jobs">
          <Button className="rounded-full bg-primary font-bold">Ver todas las ofertas</Button>
        </Link>
      </div>
    );
  }

  const relatedShop = HUESCA_SHOPS.find(
    (s) => s.name.toLowerCase() === job.company.toLowerCase()
  );

  const similarJobs = HUESCA_JOBS.filter(
    (j) => j.id !== job.id && j.type === job.type
  ).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a ofertas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-14 h-14 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {job.company.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-black mb-1">{job.title}</h1>
                <p className="text-muted-foreground font-medium">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`border-0 font-bold ${typeColors[job.type] || "bg-muted"}`}>
                <Clock className="w-3 h-3 mr-1" /> {job.type}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" /> {job.location}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Briefcase className="w-3 h-3" /> {job.salary}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">Publicado {job.posted}</p>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-black mb-3">Descripción del puesto</h2>
            <p className="text-sm text-foreground/80 leading-relaxed mb-6">{job.body}</p>

            <h3 className="text-sm font-black mb-2">Requisitos</h3>
            <ul className="space-y-2 text-sm text-foreground/80 mb-6">
              {getJobRequirements(job).map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-black mb-2">Ofrecemos</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              {getJobOffers(job).map((offer, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  {offer}
                </li>
              ))}
            </ul>
          </div>

          {/* Similar jobs */}
          {similarJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-black mb-4">Ofertas similares</h2>
              <div className="space-y-3">
                {similarJobs.map((sj) => (
                  <Link key={sj.id} href={`/jobs/${sj.id}`}>
                    <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{sj.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{sj.title}</p>
                          <p className="text-xs text-muted-foreground">{sj.company} · {sj.salary}</p>
                        </div>
                        <Badge className={`text-xs border-0 font-bold shrink-0 ${typeColors[sj.type] || "bg-muted"}`}>{sj.type}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 sticky top-20">
            <Button
              className={`w-full rounded-full font-bold h-12 ${
                applied
                  ? "bg-card text-primary border-2 border-primary hover:bg-primary/5"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
              onClick={() => setApplied(!applied)}
            >
              {applied ? <><Check className="w-5 h-5 mr-2" /> Inscrito</> : <><Mail className="w-5 h-5 mr-2" /> Inscribirme</>}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`flex-1 rounded-full font-bold ${saved ? "text-amber-500 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20" : ""}`}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark className={`w-4 h-4 mr-1.5 ${saved ? "fill-current" : ""}`} />
                {saved ? "Guardado" : "Guardar"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-full font-bold" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1.5" /> {shared ? "Enlace copiado" : "Compartir"}
              </Button>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>

          {/* Company card */}
          {relatedShop && (
            <Link href={`/marketplace/${relatedShop.id}`}>
              <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                <div className="h-28 overflow-hidden">
                  <img src={relatedShop.image_url || ""} alt={relatedShop.name} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Empresa en City App</p>
                  <p className="font-black text-sm">{relatedShop.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{relatedShop.category}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary font-bold">
                    <Globe className="w-3 h-3" /> Ver perfil de la empresa
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
