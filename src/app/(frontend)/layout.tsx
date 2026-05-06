import React from 'react'
import { Fraunces, Manrope, Noto_Serif_TC, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google'
import './styles.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})
const notoSerifTc = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  preload: false,
})
const notoSansTc = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
  preload: false,
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: '花蓮雲基地 / Hualien Cloud Hub',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cls = [
    fraunces.variable,
    manrope.variable,
    notoSerifTc.variable,
    notoSansTc.variable,
    jetbrains.variable,
  ].join(' ')

  return (
    <html lang="zh-Hant-TW" className={cls}>
      <body>{children}</body>
    </html>
  )
}
