import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ArrowDownRight, Compass, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import heroInteriorImg from '../assets/images/hero_interior_1784926250517.jpg';

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  const t = translations[currentLang];

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

          {/* Featured Visual Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xs overflow-hidden shadow-xl border border-[#EAE5DC] aspect-4/3 sm:aspect-16/11 lg:aspect-4/5 group">
              <img
                src={heroInteriorImg}
                alt="NIRO Interior Design"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A]/70 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#FAF9F6]/90 backdrop-blur-md rounded-xs border border-[#EAE5DC]">
                <div className="flex items-center justify-between text-xs text-[#1C1B1A] font-semibold">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-[#1C1B1A]" />
                    Penthouse Bubenč – 3D Rendering
                  </span>
                  <span className="font-mono text-[10px] bg-[#1C1B1A] text-[#FAF9F6] px-2 py-0.5 rounded-xs">
                    2025
                  </span>
                </div>
                <p className="text-[11px] text-[#6C6A65] mt-1 font-normal">
                  Přírodní dub Boma Parket, velkoformátové velkoobklady ProCeram & podomítková sanita Keraservis
                </p>
              </div>
            </div>

            {/* Decorative Corner Label */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#1C1B1A] text-[#FAF9F6] p-4 rounded-xs shadow-lg max-w-xs border border-[#3A3835]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D8D2C4] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider">Přední partneři</h4>
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
