export const LANGS = ['zh', 'en'] as const
export type Lang = (typeof LANGS)[number]
export type PayloadLocale = 'zh-TW' | 'en'

export const DEFAULT_LANG: Lang = 'zh'

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value)
}

export function toPayloadLocale(lang: Lang): PayloadLocale {
  return lang === 'zh' ? 'zh-TW' : 'en'
}

export function htmlLang(lang: Lang): string {
  return lang === 'zh' ? 'zh-Hant-TW' : 'en'
}

export const otherLang = (lang: Lang): Lang => (lang === 'zh' ? 'en' : 'zh')

type Dict = {
  brandWord: string
  brandTagline: string
  navNews: string
  navMedia: string
  navEvents: string
  navAbout: string
  more: string
  read: string
  prev: string
  next: string
  page: string
  of: string
  empty: string
  visit: string
  residency: string
  venueRental: string
  howToArrive: string
  events: string
  copyright: string
  contact: string
  follow: string
  topics: string
  newsLatest: string
  homeIntro: string
  homeBadge: string
  visitUs: string
  langSwitchLabel: string
  whatWeHost: string
  whatWeHostLede: string
  hostItems: Array<{ title: string; description: string }>
  visitTitle: string
  visitLede: string
  visitMore: string
  contactTitle: string
  contactLede: string
  programmesEyebrow: string
}

export const I18N: Record<Lang, Dict> = {
  zh: {
    brandWord: '花蓮雲基地',
    brandTagline: 'Hualien Cloud Hub',
    navNews: '最新消息',
    navMedia: '媒體庫',
    navEvents: '活動',
    navAbout: '關於',
    more: '看更多',
    read: '閱讀全文',
    prev: '上一頁',
    next: '下一頁',
    page: '第',
    of: '頁',
    empty: '尚無內容',
    visit: '來訪',
    residency: '進駐',
    venueRental: '場地租用',
    howToArrive: '如何前往',
    events: '活動',
    copyright: '花蓮雲基地',
    contact: '聯絡',
    follow: '社群',
    topics: '主題',
    newsLatest: '最新消息',
    homeIntro:
      '在中央山脈與太平洋之間，我們搭起數位遊牧據點。\n讓人留下來，讓事情慢慢長出來。',
    homeBadge: 'EST. HUALIEN',
    visitUs: '來訪指南',
    langSwitchLabel: '語言',
    whatWeHost: '我們提供',
    whatWeHostLede:
      '一個工作的山屋，融合共同工作、社群連結與駐留交流。下面是這裡常常發生的事。',
    hostItems: [
      { title: '33 小聚', description: '每月一次，讓在地與來訪者在同一張桌邊認識彼此。' },
      { title: '實作共創', description: '把點子帶離螢幕，動手做出可見、可摸的作品。' },
      { title: '客座業師', description: '邀請各領域實踐者來分享他們正在做的事。' },
      { title: '咖啡主題日', description: '一杯豆子、一個主題，一場慢一點的程序設計。' },
      { title: '進駐空間', description: '一張桌、一張床，一段在花蓮做事的時間。' },
      { title: '場地租用', description: '把活動、發表、工作坊放在山與海之間。' },
    ],
    visitTitle: '花蓮印象',
    visitLede:
      '中央山脈往內 15 分鐘，太平洋往東 10 分鐘。中間是稻田、原民咖啡、衝浪點，與我們留下來的理由。',
    visitMore: '看影像紀錄',
    contactTitle: '聯絡',
    contactLede: '想駐留、辦活動、或只是來坐一下，都歡迎寫信給我們。',
    programmesEyebrow: '— 02 / 服務',
  },
  en: {
    brandWord: 'Hualien Cloud Hub',
    brandTagline: '花蓮雲基地',
    navNews: 'News',
    navMedia: 'Library',
    navEvents: 'Events',
    navAbout: 'About',
    more: 'See all',
    read: 'Read',
    prev: 'Prev',
    next: 'Next',
    page: 'Page',
    of: 'of',
    empty: 'Nothing here yet',
    visit: 'Visit',
    residency: 'Residency',
    venueRental: 'Venue',
    howToArrive: 'Getting Here',
    events: 'Events',
    copyright: 'Hualien Cloud Hub',
    contact: 'Contact',
    follow: 'Follow',
    topics: 'Topics',
    newsLatest: 'Latest',
    homeIntro:
      'Between the Central Mountain Range and the Pacific,\nwe built a basecamp where work and life slow down on purpose.',
    homeBadge: 'EST. HUALIEN',
    visitUs: 'Plan a visit',
    langSwitchLabel: 'Language',
    whatWeHost: 'What we host',
    whatWeHostLede:
      'A working basecamp combining coworking, community gatherings and residency exchanges. Here is what usually happens here.',
    hostItems: [
      { title: '33 Exchange', description: 'A monthly meet-up between locals and visiting nomads, around one long table.' },
      { title: 'Co-Creation', description: 'Workshops where ideas leave the laptop and become things you can hold.' },
      { title: 'Expertise', description: 'Guest mentors share what they are actually building right now.' },
      { title: 'Coffee Themes', description: 'A single bag of beans, one topic, a slower kind of programming.' },
      { title: 'Residencies', description: 'A desk, a bed, and time to make something here.' },
      { title: 'Venue Rental', description: 'Host events, talks and workshops between mountain and sea.' },
    ],
    visitTitle: 'The Hualien Life',
    visitLede:
      'The mountains are 15 minutes inland; the Pacific is 10 minutes east. In between: rice paddies, indigenous cafés, surf points, and the reason we stayed.',
    visitMore: 'Browse the library',
    contactTitle: 'Get in touch',
    contactLede: 'Whether you want to stay, host an event, or just stop by — drop us a note.',
    programmesEyebrow: '— 02 / Programmes',
  },
}

export function t(lang: Lang): Dict {
  return I18N[lang]
}

export function formatDate(date: string | Date | null | undefined, lang: Lang): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
  }).format(d)
}
