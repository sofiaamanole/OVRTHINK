"use client";
import Script from "next/script";

/* Tracking. Se activează doar dacă sunt setate env-urile (pe Vercel):
     NEXT_PUBLIC_META_PIXEL_ID  = ID-ul pixelului Meta (Facebook/Instagram)
     NEXT_PUBLIC_GA_ID          = ID-ul Google Analytics (opțional, ex G-XXXX)
   Fără ele, nu se încarcă nimic (degradează grațios). */
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function Pixel() {
  return (
    <>
      {META && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${META}');fbq('track','PageView');
          `}</Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt=""
              src={`https://www.facebook.com/tr?id=${META}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      )}
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
            gtag('js',new Date());gtag('config','${GA}');
          `}</Script>
        </>
      )}
    </>
  );
}

/* Helpere apelabile din app (SPA): fac nimic dacă tracking-ul nu e pornit. */
export function trackPageView(path) {
  if (typeof window === "undefined") return;
  if (window.fbq) window.fbq("track", "PageView");
  if (window.gtag && GA) window.gtag("event", "page_view", { page_path: path });
}
export function trackEvent(name, params) {
  if (typeof window === "undefined") return;
  if (window.fbq) window.fbq("track", name, params);
  if (window.gtag && GA) window.gtag("event", name, params);
}
