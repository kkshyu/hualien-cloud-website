/**
 * Legacy WordPress URL → new path mapping.
 *
 * Sourced from scrape/raw/all_urls.txt + sitemap. Each entry produces both:
 *   - the bare path (e.g. /news)
 *   - the trailing-slash variant (e.g. /news/)
 *   - the URL-encoded Chinese path (the form WordPress used in links)
 *   - the literal Chinese path (the form some clients now send)
 *   - the /en/* mirror for both encoded and literal forms
 *
 * Result: every link that ever shipped with the old hualien.cloud will
 * land on a sensible page on the new site, with a 301 (permanent).
 */

export type Redirect = {
  source: string
  destination: string
  permanent: boolean
}

interface Map {
  /** WordPress path under root (without /en/ prefix), no leading or trailing slash */
  legacy: string[]
  /** Where it should land on the new site, no trailing slash, no /zh/ prefix */
  to: string
}

// `legacy` may include URL-encoded *and* the unencoded Chinese form.
const MAP: Map[] = [
  // Home (no entry — root '/' is handled by app/(frontend)/page.tsx redirect)
  // 場地租用
  { legacy: ['%e5%a0%b4%e5%9c%b0%e7%a7%9f%e7%94%a8', '場地租用'], to: 'venue-rental' },
  // 如何前往
  { legacy: ['%e5%a6%82%e4%bd%95%e5%89%8d%e5%be%80', '如何前往'], to: 'how-to-arrive' },
  // 進駐
  { legacy: ['%e9%80%b2%e9%a7%90', '進駐'], to: 'move-in' },
  // 活動 / cloudcoffee
  { legacy: ['cloudcoffee'], to: 'cloudcoffee' },
  // 最新消息
  { legacy: ['news'], to: 'news' },
  // 該舊站只有一篇 post（slug 812 被歸類在 uncategorized 子目錄）
  { legacy: ['uncategorized/812'], to: 'news/812' },
  // WordPress 預設的 author / category 列表頁 → 收斂到 /news
  { legacy: ['author/liann'], to: 'news' },
  { legacy: ['category/uncategorized'], to: 'news' },
]

function variants(p: string): string[] {
  // bare and trailing-slash forms
  return [`/${p}`, `/${p}/`]
}

export const legacyRedirects: Redirect[] = (() => {
  const out: Redirect[] = []
  const push = (source: string, destination: string) => {
    if (source === destination) return // skip self-redirects (e.g. /en/news → /en/news)
    out.push({ source, destination, permanent: true })
  }
  for (const m of MAP) {
    for (const legacy of m.legacy) {
      for (const src of variants(legacy)) {
        push(src, `/zh/${m.to}`)
        push(`/en${src}`, `/en/${m.to}`)
      }
    }
  }
  // /en root → /en (drop trailing slash if present)
  push('/en/', '/en')

  // Old /events/* URLs (from when events lived in their own collection) →
  // their /news/* equivalents.
  for (const lang of ['zh', 'en'] as const) {
    out.push({ source: `/${lang}/events`, destination: `/${lang}/news`, permanent: true })
    out.push({ source: `/${lang}/events/`, destination: `/${lang}/news`, permanent: true })
    out.push({ source: `/${lang}/events/:slug*`, destination: `/${lang}/news/:slug*`, permanent: true })
  }
  return out
})()
