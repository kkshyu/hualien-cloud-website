import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@/components/RichText'
import { Ridge } from '@/components/Ridge'
import { mediaUrl } from '@/lib/media'
import { isLang, t, toPayloadLocale, formatDate, type Lang } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const payload = await getPayload({ config: await config })
  const res = await payload
    .find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 0,
      locale: toPayloadLocale(lang as Lang),
    })
    .catch(() => ({ docs: [] }) as any)
  const post = res.docs[0]
  return {
    title: post?.title,
    description: post?.excerpt,
  }
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  const tx = t(lang as Lang)
  const locale = toPayloadLocale(lang as Lang)

  const payload = await getPayload({ config: await config })
  const res = await payload
    .find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
      locale,
    })
    .catch(() => ({ docs: [] }) as any)

  const post = res.docs[0]
  if (!post) notFound()

  const cover = typeof post.cover === 'object' ? post.cover : null

  return (
    <article>
      <header className="shell article-head">
        <div className="meta-row">
          <span>{formatDate(post.publishedAt, lang as Lang)}</span>
          <span aria-hidden>·</span>
          <span>{tx.navNews}</span>
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && (
          <p className="hero__sub" style={{ marginTop: '0.5rem' }}>{post.excerpt}</p>
        )}
      </header>

      {cover?.url && (
        <div className="article-cover">
          <img src={mediaUrl(cover.url)} alt={cover.alt ?? post.title} />
        </div>
      )}

      <div className="article-body prose">
        <RichText data={post.body} legacyHtml={post.legacyHtml ?? null} />
      </div>

      <footer className="article-foot shell">
        <Ridge variant="thin" style={{ height: 18, color: 'var(--moss)', opacity: 0.45 }} />
        <p style={{ marginTop: '1.5rem' }}>
          <Link href={`/${lang}/news`} className="cta cta--ghost">
            ← {tx.navNews}
          </Link>
        </p>
      </footer>
    </article>
  )
}
