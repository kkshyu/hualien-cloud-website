'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'
import type { Lang } from '@/lib/i18n'

interface NavLink {
  label: string
  href: string
}

interface Props {
  lang: Lang
  brandWord: string
  brandTagline: string
  links: NavLink[]
  langSwitchLabel: string
}

export function HeaderClient({ lang, brandWord, brandTagline, links, langSwitchLabel }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Build the equivalent URL in the other locale, preserving the rest of the path.
  // /zh/news/foo → /en/news/foo. If the current path lacks a known locale prefix
  // (shouldn't happen, but be defensive), fall back to the locale root.
  const swapLocale = (target: 'zh' | 'en') => {
    if (!pathname) return `/${target}`
    const m = pathname.match(/^\/(?:zh|en)(?=\/|$)(.*)$/)
    const rest = m?.[1] ?? ''
    return `/${target}${rest}` || `/${target}`
  }
  const zhHref = swapLocale('zh')
  const enHref = swapLocale('en')

  // Close menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link
            href={`/${lang}`}
            className="brand brand--logo"
            onClick={() => setOpen(false)}
            aria-label={brandWord}
          >
            <img
              src="/hualien-cloud-logo.svg"
              alt={brandWord}
              className="brand__logo"
            />
          </Link>

          <nav className="nav-main" aria-label={lang === 'zh' ? '主選單' : 'Primary'}>
            <ul>
              {links.map((l, i) => (
                <li key={i}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="nav-aux">
            <div className="locale-switch" aria-label={langSwitchLabel}>
              <Link href={zhHref} aria-current={lang === 'zh' ? 'true' : undefined}>中文</Link>
              <Link href={enHref} aria-current={lang === 'en' ? 'true' : undefined}>EN</Link>
            </div>
            <button
              type="button"
              className="nav-toggle"
              aria-label={open ? (lang === 'zh' ? '關閉選單' : 'Close menu') : (lang === 'zh' ? '開啟選單' : 'Open menu')}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`bars ${open ? 'open' : ''}`} aria-hidden="true">
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of <header>, not a child — the header's backdrop-filter
          establishes a containing block, which would otherwise trap this
          fixed-positioned overlay inside the header's own box. */}
      <div className={`nav-overlay ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <ul>
          {links.map((l, i) => (
            <li key={i}>
              <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-overlay__locale">
          <Link href={zhHref} aria-current={lang === 'zh' ? 'true' : undefined}>中文</Link>
          <span aria-hidden="true">·</span>
          <Link href={enHref} aria-current={lang === 'en' ? 'true' : undefined}>English</Link>
        </div>
      </div>
    </>
  )
}
