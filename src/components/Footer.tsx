import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { NiroMonogramLogo } from './NiroMonogramLogo';
import { ArrowUp, Instagram, Mail, Phone, Globe } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange }) => {
  const t = translations[currentLang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1B1A] text-[#FAF9F6] pt-16 pb-12 border-t border-[#3A3835]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#3A3835]">
          {/* Logo & Intro */}
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="inline-block">
              <NiroMonogramLogo
                variant="light"
                size="md"
                subtext="Nikola Rohlová | Interior Architecture"
              />
            </a>
            <p className="text-xs text-[#8E8D8A] leading-relaxed max-w-sm">
              Ateliér NIRO Studio. Čistý a nadčasový interiérový design pro rezidenční i komerční projekty. Propojujeme architekturu se světlem a poctivými materiály.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D8D2C4]">
              Navigace
            </h4>
            <ul className="space-y-2 text-xs text-[#8E8D8A]">
              <li>
                <a href="#home" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navHome}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navAbout}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navPortfolio}
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navPartners}
                </a>
              </li>
              <li>
                <a href="#identity" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navIdentity}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navContact}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Partner Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D8D2C4]">
              Kontakt & Smluvní Partneři
            </h4>

            <div className="space-y-2 text-xs text-[#8E8D8A]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D8D2C4]" />
                <a href="tel:+420732163410" className="hover:text-[#FAF9F6]">
                  +420 732 163 410
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D8D2C4]" />
                <a href="mailto:" className="hover:text-[#FAF9F6]">
                  E-mail
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#D8D2C4]" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FAF9F6]"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#8E8D8A] space-x-3">
              <a href="https://www.bomaparket.cz/" target="_blank" rel="noreferrer" className="hover:underline">
                Boma Parket
              </a>
              <span>·</span>
              <a href="https://www.proceram.cz" target="_blank" rel="noreferrer" className="hover:underline">
                ProCeram
              </a>
              <span>·</span>
              <a href="https://www.keraservis.cz" target="_blank" rel="noreferrer" className="hover:underline">
                Keraservis
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8D8A]">
          <div>
            © {new Date().getFullYear()} NIRO Studio. Nikola Rohlová. {t.footerRights}
          </div>

          <div className="flex items-center gap-4">
            {/* Language switch */}
            <div className="flex items-center gap-1.5 bg-[#2C2A29] px-2.5 py-1 rounded-full border border-[#3A3835]">
              <Globe className="w-3 h-3 text-[#D8D2C4]" />
              <button
                onClick={() => onLanguageChange('cs')}
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                  currentLang === 'cs' ? 'bg-[#FAF9F6] text-[#1C1B1A]' : 'text-[#8E8D8A]'
                }`}
              >
                CZ
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                  currentLang === 'en' ? 'bg-[#FAF9F6] text-[#1C1B1A]' : 'text-[#8E8D8A]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('vi')}
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                  currentLang === 'vi' ? 'bg-[#FAF9F6] text-[#1C1B1A]' : 'text-[#8E8D8A]'
                }`}
              >
                VI
              </button>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="p-2 bg-[#2C2A29] text-[#FAF9F6] hover:bg-[#FAF9F6] hover:text-[#1C1B1A] transition-colors rounded-xs border border-[#3A3835] flex items-center gap-1"
              title={t.footerBackTop}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase">{t.footerBackTop}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
