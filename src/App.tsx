import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PartnersSection } from './components/PartnersSection';
import { IdentitySuiteSection } from './components/IdentitySuiteSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('cs');
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'partners', 'identity', 'contact'];
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
      />

      <main className="flex-1">
        <Hero currentLang={currentLang} />
        <AboutSection currentLang={currentLang} />
        <PortfolioSection currentLang={currentLang} />
        <PartnersSection currentLang={currentLang} />
        <IdentitySuiteSection currentLang={currentLang} />
        <ContactSection currentLang={currentLang} />
      </main>

      <Footer
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />
    </div>
  );
}
