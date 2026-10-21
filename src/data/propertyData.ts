import { PropertyUnit } from '../utils/propertyLogic';

export interface HouseModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  landArea: number; // m2
  buildingArea: number; // m2
  bathrooms: number;
  bathroomsPlus: number;
  bedrooms: number;
  bedroomsPlus: number;
  carports: number;
  price: number;
  electricity: string;
  water: string;
  floorCount: number;
  features: string[];
  image: string;
  floorPlanL1: string;
  floorPlanL2: string;
}

export interface Facility {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
}

export interface Article {
  id: string;
  /** URL segment for /artikel/[slug] */
  slug: string;
  title: string;
  date: string;
  /** ISO date for sitemap & structured metadata */
  publishedAt: string;
  category: string;
  readTime: string;
  summary: string;
  image: string;
  content: string[];
}

export const HOUSE_MODELS: HouseModel[] = [
  {
    id: 'townhouse-115',
    name: 'Townhouse 115',
    tagline: 'Harmoni Arsitektur Tropis Modern & Budaya Adiluhung Jawa',
    description:
      'Perpaduan arsitektur modern dan unsur budaya Jawa serta interior yang memaksimalkan ruang terbuka menghadirkan kenyamanan di setiap sudut rumah. Didesain dengan sirkulasi udara silang optimal dan pencahayaan alami melimpah.',
    landArea: 140,
    buildingArea: 115,
    bathrooms: 3,
    bathroomsPlus: 1,
    bedrooms: 3,
    bedroomsPlus: 1,
    carports: 2,
    price: 2150000000,
    electricity: '3.500 VA',
    water: 'PDAM & Sumur Artesis Filtered',
    floorCount: 2,
    features: [
      'Inner courtyard dengan vegetasi tropis',
      'High-ceiling living room (4.2 meter)',
      'Double carport bertiang artistik batu alam',
      'Balkon pribadi master bedroom',
      'Smart door lock & video intercom integrated',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    floorPlanL1: 'Lantai 1: Carport (2 Mobil), Foyer, Living & Dining Room Terbuka, Dapur Bersih & Kotor, Kamar Tidur Tamu, Kamar Mandi, Inner Courtyard, Area Cuci & Servis.',
    floorPlanL2: 'Lantai 2: Master Bedroom dengan En-suite Bathroom & Walk-in Wardrobe, Kamar Tidur Anak 1 & 2, Kamar Mandi Keluarga, Balkon Depan.',
  },
  {
    id: 'townhouse-125',
    name: 'Townhouse 125',
    tagline: 'Keluasan Ruang Fleksibel untuk Keluarga Bahagia',
    description:
      'Hunian dua lantai yang dirancang untuk keluarga yang dinamis. Dilengkapi ruang keluarga yang lapang, bukaan kaca lebar ke taman samping, serta ruang kerja fleksibel yang menghadap ke lanskap hijau.',
    landArea: 160,
    buildingArea: 125,
    bathrooms: 4,
    bathroomsPlus: 1,
    bedrooms: 4,
    bedroomsPlus: 1,
    carports: 2,
    price: 2680000000,
    electricity: '4.400 VA',
    water: 'PDAM & Sumur Artesis Filtered',
    floorCount: 2,
    features: [
      'Dual access garden & terrace dining',
      'Ruang kerja / studio fleksibel di lantai 1',
      'Master suite dengan private powder room',
      'Atap berinsulasi termal penahan panas',
      'Pemanas air tenaga surya terpasang',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    floorPlanL1: 'Lantai 1: Carport 2 Mobil, Teras Depan, Living Room Megah, Ruang Makan, Dry & Wet Kitchen, Kamar Kerja / Kamar Tamu, Powder Room, Taman Samping.',
    floorPlanL2: 'Lantai 2: Master Suite Luas, 2 Kamar Anak Luas dengan Kamar Mandi Masing-masing, Ruang Santai Keluarga, Sky Balcony.',
  },
  {
    id: 'townhouse-145',
    name: 'Townhouse 145',
    tagline: 'Kemewahan Puncak dengan Private Garden Sanctuary',
    description:
      'Tipe hunian termewah di Hyarta Ecovillage dengan luas bangunan 145 m² di atas kavling premium. Menawarkan panorama kanopi hijau, teras santai belakang luas, serta interior lapang berfinishing marmer dan kayu jati solid.',
    landArea: 180,
    buildingArea: 145,
    bathrooms: 4,
    bathroomsPlus: 1,
    bedrooms: 4,
    bedroomsPlus: 1,
    carports: 2,
    price: 3350000000,
    electricity: '5.500 VA',
    water: 'PDAM & Sumur Artesis Filtered',
    floorCount: 2,
    features: [
      'Kavling sudut (hoek) dengan halaman samping luas',
      'Private plunge pool / jacuzzi ready area',
      'Finishing marmer impor di living room',
      'Walk-in closet lapang di kamar utama',
      'Solar panel hybrid ready & EV charger port',
    ],
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    floorPlanL1: 'Lantai 1: Double Carport Kanopi Kaca Tempered, Entrance Foyer, Grand Living Room Double Height, Dining Room, Modern Kitchen Island, Guest Suite, Alfresco Terrace.',
    floorPlanL2: 'Lantai 2: Presidential Master Bedroom dengan Balcony Hijau, 2 Kamar Anak Luas En-Suite, Family Lounge, Rooftop Utility Deck.',
  },
];

export const MASTERPLAN_UNITS: PropertyUnit[] = [
  { id: 'TH-A01', name: 'Kavling A-01', type: 'Townhouse 145', block: 'A', lotNumber: 1, landArea: 185, buildingArea: 145, bedrooms: 4, bathrooms: 4, carport: 2, price: 3450000000, status: 'Terjual', highlightFeature: 'Kavling Sudut Barat' },
  { id: 'TH-A02', name: 'Kavling A-02', type: 'Townhouse 145', block: 'A', lotNumber: 2, landArea: 180, buildingArea: 145, bedrooms: 4, bathrooms: 4, carport: 2, price: 3350000000, status: 'Tersedia', highlightFeature: 'Hadap Taman Sentral' },
  { id: 'TH-A03', name: 'Kavling A-03', type: 'Townhouse 145', block: 'A', lotNumber: 3, landArea: 180, buildingArea: 145, bedrooms: 4, bathrooms: 4, carport: 2, price: 3350000000, status: 'Booked', highlightFeature: 'Akses Langsung ke Joglo' },
  { id: 'TH-B01', name: 'Kavling B-01', type: 'Townhouse 125', block: 'B', lotNumber: 1, landArea: 165, buildingArea: 125, bedrooms: 4, bathrooms: 4, carport: 2, price: 2750000000, status: 'Tersedia', highlightFeature: 'Dekat Kolam Renang' },
  { id: 'TH-B02', name: 'Kavling B-02', type: 'Townhouse 125', block: 'B', lotNumber: 2, landArea: 160, buildingArea: 125, bedrooms: 4, bathrooms: 4, carport: 2, price: 2680000000, status: 'Tersedia', highlightFeature: 'Pemandangan Pepohonan Rindang' },
  { id: 'TH-B03', name: 'Kavling B-03', type: 'Townhouse 125', block: 'B', lotNumber: 3, landArea: 160, buildingArea: 125, bedrooms: 4, bathrooms: 4, carport: 2, price: 2680000000, status: 'Terjual', highlightFeature: 'Orientasi Utara-Selatan Bebas Panas' },
  { id: 'TH-C01', name: 'Kavling C-01', type: 'Townhouse 115', block: 'C', lotNumber: 1, landArea: 145, buildingArea: 115, bedrooms: 3, bathrooms: 3, carport: 2, price: 2200000000, status: 'Booked', highlightFeature: 'Dekat Gerbang Utama' },
  { id: 'TH-C02', name: 'Kavling C-02', type: 'Townhouse 115', block: 'C', lotNumber: 2, landArea: 140, buildingArea: 115, bedrooms: 3, bathrooms: 3, carport: 2, price: 2150000000, status: 'Tersedia', highlightFeature: 'Pilihan Favorit Keluarga Muda' },
  { id: 'TH-C03', name: 'Kavling C-03', type: 'Townhouse 115', block: 'C', lotNumber: 3, landArea: 140, buildingArea: 115, bedrooms: 3, bathrooms: 3, carport: 2, price: 2150000000, status: 'Tersedia', highlightFeature: 'Inner Courtyard Terbuka' },
  { id: 'TH-C04', name: 'Kavling C-04', type: 'Townhouse 115', block: 'C', lotNumber: 4, landArea: 140, buildingArea: 115, bedrooms: 3, bathrooms: 3, carport: 2, price: 2150000000, status: 'Terjual', highlightFeature: 'Sirkulasi Udara Alami' },
  { id: 'TH-D01', name: 'Kavling D-01', type: 'Ruko Premium', block: 'D', lotNumber: 1, landArea: 120, buildingArea: 180, bedrooms: 2, bathrooms: 3, carport: 3, price: 3850000000, status: 'Tersedia', highlightFeature: 'Lokasi Strategis Boulevard Depan' },
  { id: 'TH-D02', name: 'Kavling D-02', type: 'Ruko Premium', block: 'D', lotNumber: 2, landArea: 120, buildingArea: 180, bedrooms: 2, bathrooms: 3, carport: 3, price: 3850000000, status: 'Booked', highlightFeature: 'Cocok Untuk Cafe & Boutique Office' },
];

export const FACILITIES: Facility[] = [
  {
    id: 'area-serbaguna',
    name: 'Area Serbaguna (Joglo Heritage Pavilion)',
    subtitle: 'Ruang Komunal Bernuansa Budaya Jawa & Kehangatan Komunitas',
    description:
      'Didesain dengan nyaman dan tenang, area serbaguna ini menjadi tempat berkumpul dan bersosialisasi bersama tetangga dengan keramahan pedesaan modern.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    features: ['Pendopo Joglo Kayu Jati Tua', 'Outdoor Dining & Gathering Lawn', 'Wi-Fi Area & Coffee Corner', 'Pencahayaan Artistik Temaram'],
  },
  {
    id: 'kolam-renang',
    name: 'Infinity Pool & Children Lagoon',
    subtitle: 'Segarkan Hari di Tengah Pepohonan Tropis Rimbun',
    description:
      'Kolam renang dewasa dengan desain infinity yang menyatu dengan taman konservasi, disertai kolam dangkal anak yang aman dan menyenangkan.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    features: ['Sistem Filtrasi Garam Alami', 'Sun Deck Kursi Santai', 'Kid-friendly Splash Zone', 'Shower & Locker Room Eksklusif'],
  },
  {
    id: 'jogging-canopy',
    name: 'Green Spine & Jogging Canopy',
    subtitle: 'Jalur Sehat Dikelilingi 45% Hutan Konservasi Hijau',
    description:
      'Jalur pedestrian bebas kendaraan selebar 3 meter yang membelah kawasan pemukiman, dinaungi pepohonan rindang penghasil oksigen murni setiap pagi.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    features: ['Panjang Track 1.2 Km Bebas Polusi', 'Lampu Taman Tenaga Surya', 'Outdoor Fitness Station', 'Benches di Bawah Pohon Rindang'],
  },
  {
    id: 'security-onegate',
    name: 'One Gate System 24/7 & Underground Cabling',
    subtitle: 'Kenyamanan Maksimal Tanpa Kabel Melintang & Keamanan Berlapis',
    description:
      'Sistem keamanan 24 jam dengan kontrol akses RFID otomatis, CCTV di setiap sudut kawasan, serta instalasi kabel dan drainase seluruhnya di bawah tanah.',
    image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1200&q=80',
    features: ['Kartu Akses RFID Penghuni', 'CCTV 360 Derajat di Semua Blok', 'Underground Fiber Optic & Listrik', 'Drainase Resapan Bio-Pori Anti Banjir'],
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'artikel-1',
    slug: 'cara-merawat-rumah-agar-tetap-bersih-dan-nyaman',
    title: 'Cara merawat rumah agar tetap bersih dan nyaman',
    date: '18 Oktober 2026',
    publishedAt: '2026-10-18',
    category: 'Home & Living',
    readTime: '4 menit baca',
    summary: 'Langkah praktis menjaga kesegaran interior bergaya eco-living tropis dengan sirkulasi udara alami dan pencahayaan efisien.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    content: [
      'Rumah dengan konsep eco-living seperti Hyarta Ecovillage dirancang untuk memaksimalkan aliran angin silang (cross ventilation) dan cahaya alami. Untuk menjaga rumah tetap sejuk dan bersih tanpa bergantung sepenuhnya pada AC:',
      '1. Buka jendela dan pintu geser taman di pagi hari (pukul 06.00 - 08.30) untuk mengganti udara malam dengan udara segar beroksigen tinggi dari pepohonan sekitar.',
      '2. Gunakan material pembersih alami seperti campuran cuka apel dan lemon untuk lantai marmer atau batu alam agar kilau alaminya tetap terjaga tanpa merusak tekstur batuan.',
      '3. Bersihkan filter ventilasi dan kisi-kisi kayu kanopi secara berkala agar tidak menjadi sarang debu tropis.',
      '4. Tempatkan keset serat kelapa di setiap pintu masuk teras untuk menyaring pasir dan kotoran sebelum memasuki area dalam rumah.',
    ],
  },
  {
    id: 'artikel-2',
    slug: '10-tanaman-yang-cocok-untuk-di-dalam-rumah',
    title: '10 Tanaman yang cocok untuk di dalam rumah',
    date: '12 Oktober 2026',
    publishedAt: '2026-10-12',
    category: 'Gardening & Landscape',
    readTime: '5 menit baca',
    summary: 'Rekomendasi tanaman hias indoor penyerap racun udara dan penyejuk ruangan yang mudah dirawat di iklim Yogyakarta.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    content: [
      'Menghadirkan unsur tanaman hidup di dalam ruangan tidak hanya memperindah visual interior, tetapi juga terbukti menurunkan tingkat stres penghuni dan menyaring polutan mikroskopis.',
      'Berikut 10 tanaman terbaik untuk iklim tropis Indonesia:',
      '1. Sansevieria (Lidah Mertua): Menyerap racun formaldehyde dan menghasilkan oksigen melimpah di malam hari.',
      '2. Monstera Deliciosa: Daunnya yang berlubang estetis cocok diletakkan di sudut living room double height.',
      '3. Peace Lily (Spathiphyllum): Mampu menyerap spora jamur dan memberikan bunga putih yang anggun.',
      '4. Sirih Gading (Pothos): Sangat tahan banting dan cocok dijadikan tanaman gantung di inner courtyard.',
      '5. Calathea: Motif daunnya seperti lukisan batik, sangat serasi dengan interior bernuansa kayu jati.',
      '6. Aglaonema (Sri Rejeki), 7. Zamioculcas (ZZ Plant), 8. Philodendron Birkin, 9. Ficus Lyrata (Ketapang Biola), dan 10. Spider Plant (Lili Paris).',
    ],
  },
  {
    id: 'artikel-3',
    slug: 'tips-dan-trik-pekarangan-tetap-bersih',
    title: 'Tips dan trik pekarangan tetap bersih',
    date: '05 Oktober 2026',
    publishedAt: '2026-10-05',
    category: 'Eco Architecture',
    readTime: '3 menit baca',
    summary: 'Panduan menata pekarangan tropis bebas genangan air, bebas nyamuk, dan tetap asri di musim penghujan maupun kemarau.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    content: [
      'Pekarangan di Hyarta Ecovillage didesain dengan konsep green water retention di mana air hujan dapat meresap langsung ke tanah tanpa menimbulkan genangan:',
      '1. Pemanfaatan Paving Berpori (Grass Block): Pastikan celah di antara grass block ditumbuhi rumput gajah mini atau diisi kerikil koral sikat agar air langsung meresap ke lapisan tanah bawah.',
      '2. Rutin Memangkas Dahan Rendah: Pangkas ranting yang terlalu rapat setiap dua minggu agar sinar matahari dapat menjangkau permukaan tanah, mencegah tumbuhnya lumut licin.',
      '3. Buat Lubang Biopori: Tanam pipa biopori di sudut pekarangan untuk mengolah sampah dedaunan kering menjadi kompos alami penyubur tanaman.',
      '4. Pasang Lampu Taman Warm White dengan Solar Panel: Menghadirkan suasana magis di malam hari tanpa menambah tagihan listrik bulanan.',
    ],
  },
];

export const NEARBY_LANDMARKS = [
  { name: 'Bandara Internasional Adisutjipto', distance: '3.2 km', time: '7 menit', type: 'Transportasi' },
  { name: 'Plaza Ambarrukmo & Pakuwon Mall', distance: '4.5 km', time: '8 menit', type: 'Pusat Perbelanjaan' },
  { name: 'Jalan Malioboro & Keraton Yogyakarta', distance: '8.5 km', time: '15 menit', type: 'Pusat Budaya & Wisata' },
  { name: 'Sheraton Mustika Yogyakarta Resort & Spa', distance: '1.2 km', time: '3 menit', type: 'Hotel Bintang 5' },
  { name: 'Gudeg Yu Djum Maguwoharjo', distance: '1.8 km', time: '4 menit', type: 'Kuliner Legendaris' },
  { name: 'Universitas Gadjah Mada (UGM)', distance: '6.8 km', time: '14 menit', type: 'Pendidikan' },
  { name: 'Rumah Sakit JIH & RS Hermina', distance: '3.8 km', time: '8 menit', type: 'Kesehatan' },
];

export const CINEMATIC_CHAPTERS = [
  {
    id: 'entrance',
    title: '01. Gerbang Utama & Kemegahan Gerbang Hijau',
    duration: '0:45',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Menyambut Anda ke dalam oasis tropis Yogyakarta dengan penjagaan 24 jam dan pohon peneduh rindang.',
  },
  {
    id: 'architecture',
    title: '02. Arsitektur Modern Tropis & Fasad Natural',
    duration: '1:10',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    description: 'Detail keanggunan atap Joglo kontemporer, kisi kayu ulin, dan dinding batu paras Yogyakarta.',
  },
  {
    id: 'interior',
    title: '03. Interior Double Height & Inner Courtyard',
    duration: '1:30',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    description: 'Koneksi tanpa batas antara ruang tamu lapang dan ketenangan taman tropis privat di dalam rumah.',
  },
  {
    id: 'joglo-clubhouse',
    title: '04. Area Serbaguna Pendopo Joglo & Pool',
    duration: '1:15',
    thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    description: 'Ruang kebersamaan penghuni bernuansa klasik modern dengan latar belakang air kolam nan jernih.',
  },
];
