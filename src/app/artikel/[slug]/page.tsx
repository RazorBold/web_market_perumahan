import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { ARTICLES } from '../../../data/propertyData';
import { SiteHeader } from '../../../components/SiteHeader';
import { Footer } from '../../../components/Footer';
import { whatsappLink } from '../../../config/contact';
import { SITE_NAME } from '../../../config/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<'/artikel/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.summary,
      publishedTime: article.publishedAt,
      images: [{ url: article.image, alt: article.title }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<'/artikel/[slug]'>) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const otherArticles = ARTICLES.filter((a) => a.slug !== article.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.image,
    datePublished: article.publishedAt,
    inLanguage: 'id-ID',
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b302c] font-sans antialiased">
      <SiteHeader />

      <main>
        <article className="pt-10 sm:pt-14 pb-20">
          <header className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link
              href="/#artikel"
              className="inline-flex items-center gap-1.5 text-sm text-[#6d756c] hover:text-[#c88242] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Semua artikel
            </Link>

            <p className="mt-8 text-sm font-semibold text-[#a8743d]">{article.category}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1b3224] leading-[1.15]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-[#596158] leading-relaxed">{article.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#7e857c]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#c88242]" />
                <time dateTime={article.publishedAt}>{article.date}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c88242]" /> {article.readTime}
              </span>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-[#e0d8cb]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                preload
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 space-y-5 text-base sm:text-lg text-[#3f473f] leading-[1.75]">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <aside className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
            <div className="rounded-3xl bg-[#1b3224] text-[#f5f1e8] p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold">Ingin merasakannya langsung?</h2>
              <p className="mt-3 text-sm sm:text-base text-[#c9d6cb] leading-relaxed max-w-xl">
                Kunjungi show unit Hyarta Ecovillage di Maguwoharjo, Sleman. Buka setiap hari pukul 08.30–17.30 WIB.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappLink(
                    `Halo Hyarta Ecovillage, saya baru membaca artikel "${article.title}" dan ingin menjadwalkan kunjungan ke show unit.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#c88242] hover:bg-[#b07137] text-white text-sm font-semibold text-center transition-colors"
                >
                  Jadwalkan kunjungan
                </a>
                <Link
                  href="/#tipe-rumah"
                  className="px-6 py-3 rounded-full border border-white/25 hover:bg-white/10 text-white text-sm font-semibold text-center transition-colors"
                >
                  Lihat tipe rumah
                </Link>
              </div>
            </div>
          </aside>

          {otherArticles.length > 0 && (
            <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16" aria-labelledby="artikel-lain">
              <h2 id="artikel-lain" className="text-xl font-serif-luxury font-bold text-[#1b3224]">
                Artikel lainnya
              </h2>
              <ul className="mt-5 divide-y divide-[#e2dcd0] border-y border-[#e2dcd0]">
                {otherArticles.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/artikel/${other.slug}`} className="group flex items-center gap-4 py-4">
                      <span className="relative w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-[#e0d8cb]">
                        <Image src={other.image} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block font-semibold text-[#1b3224] group-hover:text-[#c88242] transition-colors">
                          {other.title}
                        </span>
                        <span className="block text-sm text-[#7e857c] mt-0.5">
                          {other.category}, {other.readTime}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  );
}
