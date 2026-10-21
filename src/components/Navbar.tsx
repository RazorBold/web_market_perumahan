'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Box, Sparkles, MapPin } from 'lucide-react';
import { whatsappLink } from '../config/contact';

interface NavbarProps {
  onOpen3D: () => void;
  onOpenKpr: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpen3D, onOpenKpr }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Konsep', href: '#konsep' },
    { name: 'Denah Lokasi', href: '#denah-lokasi' },
    { name: 'Tipe Rumah', href: '#tipe-rumah' },
    { name: 'Fasilitas', href: '#fasilitas' },
    { name: 'Video & 3D Tour', href: '#video-tour' },
    { name: 'Artikel', href: '#artikel' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#faf8f5]/90 backdrop-blur-md py-3.5 shadow-md border-b border-[#e2dcd0]'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching mockup */}
        <a href="#home" className="flex flex-col items-start group">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xl sm:text-2xl font-serif-luxury tracking-[0.2em] font-bold ${
                isScrolled ? 'text-[#1b3224]' : 'text-white'
              }`}
            >
              HYARTA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c88242]" />
          </div>
          <span
            className={`text-[9px] tracking-[0.3em] uppercase font-light ${
              isScrolled ? 'text-[#6d756c]' : 'text-white/80'
            }`}
          >
            ECOVILLAGE YOGYAKARTA
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase font-medium tracking-wider transition-colors duration-200 hover:text-[#c88242] ${
                isScrolled ? 'text-[#3d453f]' : 'text-white/90'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpen3D}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
              isScrolled
                ? 'border-[#c88242] text-[#c88242] hover:bg-[#c88242] hover:text-white'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D Model
          </button>

          <a
            href={whatsappLink('Halo Hyarta Ecovillage, saya tertarik untuk jadwalkan visit dan konsultasi unit.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c88242] hover:bg-[#b07137] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <Phone className="w-3.5 h-3.5" /> Jadwalkan Visit
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? 'text-[#1b3224]' : 'text-white'
          }`}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f5] border-b border-[#ded7ca] px-6 py-6 space-y-4 shadow-xl animate-fade-in text-[#2b302c]">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wide text-[#3d453f] hover:text-[#c88242] py-1 border-b border-[#eae4d7]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpen3D();
              }}
              className="w-full py-2.5 rounded-full border border-[#c88242] text-[#c88242] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4" /> Buka 3D Model Explorer
            </button>
            <a
              href={whatsappLink('Halo Hyarta Ecovillage, saya tertarik untuk jadwalkan visit.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-[#1b3224] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Hubungi WhatsApp Sales
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
