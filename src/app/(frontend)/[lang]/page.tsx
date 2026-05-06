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
                  <span className="accent">花蓮雲基地</span>
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
                花蓮雲基地是 <em>共創</em>、<em>共學</em>、<em>共生</em> 的數位遊牧據點。
                山的一側是中央山脈，另一側是太平洋；
                我們在中間打造一個讓人留下來的角落，
                <em>連結地方與世界的可能</em>。
              </>
            ) : (
              <>
                Hualien Cloud Hub is a digital nomad base shaped by <em>shared making</em>,
                <em> shared learning</em>, and <em>shared living</em>. Tucked between
                Taiwan&rsquo;s Central Range and the Pacific Ocean —
                <em> where local meets global</em>.
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

      {/* ───────────────────────── HUALIEN 33 ───────────────────────── */}
      <section className="shell programmes">
        <div className="programmes__head">
          <span className="section-label">
            — 03 / {lang === 'zh' ? '花蓮三三' : 'Hualien 33'}
          </span>
          <h2>
            {lang === 'zh' ? (
              <>花蓮三三 <em>每個月的第三個週三</em></>
            ) : (
              <>Hualien 33 <em>· every third Wednesday</em></>
            )}
          </h2>
          <p>
            {lang === 'zh'
              ? '在山海與訊號之間，找回生活的頻率。「三三」不只是一個日期，是我們與自己、與這片土地的約定 — 把忙碌與喘息的交界，留給自己與彼此。'
              : 'Between mountain, sea and signal — a chance to find the rhythm of your week. "33" is not just a date; it’s an appointment with yourself, with the land, and with each other.'}
          </p>
          <p style={{ marginTop: '1rem' }}>
            {lang === 'zh'
              ? '標誌上的三座山峰與三陣海浪，象徵花蓮的地景，也代表數位遊牧的三個支柱：'
              : 'The three peaks and three waves on our mark stand for Hualien’s landscape — and for the three pillars of digital nomad life:'}
            <br />
            <strong>
              {lang === 'zh'
                ? '自由的靈魂 ｜ 高效的工作 ｜ 深度的連結'
                : 'A free spirit · focused work · deep connection'}
            </strong>
          </p>
        </div>
        <div className="programmes__list">
          <div className="programme-item">
            <span className="num">{lang === 'zh' ? '每週三 / WED' : 'EVERY WED'}</span>
            <h3>{lang === 'zh' ? '雲咖啡' : 'Cloud Coffee'}</h3>
            <p>
              {lang === 'zh'
                ? '每週三 15:00 – 17:00 開放活動。咖啡 × 茶 × 聊天，歡迎走進來坐一下。'
                : 'Every Wednesday, 15:00 – 17:00. Coffee, tea and conversation — drop in any time.'}
            </p>
          </div>
          <div className="programme-item">
            <span className="num">{lang === 'zh' ? '每月第三週 / 3RD WED' : '3RD WEDNESDAY'}</span>
            <h3>{lang === 'zh' ? '手沖咖啡專業養成' : 'Hand-drip Coffee Class'}</h3>
            <p>
              {lang === 'zh'
                ? '每月第三個週三 15:00 – 17:00。由花蓮在地精品咖啡店「波提娜麗」帶領，從豆子到萃取，把沖一杯咖啡變成日常儀式。'
                : 'Third Wednesday, 15:00 – 17:00. Local roaster Bottega Manli walks the room from bean to brew — making a daily cup feel like ritual.'}
            </p>
          </div>
          <div className="programme-item">
            <span className="num">{lang === 'zh' ? '每月第三週 / 18:30' : '3RD WED · 18:30'}</span>
            <h3>{lang === 'zh' ? '三三小聚' : '33 Meetup'}</h3>
            <p>
              {lang === 'zh'
                ? '每月第三個週三 18:30 – 20:30。在地與全球的數位遊牧者圍坐一桌，把這個月在做的事帶上來分享。打破遠距工作的孤獨感，讓工程師、設計師、作家在每個第三週像候鳥一樣回到這裡。'
                : 'Third Wednesday, 18:30 – 20:30. Locals and visiting digital nomads — engineers, designers, writers — share one long table and one month’s worth of work, breaking the solitude of remote life.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
