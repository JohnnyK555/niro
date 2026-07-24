import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { NiroMonogramLogo } from './NiroMonogramLogo';
import {
  Mail,
  Instagram,
  Phone,
  Globe,
  Copy,
  Check,
  Sparkles,
  CreditCard,
  AtSign,
  Download,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface IdentitySuiteSectionProps {
  currentLang: Language;
}

export const IdentitySuiteSection: React.FC<IdentitySuiteSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'domains' | 'signature' | 'businesscard' | 'logo'>('logo');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Logo generator functions for export
  const getLogoSvgContent = (variant: 'dark' | 'light' | 'symbol') => {
    if (variant === 'symbol') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="600" height="600">
  <rect width="100" height="100" fill="#FAF9F6"/>
  <rect x="6" y="6" width="88" height="88" rx="2" stroke="#1C1B1A" stroke-width="3" stroke-dasharray="88 8" fill="none"/>
  <line x1="18" y1="82" x2="82" y2="18" stroke="#1C1B1A" stroke-width="1.2" stroke-opacity="0.3"/>
  <path d="M26 22V78" stroke="#1C1B1A" stroke-width="5" stroke-linecap="square"/>
  <path d="M26 22L54 78" stroke="#1C1B1A" stroke-width="4" stroke-linecap="square"/>
  <path d="M54 22V78" stroke="#1C1B1A" stroke-width="5" stroke-linecap="square"/>
  <path d="M54 22H72C78.6274 22 84 27.3726 84 34C84 40.6274 78.6274 46 72 46H54" stroke="#1C1B1A" stroke-width="4.5" stroke-linecap="square" fill="none"/>
  <path d="M62 46L82 78" stroke="#1C1B1A" stroke-width="4.5" stroke-linecap="square"/>
  <circle cx="26" cy="22" r="2.5" fill="#1C1B1A"/>
  <circle cx="82" cy="78" r="2.5" fill="#1C1B1A"/>
</svg>`;
    }

    const isLight = variant === 'light';
    const bgColor = isLight ? '#1C1B1A' : '#FAF9F6';
    const strokeColor = isLight ? '#FAF9F6' : '#1C1B1A';
    const subtextColor = isLight ? '#D8D2C4' : '#8E8D8A';
    const tagBg = isLight ? '#FAF9F6' : '#1C1B1A';
    const tagText = isLight ? '#1C1B1A' : '#FAF9F6';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 200" width="1040" height="400">
  <rect width="520" height="200" fill="${bgColor}"/>
  <g transform="translate(30, 50)">
    <rect x="6" y="6" width="88" height="88" rx="2" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="88 8" fill="none"/>
    <line x1="18" y1="82" x2="82" y2="18" stroke="${strokeColor}" stroke-width="1.2" stroke-opacity="0.3"/>
    <path d="M26 22V78" stroke="${strokeColor}" stroke-width="5" stroke-linecap="square"/>
    <path d="M26 22L54 78" stroke="${strokeColor}" stroke-width="4" stroke-linecap="square"/>
    <path d="M54 22V78" stroke="${strokeColor}" stroke-width="5" stroke-linecap="square"/>
    <path d="M54 22H72C78.6274 22 84 27.3726 84 34C84 40.6274 78.6274 46 72 46H54" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="square" fill="none"/>
    <path d="M62 46L82 78" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="square"/>
    <circle cx="26" cy="22" r="2.5" fill="${strokeColor}"/>
    <circle cx="82" cy="78" r="2.5" fill="${strokeColor}"/>
  </g>
  <text x="160" y="95" font-family="'Georgia', serif" font-size="42" font-weight="bold" letter-spacing="12" fill="${strokeColor}">N I R O</text>
  <rect x="365" y="62" width="60" height="22" rx="2" fill="${tagBg}"/>
  <text x="395" y="77" font-family="monospace" font-size="11" font-weight="bold" fill="${tagText}" text-anchor="middle">Studio</text>
  <text x="162" y="125" font-family="sans-serif" font-size="13" letter-spacing="3" fill="${subtextColor}" font-weight="500">NIKOLA ROHLOVÁ | INTERIOR ARCHITECTURE</text>
</svg>`;
  };

  const handleDownloadSvg = (variant: 'dark' | 'light' | 'symbol') => {
    const svgStr = getLogoSvgContent(variant);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `niro-logo-${variant}-nikola-rohlova.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`SVG (${variant}) staženo!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadPng = (variant: 'dark' | 'light' | 'symbol') => {
    const svgStr = getLogoSvgContent(variant);
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = variant === 'symbol' ? 1000 : 1600;
      canvas.height = variant === 'symbol' ? 1000 : 615;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `niro-logo-${variant}-nikola-rohlova.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
      setDownloadSuccess(`PNG (${variant}) staženo v vysokém rozlišení!`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    };

    img.src = url;
  };

  // Signature customizable options for Nikola Rohlová
  const [sigName, setSigName] = useState<string>('Nikola Rohlová');
  const [sigTitle, setSigTitle] = useState<string>('Interiérová architektka & Designerka');
  const [sigPhone, setSigPhone] = useState<string>('+420 732 163 410');
  const [sigEmail, setSigEmail] = useState<string>('nikola@nirodesign.cz');
  const [sigWebsite, setSigWebsite] = useState<string>('www.nirodesign.cz');

  const domainProposals = [
    {
      domain: 'nirodesign.cz',
      email: 'nikola@nirodesign.cz',
      altEmail: 'info@nirodesign.cz',
      instagram: '@niro.artdesign',
      status: 'Doporučeno #1 (Ateliér Design)',
      badgeColor: 'bg-[#1C1B1A] text-[#FAF9F6]',
      reason: {
        cs: 'Přímé propojení se jménem ateliéru NIRO Design. E-mail nikola@nirodesign.cz a info@nirodesign.cz působí velmi profesionálně.',
        en: 'Direct match with the NIRO Design studio name. Emails like nikola@nirodesign.cz are ultra-professional.',
        vi: 'Kết nối trực tiếp với tên studio NIRO Design. Email nikola@nirodesign.cz rất chuyên nghiệp.',
      },
    },
    {
      domain: 'nirostudio.cz',
      email: 'nikola@nirostudio.cz',
      altEmail: 'info@nirostudio.cz',
      instagram: '@niro.artdesign',
      status: 'Doporučeno #2 (Studio)',
      badgeColor: 'bg-[#1C1B1A] text-[#FAF9F6]',
      reason: {
        cs: 'Skvělá varianta s akcentem na architektonické studio. E-mail nikola@nirostudio.cz je výstižný a zapamatovatelný.',
        en: 'Excellent alternative emphasizing the architecture studio. Short and memorable.',
        vi: 'Phương án tuyệt vời nhấn mạnh tính chất kiến trúc studio.',
      },
    },
    {
      domain: 'nikolarohlova.cz',
      email: 'nikola@nikolarohlova.cz',
      altEmail: 'info@nikolarohlova.cz',
      instagram: '@niro.artdesign',
      status: 'Osobní značka',
      badgeColor: 'bg-[#EAE5DC] text-[#1C1B1A]',
      reason: {
        cs: 'Osobní doména pro stavbu silného osobního brandu autorky.',
        en: 'Personal domain for building the founder personal brand.',
        vi: 'Tên miền cá nhân để xây dựng thương hiệu tác giả.',
      },
    },
    {
      domain: 'niro.cz',
      email: 'nikola@niro.cz',
      altEmail: 'info@niro.cz',
      instagram: '@niro.artdesign',
      status: 'Exkluzivní varianta',
      badgeColor: 'bg-[#EAE5DC] text-[#1C1B1A]',
      reason: {
        cs: 'Extrémně krátká a prémiová čtyřpísmenná doména.',
        en: 'Ultra-short premium 4-letter domain.',
        vi: 'Tên miền 4 ký tự cực kỳ ngắn gọn.',
      },
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const htmlSignatureCode = `<table font-family="sans-serif" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #1C1B1A; font-size: 13px; border-collapse: collapse;">
  <tr>
    <td style="padding-right: 18px; border-right: 2px solid #1C1B1A; vertical-align: top;">
      <div style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #1C1B1A;">N I R O</div>
      <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #8E8D8A; margin-top: 2px;">Interior Architecture</div>
      <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #1C1B1A; margin-top: 4px; font-weight: bold;">Nikola Rohlová</div>
    </td>
    <td style="padding-left: 18px; vertical-align: top;">
      <div style="font-weight: bold; font-size: 14px; color: #1C1B1A;">${sigName}</div>
      <div style="font-size: 11px; color: #6C6A65; margin-bottom: 8px;">${sigTitle}</div>
      <div style="font-size: 11px; color: #1C1B1A;"><strong>Tel:</strong> ${sigPhone}</div>
      <div style="font-size: 11px; color: #1C1B1A;"><strong>E-mail:</strong> <a href="mailto:${sigEmail}" style="color:#1C1B1A; text-decoration:none;">${sigEmail}</a></div>
      <div style="font-size: 11px; color: #1C1B1A;"><strong>Web:</strong> <a href="https://${sigWebsite}" style="color:#1C1B1A; text-decoration:none;">${sigWebsite}</a></div>
      <div style="font-size: 11px; color: #1C1B1A;"><strong>Instagram:</strong> <a href="https://instagram.com/niro.artdesign" style="color:#1C1B1A; text-decoration:none;">@niro.artdesign</a></div>
    </td>
  </tr>
</table>`;

  return (
    <section id="identity" className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B1A]">
            {t.identityHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A65] font-normal leading-relaxed">
            {t.identitySubheading}
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('domains')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'domains'
                ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-md'
                : 'bg-[#F3F1EC] text-[#6C6A65] border border-[#EAE5DC] hover:text-[#1C1B1A]'
            }`}
          >
            <AtSign className="w-4 h-4" />
            <span>Domény & E-mailové adesy</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'logo'
                ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-md'
                : 'bg-[#F3F1EC] text-[#6C6A65] border border-[#EAE5DC] hover:text-[#1C1B1A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Monogram Logo (NIRO)</span>
          </button>

          <button
            onClick={() => setActiveTab('signature')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'signature'
                ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-md'
                : 'bg-[#F3F1EC] text-[#6C6A65] border border-[#EAE5DC] hover:text-[#1C1B1A]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>E-mailový podpis</span>
          </button>

          <button
            onClick={() => setActiveTab('businesscard')}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-2 ${
              activeTab === 'businesscard'
                ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-md'
                : 'bg-[#F3F1EC] text-[#6C6A65] border border-[#EAE5DC] hover:text-[#1C1B1A]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Vizitka ateliéru</span>
          </button>
        </div>

        {/* Tab 1: Domain Proposals Grid */}
        {activeTab === 'domains' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {domainProposals.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xs border transition-all duration-300 flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-[#FAF9F6] border-[#1C1B1A] shadow-md ring-1 ring-[#1C1B1A]'
                      : 'bg-[#F3F1EC] border-[#EAE5DC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-xs ${item.badgeColor}`}>
                        {item.status}
                      </span>
                      <Globe className="w-4 h-4 text-[#8E8D8A]" />
                    </div>

                    <h4 className="font-serif text-3xl font-normal text-[#1C1B1A]">
                      www.{item.domain}
                    </h4>

                    {/* Primary Email Badge */}
                    <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#8E8D8A] font-mono uppercase block">
                            Hlavní e-mail pro Nikolu
                          </span>
                          <span className="text-xs font-mono font-bold text-[#1C1B1A]">
                            {item.email}
                          </span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(item.email)}
                          className="p-1.5 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs transition-colors"
                          title="Kopírovat e-mail"
                        >
                          {copiedEmail === item.email ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between text-[11px] font-mono text-[#6C6A65]">
                        <span>Alternativní schránka:</span>
                        <span className="font-bold text-[#1C1B1A]">{item.altEmail}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#6C6A65] mt-4 leading-relaxed">
                      {item.reason[currentLang]}
                    </p>
                  </div>

                  {/* Social handle pairing */}
                  <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#6C6A65]">
                    <span className="flex items-center gap-1.5 font-medium text-[#1C1B1A]">
                      <Instagram className="w-3.5 h-3.5 text-[#1C1B1A]" />
                      {item.instagram}
                    </span>
                    <span className="font-mono text-[10px] text-[#8E8D8A] uppercase">Párováno pro web & e-mail</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'logo' && (
          <div className="bg-[#F3F1EC] border border-[#EAE5DC] rounded-xs p-6 md:p-8 animate-in fade-in duration-300 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE5DC]">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                  Architektonické Monogram Logo pro Nikolu Rohlovou
                </h3>
                <p className="text-xs text-[#6C6A65] mt-2 leading-relaxed">
                  Logotyp ateliéru <strong>NIRO Studio</strong> propojuje čisté architektonické linie v geometrickém rastrovaném rámu. Můžete si stáhnout vektory (SVG) i rastrové obrázky ve vysokém rozlišení (PNG).
                </p>
              </div>

              {/* Master Notification / Quick Download All */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleDownloadSvg('dark')}
                  className="px-4 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-all flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Stáhnout Hlavní Logo (SVG)</span>
                </button>
              </div>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Light Background Variant */}
              <div className="p-6 bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs flex flex-col items-center justify-between text-center space-y-6">
                <div className="w-full">
                  <span className="text-[10px] font-mono uppercase text-[#8E8D8A] block mb-4">Světlý podklad (Web & Tisk)</span>
                  <div className="py-4 flex justify-center">
                    <NiroMonogramLogo variant="dark" size="xl" subtext="Nikola Rohlová | Interior Architecture" />
                  </div>
                  <p className="text-[10px] text-[#6C6A65] mt-2">Primární logotyp na hlavičkovém papíru a webu</p>
                </div>

                <div className="w-full pt-4 border-t border-[#EAE5DC] flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadSvg('dark')}
                      className="w-full py-2 bg-[#1C1B1A] text-[#FAF9F6] text-[11px] font-semibold rounded-xs hover:bg-[#3A3835] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>SVG (Vektor)</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng('dark')}
                      className="w-full py-2 bg-[#EAE5DC] text-[#1C1B1A] text-[11px] font-semibold rounded-xs hover:bg-[#D8D2C4] transition-all flex items-center justify-center gap-1.5 border border-[#D8D2C4]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG (Obrázek)</span>
                    </button>
                  </div>

                  <button
                    onClick={() => copyToClipboard(getLogoSvgContent('dark'))}
                    className="w-full py-2 bg-[#FAF9F6] text-[#1C1B1A] hover:bg-[#EAE5DC] text-[11px] font-mono border border-[#D8D2C4] rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedEmail === getLogoSvgContent('dark') ? '✓ SVG Kód zkopírován!' : 'Kopírovat SVG Kód'}</span>
                  </button>

                  <details className="text-left mt-2">
                    <summary className="text-[10px] font-mono text-[#8E8D8A] hover:text-[#1C1B1A] cursor-pointer text-center">
                      Zobrazit zdrojový SVG kód
                    </summary>
                    <textarea
                      readOnly
                      rows={5}
                      value={getLogoSvgContent('dark')}
                      className="w-full mt-2 p-2 bg-[#1C1B1A] text-[#D8D2C4] text-[9px] font-mono rounded-xs resize-none select-all focus:outline-hidden"
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                  </details>
                </div>
              </div>

              {/* Dark Background Variant */}
              <div className="p-6 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs flex flex-col items-center justify-between text-center space-y-6 shadow-md">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D8D2C4] block mb-4">Tmavý podklad (Prezentace & Cedule)</span>
                  <div className="py-4 flex justify-center">
                    <NiroMonogramLogo variant="light" size="xl" subtext="Nikola Rohlová | Interior Architecture" />
                  </div>
                  <p className="text-[10px] text-[#8E8D8A] mt-2">Verze pro večerní osvětlené cedule a desky</p>
                </div>

                <div className="w-full pt-4 border-t border-[#3A3835] flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadSvg('light')}
                      className="w-full py-2 bg-[#FAF9F6] text-[#1C1B1A] text-[11px] font-semibold rounded-xs hover:bg-[#EAE5DC] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>SVG (Vektor)</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng('light')}
                      className="w-full py-2 bg-[#2C2A29] text-[#FAF9F6] text-[11px] font-semibold rounded-xs hover:bg-[#3A3835] transition-all flex items-center justify-center gap-1.5 border border-[#3A3835]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG (Obrázek)</span>
                    </button>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getLogoSvgContent('light'))}
                    className="w-full py-1.5 bg-[#2C2A29] text-[#D8D2C4] hover:text-[#FAF9F6] text-[10px] font-mono border border-[#3A3835] rounded-xs flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedEmail === getLogoSvgContent('light') ? 'Kód zkopírován!' : 'Kopírovat SVG kód'}</span>
                  </button>
                </div>
              </div>

              {/* Monogram Symbol Stamp Only */}
              <div className="p-6 bg-[#FAF9F6] border border-[#1C1B1A] rounded-xs flex flex-col items-center justify-between text-center space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#1C1B1A] block mb-4">Razítko / Favicon / Profilovka</span>
                  <div className="py-4 flex justify-center">
                    <NiroMonogramLogo variant="dark" size="xl" showText={false} />
                  </div>
                  <p className="text-[10px] text-[#6C6A65] mt-2">Ikona pro Instagram avatar a favikona webu</p>
                </div>

                <div className="w-full pt-4 border-t border-[#EAE5DC] flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadSvg('symbol')}
                      className="w-full py-2 bg-[#1C1B1A] text-[#FAF9F6] text-[11px] font-semibold rounded-xs hover:bg-[#3A3835] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>SVG (Vektor)</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng('symbol')}
                      className="w-full py-2 bg-[#EAE5DC] text-[#1C1B1A] text-[11px] font-semibold rounded-xs hover:bg-[#D8D2C4] transition-all flex items-center justify-center gap-1.5 border border-[#D8D2C4]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG (Obrázek)</span>
                    </button>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getLogoSvgContent('symbol'))}
                    className="w-full py-1.5 bg-[#FAF9F6] text-[#6C6A65] hover:text-[#1C1B1A] text-[10px] font-mono border border-[#EAE5DC] rounded-xs flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedEmail === getLogoSvgContent('symbol') ? 'Kód zkopírován!' : 'Kopírovat SVG kód'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Email Signature Workspace */}
        {activeTab === 'signature' && (
          <div className="bg-[#F3F1EC] border border-[#EAE5DC] rounded-xs p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAE5DC]">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                  Generátor e-mailového podpisu
                </h3>
                <p className="text-xs text-[#6C6A65] mt-1">
                  Předpřipravený HTML podpis pro e-mailové klienty (Apple Mail, Outlook, Gmail, Thunderbird).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]">
                  Úprava údajů podpisu
                </h4>

                <div>
                  <label className="text-[11px] font-mono text-[#8E8D8A] uppercase block mb-1">
                    Jméno & Příjmení
                  </label>
                  <input
                    type="text"
                    value={sigName}
                    onChange={(e) => setSigName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs font-medium text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#8E8D8A] uppercase block mb-1">
                    Pozice / Titul
                  </label>
                  <input
                    type="text"
                    value={sigTitle}
                    onChange={(e) => setSigTitle(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs font-medium text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#8E8D8A] uppercase block mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={sigPhone}
                    onChange={(e) => setSigPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs font-medium text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#8E8D8A] uppercase block mb-1">
                    E-mail
                  </label>
                  <input
                    type="text"
                    value={sigEmail}
                    onChange={(e) => setSigEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs font-medium text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#8E8D8A] uppercase block mb-1">
                    Webová adresa
                  </label>
                  <input
                    type="text"
                    value={sigWebsite}
                    onChange={(e) => setSigWebsite(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs font-medium text-[#1C1B1A]"
                  />
                </div>
              </div>

              {/* Signature Live Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]">
                    Živý náhled v e-mailu
                  </h4>
                  <button
                    onClick={() => copyToClipboard(htmlSignatureCode)}
                    className="px-3.5 py-1.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedEmail === htmlSignatureCode ? 'Kopírováno!' : 'Kopírovat HTML kód'}</span>
                  </button>
                </div>

                <div className="p-6 bg-white border border-[#D8D2C4] rounded-xs shadow-xs">
                  <div dangerouslySetInnerHTML={{ __html: htmlSignatureCode }} />
                </div>

                <div className="p-4 bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs">
                  <span className="text-[10px] font-mono uppercase text-[#8E8D8A] block mb-1">
                    HTML Kód pro vložení do pošty:
                  </span>
                  <pre className="text-[10px] font-mono text-[#6C6A65] overflow-x-auto whitespace-pre-wrap max-h-28 p-2 bg-[#F3F1EC] rounded-xs">
                    {htmlSignatureCode}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Business Card Mockups */}
        {activeTab === 'businesscard' && (
          <div className="bg-[#F3F1EC] border border-[#EAE5DC] rounded-xs p-6 md:p-8 animate-in fade-in duration-300 space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                Náhled tištěné vizitky Nikoly Rohlové (NIRO)
              </h3>
              <p className="text-xs text-[#6C6A65] mt-1">
                Standardní formát 90 × 50 mm na matném papíru Cotton Soft White 350g s ražbou loga NIRO.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
              {/* Front Side Card */}
              <div className="aspect-9/5 bg-[#FAF9F6] border border-[#1C1B1A] p-8 rounded-xs shadow-md flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <NiroMonogramLogo variant="dark" size="md" subtext="Interior Architecture" />
                  <span className="text-[9px] font-mono border border-[#1C1B1A] px-2 py-0.5 uppercase font-bold">
                    Ateliér
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#1C1B1A]">{sigName}</h4>
                  <p className="text-xs text-[#6C6A65] font-medium">{sigTitle}</p>
                </div>

                <div className="pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-[11px] font-mono text-[#1C1B1A]">
                  <span>{sigEmail}</span>
                  <span>{sigPhone}</span>
                </div>
              </div>

              {/* Back Side Card */}
              <div className="aspect-9/5 bg-[#1C1B1A] text-[#FAF9F6] p-8 rounded-xs shadow-md flex flex-col justify-between relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8D2C4]">
                    Rezidenční & Komerční projekty
                  </span>
                  <Instagram className="w-4 h-4 text-[#D8D2C4]" />
                </div>

                <div className="text-center py-2 flex justify-center">
                  <NiroMonogramLogo variant="light" size="lg" subtext="NIKOLA ROHLOVÁ | STUDIO NIRO" />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8D8A]">
                  <span>Praha & celá ČR</span>
                  <span>{sigWebsite}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
