'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { mediaUrl } from '@/lib/media'
import { formatDate, type Lang } from '@/lib/i18n'

interface Cover {
  url?: string | null
  alt?: string | null
}

export interface Post {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  publishedAt?: string | null
  cover?: Cover | string | null
}

interface Props {
  initialPosts: Post[]
  initialPage: number
  totalPages: number
  lang: Lang
  locale: 'zh-TW' | 'en'
  loadingLabel: string
  endLabel: string
}

export function InfiniteNewsGrid({
  initialPosts,
  initialPage,
  totalPages,
  lang,
  locale,
  loadingLabel,
  endLabel,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(initialPage >= totalPages)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (done) return
    const el = sentinelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting || loading || done) return
        setLoading(true)
        try {
          const next = page + 1
          const params = new URLSearchParams({
            'where[status][equals]': 'published',
            sort: '-publishedAt',
            page: String(next),
            limit: '12',
            depth: '1',
            locale,
          })
          const res = await fetch(`/api/posts?${params.toString()}`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = (await res.json()) as { docs?: Post[]; totalPages?: number }
          const fresh = data.docs ?? []
          setPosts((prev) => [...prev, ...fresh])
          setPage(next)
          const stop = fresh.length === 0 || (data.totalPages != null && next >= data.totalPages)
          if (stop) setDone(true)
        } catch (err) {
          console.error('[InfiniteNewsGrid] fetch failed', err)
          setDone(true)
        } finally {
          setLoading(false)
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [page, loading, done, locale])

  return (
    <>
      <div className="news-grid">
        {posts.map((post) => {
          const cover = typeof post.cover === 'object' ? post.cover : null
          return (
            <Link key={post.id} href={`/${lang}/news/${post.slug}`} className="news-card">
              <div className="cover">
                {cover?.url && (
                  <img src={mediaUrl(cover.url)} alt={cover.alt ?? post.title} />
                )}
              </div>
              <span className="date">{formatDate(post.publishedAt ?? null, lang)}</span>
              <h3>{post.title}</h3>
              {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
            </Link>
          )
        })}
      </div>

      {!done && (
        <>
          <div ref={sentinelRef} className="news-sentinel" aria-hidden />
          {loading && <p className="news-loadmore">{loadingLabel}</p>}
        </>
      )}
      {done && posts.length > 0 && <p className="news-loadmore news-loadmore--end">{endLabel}</p>}
    </>
  )
}
