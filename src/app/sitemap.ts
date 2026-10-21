import type { MetadataRoute } from 'next';
import { ARTICLES, HOUSE_MODELS } from '../data/propertyData';
import { SITE_URL } from '../config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...HOUSE_MODELS.map((model) => ({
      url: `${SITE_URL}/tipe/${model.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...ARTICLES.map((article) => ({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
