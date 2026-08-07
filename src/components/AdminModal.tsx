import React, { useState, useEffect } from 'react';
import { Project, Inquiry, Language, ContactInfo } from '../types';
import {
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  getStoredProjects,
  saveStoredProjects,
  getStoredTranslations,
  saveStoredTranslations,
  getStoredInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getAdminPassword,
  setAdminPassword,
  getStoredContactInfo,
  saveStoredContactInfo,
  DEFAULT_CONTACT_INFO,
  getStoredRobotEmailConfig,
  saveStoredRobotEmailConfig,
  RobotEmailConfig,
  DEFAULT_ROBOT_EMAIL_CONFIG,
} from '../lib/adminStorage';
import {
  getAllAvailableImages,
  saveCustomUploadedImage,
  saveMultipleCustomUploadedImages,
  deleteCustomUploadedImage,
  ImageAsset,
} from '../lib/imageLibrary';
import { compressImageFile } from '../lib/imageCompressor';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  FileText,
  Layers,
  Inbox,
  Settings,
  Image as ImageIcon,
  Eye,
  Download,
  Upload,
  Key,
  Globe,
  Send,
  AlertCircle,
  Copy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  currentLang: Language;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  currentLang,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'projects' | 'texts' | 'inquiries' | 'settings'>('projects');

  // Admin Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contactInfoState, setContactInfoState] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [robotConfigState, setRobotConfigState] = useState<RobotEmailConfig>(DEFAULT_ROBOT_EMAIL_CONFIG);
  const [imageLibraryState, setImageLibraryState] = useState<ImageAsset[]>([]);
  const [translationsData, setTranslationsData] = useState<Record<Language, Record<string, string>>>({
    cs: {},
    en: {},
    ru: {},
    vi: {},
  });

  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Image Picker Modal State
  const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
  const [pickerTarget, setPickerTarget] = useState<'main' | 'floor' | 'gallery'>('main');

  // New Password State
  const [newPass, setNewPass] = useState<string>('');
  const [passMessage, setPassMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const logged = isAdminLoggedIn();
      setIsLoggedIn(logged);
      if (logged) {
        refreshData();
      }
    }
  }, [isOpen]);

  const refreshData = () => {
    setProjects(getStoredProjects());
    setInquiries(getStoredInquiries());
    setTranslationsData(getStoredTranslations());
    setContactInfoState(getStoredContactInfo());
    setRobotConfigState(getStoredRobotEmailConfig());
    setImageLibraryState(getAllAvailableImages());
  };

  // Device Multi-File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = Array.from(fileList);
    const validFiles: File[] = files.filter((f: File) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert('Některé soubory přesahují velikost 10 MB a byly přeskočeny.');
    }

    if (validFiles.length === 0) return;

    // Read and compress all files as web-optimized Data URLs
    const compressPromises = validFiles.map((file: File) => compressImageFile(file, 1920, 0.82));
    const uploadedResults = await Promise.all(compressPromises);
    const validResults = uploadedResults.filter((r) => r.dataUrl && r.dataUrl.length > 0);

    if (validResults.length === 0) return;

    const newAssets = saveMultipleCustomUploadedImages(validResults);
    setImageLibraryState(getAllAvailableImages());

    const uploadedUrls = validResults.map((r) => r.dataUrl);

    if (editingProject) {
      if (pickerTarget === 'main') {
        const primary = uploadedUrls[0];
        const rest = uploadedUrls.slice(1);
        setEditingProject({
          ...editingProject,
          mainImage: primary,
          visualizationImage: primary,
          realizationImage: primary,
          galleryImages: rest.length > 0 ? [...(editingProject.galleryImages || []), ...rest] : editingProject.galleryImages,
        });
      } else if (pickerTarget === 'floor') {
        const primary = uploadedUrls[0];
        const rest = uploadedUrls.slice(1);
        setEditingProject({
          ...editingProject,
          floorplanImage: primary,
          galleryImages: rest.length > 0 ? [...(editingProject.galleryImages || []), ...rest] : editingProject.galleryImages,
        });
      } else if (pickerTarget === 'gallery') {
        setEditingProject({
          ...editingProject,
          galleryImages: [...(editingProject.galleryImages || []), ...uploadedUrls],
        });
      }
    }

    showSuccess(
      validFiles.length === 1
        ? `Obrázek "${validFiles[0].name}" byl úspěšně nahrán!`
        : `Úspěšně nahráno ${validFiles.length} fotografií do vaší knihovny!`
    );

    // Reset input value so same files can be chosen again if needed
    e.target.value = '';
  };

  const handleSaveRobotConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredRobotEmailConfig(robotConfigState);
    showSuccess('Nastavení Robot E-mailu bylo úspěšně uloženo!');
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passwordInput)) {
      setIsLoggedIn(true);
      setLoginError(null);
      setPasswordInput('');
      refreshData();
    } else {
      setLoginError('Nesprávné heslo.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Sample Images Preset helper
  const sampleImages = [
    { label: 'Obývací pokoj (Hero)', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Moderní Kuchyně', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Penthouse Ložnice', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Kavárna Bistro', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Luxusní Koupelna', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80' },
  ];

  // Save Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title?.cs) return;

    const projToSave: Project = {
      id: editingProject.id || `proj-${Date.now()}`,
      category: editingProject.category || 'residential',
      tags: editingProject.tags || ['visualization'],
      year: editingProject.year || new Date().getFullYear().toString(),
      area: editingProject.area || '90 m²',
      featured: editingProject.featured ?? true,
      title: {
        cs: editingProject.title?.cs || '',
        en: editingProject.title?.en || editingProject.title?.cs || '',
        ru: editingProject.title?.ru || editingProject.title?.cs || '',
        vi: editingProject.title?.vi || editingProject.title?.cs || '',
      },
      subtitle: {
        cs: editingProject.subtitle?.cs || '',
        en: editingProject.subtitle?.en || editingProject.subtitle?.cs || '',
        ru: editingProject.subtitle?.ru || editingProject.subtitle?.cs || '',
        vi: editingProject.subtitle?.vi || editingProject.subtitle?.cs || '',
      },
      location: {
        cs: editingProject.location?.cs || 'Praha',
        en: editingProject.location?.en || 'Prague',
        ru: editingProject.location?.ru || 'Прага',
        vi: editingProject.location?.vi || 'Prague',
      },
      description: {
        cs: editingProject.description?.cs || '',
        en: editingProject.description?.en || editingProject.description?.cs || '',
        ru: editingProject.description?.ru || editingProject.description?.cs || '',
        vi: editingProject.description?.vi || editingProject.description?.cs || '',
      },
      mainImage: editingProject.mainImage || sampleImages[0].url,
      visualizationImage: editingProject.visualizationImage || editingProject.mainImage || sampleImages[0].url,
      realizationImage: editingProject.realizationImage || editingProject.mainImage || sampleImages[0].url,
      floorplanImage: editingProject.floorplanImage || '',
      galleryImages: editingProject.galleryImages || [editingProject.mainImage || sampleImages[0].url],
      materials: editingProject.materials || [],
    };

    let updatedList: Project[] = [];
    if (isAddingProject) {
      updatedList = [projToSave, ...projects];
    } else {
      updatedList = projects.map((p) => (p.id === projToSave.id ? projToSave : p));
    }

    setProjects(updatedList);
    saveStoredProjects(updatedList);
    setEditingProject(null);
    setIsAddingProject(false);
    onDataChanged();
    showSuccess('Projekt byl úspěšně uložen!');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Opravdu chcete smazat tento projekt?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveStoredProjects(updated);
      onDataChanged();
      showSuccess('Projekt byl odstraněn.');
    }
  };

  // Save Contact Info
  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredContactInfo(contactInfoState);
    onDataChanged();
    showSuccess('Kontaktní údaje byly úspěšně uloženy!');
  };

  // Save Translations Text
  const handleSaveTextKey = (key: string, value: string) => {
    const updated = {
      ...translationsData,
      [selectedLang]: {
        ...translationsData[selectedLang],
        [key]: value,
      },
    };
    setTranslationsData(updated);
    saveStoredTranslations(updated);
    onDataChanged();
  };

  // Export & Import Backup
  const handleExportBackup = () => {
    const backupObj = {
      projects,
      translations: translationsData,
      inquiries,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `niro-studio-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Záloha stažena!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects) {
          setProjects(parsed.projects);
          saveStoredProjects(parsed.projects);
        }
        if (parsed.translations) {
          setTranslationsData(parsed.translations);
          saveStoredTranslations(parsed.translations);
        }
        if (parsed.inquiries) {
          setInquiries(parsed.inquiries);
        }
        refreshData();
        onDataChanged();
        showSuccess('Záloha byla úspěšně načtena!');
      } catch (err) {
        alert('Soubor zálohy se nepodařilo načíst.');
      }
    };
    reader.readAsText(file);
  };

  const handleChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 3) {
      setPassMessage('Heslo musí mít alespoň 3 znaky.');
      return;
    }
    setAdminPassword(newPass);
    setNewPass('');
    setPassMessage('Heslo bylo změněno!');
    setTimeout(() => setPassMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B1A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] border border-[#1C1B1A] w-full max-w-5xl rounded-xs shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#1C1B1A] text-[#FAF9F6] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C5A059] text-[#1C1B1A] rounded-xs font-bold text-xs">
              NIRO
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#FAF9F6]">
                Ateliér Web Admin · Nikola Rohlová
              </h3>
              <p className="text-[10px] text-[#D8D2C4] font-mono">
                Správa obsahu, 3D vizualizací, textů a přijatých poptávek
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-[#3A3835] hover:bg-rose-900 text-[#FAF9F6] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
                title="Odhlásit se"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Odhlásit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#D8D2C4] hover:text-[#FAF9F6] hover:bg-[#3A3835] rounded-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-800 text-white px-6 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 animate-in slide-in-from-top duration-200 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="p-8 md:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 bg-[#1C1B1A] text-[#FAF9F6] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                Přihlášení do správy webu
              </h4>
              <p className="text-xs text-[#6C6A65] mt-1">
                Zadejte přístupové heslo pro úpravu projektů a textů.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                  Heslo správce
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Zadejte heslo..."
                  className="w-full bg-white border border-[#D8D2C4] p-3 text-xs rounded-xs text-[#1C1B1A] focus:outline-hidden focus:border-[#1C1B1A]"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#3A3835] transition-all shadow-xs"
              >
                Přihlásit se
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-[#F3F1EC] border-b md:border-b-0 md:border-r border-[#EAE5DC] p-4 flex md:flex-col gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setEditingProject(null);
                  setIsAddingProject(false);
                }}
                className={`w-full px-4 py-3 rounded-xs text-xs font-semibold uppercase tracking-wider text-left transition-all flex items-center justify-between whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                    : 'text-[#6C6A65] hover:bg-[#EAE5DC] hover:text-[#1C1B1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Projekty & 3D Rendery</span>
                </div>
                <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded-full">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full px-4 py-3 rounded-xs text-xs font-semibold uppercase tracking-wider text-left transition-all flex items-center justify-between whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                    : 'text-[#6C6A65] hover:bg-[#EAE5DC] hover:text-[#1C1B1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Poptávky</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('texts')}
                className={`w-full px-4 py-3 rounded-xs text-xs font-semibold uppercase tracking-wider text-left transition-all flex items-center justify-between whitespace-nowrap ${
                  activeTab === 'texts'
                    ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                    : 'text-[#6C6A65] hover:bg-[#EAE5DC] hover:text-[#1C1B1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Texty webu</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-4 py-3 rounded-xs text-xs font-semibold uppercase tracking-wider text-left transition-all flex items-center justify-between whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                    : 'text-[#6C6A65] hover:bg-[#EAE5DC] hover:text-[#1C1B1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Záloha & Heslo</span>
                </div>
              </button>
            </div>

            {/* Main Panel View */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              {/* TAB 1: PROJECTS & VISUALIZATIONS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {!editingProject && !isAddingProject ? (
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE5DC]">
                        <div>
                          <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                            Správa portfolio projektů & 3D vizualizací
                          </h4>
                          <p className="text-xs text-[#6C6A65] mt-1">
                            Přidávejte nové návrhy, upravujte existující realizace a nahrávejte vizualizace.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setIsAddingProject(true);
                            setEditingProject({
                              category: 'residential',
                              tags: ['visualization'],
                              year: new Date().getFullYear().toString(),
                              area: '85 m²',
                              featured: true,
                              title: { cs: '', en: '', ru: '', vi: '' },
                              subtitle: { cs: '', en: '', ru: '', vi: '' },
                              location: { cs: 'Praha', en: 'Prague', ru: 'Прага', vi: 'Prague' },
                              description: { cs: '', en: '', ru: '', vi: '' },
                              mainImage: sampleImages[0].url,
                              visualizationImage: sampleImages[0].url,
                              materials: [],
                            });
                          }}
                          className="px-4 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all flex items-center gap-2 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Přidat projekt</span>
                        </button>
                      </div>

                      {/* Project Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="bg-white border border-[#EAE5DC] rounded-xs p-5 shadow-2xs space-y-4 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="aspect-16/9 bg-neutral-100 rounded-xs overflow-hidden relative group">
                                <img
                                  src={proj.mainImage}
                                  alt={proj.title.cs}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                  <span className="text-[10px] font-mono font-bold bg-[#1C1B1A] text-white px-2 py-0.5 rounded-xs uppercase">
                                    {proj.category}
                                  </span>
                                  {proj.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] font-mono bg-[#EAE5DC] text-[#1C1B1A] px-2 py-0.5 rounded-xs uppercase"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-serif text-xl font-normal text-[#1C1B1A]">
                                  {proj.title.cs || 'Nepojmenovaný projekt'}
                                </h5>
                                <p className="text-xs text-[#6C6A65] line-clamp-2 mt-1">
                                  {proj.subtitle.cs}
                                </p>
                              </div>

                              <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8D8A] pt-2 border-t border-[#EAE5DC]">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {proj.location.cs}
                                </span>
                                <span>{proj.area}</span>
                                <span>{proj.year}</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProject({ ...proj });
                                  setIsAddingProject(false);
                                }}
                                className="px-3 py-1.5 bg-[#F3F1EC] hover:bg-[#EAE5DC] text-[#1C1B1A] text-xs font-semibold rounded-xs border border-[#D8D2C4] flex items-center gap-1.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Upravit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-700 hover:text-rose-900 rounded-xs transition-colors"
                                title="Smazat projekt"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* FORM: EDIT OR ADD PROJECT */
                    <form onSubmit={handleSaveProject} className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
                        <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                          {isAddingProject ? 'Nová 3D Vizualizace / Projekt' : `Úprava projektu: ${editingProject?.title?.cs}`}
                        </h4>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="px-3 py-1.5 bg-[#EAE5DC] text-[#1C1B1A] text-xs font-semibold rounded-xs"
                        >
                          Zrušit
                        </button>
                      </div>

                      {/* Presets images row */}
                      <div className="p-4 bg-[#F3F1EC] border border-[#EAE5DC] rounded-xs space-y-2">
                        <span className="text-[11px] font-mono text-[#8E8D8A] uppercase block">
                          Rychlý výběr ukázkových fotek/renderů pro tento projekt:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {sampleImages.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setEditingProject({
                                  ...editingProject,
                                  mainImage: s.url,
                                  visualizationImage: s.url,
                                  realizationImage: s.url,
                                });
                              }}
                              className="px-2.5 py-1 bg-white border border-[#D8D2C4] hover:bg-[#1C1B1A] hover:text-white text-[11px] font-medium rounded-xs transition-colors"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                            Název projektu (Česky) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProject?.title?.cs || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                title: { ...editingProject?.title, cs: e.target.value } as any,
                              })
                            }
                            placeholder="Např. Mezonet Vinohrady"
                            className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                            Kategorie
                          </label>
                          <select
                            value={editingProject?.category || 'residential'}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                category: e.target.value as any,
                              })
                            }
                            className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          >
                            <option value="residential">Rezidenční (Byty & Domy)</option>
                            <option value="commercial">Komerční (Kavárny & Kanceláře)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                            Lokalita
                          </label>
                          <input
                            type="text"
                            value={editingProject?.location?.cs || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                location: { ...editingProject?.location, cs: e.target.value } as any,
                              })
                            }
                            placeholder="Praha 2"
                            className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                            Rok
                          </label>
                          <input
                            type="text"
                            value={editingProject?.year || '2026'}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                year: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                            Plocha (m²)
                          </label>
                          <input
                            type="text"
                            value={editingProject?.area || '110 m²'}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                area: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                          Podtitul (Česky)
                        </label>
                        <input
                          type="text"
                          value={editingProject?.subtitle?.cs || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              subtitle: { ...editingProject?.subtitle, cs: e.target.value } as any,
                            })
                          }
                          placeholder="Krátký popis stylu a materiálů..."
                          className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                          Detailní popis projektu
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject?.description?.cs || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              description: { ...editingProject?.description, cs: e.target.value } as any,
                            })
                          }
                          placeholder="Popis zadání, průběhu a architektonického řešení..."
                          className="w-full bg-white border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      {/* Visual Image Selection & Device File Upload */}
                      <div className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE5DC]">
                          <div>
                            <h5 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                              <span>Obrázky projektu & Vizualizace</span>
                            </h5>
                            <p className="text-xs text-[#6C6A65]">
                              Vyberte si fotku/render z vaší knihovny nebo nahrajte vlastní soubor přímo z vaší složky v počítači nebo telefonu.
                            </p>
                          </div>

                          <label className="px-4 py-2 bg-[#C5A059] text-[#1C1B1A] font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#B59049] transition-all flex items-center gap-2 shrink-0 shadow-xs">
                            <Upload className="w-4 h-4" />
                            <span>📁 Nahrát fotku / fotky (i více najednou)</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                setPickerTarget('main');
                                handleFileUpload(e);
                              }}
                            />
                          </label>
                        </div>

                        {/* Image Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Main Image Card */}
                          <div className="p-4 bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs space-y-3">
                            <span className="text-xs font-mono font-bold text-[#1C1B1A] uppercase block">
                              1. Hlavní vizualizace / Náhled
                            </span>

                            {editingProject?.mainImage ? (
                              <div className="aspect-16/9 bg-neutral-200 rounded-xs overflow-hidden relative group border border-[#D8D2C4]">
                                <img
                                  src={editingProject.mainImage}
                                  alt="Main"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-16/9 bg-[#F3F1EC] border border-dashed border-[#D8D2C4] rounded-xs flex flex-col items-center justify-center text-[#8E8D8A] text-xs">
                                <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                                <span>Žádný obrázek vybrán</span>
                              </div>
                            )}

                            <div className="flex gap-2 pt-1">
                              <label className="flex-1 py-1.5 px-3 bg-[#EAE5DC] hover:bg-[#D8D2C4] text-[#1C1B1A] text-xs font-semibold rounded-xs cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Nahrát soubor(y)</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    setPickerTarget('main');
                                    handleFileUpload(e);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget('main');
                                  setShowImagePickerModal(true);
                                }}
                                className="flex-1 py-1.5 px-3 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Knihovna ({imageLibraryState.length})</span>
                              </button>
                            </div>
                          </div>

                          {/* Floorplan Card */}
                          <div className="p-4 bg-[#FAF9F6] border border-[#EAE5DC] rounded-xs space-y-3">
                            <span className="text-xs font-mono font-bold text-[#1C1B1A] uppercase block">
                              2. Architektonický půdorys / výkres
                            </span>

                            {editingProject?.floorplanImage ? (
                              <div className="aspect-16/9 bg-neutral-200 rounded-xs overflow-hidden relative group border border-[#D8D2C4]">
                                <img
                                  src={editingProject.floorplanImage}
                                  alt="Floorplan"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-16/9 bg-[#F3F1EC] border border-dashed border-[#D8D2C4] rounded-xs flex flex-col items-center justify-center text-[#8E8D8A] text-xs">
                                <FileText className="w-8 h-8 mb-1 opacity-50" />
                                <span>Půdorys ještě není nahrán</span>
                              </div>
                            )}

                            <div className="flex gap-2 pt-1">
                              <label className="flex-1 py-1.5 px-3 bg-[#EAE5DC] hover:bg-[#D8D2C4] text-[#1C1B1A] text-xs font-semibold rounded-xs cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Nahrát soubor(y)</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    setPickerTarget('floor');
                                    handleFileUpload(e);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget('floor');
                                  setShowImagePickerModal(true);
                                }}
                                className="flex-1 py-1.5 px-3 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Knihovna</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Gallery Images List */}
                        <div className="pt-4 border-t border-[#EAE5DC] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#1C1B1A] uppercase">
                              3. Galerie dalších fotografií projektu ({editingProject?.galleryImages?.length || 0})
                            </span>

                            <div className="flex items-center gap-2">
                              <label className="px-3 py-1 bg-[#EAE5DC] hover:bg-[#D8D2C4] text-[#1C1B1A] text-xs font-semibold rounded-xs cursor-pointer flex items-center gap-1 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Nahrát fotky z PC/Mobilu (i více)</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    setPickerTarget('gallery');
                                    handleFileUpload(e);
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget('gallery');
                                  setShowImagePickerModal(true);
                                }}
                                className="px-3 py-1 bg-[#1C1B1A] text-white text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-colors flex items-center gap-1"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Vybrat z knihovny</span>
                              </button>
                            </div>
                          </div>

                          {editingProject?.galleryImages && editingProject.galleryImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {editingProject.galleryImages.map((imgUrl, idx) => (
                                <div key={idx} className="relative aspect-4/3 rounded-xs overflow-hidden border border-[#D8D2C4] group">
                                  <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = editingProject.galleryImages?.filter((_, i) => i !== idx);
                                      setEditingProject({ ...editingProject, galleryImages: updated });
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-rose-800 text-white rounded-full opacity-80 group-hover:opacity-100 hover:bg-rose-900 transition-opacity"
                                    title="Odstranit fotku z galerie"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-[#8E8D8A] italic">
                              Galerie zatím neobsahuje další snímky.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#EAE5DC] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="px-5 py-2.5 bg-[#EAE5DC] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider rounded-xs"
                        >
                          Zrušit
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all shadow-xs"
                        >
                          Uložit projekt
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: INQUIRIES MANAGER */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  {/* Robot Email Configuration Box */}
                  <form onSubmit={handleSaveRobotConfig} className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE5DC]">
                      <div>
                        <h5 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
                          <Send className="w-4 h-4 text-[#C5A059]" />
                          <span>Odesílací Robot E-mail (Automatický Poptávkový Systém)</span>
                        </h5>
                        <p className="text-xs text-[#6C6A65] mt-0.5">
                          Když návštěvník vyplní formulář, poptávka se automaticky doručí z vaší robotické adresy přímo do vašeho e-mailu bez nucení klienta otevírat e-mailovou aplikaci.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all shrink-0"
                      >
                        Uložit robota
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          E-mail odesílacího robota
                        </label>
                        <input
                          type="email"
                          required
                          value={robotConfigState.robotEmail}
                          onChange={(e) => setRobotConfigState({ ...robotConfigState, robotEmail: e.target.value })}
                          placeholder="poptavky-robot@nirodesign.cz"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Cílová schránka (E-mail Nikoly)
                        </label>
                        <input
                          type="email"
                          required
                          value={robotConfigState.recipientEmail}
                          onChange={(e) => setRobotConfigState({ ...robotConfigState, recipientEmail: e.target.value })}
                          placeholder="nikola@nirodesign.cz"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Jméno odesílatele robota
                        </label>
                        <input
                          type="text"
                          value={robotConfigState.senderName}
                          onChange={(e) => setRobotConfigState({ ...robotConfigState, senderName: e.target.value })}
                          placeholder="NIRO Studio Poptávky"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          E-mail Webhook / Gateway Service URL (volitelné)
                        </label>
                        <input
                          type="text"
                          value={robotConfigState.webhookUrl || ''}
                          onChange={(e) => setRobotConfigState({ ...robotConfigState, webhookUrl: e.target.value })}
                          placeholder="https://api.emailjs.com/api/v1.0/email/send..."
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>
                    </div>
                  </form>

                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
                    <div>
                      <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                        Přijaté poptávky klientů
                      </h4>
                      <p className="text-xs text-[#6C6A65] mt-1">
                        Seznam zpráv z poptávkového formuláře na webu.
                      </p>
                    </div>

                    <span className="text-xs font-mono bg-[#1C1B1A] text-[#FAF9F6] px-3 py-1 rounded-full">
                      Celkem: {inquiries.length}
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-12 text-center text-[#8E8D8A] bg-[#F3F1EC] rounded-xs">
                      Zatím nemáte žádné přijaté poptávky.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className={`p-6 rounded-xs border transition-all ${
                            inq.status === 'new'
                              ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                              : 'bg-white border-[#EAE5DC]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                                  inq.status === 'new'
                                    ? 'bg-amber-500 text-white'
                                    : inq.status === 'replied'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-neutral-200 text-neutral-800'
                                }`}
                              >
                                {inq.status === 'new'
                                  ? 'Nová poptávka'
                                  : inq.status === 'replied'
                                  ? 'Vyřízeno'
                                  : 'Přečteno'}
                              </span>

                              <span className="text-xs font-mono text-[#8E8D8A]">
                                ID: {inq.id}
                              </span>
                            </div>

                            <span className="text-[11px] font-mono text-[#8E8D8A]">
                              {new Date(inq.createdAt).toLocaleString('cs-CZ')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#EAE5DC]">
                            <div>
                              <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                                Jméno klienta:
                              </span>
                              <span className="text-sm font-bold text-[#1C1B1A]">
                                {inq.name}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                                Kontakt:
                              </span>
                              <a
                                href={`mailto:${inq.email}`}
                                className="text-xs font-semibold text-[#1C1B1A] hover:underline block"
                              >
                                {inq.email}
                              </a>
                              {inq.phone && (
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="text-xs text-[#6C6A65] hover:underline block"
                                >
                                  {inq.phone}
                                </a>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                                Plocha & Rozpočet:
                              </span>
                              <span className="text-xs text-[#1C1B1A] block">
                                {inq.spaceSize || 'Neuvedeno'} · {inq.budget || 'Rozpočet neuveden'}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#FAF9F6] p-4 rounded-xs border border-[#EAE5DC] text-xs text-[#1C1B1A] leading-relaxed mb-4 whitespace-pre-wrap">
                            {inq.message || 'Bez doplňující zprávy.'}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <a
                              href={`mailto:${inq.email}?subject=Odpověď na poptávku NIRO Studio (${inq.id})&body=Dobrý den ${inq.name},%0D%0A%0D%0Aděkuji za Vaši poptávku.`}
                              onClick={() => {
                                updateInquiryStatus(inq.id, 'replied');
                                setInquiries(getStoredInquiries());
                              }}
                              className="px-4 py-2 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold rounded-xs hover:bg-[#3A3835] transition-colors flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Odpovědět e-mailem</span>
                            </a>

                            <div className="flex items-center gap-2">
                              {inq.status === 'new' && (
                                <button
                                  onClick={() => {
                                    updateInquiryStatus(inq.id, 'read');
                                    setInquiries(getStoredInquiries());
                                  }}
                                  className="px-3 py-1.5 bg-[#EAE5DC] text-[#1C1B1A] text-xs font-medium rounded-xs hover:bg-[#D8D2C4]"
                                >
                                  Označit jako přečtené
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  deleteInquiry(inq.id);
                                  setInquiries(getStoredInquiries());
                                }}
                                className="p-1.5 hover:bg-rose-50 text-rose-700 rounded-xs"
                                title="Smazat poptávku"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TEXTS EDITOR */}
              {activeTab === 'texts' && (
                <div className="space-y-6">
                  {/* Contact Info Card */}
                  <form onSubmit={handleSaveContactInfo} className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                      <div>
                        <h5 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#C5A059]" />
                          <span>Hlavní kontaktní údaje Nikoly</span>
                        </h5>
                        <p className="text-xs text-[#6C6A65] mt-0.5">
                          Tento e-mail, telefon a Instagram se automaticky zobrazují na celém webu a slouží k doručování poptávek.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all shrink-0"
                      >
                        Uložit kontakty
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          E-mail pro poptávky
                        </label>
                        <input
                          type="email"
                          required
                          value={contactInfoState.email}
                          onChange={(e) => setContactInfoState({ ...contactInfoState, email: e.target.value })}
                          placeholder="nikola@nirodesign.cz"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Telefonní číslo
                        </label>
                        <input
                          type="text"
                          required
                          value={contactInfoState.phone}
                          onChange={(e) => setContactInfoState({ ...contactInfoState, phone: e.target.value })}
                          placeholder="+420 732 163 410"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Instagram profil (URL nebo @handle)
                        </label>
                        <input
                          type="text"
                          value={contactInfoState.instagram}
                          onChange={(e) => setContactInfoState({ ...contactInfoState, instagram: e.target.value })}
                          placeholder="https://instagram.com/niro.studio"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Lokalita / Působnost ateliéru
                        </label>
                        <input
                          type="text"
                          value={contactInfoState.studioLocation}
                          onChange={(e) => setContactInfoState({ ...contactInfoState, studioLocation: e.target.value })}
                          placeholder="Praha & celá ČR"
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>
                    </div>
                  </form>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE5DC]">
                    <div>
                      <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                        Úprava textů na webu
                      </h4>
                      <p className="text-xs text-[#6C6A65] mt-1">
                        Vyberte jazykovou verzi pro úpravu nadpisů, popisů a tlačítek.
                      </p>
                    </div>

                    <div className="flex items-center bg-[#EAE5DC] p-1 rounded-full">
                      {(['cs', 'en', 'ru', 'vi'] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={`px-3.5 py-1 text-xs font-bold rounded-full uppercase transition-all ${
                            selectedLang === lang
                              ? 'bg-[#1C1B1A] text-[#FAF9F6] shadow-xs'
                              : 'text-[#6C6A65] hover:text-[#1C1B1A]'
                          }`}
                        >
                          {lang === 'cs' ? '🇨🇿 CS' : lang === 'en' ? '🇬🇧 EN' : lang === 'ru' ? '🇷🇺 RU' : '🇻🇳 VI'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 max-w-3xl">
                    {/* Hero Section */}
                    <div className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                      <h5 className="font-serif text-lg font-bold text-[#1C1B1A]">Úvodní sekce (Hero)</h5>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Hlavní nadpis
                        </label>
                        <textarea
                          rows={2}
                          value={translationsData[selectedLang]?.heroTitle || ''}
                          onChange={(e) => handleSaveTextKey('heroTitle', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Popis ateliéru
                        </label>
                        <textarea
                          rows={3}
                          value={translationsData[selectedLang]?.heroDesc || ''}
                          onChange={(e) => handleSaveTextKey('heroDesc', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                            Tlačítko Portfolio
                          </label>
                          <input
                            type="text"
                            value={translationsData[selectedLang]?.heroBtnPortfolio || ''}
                            onChange={(e) => handleSaveTextKey('heroBtnPortfolio', e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                            Tlačítko Kontakt
                          </label>
                          <input
                            type="text"
                            value={translationsData[selectedLang]?.heroBtnContact || ''}
                            onChange={(e) => handleSaveTextKey('heroBtnContact', e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                      <h5 className="font-serif text-lg font-bold text-[#1C1B1A]">O Nikole & Filosofii</h5>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Hlavní nadpis sekce
                        </label>
                        <input
                          type="text"
                          value={translationsData[selectedLang]?.aboutHeading || ''}
                          onChange={(e) => handleSaveTextKey('aboutHeading', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Úvodní perex (O Nikole)
                        </label>
                        <textarea
                          rows={3}
                          value={translationsData[selectedLang]?.aboutIntro || ''}
                          onChange={(e) => handleSaveTextKey('aboutIntro', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>
                    </div>

                    {/* Portfolio Section */}
                    <div className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                      <h5 className="font-serif text-lg font-bold text-[#1C1B1A]">Sekce Portfolio</h5>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Nadpis Portfolio
                        </label>
                        <input
                          type="text"
                          value={translationsData[selectedLang]?.portHeading || ''}
                          onChange={(e) => handleSaveTextKey('portHeading', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Podnadpis
                        </label>
                        <input
                          type="text"
                          value={translationsData[selectedLang]?.portSubheading || ''}
                          onChange={(e) => handleSaveTextKey('portSubheading', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="p-5 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                      <h5 className="font-serif text-lg font-bold text-[#1C1B1A]">Sekce Kontakt</h5>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Nadpis sekce kontakt
                        </label>
                        <input
                          type="text"
                          value={translationsData[selectedLang]?.contactHeading || ''}
                          onChange={(e) => handleSaveTextKey('contactHeading', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#8E8D8A] block mb-1">
                          Podnadpis
                        </label>
                        <input
                          type="text"
                          value={translationsData[selectedLang]?.contactSubheading || ''}
                          onChange={(e) => handleSaveTextKey('contactSubheading', e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-8 max-w-xl">
                  <div>
                    <h4 className="font-serif text-2xl font-normal text-[#1C1B1A]">
                      Zálohování & Změna hesla
                    </h4>
                    <p className="text-xs text-[#6C6A65] mt-1">
                      Stáhněte si zálohu dat nebo změňte přihlašovací heslo správce.
                    </p>
                  </div>

                  {/* Change password */}
                  <form onSubmit={handleChangePass} className="p-6 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                    <h5 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#C5A059]" />
                      <span>Změna přístupového hesla</span>
                    </h5>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] block mb-1">
                        Nové heslo pro Nikolu
                      </label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Nové heslo..."
                        className="w-full bg-[#FAF9F6] border border-[#D8D2C4] p-2.5 text-xs rounded-xs text-[#1C1B1A]"
                      />
                    </div>

                    {passMessage && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs">
                        {passMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs"
                    >
                      Uložit nové heslo
                    </button>
                  </form>

                  {/* Backup / Export / Import */}
                  <div className="p-6 bg-white border border-[#EAE5DC] rounded-xs space-y-4">
                    <h5 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#1C1B1A]" />
                      <span>Export & Import zálohy dat</span>
                    </h5>

                    <p className="text-xs text-[#6C6A65]">
                      Můžete si exportovat kompletní zálohu projektů, úprav textů a přijatých poptávek do jednoho JSON souboru a později ho načíst na jiném zařízení.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleExportBackup}
                        className="px-4 py-2.5 bg-[#1C1B1A] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#3A3835] transition-all flex items-center gap-2 shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Stáhnout JSON zálohu</span>
                      </button>

                      <label className="px-4 py-2.5 bg-[#EAE5DC] hover:bg-[#D8D2C4] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Načíst zálohu ze souboru</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* IMAGE PICKER MODAL DIALOG */}
      {showImagePickerModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#D8D2C4] w-full max-w-4xl max-h-[85vh] rounded-xs shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 bg-[#1C1B1A] text-[#FAF9F6] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h4 className="font-serif text-lg font-normal">Knihovna obrázků & vizualizací</h4>
                  <p className="text-[11px] text-[#A39E93]">
                    Vyberte vizuální náhled pro: {pickerTarget === 'main' ? 'Hlavní Vizualizaci' : pickerTarget === 'floor' ? 'Půdorys / Výkres' : 'Galerii projektu'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowImagePickerModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#F3F1EC] border-b border-[#EAE5DC] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#6C6A65]">
                Dostupné obrázky v knihovně ({imageLibraryState.length})
              </span>

              <label className="px-4 py-2 bg-[#C5A059] text-[#1C1B1A] font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#B59049] transition-all flex items-center gap-2 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>📁 Nahrát z vašeho zařízení (i více fotek)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageLibraryState.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white border border-[#EAE5DC] rounded-xs overflow-hidden shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-4/3 bg-neutral-100 overflow-hidden relative">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono font-bold bg-[#1C1B1A]/80 text-white px-1.5 py-0.5 rounded-xs uppercase">
                      {asset.category === 'custom' ? 'Nahrané' : 'Vzor'}
                    </span>
                  </div>

                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-[#1C1B1A] truncate" title={asset.name}>
                      {asset.name}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (editingProject) {
                            if (pickerTarget === 'main') {
                              setEditingProject({
                                ...editingProject,
                                mainImage: asset.url,
                                visualizationImage: asset.url,
                              });
                            } else if (pickerTarget === 'floor') {
                              setEditingProject({
                                ...editingProject,
                                floorplanImage: asset.url,
                              });
                            } else if (pickerTarget === 'gallery') {
                              setEditingProject({
                                ...editingProject,
                                galleryImages: [...(editingProject.galleryImages || []), asset.url],
                              });
                            }
                          }
                          setShowImagePickerModal(false);
                          showSuccess('Obrázek byl vybrán.');
                        }}
                        className="flex-1 py-1.5 bg-[#1C1B1A] hover:bg-[#3A3835] text-white text-[11px] font-semibold rounded-xs transition-colors text-center"
                      >
                        Vybrat
                      </button>

                      {asset.category === 'custom' && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteCustomUploadedImage(asset.id);
                            setImageLibraryState(getAllAvailableImages());
                            showSuccess('Obrázek byl smazán z knihovny.');
                          }}
                          className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-xs transition-colors"
                          title="Smazat z knihovny"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F3F1EC] border-t border-[#EAE5DC] flex justify-end">
              <button
                type="button"
                onClick={() => setShowImagePickerModal(false)}
                className="px-5 py-2 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
              >
                Zavřít knihovnu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
