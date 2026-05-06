/**
 * Resolve a media URL.
 * Payload's S3 storage plugin returns full URLs by default; this helper just
 * passes them through but provides a single edit point if we need to rewrite
 * MinIO endpoints (e.g. internal vs public hostname) later.
 */
export function mediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url

  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '')
  if (base) return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  return url
}
