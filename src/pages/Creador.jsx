import React from 'react';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { Heart, Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Creador() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
              Sobre el
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Creador
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Huesca City nace de la pasión por nuestra ciudad y el deseo de conectar a todos los oscenses
            </p>
          </motion.div>

          {/* Contenido principal */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl p-1">
                <div className="bg-white rounded-2xl p-8">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/73cfd9676_625899148_17845445655684569_5590920382246267599_n.jpg"
                    alt="Huesca City Logo"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">La visión</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Huesca City es más que una app: es un proyecto para unir nuestra comunidad en el entorno digital. 
                Queremos que los oscenses puedan descubrir todo lo que nuestra ciudad tiene para ofrecer, 
                desde comercios locales hasta eventos culturales.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Este proyecto nace del amor por Huesca y la convicción de que merece una plataforma 
                que refleje su riqueza cultural, su comunidad vibrante y su futuro prometedor.
              </p>
              <div className="flex items-center gap-3 pt-4">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="text-gray-700 font-medium">Hecho con amor en Huesca</span>
              </div>
            </motion.div>
          </div>

          {/* Valores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Nuestros valores</h3>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🏘️</div>
                <h4 className="font-bold text-gray-900 mb-2">Local</h4>
                <p className="text-gray-600 text-sm">
                  Primero Huesca, siempre Huesca
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-bold text-gray-900 mb-2">Comunidad</h4>
                <p className="text-gray-600 text-sm">
                  Construido por y para los oscenses
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="font-bold text-gray-900 mb-2">Innovación</h4>
                <p className="text-gray-600 text-sm">
                  Tecnología al servicio de nuestra ciudad
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">¿Quieres saber más?</h2>
            <p className="text-xl mb-6 text-white/90">
              Escríbenos y hablemos sobre Huesca City
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full inline-flex items-center gap-2"
              onClick={() => window.location.href = 'mailto:equipocityapp@gmail.com'}
            >
              <Mail className="w-5 h-5" />
              Contactar
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}