import React from 'react';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { Users, Heart, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Colaborar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-emerald-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
              Colabora con
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Huesca City
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Únete a nuestra comunidad y ayúdanos a construir el mejor punto de encuentro digital para Huesca
            </p>
          </motion.div>

          {/* Formas de colaborar */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Comparte Ideas</h3>
              <p className="text-gray-600 mb-4">
                Ayúdanos a mejorar la app compartiendo tus ideas y sugerencias sobre qué funcionalidades te gustaría ver.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Difunde el Proyecto</h3>
              <p className="text-gray-600 mb-4">
                Comparte Huesca City con tus amigos, familia y en redes sociales para llegar a más oscenses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sé Beta Tester</h3>
              <p className="text-gray-600 mb-4">
                Prueba las nuevas funcionalidades antes que nadie y ayúdanos a detectar errores y mejorar la experiencia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contacta con Nosotros</h3>
              <p className="text-gray-600 mb-4">
                ¿Tienes una propuesta concreta? Escríbenos y hablemos sobre cómo puedes colaborar.
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">¿Listo para colaborar?</h2>
            <p className="text-xl mb-6 text-white/90">
              Escríbenos a equipocityapp@gmail.com y cuéntanos cómo quieres ayudar
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full"
              onClick={() => window.location.href = 'mailto:equipocityapp@gmail.com'}
            >
              Enviar correo
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}