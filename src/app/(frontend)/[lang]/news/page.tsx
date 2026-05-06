import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { mediaUrl } from '@/lib/media'
import { isLang, t, toPayloadLocale, formatDate, type Lang } from '@/lib/i18n'
import { InfiniteNewsGrid, type Post } from '@/components/InfiniteNewsGrid'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: t(lang as Lang).navNews }
}

export default async function NewsListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const tx = t(lang as Lang)
  const locale = toPayloadLocale(lang as Lang)

  const limit = 12

  const payload = await getPayload({ config: await config })
  const result = await payload
    .find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit,
      page: 1,
      depth: 1,
      locale,
    })
    .catch(() => ({ docs: [], totalPages: 1, page: 1 }) as any)

  const [feature, ...rest] = result.docs as any[]
  const initialPosts = rest as Post[]

  return (
    <div className="shell news-index">
      <header className="article-head">
        <span className="eyebrow">— {lang === 'zh' ? '紀事' : 'Journal'}</span>
        <h1>{tx.navNews}</h1>
        <p className="hero__sub" style={{ marginTop: 0 }}>
          {lang === 'zh'
            ? '活動、招募、駐留、隨手記下的山與海。'
            : 'Events, calls, residencies and quiet notes from mountain & sea.'}
        </p>
      </header>

      {result.docs.length === 0 ? (
        <div className="empty">{tx.empty}</div>
      ) : (
        <>
          {feature && (
            <Link
              href={`/${lang}/news/${feature.slug}`}
              className="news-feature"
              aria-label={feature.title}
            >
              <div className="cover">
                {typeof feature.cover === 'object' && feature.cover?.url && (
                  <img src={mediaUrl(feature.cover.url)} alt={feature.cover.alt ?? feature.title} />
                )}
              </div>
              <div>
                <span className="eyebrow">{formatDate(feature.publishedAt, lang as Lang)}</span>
                <h2>{feature.title}</h2>
                {feature.excerpt && <p>{feature.excerpt}</p>}
                <span className="cta cta--ghost" style={{ marginTop: '1.25rem' }}>
                  {tx.read} →
                </span>
              </div>
            </Link>
          )}

          <InfiniteNewsGrid
            initialPosts={initialPosts}
            initialPage={1}
            totalPages={result.totalPages ?? 1}
            lang={lang as Lang}
            locale={locale}
            loadingLabel={lang === 'zh' ? '載入更多…' : 'Loading more…'}
            endLabel={lang === 'zh' ? '— 已是最後一篇 —' : '— end —'}
          />
        </>
      )}
    </div>
  )
}
