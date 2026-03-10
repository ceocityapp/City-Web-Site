import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, Users, Briefcase, ShoppingBag, Calendar, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: "Posts",
    description: "Comparte momentos, pregunta lo que necesites y conecta con tu comunidad local",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/20955ff87_image.png",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    icon: MessageCircle,
    title: "Foro",
    description: "Debate sobre temas populares de Huesca, desde gimnasios hasta eventos locales",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/6f229f502_image.png",
    color: "from-lime-400 to-emerald-500"
  },
  {
    icon: Briefcase,
    title: "Empleo Local",
    description: "Encuentra oportunidades de trabajo en Huesca. Profesores, fotógrafos y más",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/3c71c4d78_image.png",
    color: "from-emerald-500 to-lime-600"
  },
  {
    icon: Users,
    title: "Comunidades",
    description: "Únete a Running Huesca, SD Huesca Fans, Rediseñadores UX y muchas más",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/4a8a1b9be_image.png",
    color: "from-lime-500 to-emerald-400"
  },
  {
    icon: ShoppingBag,
    title: "Mercado",
    description: "Apoya a los negocios locales. Descubre Tolosana, Heladería Oscense y más",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/b9c530e97_image.png",
    color: "from-emerald-600 to-lime-500"
  },
  {
    icon: Calendar,
    title: "Eventos",
    description: "No te pierdas nada: Maratón Huesca Running, Mercado Medieval y más",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/4d5f22846_image.png",
    color: "from-lime-600 to-emerald-600"
  },
];

export default function FeaturesShowcase() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
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
              Descubre Huesca
            </span>
          </motion.div>
          <h2 className="text-5xl sm:text-6xl font-black text-black mb-6">
            Todo lo que necesitas en una
            <span className="block bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent"> sola app</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde encontrar eventos hasta conectar con vecinos, Huesca City tiene todo para vivir tu ciudad al máximo
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                onHoverStart={() => setActiveIndex(index)}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Phone mockup with real screenshot */}
                  <div className="relative h-96 bg-gradient-to-br from-gray-50 to-white p-8 flex items-center justify-center">
                    <div className="relative w-48 h-full">
                      {/* Mini phone frame */}
                      <div className="absolute inset-0 bg-black rounded-[36px] p-2 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />
                        <div className="relative w-full h-full bg-white rounded-[30px] overflow-hidden">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300 -z-10`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-2xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-black group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-lg text-gray-600 mb-6">Y mucho más por descubrir...</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a
              href="#download"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Descarga la app gratis
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}