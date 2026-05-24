'use client';

import Script from 'next/script';

// ─── IDs — set in .env.local ───────────────────────────
const META_PIXEL_ID     = process.env.NEXT_PUBLIC_META_PIXEL_ID     || '';
const TIKTOK_PIXEL_ID   = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID   || '';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const SNAP_PIXEL_ID     = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID     || '';

export default function PixelScripts() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) return null; // Don't fire pixels in dev

  return (
    <>
      {/* ── Google Analytics 4 ── */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                send_page_view: true,
                language: 'ar',
                country: 'SA'
              });
            `}
          </Script>
        </>
      )}

      {/* ── Meta (Facebook) Pixel ── */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── TikTok Pixel ── */}
      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* ── Snapchat Pixel ── */}
      {SNAP_PIXEL_ID && (
        <Script id="snap-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script',r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${SNAP_PIXEL_ID}');
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      )}
    </>
  );
}

// ─── Pixel Event Helpers ───────────────────────────────
export function trackPurchase(value: number, currency = 'SAR', items: object[] = []) {
  if (typeof window === 'undefined') return;

  // GA4
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'purchase', { value, currency, items });
  }
  // Meta
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Purchase', { value, currency, contents: items, content_type: 'product' });
  }
  // TikTok
  if (typeof (window as any).ttq === 'object') {
    (window as any).ttq.track('PlaceAnOrder', { value, currency, contents: items });
  }
  // Snapchat
  if (typeof (window as any).snaptr === 'function') {
    (window as any).snaptr('track', 'PURCHASE', { price: value, currency });
  }
}

export function trackAddToCart(productName: string, value: number, currency = 'SAR') {
  if (typeof window === 'undefined') return;

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'add_to_cart', { currency, value, items: [{ item_name: productName }] });
  }
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'AddToCart', { value, currency, content_name: productName });
  }
  if (typeof (window as any).ttq === 'object') {
    (window as any).ttq.track('AddToCart', { value, currency, content_name: productName });
  }
  if (typeof (window as any).snaptr === 'function') {
    (window as any).snaptr('track', 'ADD_CART', { price: value, currency });
  }
}

export function trackViewContent(productName: string, value: number) {
  if (typeof window === 'undefined') return;

  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'ViewContent', { content_name: productName, value, currency: 'SAR' });
  }
  if (typeof (window as any).ttq === 'object') {
    (window as any).ttq.track('ViewContent', { content_name: productName, value, currency: 'SAR' });
  }
}

export function trackSearch(query: string) {
  if (typeof window === 'undefined') return;

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'search', { search_term: query });
  }
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Search', { search_string: query });
  }
}

export function trackInitiateCheckout(value: number, numItems: number) {
  if (typeof window === 'undefined') return;

  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'InitiateCheckout', { value, currency: 'SAR', num_items: numItems });
  }
  if (typeof (window as any).ttq === 'object') {
    (window as any).ttq.track('InitiateCheckout', { value, currency: 'SAR' });
  }
}
