import React, { useState } from 'react';
import { Language, Project, ProjectCategory, ProjectTag } from '../types';
import { projectsData } from '../data/projects';
import { translations } from '../data/translations';
import {
  Maximize2,
  X,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface PortfolioSectionProps {
  currentLang: Language;
  projectsList?: Project[];
  customTranslations?: Record<Language, Record<string, string>>;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  currentLang,
  projectsList,
  customTranslations,
}) => {
  const t = (customTranslations && customTranslations[currentLang]) || translations[currentLang] || translations.cs;

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  const displayProjects = projectsList && projectsList.length > 0 ? projectsList : projectsData;

  // Filter projects
  const filteredProjects = displayProjects.filter((p) => {
    const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
    return categoryMatch;
  });

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setActiveGalleryIndex(0);
  };

  const getLangField = (field: Record<Language, string> | undefined) => {
    if (!field) return '';
    return field[currentLang] || field.cs || '';
  };

  return (
    <section id="portfolio" className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B1A]">
              {t.portHeading}
            </h2>
            <p className="text-sm text-[#6C6A65] mt-2 max-w-xl">
              {t.portSubheading}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs border transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#1C1B1A] text-[#FAF9F6] border-[#1C1B1A]'
                  : 'bg-transparent text-[#6C6A65] border-[#EAE5DC] hover:border-[#1C1B1A]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveCategory('residential')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs border transition-all ${
                activeCategory === 'residential'
                  ? 'bg-[#1C1B1A] text-[#FAF9F6] border-[#1C1B1A]'
                  : 'bg-transparent text-[#6C6A65] border-[#EAE5DC] hover:border-[#1C1B1A]'
              }`}
            >
              {t.filterRes}
            </button>
            <button
              onClick={() => setActiveCategory('commercial')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs border transition-all ${
                activeCategory === 'commercial'
                  ? 'bg-[#1C1B1A] text-[#FAF9F6] border-[#1C1B1A]'
                  : 'bg-transparent text-[#6C6A65] border-[#EAE5DC] hover:border-[#1C1B1A]'
              }`}
            >
              {t.filterCom}
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center bg-white border border-[#EAE5DC] rounded-xs space-y-4 shadow-2xs">
              <div className="w-14 h-14 bg-[#F3F1EC] text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#EAE5DC]">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                  Portfolio se právě připravuje
                </h3>
                <p className="text-xs text-[#6C6A65] max-w-md mx-auto leading-relaxed">
                  Zatím nebyly publikovány žádné realizace. Nikola sem brzy nahraje své nové vytvořené interiéry a vizualizace. Nové projekty můžete spravovat v administraci.
                </p>
              </div>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProjectModal(project)}
                className="group cursor-pointer bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-16/10 overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={project.mainImage}
                    alt={getLangField(project.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1C1B1A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#FAF9F6]/90 backdrop-blur-md text-[#1C1B1A] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-md flex items-center gap-2">
                      <Maximize2 className="w-3.5 h-3.5" />
                      {t.btnViewProject}
                    </span>
                  </div>

                  {/* Tags on top */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-semibold bg-[#1C1B1A]/80 text-[#FAF9F6] backdrop-blur-md rounded-xs">
                      {project.category === 'residential' ? 'Rezidenční' : 'Komerční'}
                    </span>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] uppercase font-mono font-semibold bg-white/80 text-[#1C1B1A] backdrop-blur-md rounded-xs"
                      >
                        {tag === 'visualization' ? '3D Vizualizace' : tag === 'floorplan' ? 'Půdorys' : 'Realizace'}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-[#1C1B1A]/90 text-[#FAF9F6] px-2.5 py-0.5 text-xs font-mono rounded-xs">
                    {project.area}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8E8D8A] font-medium mb-1">
                      <span>{getLangField(project.location)}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-normal text-[#1C1B1A] group-hover:text-[#6C6A65] transition-colors">
                      {getLangField(project.title)}
                    </h3>
                    <p className="text-xs text-[#6C6A65] mt-2 line-clamp-2">
                      {getLangField(project.subtitle)}
                    </p>
                  </div>

                  {/* Material Partners Badges Footer */}
                  <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#8E8D8A] font-mono uppercase">
                        Dodavatelé:
                      </span>
                      <div className="flex items-center gap-1">
                        {project.materials.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-[#EAE5DC] text-[#1C1B1A] font-medium rounded-xs"
                          >
                            {m.brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#1C1B1A] group-hover:underline">
                      Detail →
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Lightbox & Modal Drawer */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-[#1C1B1A]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-[#FAF9F6] w-full max-w-5xl max-h-[92vh] rounded-xs shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col my-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#EAE5DC] flex items-center justify-between bg-[#F3F1EC]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8D8A]">
                    {selectedProject.category === 'residential' ? 'Rezidenční projekt' : 'Komerční projekt'} · {selectedProject.year}
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                    {getLangField(selectedProject.title)}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-[#1C1B1A] hover:bg-[#EAE5DC] rounded-xs transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Main Image Display Area */}
                <div className="relative rounded-xs overflow-hidden border border-[#EAE5DC] bg-[#1C1B1A]/5 aspect-16/10 sm:aspect-16/9">
                  <img
                    src={
                      selectedProject.galleryImages?.[activeGalleryIndex] ||
                      selectedProject.mainImage
                    }
                    alt={getLangField(selectedProject.title)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Gallery thumbnails */}
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {selectedProject.galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`w-20 h-14 rounded-xs overflow-hidden border-2 shrink-0 transition-all ${
                          activeGalleryIndex === idx
                            ? 'border-[#1C1B1A] scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Project Description & Specs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="font-serif text-xl font-normal text-[#1C1B1A]">
                      Popis projektu & vizualizace
                    </h4>
                    <p className="text-sm text-[#5A5853] leading-relaxed">
                      {getLangField(selectedProject.description)}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#6C6A65]">
                      <div>
                        <span className="font-semibold text-[#1C1B1A] block">{t.locationLabel}:</span>
                        <span>{getLangField(selectedProject.location)}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#1C1B1A] block">{t.yearLabel}:</span>
                        <span>{selectedProject.year}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#1C1B1A] block">{t.areaLabel}:</span>
                        <span>{selectedProject.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Materials & Partner Suppliers List */}
                  {selectedProject.materials && selectedProject.materials.length > 0 && (
                    <div className="md:col-span-5 bg-[#F3F1EC] p-5 rounded-xs border border-[#EAE5DC] space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#1C1B1A]" />
                        {t.modalMaterials}
                      </h4>

                      <div className="space-y-2.5">
                        {selectedProject.materials.map((mat, idx) => (
                          <div
                            key={idx}
                            className="bg-[#FAF9F6] p-3 rounded-xs border border-[#EAE5DC] flex items-start justify-between"
                          >
                            <div>
                              <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                                {mat.type}
                              </span>
                              <span className="text-xs font-medium text-[#1C1B1A] block mt-0.5">
                                {getLangField(mat.name)}
                              </span>
                            </div>

                            {mat.brand && (
                              <a
                                href={mat.brandUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-[#1C1B1A] text-[#FAF9F6] text-[10px] font-mono font-semibold rounded-xs hover:bg-[#3A3835] transition-colors shrink-0 flex items-center gap-1"
                              >
                                <span>{mat.brand}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#F3F1EC] border-t border-[#EAE5DC] flex items-center justify-between">
                <span className="text-xs text-[#6C6A65]">
                  Poptáváte podobný typ projektu?
                </span>

                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3A3835] transition-colors"
                >
                  Konzultovat projekt
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
