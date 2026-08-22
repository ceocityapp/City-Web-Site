import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: 'Home', isHome: true },
    { name: 'Colaborar', href: 'Colaborar' },
    { name: 'Creador', href: 'Creador' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100" 
          : "bg-white/60 backdrop-blur-md border-b border-gray-50"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 gap-8 lg:gap-12">
          {/* Navigation links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={createPageUrl(link.href)}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          
          {/* Registro button - destacado */}
          <Link
            to={createPageUrl('Registro')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
}