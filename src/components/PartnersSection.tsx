import React from 'react';
import { Language } from '../types';
import { partnersData } from '../data/partners';
import { translations } from '../data/translations';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface PartnersSectionProps {
  currentLang: Language;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="partners" className="py-20 bg-[#F3F1EC] border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B1A]">
            {t.partnerHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A65] font-normal leading-relaxed">
            {t.partnerSubheading}
          </p>
        </div>

        {/* Partners Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partnersData.map((partner) => (
            <div
              key={partner.id}
              className="bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs p-6 shadow-2xs hover:border-[#1C1B1A] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Logo Box Container */}
                <div className="w-full h-28 sm:h-32 rounded-xs px-4 py-2 flex items-center justify-center transition-all mb-6 border bg-[#FFFFFF] border-[#EAE5DC] group-hover:border-[#1C1B1A]">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className={`max-h-20 sm:max-h-24 w-auto max-w-[96%] object-contain transition-transform duration-300 group-hover:scale-105 ${
                        partner.id === 'proceram' ? 'h-14 sm:h-16 w-[92%]' : ''
                      } ${partner.id === 'bomma-parket' ? 'h-20 sm:h-24' : ''} ${
                        partner.id === 'keraservis' ? 'h-14 sm:h-18' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ) : partner.svgIcon ? (
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: partner.svgIcon }}
                    />
                  ) : (
                    <span className="font-serif text-xl tracking-widest uppercase font-semibold text-[#1C1B1A]">
                      {partner.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8D8A] bg-[#EAE5DC] px-2 py-0.5 rounded-xs">
                    {partner.category[currentLang]}
                  </span>
                  <span className="text-[10px] text-[#8E8D8A] font-mono">
                    Official Partner
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A] group-hover:text-[#6C6A65] transition-colors">
                  {partner.name}
                </h3>

                <p className="text-xs text-[#5A5853] mt-2 font-normal leading-relaxed">
                  {partner.description[currentLang]}
                </p>

                {/* Highlights List */}
                <ul className="mt-4 space-y-1.5 pt-4 border-t border-[#EAE5DC]">
                  {partner.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#6C6A65]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1C1B1A] shrink-0" />
                      <span>{item[currentLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-[#EAE5DC]">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all shadow-xs"
                >
                  <span>{t.partnerVisit}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
