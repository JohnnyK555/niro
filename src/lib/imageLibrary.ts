export interface ImageAsset {
  id: string;
  title: string;
  category: 'interior' | 'commercial' | 'floorplan' | 'portrait' | 'custom';
  url: string;
  isCustom?: boolean;
}

export const BUILTIN_IMAGES: ImageAsset[] = [];

const UPLOADED_IMAGES_KEY = 'niro_uploaded_images_library';

export function getCustomUploadedImages(): ImageAsset[] {
  try {
    const raw = localStorage.getItem(UPLOADED_IMAGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading custom images from storage:', err);
    return [];
  }
}

export function saveCustomUploadedImage(title: string, dataUrl: string): ImageAsset {
  const current = getCustomUploadedImages();
  const newAsset: ImageAsset = {
    id: `custom-img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: title || `Nahrán obrázek (${new Date().toLocaleDateString('cs-CZ')})`,
    category: 'custom',
    url: dataUrl,
    isCustom: true,
  };
  const updated = [newAsset, ...current];
  localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(updated));
  return newAsset;
}

export function saveMultipleCustomUploadedImages(images: { title: string; dataUrl: string }[]): ImageAsset[] {
  const current = getCustomUploadedImages();
  const newAssets: ImageAsset[] = images.map((img, idx) => ({
    id: `custom-img-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
    title: img.title || `Nahrán obrázek (${new Date().toLocaleDateString('cs-CZ')})`,
    category: 'custom',
    url: img.dataUrl,
    isCustom: true,
  }));
  const updated = [...newAssets, ...current];
  try {
    localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('localStorage quota exceeded:', err);
  }
  return newAssets;
}

export function deleteCustomUploadedImage(id: string): ImageAsset[] {
  const current = getCustomUploadedImages();
  const updated = current.filter((img) => img.id !== id);
  localStorage.setItem(UPLOADED_IMAGES_KEY, JSON.stringify(updated));
  return updated;
}

export function getAllAvailableImages(): ImageAsset[] {
  const custom = getCustomUploadedImages();
  return [...custom, ...BUILTIN_IMAGES];
}

