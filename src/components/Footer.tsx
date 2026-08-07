import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { NiroMonogramLogo } from './NiroMonogramLogo';
import { ArrowUp, Instagram, Mail, Phone, Globe, Lock } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAdmin?: () => void;
  customTranslations?: Record<Language, Record<string, string>>;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAdmin,
  customTranslations,
}) => {
  const t = (customTranslations && customTranslations[currentLang]) || translations[currentLang] || translations.cs;

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
                <a href="#contact" className="hover:text-[#FAF9F6] transition-colors">
                  {t.navContact}
                </a>
              </li>
              {onOpenAdmin && (
                <li className="pt-2 border-t border-[#2C2A29]">
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-[#FAF9F6] text-[#C5A059] transition-colors flex items-center gap-1.5 font-mono text-[11px]"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{t.navAdmin || 'Správa webu'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Direct Contact & Partner Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D8D2C4]">
              Smluvní Partneři
            </h4>

            <div className="space-y-2 text-xs text-[#8E8D8A]">
              <a
                href="https://www.bomaparket.cz/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#FAF9F6] block"
              >
                Boma Parket – Dřevěné podlahy & Parkety
              </a>
              <a
                href="https://www.proceram.cz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#FAF9F6] block"
              >
                ProCeram – Velkoformátová keramika
              </a>
              <a
                href="https://www.keraservis.cz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#FAF9F6] block"
              >
                Keraservis – Koupelnové studio
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
            <div className="flex items-center gap-1 bg-[#2C2A29] px-2.5 py-1 rounded-full border border-[#3A3835]">
              <Globe className="w-3 h-3 text-[#D8D2C4] mr-1" />
              {(['cs', 'en', 'ru', 'vi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                    currentLang === lang ? 'bg-[#FAF9F6] text-[#1C1B1A]' : 'text-[#8E8D8A]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
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
