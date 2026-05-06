import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Ridge } from './Ridge'
import { t, toPayloadLocale, type Lang } from '@/lib/i18n'

interface SocialLink {
  platform?: string | null
  url: string
  label?: string | null
}

interface Settings {
  siteName?: string | null
  tagline?: string | null
  footer?: { copyright?: string | null } | null
  contact?: { email?: string | null; phone?: string | null; address?: string | null } | null
  social?: SocialLink[] | null
}

export async function Footer({ lang }: { lang: Lang }) {
  const tx = t(lang)
  const payload = await getPayload({ config: await config })
  const locale = toPayloadLocale(lang)
  const settings = (await payload
    .findGlobal({ slug: 'site-settings', locale, depth: 0 })
    .catch(() => null)) as Settings | null

  const year = new Date().getFullYear()
  const copyright = settings?.footer?.copyright ?? `© ${year} ${tx.copyright}`
  const email = settings?.contact?.email
  const phone = settings?.contact?.phone
  const address = settings?.contact?.address
  const socials = settings?.social ?? []

  return (
    <footer className="site-footer">
      <Ridge variant="footer" className="ridge" />
      <div className="footer-inner">
        <div>
          <div className="stamp">
            {lang === 'zh' ? '花蓮 · 雲基地' : 'Hualien · Cloud Hub'}
            <small>EST · 中央山脈 × 太平洋</small>
          </div>
        </div>

        <div>
          <h4>{tx.contact}</h4>
          <ul>
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {phone && <li>{phone}</li>}
            {address && <li style={{ whiteSpace: 'pre-line' }}>{address}</li>}
          </ul>
        </div>

        <div>
          <h4>{tx.follow}</h4>
          <ul>
            {socials.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label ?? s.platform ?? s.url}
                </a>
              </li>
            ))}
            {socials.length === 0 && (
              <li><Link href={`/${lang}/news`}>{tx.navNews}</Link></li>
            )}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{copyright}</span>
        <span>Hualien · Taiwan</span>
      </div>
    </footer>
  )
}
