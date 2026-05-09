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
  hostItems: Array<{ title: string; description: string; image?: string }>
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
      '歡迎來到花蓮雲基地！讓我們一起在太平洋風的吹拂下，\n開啟數位遊牧的新篇章。',
    homeBadge: 'EST. HUALIEN',
    visitUs: '來訪指南',
    langSwitchLabel: '語言',
    whatWeHost: '環境與設施',
    whatWeHostLede: '',
    hostItems: [
      {
        title: '山海環抱',
        description: '前有太平洋、後有中央山脈，從工作桌一抬頭即擁有花蓮的遼闊。',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: '地理位置',
        description: '走路 10 分鐘內有多種美食、便利商店、美崙田徑場，生活機能便利。',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: '獨立進駐空間',
        description: '環境優美、設備齊全的個人工作室，含有獨立的衛浴與空調。',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: '共創空間',
        description: '能激發創意靈感的場域，最多容納 20 – 25 人，適合工作坊與小型交流會。',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: '小型會議室',
        description: '預約制小型會議室，配有投影、白板、視訊麥克風設備。',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: '高速網路',
        description: '與世界連結不卡卡，上傳下載都輕鬆。',
        // image filled via CMS / public folder once photos are uploaded
      },
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
      'Welcome to Hualien Cloud Hub —\nstart your new chapter as a digital nomad on the breath of the Pacific.',
    homeBadge: 'EST. HUALIEN',
    visitUs: 'Plan a visit',
    langSwitchLabel: 'Language',
    whatWeHost: 'Environment & Facilities',
    whatWeHostLede: '',
    hostItems: [
      {
        title: 'Between mountain & sea',
        description: 'Pacific to the east, Central Mountain Range to the west — Hualien opens up the moment you look up from your desk.',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: 'In the right neighbourhood',
        description: 'Cafés, restaurants, convenience stores and the Meilun Track all within a 10-minute walk.',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: 'Private studios',
        description: 'Well-equipped private studios with ensuite bathroom and air conditioning.',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: 'Coworking space',
        description: 'A creative space for 20–25 people — perfect for workshops and small meet-ups.',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: 'Bookable meeting rooms',
        description: 'Reservation-based meeting rooms with projector, whiteboard and video conferencing gear.',
        // image filled via CMS / public folder once photos are uploaded
      },
      {
        title: 'High-speed internet',
        description: 'Stay connected to the world — uploads and downloads, no friction.',
        // image filled via CMS / public folder once photos are uploaded
      },
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
