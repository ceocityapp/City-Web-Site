import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Apple, Smartphone, Sparkles, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouette background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5" data-parallax="0.3">
        <Mountain className="w-full h-full text-emerald-900" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-8 lg:pl-8 lg:pr-4"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">La comunidad más viva de Huesca</span>
            </motion.div>

            {/* Main title with animated gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-tight cursor-pointer group"
            >
              <motion.span 
                className="block text-black transition-all duration-300 group-hover:scale-105 inline-block"
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                HUESCA
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent animate-gradient transition-all duration-300 group-hover:scale-105 inline-block"
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                CITY
              </motion.span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl text-gray-700 font-light max-w-lg leading-relaxed"
            >
              El punto de encuentro digital de Huesca. Comercio local, eventos, cultura y comunidad, todo en un solo lugar.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-700 hover:to-lime-600 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 group"
              >
                <Sparkles className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Muy pronto
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:scale-105 transition-all duration-300 group"
              >
                Regístrate para acceso anticipado
              </Button>
            </motion.div>

            {/* Support button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="pt-4"
            >
              <a
                href="https://buymeacoffee.com/huescacity"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 hover:text-emerald-700 bg-white border border-gray-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span>☕</span>
                <span>Apóyanos</span>
              </a>
            </motion.div>

            {/* Vision statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="pt-8 max-w-lg"
            >
              <p className="text-base text-gray-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
                "Huesca es comunidad, cultura y vida local. Estamos construyendo el punto de encuentro digital para nuestra ciudad."
              </p>
            </motion.div>
          </motion.div>

          {/* Right - 3D Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative flex items-center justify-center lg:justify-center"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-[320px] h-[650px] perspective-1000"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-lime-400/20 to-emerald-500/30 rounded-[60px] blur-3xl"
                animate={{
                  scale: isHovering ? 1.1 : 1,
                  opacity: isHovering ? 0.6 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Phone frame */}
              <div className="relative w-full h-full bg-black rounded-[60px] p-3 shadow-2xl" style={{ transform: "translateZ(50px)" }}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-10" />
                
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[48px] overflow-hidden">
                  {/* Real app screenshot */}
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_699cc82814d0376abefd58e2/a290ef0a1_WhatsAppImage2026-02-10at182227.jpg"
                    alt="Huesca City App Interface"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0"
                    animate={{
                      x: isHovering ? ["-100%", "100%"] : "0%",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isHovering ? Infinity : 0,
                      repeatDelay: 2,
                    }}
                  />
                </div>

                {/* Side buttons */}
                <div className="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-l" />
                <div className="absolute right-0 top-52 w-1 h-12 bg-gray-800 rounded-l" />
                <div className="absolute left-0 top-40 w-1 h-12 bg-gray-800 rounded-r" />
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -right-8 top-20 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transform: "translateZ(100px)" }}
              />
              <motion.div
                className="absolute -left-8 bottom-32 w-24 h-24 bg-lime-400/20 rounded-full blur-xl"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                style={{ transform: "translateZ(80px)" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-emerald-600 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-emerald-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}