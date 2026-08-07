export type Language = 'cs' | 'en' | 'vi' | 'ru';

export type ProjectCategory = 'all' | 'residential' | 'commercial';

export type ProjectTag = 'visualization' | 'floorplan' | 'realization';

export interface MaterialSwatch {
  name: Record<Language, string>;
  brand?: string;
  brandUrl?: string;
  type: string;
}

export interface Project {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  category: 'residential' | 'commercial';
  tags: ProjectTag[];
  year: string;
  location: Record<Language, string>;
  area: string;
  description: Record<Language, string>;
  mainImage: string;
  floorplanImage?: string;
  visualizationImage?: string;
  realizationImage?: string;
  galleryImages?: string[];
  materials: MaterialSwatch[];
  featured?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  url: string;
  category: Record<Language, string>;
  description: Record<Language, string>;
  tagline: Record<Language, string>;
  logoText: string;
  logoUrl?: string;
  logoClassName?: string;
  svgIcon: string;
  brandColor: string;
  highlights: Record<Language, string>[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  instagram: string;
  studioLocation: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  spaceSize: string;
  budget: string;
  message: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  spaceSize: string;
  budget: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes?: string;
}
