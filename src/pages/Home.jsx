import React, { useEffect, useRef } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/landing/HeroSection';
import FeaturesShowcase from '../components/landing/FeaturesShowcase';
import StatsSection from '../components/landing/StatsSection';
import EarlyAccessSection from '../components/landing/EarlyAccessSection';
import DownloadSection from '../components/landing/DownloadSection';

export default function Home() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach((el) => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white overflow-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesShowcase />
      <StatsSection />
      <EarlyAccessSection />
      <DownloadSection />
    </div>
  );
}