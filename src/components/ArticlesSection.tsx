import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ARTICLES } from '../data/propertyData';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="artikel" className="py-24 bg-[#f8f6f0] text-[#2b302c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching mockup */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#a8743d] block">
            ARTIKEL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1b3224]">
            Artikel Kami
          </h2>
          <div className="w-16 h-0.5 bg-[#c88242] mx-auto my-3" />
          <p className="text-[#596158] text-sm sm:text-base leading-relaxed">
            Inspirasi gaya hidup sehat, tips merawat hunian tropis, dan panduan menata tanaman hijau di lingkungan
            eco-living.
          </p>
        </div>

        {/* 3 Articles Grid matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#ded8cb] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[#e0d8cb]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#1b3224]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#f5eee2] border border-white/10">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-[#7e857c]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c88242]" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c88242]" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury font-bold text-lg text-[#1b3224] group-hover:text-[#c88242] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#5f675f] leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Read More Link */}
              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#c88242] group-hover:text-[#a86a2f]">
                <span className="uppercase tracking-wider">Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
