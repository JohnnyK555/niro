import React, { useState, useEffect } from 'react';
import { Language, Project, ContactInfo } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PartnersSection } from './components/PartnersSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { getStoredProjects, getStoredTranslations, getStoredContactInfo, DEFAULT_CONTACT_INFO } from './lib/adminStorage';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('cs');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Admin Modal & Dynamic Data State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [customTranslations, setCustomTranslations] = useState<Record<Language, Record<string, string>>>({
    cs: {},
    en: {},
    ru: {},
    vi: {},
  });

  const loadAdminData = () => {
    setProjectsList(getStoredProjects());
    setCustomTranslations(getStoredTranslations());
    setContactInfo(getStoredContactInfo());
  };

  useEffect(() => {
    loadAdminData();

    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'partners', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1B1A] font-sans flex flex-col">
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        customTranslations={customTranslations}
      />

      <main className="flex-1">
        <Hero currentLang={currentLang} customTranslations={customTranslations} />
        <AboutSection currentLang={currentLang} customTranslations={customTranslations} />
        <PortfolioSection
          currentLang={currentLang}
          projectsList={projectsList}
          customTranslations={customTranslations}
        />
        <PartnersSection currentLang={currentLang} customTranslations={customTranslations} />
        <ContactSection
          currentLang={currentLang}
          customTranslations={customTranslations}
          contactInfo={contactInfo}
        />
      </main>

      <Footer
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        customTranslations={customTranslations}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={loadAdminData}
        currentLang={currentLang}
      />
    </div>
  );
}
