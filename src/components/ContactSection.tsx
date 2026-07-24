import React, { useState } from 'react';
import { Language, ContactFormState } from '../types';
import { translations } from '../data/translations';
import { Phone, Mail, Instagram, Send, CheckCircle2, Copy, Clock } from 'lucide-react';

interface ContactSectionProps {
  currentLang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    projectType: 'optApt',
    spaceSize: '',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
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
    setSubmitted(true);
  };

  const copyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
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
                        Telefon
                      </span>
                      <a
                        href="tel:+420732163410"
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        +420 732 163 410
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => copyContact('+420732163410', 'phone')}
                    className="p-1.5 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs"
                    title="Kopírovat telefon"
                  >
                    {copiedField === 'phone' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Email (mailto link without hardcoded username) */}
                <div className="flex items-center justify-between p-3 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        E-mail
                      </span>
                      <a
                        href="mailto:"
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        Napište e-mail
                      </a>
                    </div>
                  </div>
                </div>

                {/* Instagram (link without specific handle) */}
                <div className="flex items-center justify-between p-3 bg-[#F3F1EC] rounded-xs border border-[#EAE5DC]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1C1B1A] text-[#FAF9F6] rounded-xs">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        Sociální sítě
                      </span>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#1C1B1A] hover:underline"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
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
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-[#1C1B1A] text-[#FAF9F6] rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-normal text-[#1C1B1A]">
                    Poptávka byla úspěšně odeslána
                  </h3>
                  <p className="text-sm text-[#6C6A65] max-w-md mx-auto">
                    {t.formSuccess}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
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
                    className="mt-4 px-6 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs uppercase tracking-widest font-semibold rounded-xs"
                  >
                    Odeslat další dotaz
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
