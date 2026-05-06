import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Ridge } from '@/components/Ridge'
import { mediaUrl } from '@/lib/media'
import { isLang, t, toPayloadLocale, formatDate, type Lang } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const tx = t(lang as Lang)
  const locale = toPayloadLocale(lang as Lang)

  const payload = await getPayload({ config: await config })
  const [pageRes, postsRes, mediaRes] = await Promise.all([
    payload
      .find({
        collection: 'pages',
        where: { slug: { equals: 'home' } },
        limit: 1,
        depth: 2,
        locale,
      })
      .catch(() => ({ docs: [] }) as any),
    payload
      .find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 3,
        depth: 1,
        locale,
      })
      .catch(() => ({ docs: [] }) as any),
    payload
      .find({
        collection: 'media',
        where: { mimeType: { contains: 'image' } },
        sort: '-createdAt',
        limit: 3,
        locale,
      })
      .catch(() => ({ docs: [] }) as any),
  ])

  const home = pageRes.docs[0] as
    | {
        title?: string
        hero?: {
          heading?: string | null
          subheading?: string | null
          image?: { url?: string; alt?: string } | string | null
        } | null
      }
    | undefined

  const heroImg =
    home?.hero?.image && typeof home.hero.image === 'object' ? home.hero.image : null
  const heroSub = home?.hero?.subheading

  const featuredImages = (mediaRes.docs as any[]).slice(0, 3)

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="hero shell">
        <div className="hero__grid">
          <div className="hero__lede reveal" style={{ '--delay': '0.05s' } as React.CSSProperties}>
            <span className="eyebrow">{tx.homeBadge}</span>
            <h1 className="hero__title">
              {lang === 'zh' ? (
                <>
                  山與海之間<br />
                  <span className="accent">Hualien Cloud Hub</span>
                </>
              ) : (
                <>
                  Hualien<br />
                  <span className="accent">Cloud Hub</span>
                </>
              )}
            </h1>
            <p className="hero__sub">
              {(heroSub || tx.homeIntro)
                .split('\n')
                .map((line, i, all) => (
                  <span key={i}>
                    {line}
                    {i < all.length - 1 && <br />}
                  </span>
                ))}
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href={`/${lang}/news`} className="cta">
                {tx.navNews}
              </Link>
              <Link href={`/${lang}/how-to-arrive`} className="cta cta--ghost">
                {tx.visitUs}
              </Link>
            </div>
          </div>

          <div className="hero__media reveal" style={{ '--delay': '0.18s' } as React.CSSProperties}>
            {heroImg?.url ? (
              <img src={mediaUrl(heroImg.url)} alt={heroImg.alt ?? ''} />
            ) : (
              <Ridge
                variant="hero"
                style={{ width: '100%', height: '100%', color: 'var(--moss)' }}
              />
            )}
            <span className="badge">{lang === 'zh' ? '花蓮 · HUALIEN' : 'HUALIEN · 花蓮'}</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────── INTRO ───────────────────────── */}
      <section className="shell">
        <div className="intro">
          <span className="section-label">— 01 / {lang === 'zh' ? '緒言' : 'Intro'}</span>
          <p className="intro__copy">
            {lang === 'zh' ? (
              <>
                花蓮雲基地是 <em>共創</em>、<em>共學</em>、<em>共生</em> 的工作場域。
                山的一側是中央山脈，另一側是太平洋；
                我們在中間打造一個讓人留下來的角落。
              </>
            ) : (
              <>
                Hualien Cloud Hub is a workplace built around <em>shared making</em>,
                <em> shared learning</em>, and <em>shared living</em>. Tucked between
                Taiwan&rsquo;s Central Range and the Pacific Ocean.
              </>
            )}
          </p>
        </div>
      </section>

      {/* ───────────────────────── WHAT WE HOST ───────────────────────── */}
      <section className="shell programmes">
        <div className="programmes__head">
          <span className="section-label">{tx.programmesEyebrow}</span>
          <h2>{tx.whatWeHost}</h2>
          <p>{tx.whatWeHostLede}</p>
        </div>
        <div className="programmes__list">
          {tx.hostItems.map((item, i) => (
            <div className="programme-item" key={i}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── LATEST ───────────────────────── */}
      <section className="shell feature-strip">
        <div className="feature-strip__head">
          <h2>{tx.newsLatest}</h2>
          <Link className="more" href={`/${lang}/news`}>
            {tx.more} →
          </Link>
        </div>

        {postsRes.docs.length === 0 ? (
          <div className="empty">{tx.empty}</div>
        ) : (
          <div className="news-grid">
            {postsRes.docs.map((post: any) => {
              const cover = typeof post.cover === 'object' ? post.cover : null
              return (
                <Link key={post.id} href={`/${lang}/news/${post.slug}`} className="news-card">
                  <div className="cover">
                    {cover?.url && (
                      <img src={mediaUrl(cover.url)} alt={cover.alt ?? post.title} />
                    )}
                  </div>
                  <span className="date">{formatDate(post.publishedAt, lang as Lang)}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ───────────────────────── CONTACT ───────────────────────── */}
      <section className="shell contact-strip">
        <div>
          <span className="section-label">— 03 / {tx.contactTitle}</span>
          <h2>{tx.contactTitle}</h2>
          <p>{tx.contactLede}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="mailto:contact@hualien.cloud" className="cta">
            contact@hualien.cloud
          </a>
          <Link href={`/${lang}/how-to-arrive`} className="cta cta--ghost">
            {tx.visitUs}
          </Link>
        </div>
      </section>
    </>
  )
}
