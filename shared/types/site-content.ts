export interface MenuItem {
  title: string
  url: string
}

export interface SocialItem {
  name: string
  url: string
  icon: string
}

export interface Partner {
  name: string
  image: string
  site: string
  url: string
}

export interface FounderContent {
  name: string
  role: string
  image: string
  quote: string
}

export interface HomeIntroContent {
  title: string
  codeNote: string
  founderText: string
}

export interface SpectaclePageContent {
  title: string
  image: string
  paragraphs: string[]
}

export interface PolicySection {
  title: string
  paragraphs: string[]
  items?: string[]
}

export interface PolicyDocument {
  title: string
  description: string
  sections: PolicySection[]
}

export interface NewsPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string[]
  image: string
  publishedAt: string
  gallery?: string[]
  meta: {
    category: string
  }
}

export interface EventRecord {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string[]
  image: string
  gallery: string[]
  meta: {
    dateStart: string
    dateEnd: string
    timeStart: string
    timeEnd: string
    city: string
    address: string
    location: string
    price: number
    currency: string
    ageLimit: string
    organizer: string
    organizerUrl: string
  }
}

export interface PublicSiteContent {
  site: {
    siteName: string
    mainMenu: MenuItem[]
    footerMenu: MenuItem[]
    headerSocials: SocialItem[]
    mockImages: Record<string, string>
  }
  pages: {
    founder: FounderContent
    homeIntro: HomeIntroContent
    manifestParagraphs: string[]
    founderBiography: string[]
    spectaclePage: SpectaclePageContent
  }
  partners: Partner[]
  policies: {
    privacyPolicy: PolicyDocument
    cookiesPolicy: PolicyDocument
  }
  news: NewsPost[]
  events: EventRecord[]
}

export type PublicSiteDocumentMap = {
  [Key in keyof PublicSiteContent]: PublicSiteContent[Key]
}

export type PublicSiteDocumentKey = keyof PublicSiteDocumentMap
