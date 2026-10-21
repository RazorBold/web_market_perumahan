import React, { useState } from 'react';
import { ARTICLES, Article } from '../data/propertyData';
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-[#ded8cb] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[#e0d8cb]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f5] w-full max-w-2xl rounded-3xl border border-[#ded7ca] shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#ede6da] hover:bg-[#ded5c5] flex items-center justify-center text-[#2b302c]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase text-[#a8743d] tracking-widest">
                {selectedArticle.category} • {selectedArticle.date}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1b3224]">
                {selectedArticle.title}
              </h3>
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-2xl border border-[#ded7ca]"
            />

            <div className="space-y-4 text-sm text-[#464e45] leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-[#e2dcd0] flex justify-between items-center">
              <span className="text-xs text-[#7e857c]">Hyarta Ecovillage Editorial Team</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 rounded-full bg-[#1b3224] text-white text-xs font-semibold hover:bg-[#284935]"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
