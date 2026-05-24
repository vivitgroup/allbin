import type { Metadata, Viewport } from 'next';
import './globals.css';
import PixelScripts from '@/components/pixels/PixelScripts';

const SITE_URL = 'https://binsiddiq.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'بن صديق للأقمشة الفاخرة | Bin Siddiq Fabric',
    template: '%s | بن صديق للأقمشة',
  },
  description: 'أفضل محل أقمشة في ينبع والمملكة العربية السعودية — أقمشة جورجيت، ساتان، شيفون، حرير وقطن بجودة عالية وأسعار تنافسية. توصيل لينبع وجدة والرياض.',
  keywords: [
    'اقمشة ينبع','محل اقمشة ينبع','اقمشة بالمتر ينبع','خياطة ينبع','قماش ينبع','فساتين ينبع',
    'اقمشة جدة','محل اقمشة جدة','قماش فاخر جدة','اقمشة سواريه جدة','اقمشة للبيع جدة',
    'بن صديق للاقمشة','اقمشة فاخرة السعودية','اقمشة بالمتر','شراء اقمشة اون لاين',
    'قماش جورجيت','قماش ساتان','قماش شيفون','قماش حرير','قماش قطن مصري','قماش كريب','قماش قطيفة','قماش دانتيل',
    'اقمشة سهرة','اقمشة اعراس','اقمشة خطوبة','اقمشة عبايات',
    'fabric shop Saudi Arabia','fabric Yanbu','bin siddiq fabric','premium fabric jeddah',
  ],
  authors:   [{ name: 'بن صديق للأقمشة', url: SITE_URL }],
  creator:   'Bin Siddiq Fabric',
  publisher: 'بن صديق للأقمشة الفاخرة',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website', locale: 'ar_SA', url: SITE_URL,
    siteName: 'بن صديق للأقمشة الفاخرة',
    title:    'بن صديق للأقمشة الفاخرة | ينبع - جدة - السعودية',
    description: 'أفضل أقمشة فاخرة في ينبع والمملكة — جورجيت، ساتان، شيفون، حرير وأكثر',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'بن صديق للأقمشة الفاخرة' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بن صديق للأقمشة الفاخرة | ينبع والسعودية',
    description: 'أفضل أقمشة فاخرة بأسعار تنافسية',
    images: ['/logo.png'],
  },
  alternates: { canonical: SITE_URL },
  manifest: '/manifest.json',
  icons: { icon: '/logo.png', apple: '/logo.png', shortcut: '/logo.png' },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '' },
  category: 'shopping',
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5,
  themeColor: '#8B1A1A', colorScheme: 'light',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Store','LocalBusiness'], '@id': `${SITE_URL}/#business`,
      name: 'بن صديق للأقمشة الفاخرة',
      alternateName: ['Bin Siddiq Fabric','بن صديق للاقمشة'],
      url: SITE_URL, logo: `${SITE_URL}/logo.png`, image: `${SITE_URL}/logo.png`,
      description: 'محل أقمشة فاخرة في ينبع المملكة العربية السعودية',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA', addressLocality: 'ينبع',
        addressRegion: 'المنطقة الغربية', postalCode: '46452',
      },
      geo: { '@type': 'GeoCoordinates', latitude: '24.0883', longitude: '38.0582' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '09:00', closes: '22:00' },
      ],
      priceRange: '$$', currenciesAccepted: 'SAR',
      paymentAccepted: 'Cash, Credit Card, Apple Pay, Mada',
      areaServed: ['ينبع','جدة','الرياض','المملكة العربية السعودية'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['Arabic','English'] },
      sameAs: [
        'https://web.facebook.com/profile.php?id=61590399539166',
        'https://www.instagram.com/bin.siddiq.alnazawi',
        'https://www.tiktok.com/@bin.siddiq7',
        'https://snapchat.com/t/C2cnELIj',
      ],
    },
    {
      '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
      url: SITE_URL, name: 'بن صديق للأقمشة الفاخرة', inLanguage: 'ar-SA',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="font-cairo min-h-screen flex flex-col antialiased">
        <PixelScripts />
        {children}
      </body>
    </html>
  );
}
