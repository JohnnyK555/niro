import { Project } from '../types';

import heroInteriorImg from '../assets/images/hero_interior_1784926250517.jpg';
import floorplanDrawingImg from '../assets/images/floorplan_drawing_1784926275606.jpg';

export const projectsData: Project[] = [
  {
    id: 'bubenech-penthouse',
    category: 'residential',
    tags: ['realization'],
    year: '2025',
    area: '145 m²',
    featured: true,
    title: {
      cs: 'Penthouse Bubenč',
      en: 'Bubeneč Penthouse',
      vi: 'Penthouse Bubenč',
    },
    subtitle: {
      cs: 'Luxusní mezonet s přírodním dubem a mikrocementovými stěnami',
      en: 'Luxury duplex with natural oak parquet and microcement finishes',
      vi: 'Căn hộ Duplex sang trọng với sàn gỗ sồi tự nhiên & tường microcement',
    },
    location: {
      cs: 'Praha 6 – Bubenč',
      en: 'Prague 6 – Bubeneč',
      vi: 'Prague 6 – Bubeneč',
    },
    description: {
      cs: 'Kompletní rekonstrukce mezonetového bytu v prvorepublikové vile. Klient požadoval prosvětlený, velkorysý obývací prostor spojený s kuchyní, čisté geometrické linie a materiálovou kontinuitu.',
      en: 'Complete renovation of a duplex apartment in a First Republic villa. The client requested a luminous open-plan living area connected with the kitchen, clean geometric lines, and material continuity.',
      vi: 'Cải tạo toàn bộ căn hộ duplex trong biệt thự cổ. Gia chủ yêu cầu không gian sống ngập tràn ánh sáng kết hợp bếp, đường nét tối giản và sự đồng điệu về vật liệu.',
    },
    mainImage: heroInteriorImg,
    visualizationImage: heroInteriorImg,
    realizationImage: heroInteriorImg,
    galleryImages: [
      heroInteriorImg,
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80'
    ],
    materials: [
      {
        name: {
          cs: 'Dubové parkety – vzor Francouzský stromeček (Chevron)',
          en: 'Oak Parquet – French Chevron Pattern',
          vi: 'Sàn gỗ sồi – Họa tiết xương cá kiểu Pháp',
        },
        brand: 'BOMMA PARKET',
        brandUrl: 'https://www.bomaparket.cz/',
        type: 'Podlaha',
      },
      {
        name: {
          cs: 'Velkoformátová dlažba s texturou přírodního travertinu 120x280 cm',
          en: 'Large-Format Porcelain Tiles with Travertine Texture 120x280 cm',
          vi: 'Gạch ốp lát khổ lớn giả đá Travertine 120x280 cm',
        },
        brand: 'ProCeram',
        brandUrl: 'https://www.proceram.cz',
        type: 'Koupelna & Kuchyně',
      },
      {
        name: {
          cs: 'Podomítkové černé baterie a volně stojící litá vana',
          en: 'Concealed Matt Black Faucets and Freestanding Cast Bathtub',
          vi: 'Vòi sen âm tường đen nhám & Bồn tắm đứng cao cấp',
        },
        brand: 'KERASERVIS',
        brandUrl: 'https://www.keraservis.cz',
        type: 'Sanita',
      },
    ],
  }
];
