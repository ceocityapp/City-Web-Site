import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MessageSquare, Calendar, Store } from 'lucide-react';

const stats = [
  { icon: Users, value: 50000, label: "Usuarios activos", suffix: "+" },
  { icon: MessageSquare, value: 15000, label: "Posts mensuales", suffix: "+" },
  { icon: Calendar, value: 5000, label: "Eventos al año", suffix: "+" },
  { icon: Store, value: 200, label: "Negocios locales", suffix: "+" },
];

function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(target * easeOutQuart));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, isInView]);

  return (
    <span ref={ref}>
      {count.toLocaleString('es-ES')}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const features = [
    {
      icon: Store,
      title: "Comercio Local",
      description: "Conectamos negocios oscenses con su comunidad"
    },
    {
      icon: Calendar,
      title: "Eventos",
      description: "La agenda cultural y social de Huesca unificada"
    },
    {
      icon: Users,
      title: "Asociaciones",
      description: "Fortaleciendo el tejido social de nuestra ciudad"
    },
    {
      icon: MessageSquare,
      title: "Cultura",
      description: "Un espacio para la creatividad y expresión local"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
            Construyendo el futuro de Huesca
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Nuestra ciudad es hostelería de calidad, comercio familiar, eventos únicos, asociaciones activas y una cultura vibrante. Huesca City conectará todo esto en un solo lugar.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 bg-white rounded-2xl mb-6 shadow-lg"
                  >
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center max-w-2xl mx-auto"
        >
          <p className="text-2xl text-white font-light leading-relaxed">
            Una app hecha por oscenses, para oscenses. Con orgullo local y ambición digital.
          </p>
        </motion.div>
      </div>
    </section>
  );
}