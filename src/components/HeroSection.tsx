import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Box, Play, ChevronDown, Sparkles, Compass, Shield } from 'lucide-react';

interface HeroSectionProps {
  onOpen3D: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpen3D, onOpenVideo }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85',
      tag: 'Eco-Living & Modern Tropical',
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
      tag: 'Sanctuary of Nature & Serenity',
    },
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
      tag: 'Harmony with Javanese Cultural Heritage',
    },
  ];

  // GSAP Animations on Mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 35, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 },
          '-=0.6'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20 pb-16"
    >
      {/* Background Slides with smooth fade */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1200ms' }}
        >
          <img
            src={slide.image}
            alt="Hyarta Ecovillage Hero"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered cinematic shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121c15] via-[#121c15]/45 to-black/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>
      ))}

      {/* Hero Central Content matching mockup */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Brand Crest / Logo Monogram matching image */}
        <div ref={logoRef} className="mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f0e4d3] tracking-[0.25em] uppercase mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" /> Yogyakarta Eco Sanctuary
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold tracking-[0.3em] uppercase text-white drop-shadow-md">
            HYARTA
          </h2>
          <span className="text-[10px] tracking-[0.45em] uppercase text-[#d4a373] font-light mt-0.5">
            ECOVILLAGE
          </span>
        </div>

        {/* Exact Headline matching screenshot */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury font-normal text-[#fbf8f2] tracking-tight leading-[1.1] max-w-4xl drop-shadow-lg"
        >
          A home that grows with you
        </h1>

        {/* Exact Subtitle matching screenshot */}
        <p
          ref={subtitleRef}
          className="mt-6 text-sm sm:text-base md:text-lg text-[#ded8cb] max-w-2xl mx-auto font-light leading-relaxed drop-shadow"
        >
          Konsep lingkungan berbasis komunitas dimana setiap individu berkontribusi untuk keberadaan satu sama lain
          dan lingkungan tempat mereka tinggal.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onOpen3D}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#c88242]/25 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <Box className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            Eksplor Model 3D 360°
          </button>

          <button
            onClick={onOpenVideo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-[#d4a373]" /> Tonton Sinematik Tour
          </button>

          <a
            href="#denah-lokasi"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1b3224]/85 hover:bg-[#1b3224] text-[#f5f1e8] backdrop-blur-md border border-[#c88242]/40 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#d4a373]" /> Denah Kawasan
          </a>
        </div>

        {/* Carousel slide indicators matching screenshot */}
        <div className="flex items-center gap-2.5 mt-14">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === idx ? 'w-8 h-2 bg-[#d4a373]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <a
        href="#konsep"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 hover:text-white transition-colors duration-200 text-xs"
      >
        <span className="text-[10px] uppercase tracking-widest mb-1">Scroll Jelajahi</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#d4a373]" />
      </a>
    </section>
  );
};
