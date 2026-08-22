import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la integración con el servicio de email
    console.log('Email registrado:', email);
    setSubmitted(true);
    setEmail('');
    
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Acceso anticipado</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
              Sé de los
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                primeros
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Regístrate para obtener acceso anticipado a Huesca City y recibe noticias exclusivas sobre el lanzamiento
            </p>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="pl-12 h-14 text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 h-14 text-lg font-semibold rounded-xl"
                >
                  Registrarme para acceso anticipado
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Al registrarte, aceptas recibir actualizaciones sobre Huesca City. 
                  Puedes darte de baja en cualquier momento.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Registrado con éxito!</h3>
                <p className="text-gray-600">
                  Te enviaremos un correo cuando estemos listos para el lanzamiento
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Beneficios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid sm:grid-cols-3 gap-6 text-center"
          >
            <div className="p-6">
              <div className="text-4xl font-black text-blue-600 mb-2">🎁</div>
              <h4 className="font-semibold text-gray-900 mb-1">Acceso Exclusivo</h4>
              <p className="text-sm text-gray-600">Sé de los primeros en probar la app</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-emerald-600 mb-2">📬</div>
              <h4 className="font-semibold text-gray-900 mb-1">Noticias Anticipadas</h4>
              <p className="text-sm text-gray-600">Entérate antes que nadie de las novedades</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-purple-600 mb-2">💬</div>
              <h4 className="font-semibold text-gray-900 mb-1">Influye en el Desarrollo</h4>
              <p className="text-sm text-gray-600">Tu opinión contará en las decisiones</p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center text-gray-500 text-sm"
          >
            <p>
              ¿Tienes preguntas? Escríbenos a{' '}
              <a href="mailto:equipocityapp@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                equipocityapp@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}