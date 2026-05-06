import { getPayload } from 'payload'
import config from '@/payload.config'
import { HeaderClient } from './HeaderClient'
import { t, toPayloadLocale, type Lang } from '@/lib/i18n'

interface NavLeaf {
  label?: string | null
  type?: 'page' | 'url' | null
  page?: { slug?: string | null } | null | string
  url?: string | null
}

interface NavNode extends NavLeaf {
  children?: NavLeaf[]
}

function resolveHref(item: NavLeaf, lang: Lang): string {
  if (item.type === 'url' && item.url) return item.url
  const slug =
    item.page && typeof item.page === 'object' ? (item.page.slug ?? undefined) : undefined
  if (!slug) return `/${lang}`
  if (slug === 'home') return `/${lang}`
  return `/${lang}/${slug}`
}

export async function Header({ lang }: { lang: Lang }) {
  const tx = t(lang)
  const payload = await getPayload({ config: await config })
  const locale = toPayloadLocale(lang)
  const nav = await payload
    .findGlobal({ slug: 'navigation', locale, depth: 1 })
    .catch(() => null)
  const items = ((nav as { items?: NavNode[] } | null)?.items ?? []) as NavNode[]

  // Build the link list once on the server, then hand off to the client UI.
  const links = [
    { label: tx.navNews, href: `/${lang}/news` },
    ...items.slice(0, 4).map((item) => ({
      label: item.label ?? '',
      href: resolveHref(item, lang),
    })),
  ]

  return (
    <HeaderClient
      lang={lang}
      brandWord={tx.brandWord}
      brandTagline={tx.brandTagline}
      links={links}
      langSwitchLabel={tx.langSwitchLabel}
    />
  )
}
