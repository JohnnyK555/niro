import React, { useState } from 'react';
import { Language, ContactFormState, Inquiry, ContactInfo } from '../types';
import { translations } from '../data/translations';
import { addInquiry, getStoredRobotEmailConfig } from '../lib/adminStorage';
import { Phone, Mail, Instagram, Send, CheckCircle2, Copy, Clock, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  currentLang: Language;
  customTranslations?: Record<Language, Record<string, string>>;
  contactInfo?: ContactInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLang,
  customTranslations,
  contactInfo,
}) => {
  const t = (customTranslations && customTranslations[currentLang]) || translations[currentLang] || translations.cs;

  const phoneVal = contactInfo?.phone || '+420 732 163 410';
  const emailVal = contactInfo?.email || 'nikola@nirodesign.cz';
  const instaVal = contactInfo?.instagram || 'https://instagram.com/niro.studio';

  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    projectType: 'optApt',
    spaceSize: '',
    budget: '',
    message: '',
  });

  const [lastSubmittedInquiry, setLastSubmittedInquiry] = useState<Inquiry | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    // Save to adminStorage so Nikola sees it in Admin Panel
    const created = addInquiry({
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      projectType: formState.projectType,
      spaceSize: formState.spaceSize,
      budget: formState.budget,
      message: formState.message,
    });

    setLastSubmittedInquiry(created);

    // Send Netlify Forms AJAX request
    try {
      const netlifyBody = new URLSearchParams({
        'form-name': 'kontakt',
        name: formState.name,
        email: formState.email,
        phone: formState.phone || '',
        projectType: formState.projectType || '',
        spaceSize: formState.spaceSize || '',
        budget: formState.budget || '',
        message: formState.message || '',
      }).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyBody,
      }).catch((err) => console.log('Netlify submission note:', err));
    } catch (err) {
      console.error('Netlify submit error:', err);
    }

    // Optional webhook trigger if configured in admin
    try {
      const robotConfig = getStoredRobotEmailConfig();
      if (robotConfig?.webhookUrl && robotConfig.webhookUrl.trim().length > 0) {
        fetch(robotConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            robotEmail: robotConfig.robotEmail,
            recipientEmail: robotConfig.recipientEmail,
            inquiry: created,
          }),
        }).catch((err) => console.log('Robot webhook notification note:', err));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Mailto link pre-filled
  const getMailtoLink = () => {
    if (!lastSubmittedInquiry) return `mailto:${emailVal}`;
    const subject = encodeURIComponent(`Poptávka NIRO Studio [${lastSubmittedInquiry.id}] - ${lastSubmittedInquiry.name}`);
    const body = encodeURIComponent(
      `Dobrý den Nikolo,\n\nZasílám poptávku projektu [ID: ${lastSubmittedInquiry.id}]:\n\n- Jméno: ${lastSubmittedInquiry.name}\n- E-mail: ${lastSubmittedInquiry.email}\n- Telefon: ${lastSubmittedInquiry.phone || 'Není'}\n- Plocha: ${lastSubmittedInquiry.spaceSize || 'Neuvedeno'}\n- Rozpočet: ${lastSubmittedInquiry.budget || 'Neuvedeno'}\n\nZpráva:\n${lastSubmittedInquiry.message}\n`
    );
    return `mailto:${emailVal}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 bg-[#F3F1EC] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B1A]">
            {t.contactHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A65] font-normal leading-relaxed">
            {t.contactSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Contact Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF9F6] border border-[#EAE5DC] p-8 rounded-xs shadow-2xs space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A] mb-1">
                  Nikola Rohlová
                </h3>
                <p className="text-xs text-[#8E8D8A] font-mono uppercase tracking-widest font-semibold mb-3">
                  Interiérová Architektura & Design
                </p>
                <p className="text-xs text-[#6C6A65] leading-relaxed">
                  Interiérová architektura a kompletní realizace rezidenčních i komerčních projektů na klíč.
                </p>
              </div>

              {/* Direct Details Items */}
              <div className="space-y-4 pt-4 border-t border-[#EAE5DC]">
                {/* Phone */}
                <div className="flex items-center justify-between p-3 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        {t.contactPhoneLabel}
                      </span>
                      <a
                        href={`tel:${phoneVal.replace(/\s+/g, '')}`}
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        {phoneVal}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => copyContact(phoneVal, 'phone')}
                    className="p-1.5 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs transition-colors"
                    title="Kopírovat telefon"
                  >
                    {copiedField === 'phone' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        {t.contactEmailLabel}
                      </span>
                      <a
                        href={`mailto:${emailVal}`}
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        {emailVal}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => copyContact(emailVal, 'email')}
                    className="p-1.5 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs transition-colors"
                    title="Kopírovat e-mail"
                  >
                    {copiedField === 'email' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between p-3 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        {t.contactInstaLabel}
                      </span>
                      <a
                        href={instaVal.startsWith('http') ? instaVal : `https://${instaVal}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        Instagram NIRO Studio
                      </a>
                    </div>
                  </div>

                  <a
                    href={instaVal.startsWith('http') ? instaVal : `https://${instaVal}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs transition-colors"
                    title="Otevřít Instagram"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Working Hours Banner */}
              <div className="pt-4 border-t border-[#EAE5DC] flex items-center gap-3 text-xs text-[#6C6A65]">
                <Clock className="w-4 h-4 text-[#8E8D8A] shrink-0" />
                <span>Odpovídám obvykle do 24 hodin od odeslání poptávky.</span>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF9F6] border border-[#EAE5DC] p-8 rounded-xs shadow-2xs">
              {lastSubmittedInquiry ? (
                <div className="py-8 space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1B1A]">
                      Poptávka odeslána!
                    </h3>
                    <p className="text-xs font-mono text-[#8E8D8A]">
                      Kód poptávky: <span className="font-bold text-[#1C1B1A]">{lastSubmittedInquiry.id}</span>
                    </p>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xs text-xs space-y-1 max-w-md mx-auto">
                      <p className="font-semibold flex items-center justify-center gap-1.5 text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Poptávka byla úspěšně odeslána!</span>
                      </p>
                      <p className="text-[11px] text-emerald-800 font-normal">
                        Děkujeme. Vaši zprávu jsme v pořádku přijali a brzy se vám ozveme zpět.
                      </p>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-[#F3F1EC] p-5 rounded-xs border border-[#EAE5DC] space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-[#EAE5DC] pb-2">
                      <span className="font-mono text-[#8E8D8A] uppercase text-[10px]">Jméno:</span>
                      <span className="font-bold text-[#1C1B1A]">{lastSubmittedInquiry.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EAE5DC] pb-2">
                      <span className="font-mono text-[#8E8D8A] uppercase text-[10px]">E-mail:</span>
                      <span className="font-medium text-[#1C1B1A]">{lastSubmittedInquiry.email}</span>
                    </div>
                    {lastSubmittedInquiry.phone && (
                      <div className="flex justify-between items-center border-b border-[#EAE5DC] pb-2">
                        <span className="font-mono text-[#8E8D8A] uppercase text-[10px]">Telefon:</span>
                        <span className="font-medium text-[#1C1B1A]">{lastSubmittedInquiry.phone}</span>
                      </div>
                    )}
                    {lastSubmittedInquiry.spaceSize && (
                      <div className="flex justify-between items-center border-b border-[#EAE5DC] pb-2">
                        <span className="font-mono text-[#8E8D8A] uppercase text-[10px]">Plocha / Rozpočet:</span>
                        <span className="font-medium text-[#1C1B1A]">
                          {lastSubmittedInquiry.spaceSize} · {lastSubmittedInquiry.budget || 'Rozpočet neuveden'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 items-center justify-between">
                    <button
                      onClick={() => {
                        setLastSubmittedInquiry(null);
                        setFormState({
                          name: '',
                          email: '',
                          phone: '',
                          projectType: 'optApt',
                          spaceSize: '',
                          budget: '',
                          message: '',
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all"
                    >
                      Odeslat další poptávku
                    </button>

                    <a
                      href={getMailtoLink()}
                      className="text-[11px] text-[#6C6A65] hover:text-[#1C1B1A] underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chcete poslat kopii z vašeho e-mailu?</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  name="kontakt"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <input type="hidden" name="form-name" value="kontakt" />
                  <p className="hidden">
                    <label>
                      Don’t fill this out if you’re human: <input name="bot-field" />
                    </label>
                  </p>
                  <h3 className="font-serif text-2xl font-normal text-[#1C1B1A] mb-2">
                    Nezávazný poptávkový formulář
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formName} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Např. Eva Nováková"
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formEmail} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="eva@example.cz"
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formPhone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+420 777 000 000"
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formProjectType}
                      </label>
                      <select
                        name="projectType"
                        value={formState.projectType}
                        onChange={handleChange}
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      >
                        <option value="optApt">{t.optApt}</option>
                        <option value="optHouse">{t.optHouse}</option>
                        <option value="optCafe">{t.optCafe}</option>
                        <option value="optOffice">{t.optOffice}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formSpaceSize}
                      </label>
                      <input
                        type="text"
                        name="spaceSize"
                        value={formState.spaceSize}
                        onChange={handleChange}
                        placeholder="Např. 85 m²"
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        {t.formBudget}
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formState.budget}
                        onChange={handleChange}
                        placeholder="Např. 500.000 CZK"
                        className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                      {t.formMessage}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Popište vaši představu, styl, časový plán a stav nemovitosti..."
                      className="w-full bg-[#F3F1EC] border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#3A3835] transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>{t.formSubmit}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
