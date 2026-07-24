import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { NiroMonogramLogo } from './NiroMonogramLogo';
import { Menu, X, Globe, ChevronRight, Phone, Mail, Instagram } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.navHome, href: '#home' },
    { id: 'about', label: t.navAbout, href: '#about' },
    { id: 'portfolio', label: t.navPortfolio, href: '#portfolio' },
    { id: 'partners', label: t.navPartners, href: '#partners' },
    { id: 'identity', label: t.navIdentity, href: '#identity' },
    { id: 'contact', label: t.navContact, href: '#contact' },
  ];

  const languages: { code: Language; label: string; full: string }[] = [
    { code: 'cs', label: 'CZ', full: 'Čeština' },
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'vi', label: 'VI', full: 'Tiếng Việt' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs py-4 border-b border-[#EAE5DC]'
          : 'bg-transparent py-6 sm:py-7'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo with Monogram SVG */}
          <a
            href="#home"
            className="group flex items-center focus:outline-hidden shrink-0 pr-6 lg:pr-12"
            title="NIRO Studio - Interior Architecture"
          >
            <NiroMonogramLogo
              variant="dark"
              size="md"
              subtext="Interior Architecture & Design"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 px-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-xs font-medium uppercase tracking-[0.15em] transition-all relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#1C1B1A] font-semibold'
                      : 'text-[#6C6A65] hover:text-[#1C1B1A]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C1B1A]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Language Selector + Inquire Button */}
          <div className="hidden md:flex items-center space-x-5 xl:space-x-6 shrink-0 pl-6 lg:pl-12">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#EAE5DC]/60 p-1 rounded-full border border-[#D8D2C4]">
              <Globe className="w-3.5 h-3.5 text-[#6C6A65] ml-2.5 mr-1.5" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                    currentLang === lang.code
                      ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                      : 'text-[#6C6A65] hover:text-[#1C1B1A]'
                  }`}
                  title={lang.full}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Inquire CTA Button */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-xs bg-[#1C1B1A] text-[#FAF9F6] hover:bg-[#3A3835] transition-all shadow-xs hover:shadow-md"
            >
              <span>{t.navInquire}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex items-center bg-[#EAE5DC] p-0.5 rounded-full border border-[#D8D2C4]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all ${
                    currentLang === lang.code
                      ? 'bg-[#1C1B1A] text-[#FAF9F6]'
                      : 'text-[#6C6A65]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1C1B1A] focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-b border-[#EAE5DC] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest py-2 border-b border-[#EAE5DC]/60 text-[#1C1B1A]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <a
              href="tel:+420732163410"
              className="flex items-center gap-2 text-xs text-[#6C6A65]"
            >
              <Phone className="w-4 h-4 text-[#1C1B1A]" />
              <span>+420 732 163 410</span>
            </a>
            <a
              href="mailto:"
              className="flex items-center gap-2 text-xs text-[#6C6A65]"
            >
              <Mail className="w-4 h-4 text-[#1C1B1A]" />
              <span>E-mail</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-[#6C6A65]"
            >
              <Instagram className="w-4 h-4 text-[#1C1B1A]" />
              <span>Instagram</span>
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs uppercase tracking-widest font-semibold py-3 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs mt-2"
            >
              {t.navInquire}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
