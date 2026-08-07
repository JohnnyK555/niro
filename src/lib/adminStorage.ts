import { Project, Inquiry, Language, ContactInfo } from '../types';
import { projectsData } from '../data/projects';
import { translations } from '../data/translations';

const PROJECTS_KEY = 'niro_admin_projects';
const TRANSLATIONS_KEY = 'niro_admin_translations';
const INQUIRIES_KEY = 'niro_admin_inquiries';
const CONTACT_INFO_KEY = 'niro_admin_contact_info';
const ROBOT_EMAIL_KEY = 'niro_admin_robot_email';
const ADMIN_AUTH_KEY = 'niro_admin_session';

export interface RobotEmailConfig {
  robotEmail: string;
  recipientEmail: string;
  senderName: string;
  autoSendEnabled: boolean;
  webhookUrl?: string;
}

export const DEFAULT_ROBOT_EMAIL_CONFIG: RobotEmailConfig = {
  robotEmail: 'poptavky-robot@nirodesign.cz',
  recipientEmail: 'nikola@nirodesign.cz',
  senderName: 'NIRO Studio Poptávkový Automat',
  autoSendEnabled: true,
  webhookUrl: '',
};

export function getStoredRobotEmailConfig(): RobotEmailConfig {
  try {
    const raw = localStorage.getItem(ROBOT_EMAIL_KEY);
    if (!raw) return DEFAULT_ROBOT_EMAIL_CONFIG;
    return { ...DEFAULT_ROBOT_EMAIL_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading robot email config:', err);
    return DEFAULT_ROBOT_EMAIL_CONFIG;
  }
}

export function saveStoredRobotEmailConfig(config: RobotEmailConfig): void {
  localStorage.setItem(ROBOT_EMAIL_KEY, JSON.stringify(config));
}
const ADMIN_PASSWORD_KEY = 'niro_admin_password';

// Default Contact Info
export const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: 'nikola@nirodesign.cz',
  phone: '+420 732 163 410',
  instagram: 'https://instagram.com/niro.studio',
  studioLocation: 'Praha & celá ČR',
};

export function getStoredContactInfo(): ContactInfo {
  try {
    const raw = localStorage.getItem(CONTACT_INFO_KEY);
    if (!raw) return DEFAULT_CONTACT_INFO;
    return { ...DEFAULT_CONTACT_INFO, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading stored contact info:', err);
    return DEFAULT_CONTACT_INFO;
  }
}

export function saveStoredContactInfo(info: ContactInfo): void {
  localStorage.setItem(CONTACT_INFO_KEY, JSON.stringify(info));
}

// Default Password for Nikola
const DEFAULT_PASSWORD = 'nikola';

export function getAdminPassword(): string {
  const custom = localStorage.getItem(ADMIN_PASSWORD_KEY);
  return custom || DEFAULT_PASSWORD;
}

export function setAdminPassword(newPassword: string): void {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function adminLogin(password: string): boolean {
  if (password === getAdminPassword()) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

// Projects Storage
export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading stored projects:', err);
    return [];
  }
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Chyba při ukládání projektů do localStorage (možná zaplněná paměť prohlížeče):', err);
    alert('Upozornění: Paměť prohlížeče pro lokální data je z většiny plná. Projekt byl uložen do paměti relace.');
  }
}

export function addProject(newProj: Project): Project[] {
  const current = getStoredProjects();
  const updated = [newProj, ...current];
  saveStoredProjects(updated);
  return updated;
}

export function updateProject(updatedProj: Project): Project[] {
  const current = getStoredProjects();
  const updated = current.map((p) => (p.id === updatedProj.id ? updatedProj : p));
  saveStoredProjects(updated);
  return updated;
}

export function deleteProject(id: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProjects(updated);
  return updated;
}

// Translations Storage
export function getStoredTranslations(): Record<Language, Record<string, string>> {
  try {
    const raw = localStorage.getItem(TRANSLATIONS_KEY);
    if (!raw) return translations;
    const parsed = JSON.parse(raw);
    // Deep merge defaults with stored custom edits
    return {
      cs: { ...translations.cs, ...(parsed.cs || {}) },
      en: { ...translations.en, ...(parsed.en || {}) },
      ru: { ...translations.ru, ...(parsed.ru || {}) },
      vi: { ...translations.vi, ...(parsed.vi || {}) },
    };
  } catch (err) {
    console.error('Error reading stored translations:', err);
    return translations;
  }
}

export function saveStoredTranslations(trans: Record<Language, Record<string, string>>): void {
  localStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(trans));
}

// Inquiries Storage
export function getStoredInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) return getSampleInquiries();
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored inquiries:', err);
    return [];
  }
}

export function saveStoredInquiries(inquiries: Inquiry[]): void {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
}

export function addInquiry(inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
  const current = getStoredInquiries();
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: `NIRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newInquiry, ...current];
  saveStoredInquiries(updated);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry['status'], notes?: string): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, status, ...(notes !== undefined ? { notes } : {}) } : inq));
  saveStoredInquiries(updated);
  return updated;
}

export function deleteInquiry(id: string): Inquiry[] {
  const current = getStoredInquiries();
  const updated = current.filter((inq) => inq.id !== id);
  saveStoredInquiries(updated);
  return updated;
}

function getSampleInquiries(): Inquiry[] {
  return [
    {
      id: 'NIRO-2026-8812',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      name: 'Tereza Kratochvílová',
      email: 'terez.kratochvilova@email.cz',
      phone: '+420 774 123 987',
      projectType: 'optApt',
      spaceSize: '95 m²',
      budget: '650 000 CZK',
      message: 'Dobrý den Nikolo, koupili jsme novostavbu bytu 3+kk v Holešovicích. Rádi bychom zpracovali návrh interiéru a 3D vizualizace kuchyně spojené s obývacím pokojem.',
      status: 'new',
    },
    {
      id: 'NIRO-2026-8410',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      name: 'Martin Svoboda',
      email: 'martin.svoboda@firmasvoboda.cz',
      phone: '+420 602 888 111',
      projectType: 'optCafe',
      spaceSize: '120 m²',
      budget: '1 200 000 CZK',
      message: 'Poptáváme kompletní návrh a autorský dozor pro nové bistro v centru Prahy. Hledáme čistý skandinávský styl a teplé tóny.',
      status: 'read',
    },
  ];
}
