import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ArrowDownRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  customTranslations?: Record<Language, Record<string, string>>;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, customTranslations }) => {
  const t = (customTranslations && customTranslations[currentLang]) || translations[currentLang] || translations.cs;

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Editorial Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1B1A] leading-[1.12]">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-[#5A5853] font-normal leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest hover:bg-[#3A3835] transition-all rounded-xs shadow-sm hover:shadow-md"
              >
                <span>{t.heroBtnPortfolio}</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-[#1C1B1A] text-[#1C1B1A] text-xs font-semibold uppercase tracking-widest hover:bg-[#1C1B1A] hover:text-[#FAF9F6] transition-all rounded-xs"
              >
                <span>{t.heroBtnContact}</span>
              </a>
            </div>

            {/* Key Service Scope Badges */}
            <div className="pt-8 border-t border-[#EAE5DC] grid grid-cols-3 gap-4">
              <div>
                <span className="block font-serif text-2xl font-semibold text-[#1C1B1A]">01.</span>
                <span className="text-xs text-[#6C6A65] font-medium uppercase tracking-wider block mt-0.5">
                  {t.heroStatRes}
                </span>
                <span className="text-[11px] text-[#8E8D8A] block mt-0.5">Byty, penthousy & vily</span>
              </div>

              <div>
                <span className="block font-serif text-2xl font-semibold text-[#1C1B1A]">02.</span>
                <span className="text-xs text-[#6C6A65] font-medium uppercase tracking-wider block mt-0.5">
                  {t.heroStatCom}
                </span>
                <span className="text-[11px] text-[#8E8D8A] block mt-0.5">Kavárny & kanceláře</span>
              </div>

              <div>
                <span className="block font-serif text-2xl font-semibold text-[#1C1B1A]">03.</span>
                <span className="text-xs text-[#6C6A65] font-medium uppercase tracking-wider block mt-0.5">
                  {t.heroStatVis}
                </span>
                <span className="text-[11px] text-[#8E8D8A] block mt-0.5">3D rendery & výkresy</span>
              </div>
            </div>
          </div>

          {/* Featured Visual Panel Placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xs overflow-hidden shadow-lg border border-[#1C1B1A] bg-[#FAF9F6] p-8 aspect-4/3 sm:aspect-16/11 lg:aspect-4/5 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1b1a06_1px,transparent_1px),linear-gradient(to_bottom,#1c1b1a06_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-[#EAE5DC] pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B1A] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  <span>NIRO Studio & Design</span>
                </span>
                <span className="text-[10px] font-mono bg-[#1C1B1A] text-white px-2 py-0.5 rounded-xs">
                  Ateliér
                </span>
              </div>

              <div className="relative z-10 my-auto text-center space-y-3 py-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F3F1EC] border border-[#D8D2C4] flex items-center justify-center text-[#C5A059] shadow-2xs">
                  <Sparkles className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                  Interiérový design na míru
                </h3>
                <p className="text-xs text-[#6C6A65] max-w-xs mx-auto leading-relaxed">
                  Autorské koncepty, fotorealistické 3D vizualizace a realizace projektů s autorským dozorem.
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#8E8D8A]">
                <span>Praha & Středočeský kraj</span>
                <span className="font-mono text-[#1C1B1A] font-medium">NIRO Studio</span>
              </div>
            </div>

            {/* Decorative Partner Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#1C1B1A] text-[#FAF9F6] p-4 rounded-xs shadow-lg max-w-xs border border-[#3A3835]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider">Ověření dodavatelé</h4>
                  <p className="text-[10px] text-[#D8D2C4] mt-0.5">
                    Boma Parket · ProCeram · Keraservis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

