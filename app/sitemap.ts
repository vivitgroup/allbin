import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://binsiddiq.com';
  const now     = new Date();

  const staticRoutes = [
    { url: baseUrl,               priority: 1.0,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/products`, priority: 0.9,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/ai-measure`,priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/dress-viewer`,priority:0.7,changeFrequency: 'monthly' as const },
  ];

  // Product pages (static IDs for now — replace with DB call in production)
  const productIds = ['1','2','3','4','5','6','7','8'];
  const productRoutes = productIds.map((id) => ({
    url: `${baseUrl}/products/${id}`,
    priority: 0.8 as number,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticRoutes, ...productRoutes].map((r) => ({ ...r, lastModified: now }));
}
