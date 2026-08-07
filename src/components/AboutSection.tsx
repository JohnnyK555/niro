import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  CheckCircle2,
  SlidersHorizontal,
  Ruler,
  Eye,
  Award,
  Camera,
  User,
} from 'lucide-react';

interface AboutSectionProps {
  currentLang: Language;
  customTranslations?: Record<Language, Record<string, string>>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang, customTranslations }) => {
  const t = (customTranslations && customTranslations[currentLang]) || translations[currentLang] || translations.cs;

  const processSteps = [
    {
      num: '01',
      icon: SlidersHorizontal,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: '02',
      icon: Eye,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: '03',
      icon: Ruler,
      title: t.step3Title,
      desc: t.step3Desc,
    },
    {
      num: '04',
      icon: Award,
      title: t.step4Title,
      desc: t.step4Desc,
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F3F1EC] border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B1A]">
            {t.aboutHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A65] font-normal leading-relaxed">
            {t.aboutSubheading}
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Portrait Photo Frame Placeholder for Nikola Rohlová */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xs overflow-hidden shadow-lg border border-[#1C1B1A] bg-[#FAF9F6] p-1">
              <div className="relative aspect-4/5 bg-[#F3F1EC] border border-dashed border-[#8E8D8A] rounded-xs flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1b1a08_1px,transparent_1px),linear-gradient(to_bottom,#1c1b1a08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#1C1B1A] flex items-center justify-center text-[#1C1B1A] mb-4 shadow-xs relative z-10">
                  <Camera className="w-8 h-8 stroke-[1.5]" />
                </div>

                <div className="relative z-10 space-y-2">
                  <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                    Nikola Rohlová
                  </h4>
                  <p className="text-xs text-[#6C6A65] max-w-xs leading-relaxed">
                    Interiérová architektura a design
                  </p>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-6 bg-[#FAF9F6] border-t border-[#EAE5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#1C1B1A]">
                      Nikola Rohlová
                    </h3>
                    <p className="text-[10px] text-[#8E8D8A] uppercase tracking-widest font-semibold mt-0.5">
                      Interiérová architektka & Designerka
                    </p>
                  </div>
                  <div className="p-2 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                    <User className="w-4 h-4 text-[#1C1B1A]" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#6C6A65]">
                  <span className="font-medium text-[#1C1B1A]">Ateliér NIRO</span>
                  <a href="tel:+420732163410" className="font-mono text-[#1C1B1A] font-medium hover:underline">
                    +420 732 163 410
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Statement */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base text-[#1C1B1A] leading-relaxed">
              {t.aboutIntro}
            </p>
            <p className="text-sm text-[#5A5853] leading-relaxed">
              {t.aboutText1}
            </p>
            <p className="text-sm text-[#5A5853] leading-relaxed">
              {t.aboutText2}
            </p>

            {/* Material & Detail Bullet Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 bg-[#FAF9F6] rounded-xs border border-[#EAE5DC]">
                <CheckCircle2 className="w-4 h-4 text-[#1C1B1A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]">
                    Poctivé materiály
                  </h4>
                  <p className="text-xs text-[#6C6A65] mt-0.5">
                    Spolupráce s Boma Parket (dřevo), ProCeram (keramika) & Keraservis (sanita).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#FAF9F6] rounded-xs border border-[#EAE5DC]">
                <CheckCircle2 className="w-4 h-4 text-[#1C1B1A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]">
                    Kompletní dokumentace
                  </h4>
                  <p className="text-xs text-[#6C6A65] mt-0.5">
                    Přesné výkresy pro truhláře, instalatéry, stavbu a autorský dozor Nikoly Rohlové na místě.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps Section */}
        <div className="pt-12 border-t border-[#EAE5DC]">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1B1A]">
              {t.processTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-[#FAF9F6] p-6 rounded-xs border border-[#EAE5DC] shadow-2xs hover:border-[#1C1B1A] transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-[#8E8D8A] group-hover:text-[#1C1B1A] transition-colors">
                      {step.num}
                    </span>
                    <div className="p-2 bg-[#EAE5DC] rounded-xs text-[#1C1B1A]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1C1B1A] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#6C6A65] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
