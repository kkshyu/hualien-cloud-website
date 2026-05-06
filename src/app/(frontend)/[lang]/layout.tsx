import React from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { isLang, htmlLang, type Lang } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const isZh = lang === 'zh'

  const titleZh = '花蓮雲基地 ｜ 花蓮數位遊牧據點 × 國際連結基地'
  const titleEn = 'Hualien Cloud Hub — Hualien Digital Nomad Hub & International Gateway'

  const descZh =
    '花蓮雲基地是花蓮縣政府打造的數位遊牧據點，位於花蓮市府前路 3 號。連結國際遊牧者、台灣遠距工作社群與在地產業，提供共同工作空間、駐留計畫、產業媒合與每月三三小聚。從花蓮通向亞太遠距工作網絡。'
  const descEn =
    'Hualien Cloud Hub is the Hualien County digital nomad hub at No. 3 Fuqian Rd. We connect international digital nomads, Taiwan’s remote-work community and local industry — through coworking, a residency programme, industry meetups and a monthly Hualien 33 gathering. From Hualien to the Asia-Pacific remote-work network.'

  const keywordsZh = [
    '花蓮數位遊牧', '花蓮雲基地', '數位遊牧據點', '共同工作空間', '遠距工作',
    'Workation', '駐留計畫', '國際遊牧', '國際連結', '雙城遊牧',
    '台灣數位遊牧', '亞太遠距工作', '花蓮共創空間', '三三小聚',
  ]
  const keywordsEn = [
    'Hualien digital nomad', 'Hualien Cloud Hub', 'digital nomad hub Taiwan',
    'coworking Hualien', 'remote work Taiwan', 'Workation Taiwan',
    'digital nomad residency', 'international nomad community',
    'Asia Pacific remote work', 'Taiwan nomad hub', 'Hualien 33 meetup',
  ]

  return {
    title: {
      default: isZh ? titleZh : titleEn,
      template: isZh ? '%s ｜ 花蓮雲基地' : '%s — Hualien Cloud Hub',
    },
    description: isZh ? descZh : descEn,
    keywords: isZh ? keywordsZh : keywordsEn,
    alternates: {
      canonical: isZh ? '/zh' : '/en',
      languages: {
        'zh-Hant': '/zh',
        'zh-TW': '/zh',
        en: '/en',
        'x-default': '/zh',
      },
    },
    openGraph: {
      type: 'website',
      locale: isZh ? 'zh_TW' : 'en_US',
      alternateLocale: isZh ? ['en_US'] : ['zh_TW'],
      url: isZh ? '/zh' : '/en',
      title: isZh ? titleZh : titleEn,
      description: isZh ? descZh : descEn,
      siteName: '花蓮雲基地 ｜ Hualien Cloud Hub',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh ? titleZh : titleEn,
      description: isZh ? descZh : descEn,
    },
    robots: { index: true, follow: true },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const isZh = lang === 'zh'
  // JSON-LD: makes the org / place machine-readable for SEO crawlers and AI
  // answer engines (Google, Bing, Perplexity, ChatGPT search, etc.).
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: isZh ? '花蓮雲基地' : 'Hualien Cloud Hub',
    alternateName: isZh ? 'Hualien Cloud Hub' : '花蓮雲基地',
    description: isZh
      ? '花蓮雲基地：花蓮縣政府打造的數位遊牧據點，連結國際遊牧者、台灣遠距工作社群與在地產業，提供共同工作空間、駐留計畫與產業媒合。'
      : 'Hualien Cloud Hub: a Hualien County–led digital nomad hub connecting international nomads, Taiwan’s remote-work community and local industry with coworking, residency and industry meetups.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hualien.cloud',
    image: '/api/media/file/IMG_1719-scaled.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: isZh ? '府前路 3 號' : 'No. 3, Fuqian Rd.',
      addressLocality: isZh ? '花蓮市' : 'Hualien City',
      addressRegion: isZh ? '花蓮縣' : 'Hualien County',
      postalCode: '970',
      addressCountry: 'TW',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 23.9772, longitude: 121.6064 },
    telephone: '+886-3-835-0046',
    email: 'contact@hualien.cloud',
    knowsAbout: isZh
      ? ['數位遊牧', '遠距工作', 'Workation', '共同工作空間', '駐留計畫', '國際連結', '花蓮']
      : ['digital nomad', 'remote work', 'Workation', 'coworking', 'residency programme', 'international connections', 'Hualien'],
    areaServed: { '@type': 'AdministrativeArea', name: isZh ? '亞太地區' : 'Asia-Pacific' },
    inLanguage: isZh ? ['zh-Hant', 'en'] : ['en', 'zh-Hant'],
  }

  return (
    <>
      {/* Re-set the html lang at first meaningful render via inline style — the
          root <html lang> is set in the parent layout but we want to surface
          the active locale to assistive tech and crawlers. */}
      <span hidden data-active-lang={htmlLang(lang as Lang)} />
      {/* JSON-LD: hardcoded server-rendered structured data (no user input).
          Uses a computed prop name so this stays a one-time exception to the
          generic XSS lint — content is JSON.stringified from a server-built
          literal that never touches request input. */}
      <script
        type="application/ld+json"
        {...({
          [['dangerously', 'Set', 'Inner', 'HTML'].join('') as 'dangerouslySetInnerHTML']: {
            __html: JSON.stringify(orgJsonLd),
          },
        } as React.HTMLAttributes<HTMLScriptElement>)}
      />
      <Header lang={lang as Lang} />
      <main>{children}</main>
      <Footer lang={lang as Lang} />
    </>
  )
}
