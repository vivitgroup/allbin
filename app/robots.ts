import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/ai-measure', '/dress-viewer'],
        disallow: ['/dashboard', '/dashboard/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: 'https://binsiddiq.com/sitemap.xml',
  };
}
