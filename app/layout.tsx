import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import CookieBanner from "./components/CookieBanner";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./globals.css";
import prisma from "@/app/lib/prisma";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Dynamic Metadata from DB
export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  } catch (e) {
    console.warn("Could not fetch settings for metadata (build/static generation):", e);
  }

  return {
    title: settings?.seoTitle || "Hakan Karsak Akademi | Admin",
    description: settings?.seoDescription || "Hakan Karsak Akademi Yönetim Paneli",
    keywords: settings?.seoKeywords ? settings.seoKeywords.split(',') : [],
    robots: {
      index: false, // Keep false for admin panel, usually separate layout for public site
      follow: false
    },
    openGraph: {
      title: settings?.seoTitle || "Hakan Karsak Akademi",
      description: settings?.seoDescription || "Hakan Karsak Akademi Resmi Web Sitesi",
      siteName: "Hakan Karsak Akademi",
      locale: "tr_TR",
      type: "website",
    },
    verification: {
      google: settings?.googleSiteVerification || undefined,
      yandex: settings?.yandexSiteVerification || undefined,
      other: {
        "facebook-domain-verification": settings?.metaSiteVerification || "",
        "msvalidate.01": settings?.bingSiteVerification || "",
      }
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  } catch (e) {
    console.warn("Could not fetch settings for layout (build/static generation):", e);
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white dark:bg-black text-black dark:text-white transition-colors duration-200`}
      >
        <ThemeProvider>
          <NextTopLoader
            color="#ffffff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #ffffff,0 0 5px #ffffff"
          />

          {/* 1. Google Tag Manager (Head) */}
          {settings?.googleTagManagerId && (
            <Script id="gtm-script" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${settings.googleTagManagerId}');`}
            </Script>
          )}

          {/* 2. Google Analytics 4 */}
          {settings?.googleAnalyticsId && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} strategy="afterInteractive" />
              <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${settings.googleAnalyticsId}');
                    `}
              </Script>
            </>
          )}

          {/* 3. Meta Pixel Code */}
          {settings?.metaPixelId && (
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
                fbq('init', '${settings.metaPixelId}');
                fbq('track', 'PageView');
                `}
            </Script>
          )}

          {/* 4. Yandex Metrica */}
          {settings?.yandexMetricaId && (
            <Script id="yandex-metrica" strategy="afterInteractive">
              {`
                 (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                 m[i].l=1*new Date();
                 for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                 k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                 (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                 ym(${settings.yandexMetricaId}, "init", {
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true,
                      webvisor:true
                 });
                 `}
            </Script>
          )}

          {/* 5. Microsoft Clarity */}
          {settings?.microsoftClarityId && (
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${settings.microsoftClarityId}");
                `}
            </Script>
          )}

          {/* GTM NoScript Body */}
          {settings?.googleTagManagerId && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          )}

          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
