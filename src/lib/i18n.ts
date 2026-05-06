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
    whatWeHost: '設施與環境',
    whatWeHostLede:
      '依山傍海的工作據點。為長駐工作而生的設備：私人工作室、共創空間、雲咖啡、會議室、淋浴間，一次到位。',
    hostItems: [
      { title: '山海環抱', description: '前有太平洋，後有中央山脈。從工作桌抬頭就是花蓮的地景。' },
      { title: '私人工作室', description: '可長駐專注的獨立工作室，含衛浴與空調。1 ～ 3 個月為單位的進駐期。' },
      { title: '共創空間', description: '一樓共用辦公與會議區，最多容納 20 ～ 25 人，適合工作坊與小型發表。' },
      { title: '私人會議室', description: '可預約的封閉式會議室，配有投影、白板、視訊設備。' },
      { title: '高速網路', description: '光纖企業級網路，遠端會議、跨時區協作、上傳 4K 都游刃有餘。' },
      { title: '隨時盥洗', description: '附獨立淋浴間，運動、通勤、海邊回來都能直接沖洗，繼續工作。' },
    ],
    visitTitle: '花蓮印象',
    visitLede:
      '中央山脈往內 15 分鐘，太平洋往東 10 分鐘。中間是稻田、原民咖啡、衝浪點，與我們留下來的理由。',
    visitMore: '看影像紀錄',
    contactTitle: '聯絡',
    contactLede: '想駐留、辦活動、或只是來坐一下，都歡迎寫信給我們。',
    programmesEyebrow: '— 02 / 設施',
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
    whatWeHost: 'Facilities & Environment',
    whatWeHostLede:
      'A workspace built between mountains and sea — private studios, coworking, Cloud Coffee, meeting rooms and a shower, all under one roof.',
    hostItems: [
      { title: 'Between mountain & sea', description: 'The Pacific Ocean to the front, the Central Mountain Range behind. The view from your desk.' },
      { title: 'Private studios', description: 'Long-stay studios with ensuite bathroom and air conditioning. Residencies run one to three months.' },
      { title: 'Coworking space', description: 'Ground-floor coworking and meeting area for up to 20–25 — ideal for workshops and small launches.' },
      { title: 'Private meeting rooms', description: 'Bookable closed-door rooms with projector, whiteboard and video gear.' },
      { title: 'High-speed internet', description: 'Enterprise-grade fibre — comfortable for video calls, async collaboration and 4K uploads.' },
      { title: 'Shower on site', description: 'A private shower room — surf, run, commute and rinse off, then keep working.' },
    ],
    visitTitle: 'The Hualien Life',
    visitLede:
      'The mountains are 15 minutes inland; the Pacific is 10 minutes east. In between: rice paddies, indigenous cafés, surf points, and the reason we stayed.',
    visitMore: 'Browse the library',
    contactTitle: 'Get in touch',
    contactLede: 'Whether you want to stay, host an event, or just stop by — drop us a note.',
    programmesEyebrow: '— 02 / Facilities',
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
