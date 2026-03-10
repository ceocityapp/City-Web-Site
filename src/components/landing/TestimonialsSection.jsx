import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Laura García",
    role: "Miembro de Running Huesca",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    content: "Gracias a Huesca City encontré mi grupo de running. Ahora corro con gente increíble cada sábado. ¡La app ha cambiado mi forma de vivir la ciudad!",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "Propietario de Tolosana",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    content: "El Mercado de Huesca City nos ha traído muchos clientes nuevos. Es perfecto para negocios locales como el nuestro. 100% recomendable.",
    rating: 5,
  },
  {
    name: "María Pérez",
    role: "Organizadora de eventos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    content: "Organizo eventos culturales en Huesca y esta app es imprescindible. La sección de Eventos me permite llegar a toda la ciudad de forma fácil.",
    rating: 5,
  },
  {
    name: "Juan Martínez",
    role: "Estudiante UNIZAR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    content: "El foro es oro puro. Encontré compañeros para ir a Zaragoza, recomendaciones de sitios... Es como tener a toda Huesca en tu bolsillo.",
    rating: 5,
  },
  {
    name: "Ana López",
    role: "Fotógrafa freelance",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    content: "Conseguí mis primeros clientes a través de la sección de Empleo. ¡Es increíble lo fácil que es conectar con gente que necesita tus servicios!",
    rating: 5,
  },
  {
    name: "Pedro Sánchez",
    role: "Fan del SD Huesca",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    content: "La comunidad de SD Huesca Fans es brutal. Organizamos quedadas para ver partidos, comentamos jugadas... ¡Pura pasión oscense!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Testimonios
            </span>
          </motion.div>
          <h2 className="text-5xl sm:text-6xl font-black text-black mb-6">
            Lo que dice la
            <span className="block bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
              comunidad
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de oscenses ya están disfrutando de la app. Lee sus experiencias
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-2xl flex items-center justify-center shadow-lg rotate-6 group-hover:rotate-12 transition-transform">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-emerald-100"
                  />
                  <div>
                    <div className="font-bold text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-lime-500/0 group-hover:from-emerald-500/5 group-hover:to-lime-500/5 rounded-3xl transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-full">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">
              4.9/5 - Más de 12,000 valoraciones
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}