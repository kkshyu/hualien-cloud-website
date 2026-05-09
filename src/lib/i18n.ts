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
    whatWeHost: '依山傍海的工作據點',
    whatWeHostLede: '一個為長駐工作而生的基地。',
    hostItems: [
      {
        title: '山海環抱',
        description: '前有太平洋，後有中央山脈。',
        image: '/programmes/01-exterior.png',
      },
      {
        title: '可長駐專注',
        description: '獨立工作位，不受打擾。',
        image: '/programmes/02-private-studio.png',
      },
      {
        title: '活動與社群交流',
        description: '小聚、工作坊、社群活動。',
        image: '/programmes/03-coworking.png',
      },
      {
        title: '以咖啡會友',
        description: '每月主題日，與波提娜麗合作。',
        image: '/programmes/04-cloud-coffee.png',
      },
      {
        title: '隨時盥洗',
        description: '運動、通勤後都能沖澡。',
        image: '/programmes/05-shower.png',
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
    whatWeHost: 'A fully-equipped hub built for long stays and real work.',
    whatWeHostLede: '',
    hostItems: [
      {
        title: 'Between mountain & sea',
        description: 'Pacific to the front, Central Range behind.',
        image: '/programmes/01-exterior.png',
      },
      {
        title: 'Focus, undisturbed',
        description: 'Private workstations for deep focus.',
        image: '/programmes/02-private-studio.png',
      },
      {
        title: 'Connect & community',
        description: 'Meet-ups, workshops and community events.',
        image: '/programmes/03-coworking.png',
      },
      {
        title: 'Coffee with the locals',
        description: 'Monthly themed mornings with Bottega Manli.',
        image: '/programmes/04-cloud-coffee.png',
      },
      {
        title: 'Fresh after a run',
        description: 'On-site shower for runs, surf and commutes.',
        image: '/programmes/05-shower.png',
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
