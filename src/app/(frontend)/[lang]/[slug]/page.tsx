import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@/components/RichText'
import { mediaUrl } from '@/lib/media'
import { isLang, t, toPayloadLocale, type Lang } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const RESERVED = new Set(['news', 'media'])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang) || RESERVED.has(slug)) return {}
  const payload = await getPayload({ config: await config })
  const res = await payload
    .find({
      collection: 'pages',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 0,
      locale: toPayloadLocale(lang as Lang),
    })
    .catch(() => ({ docs: [] }) as any)
  const page = res.docs[0]
  if (!page) return {}
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  if (RESERVED.has(slug)) notFound()
  const tx = t(lang as Lang)
  const locale = toPayloadLocale(lang as Lang)

  const payload = await getPayload({ config: await config })
  const res = await payload
    .find({
      collection: 'pages',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
      locale,
    })
    .catch(() => ({ docs: [] }) as any)

  const page = res.docs[0]
  if (!page) notFound()

  const heroImg =
    page.hero?.image && typeof page.hero.image === 'object' ? page.hero.image : null
  const hasHero = page.hero?.heading || heroImg
  const eyebrowLabel =
    slug === 'venue-rental'
      ? tx.venueRental
      : slug === 'move-in'
        ? tx.residency
        : slug === 'how-to-arrive'
          ? tx.howToArrive
          : slug === 'cloudcoffee'
            ? tx.events
            : (lang === 'zh' ? '介紹' : 'Page')

  return (
    <>
      {hasHero ? (
        <section className="hero shell">
          <div className="hero__grid">
            <div className="hero__lede">
              <span className="eyebrow">— {eyebrowLabel}</span>
              <h1 className="hero__title">{page.hero?.heading || page.title}</h1>
              {page.hero?.subheading && (
                <p className="hero__sub">{page.hero.subheading}</p>
              )}
            </div>
            <div className="hero__media">
              {heroImg?.url && (
                <img src={mediaUrl(heroImg.url)} alt={heroImg.alt ?? ''} />
              )}
            </div>
          </div>
        </section>
      ) : (
        <header className="shell article-head">
          <span className="eyebrow">— {eyebrowLabel}</span>
          <h1>{page.title}</h1>
        </header>
      )}

      {(page.body || page.legacyHtml) && (
        <div className="article-body prose">
          <RichText data={page.body} legacyHtml={page.legacyHtml ?? null} />
        </div>
      )}
    </>
  )
}
