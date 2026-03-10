import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Smartphone, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadSection() {
  return (
    <section id="download" className="py-32 bg-gradient-to-br from-black via-gray-900 to-emerald-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Sparkle badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Descarga gratuita</span>
            </motion.div>

            {/* Main heading */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
              Huesca merece
              <span className="block bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500 bg-clip-text text-transparent">
                una app así
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Estamos trabajando para crear la mejor experiencia digital para nuestra ciudad. Pronto disponible en iOS y Android.
            </p>

            {/* App logo showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="pt-16 pb-8"
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/73cfd9676_625899148_17845445655684569_5590920382246267599_n.jpg"
                alt="Huesca City Logo"
                className="w-32 h-32 mx-auto rounded-3xl shadow-2xl border-4 border-white/20"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-white/10 mt-20 pt-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/60 text-sm">
            <div>
              © 2026 Huesca City. Hecho con ❤️ en Huesca.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}