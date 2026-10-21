import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bath, Bed, Car, CheckCircle, Droplet, Home, Maximize, Zap } from 'lucide-react';
import { HOUSE_MODELS } from '../../../data/propertyData';
import { formatRupiah } from '../../../utils/propertyLogic';
import { SiteHeader } from '../../../components/SiteHeader';
import { Footer } from '../../../components/Footer';
import { HouseTypeActions } from '../../../components/HouseTypeActions';
import { ThreeHouseViewer } from '../../../components/ThreeHouseViewerLazy';

export const dynamicParams = false;

export function generateStaticParams() {
  return HOUSE_MODELS.map((model) => ({ slug: model.id }));
}

export async function generateMetadata({ params }: PageProps<'/tipe/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const model = HOUSE_MODELS.find((m) => m.id === slug);
  if (!model) return {};

  const description = `${model.name}: luas tanah ${model.landArea} m², bangunan ${model.buildingArea} m², ${model.bedrooms}+${model.bedroomsPlus} kamar tidur. Mulai ${formatRupiah(model.price)}. ${model.tagline}.`;

  return {
    title: model.name,
    description,
    alternates: { canonical: `/tipe/${model.id}` },
    openGraph: {
      title: `${model.name} di Hyarta Ecovillage`,
      description,
      images: [{ url: model.image, alt: model.name }],
    },
  };
}

export default async function HouseTypePage({ params }: PageProps<'/tipe/[slug]'>) {
  const { slug } = await params;
  const model = HOUSE_MODELS.find((m) => m.id === slug);
  if (!model) notFound();

  const otherModels = HOUSE_MODELS.filter((m) => m.id !== model.id);

  const specs = [
    { icon: Maximize, label: 'Luas tanah', value: `${model.landArea} m²` },
    { icon: Home, label: 'Luas bangunan', value: `${model.buildingArea} m²` },
    { icon: Bed, label: 'Kamar tidur', value: `${model.bedrooms}+${model.bedroomsPlus}` },
    { icon: Bath, label: 'Kamar mandi', value: `${model.bathrooms}+${model.bathroomsPlus}` },
    { icon: Car, label: 'Carport', value: `${model.carports} mobil` },
    { icon: Zap, label: 'Listrik', value: model.electricity },
  ];

  // "Lantai 1: Carport, Foyer, ..." → heading + room list
  const floorPlans = [model.floorPlanL1, model.floorPlanL2].map((plan) => {
    const [heading, rooms = ''] = plan.split(/:\s*/, 2);
    return { heading, rooms: rooms.replace(/\.$/, '').split(/,\s*/) };
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b302c] font-sans antialiased">
      <SiteHeader />

      <main>
        {/* Overview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
          <Link
            href="/#tipe-rumah"
            className="inline-flex items-center gap-1.5 text-sm text-[#6d756c] hover:text-[#c88242] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Semua tipe rumah
          </Link>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#e0d8cb]">
              <Image
                src={model.image}
                alt={`Fasad ${model.name}`}
                fill
                preload
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-5">
              <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#1b3224] leading-[1.1]">{model.name}</h1>
              <p className="mt-3 text-lg text-[#a8743d] font-serif-luxury italic">{model.tagline}</p>
              <p className="mt-6 text-[#596158] leading-relaxed">{model.description}</p>

              <p className="mt-8 text-sm text-[#6d756c]">Harga mulai</p>
              <p className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1b3224]">{formatRupiah(model.price)}</p>

              <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 border-y border-[#e2dcd0] py-6">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <dt className="flex items-center gap-1.5 text-xs text-[#6d756c]">
                      <Icon className="w-3.5 h-3.5 text-[#c88242]" /> {label}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#1b3224]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-[#6d756c]">
                <Droplet className="w-4 h-4 text-[#c88242]" /> Air: {model.water}
              </p>

              <div className="mt-8">
                <HouseTypeActions model={{ name: model.name, price: model.price }} />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 3D model */}
        <section className="py-20 bg-[#16211a] text-white" aria-labelledby="model-3d-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <h2 id="model-3d-heading" className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#faf7f2]">
                Jelajahi {model.name} dalam 3D
              </h2>
              <p className="text-sm text-[#a2b3a3] max-w-md leading-relaxed">
                Putar 360°, ubah suasana pagi, senja, atau malam, dan pisahkan tiap lantai untuk melihat susunan ruangnya.
              </p>
            </div>
            <ThreeHouseViewer modelName={model.name} />
          </div>
        </section>

        {/* Floor plans & features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1b3224]">Denah ruang</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {floorPlans.map((floor) => (
                <div key={floor.heading}>
                  <h3 className="font-semibold text-[#1b3224] pb-2 border-b border-[#e2dcd0]">{floor.heading}</h3>
                  <ul className="mt-3 space-y-1.5 text-[#596158]">
                    {floor.rooms.map((room) => (
                      <li key={room}>{room}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1b3224]">Keunggulan</h2>
            <ul className="mt-6 space-y-3">
              {model.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[#3f473f]">
                  <CheckCircle className="w-5 h-5 text-[#2e6f40] shrink-0 mt-0.5" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Other types */}
        <section className="border-t border-[#e2dcd0] bg-[#f3efe6]" aria-labelledby="tipe-lain">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 id="tipe-lain" className="text-2xl font-serif-luxury font-bold text-[#1b3224]">
              Bandingkan dengan tipe lain
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherModels.map((other) => (
                <Link
                  key={other.id}
                  href={`/tipe/${other.id}`}
                  className="group flex items-center gap-5 rounded-3xl bg-white border border-[#e2dcd0] p-4 hover:border-[#c88242] transition-colors"
                >
                  <span className="relative w-28 h-24 shrink-0 rounded-2xl overflow-hidden bg-[#e0d8cb]">
                    <Image src={other.image} alt="" fill sizes="112px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-lg font-serif-luxury font-bold text-[#1b3224] group-hover:text-[#c88242] transition-colors">
                      {other.name}
                    </span>
                    <span className="block text-sm text-[#6d756c] mt-1">
                      {other.landArea}/{other.buildingArea} m², mulai {formatRupiah(other.price)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
