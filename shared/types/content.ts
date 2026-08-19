export interface WinemakerMeta {
  initials: string
  location: string
  aboutBrand: string
  wineSlugs: string[]
}

export interface Winemaker {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  quote: string
  biography: string[]
  meta: WinemakerMeta
}

export interface TerroirMeta {
  code: string
  climate: string
  tags: string[]
  soil: string
  coordinates: string
  center: [number, number]
  bounds: [number, number][]
  area: string
  humidity: string
  slope: string
  altitude: string
  wineSlugs: string[]
}

export interface Terroir {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  gallery: string[]
  meta: TerroirMeta
}

export interface WineDetailGroup {
  title: string
  items: string[]
}

export interface WineMeta {
  wineType: string
  variety: string
  method: string
  methodCode: string
  year: string
  alcohol: string
  volume: string
  terroirSlug: string
  terroirName: string
  terroirCode: string
  winemakerSlug: string
  winemakerName: string
  winemakerCode: string
  batch: string
  bottleNumber: string
  servingTemperature: string
  color: string
  aroma: string
  taste: string
  pairing: string
}

export interface Wine {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  gallery?: string[]
  authorQuote: string
  terroir: string[]
  details: WineDetailGroup[]
  meta: WineMeta
}

export interface AdminWinemakerListItem {
  id: number
  slug: string
  title: string
  initials: string
  isVisible: boolean
  winesCount: number
}

export interface AdminWineryListItem {
  id: number
  slug: string
  title: string
  region: string
  foundedYear: number | null
  isVisible: boolean
}

export interface Store {
  id: number
  title: string
  city: string
  address: string
  website: string
  coordinates: [number, number]
}

export interface AdminStoreListItem extends Store {
  isVisible: boolean
}

export interface AdminWineListItem {
  id: number
  slug: string
  title: string
  variety: string
  winemakerTitle: string
  isVisible: boolean
}

export interface AdminTerroirListItem {
  id: number
  slug: string
  title: string
  content: string
  code: string
  isVisible: boolean
  winesCount: number
}

export interface AdminContentOverview {
  wineries: AdminWineryListItem[]
  stores: AdminStoreListItem[]
  winemakers: AdminWinemakerListItem[]
  terroirs: AdminTerroirListItem[]
  wines: AdminWineListItem[]
}

export interface AdminWineryEditorData extends AdminWineryListItem {
  legalName: string
  excerpt: string
  content: string
  image: string
  address: string
  latitude: number | null
  longitude: number | null
  website: string
  email: string
  phone: string
  vineyardArea: string
  annualProduction: string
  specialization: string
  visitInfo: string
}

export interface AdminStoreEditorData extends Store {
  isVisible: boolean
}

export interface AdminWinemakerEditorData extends Omit<Winemaker, 'meta'> {
  meta: Omit<WinemakerMeta, 'wineSlugs'>
  isVisible: boolean
}

export interface AdminTerroirEditorData extends Omit<Terroir, 'meta'> {
  meta: Omit<TerroirMeta, 'wineSlugs'>
  isVisible: boolean
}

export interface AdminWineEditorData extends Omit<Wine, 'gallery' | 'terroir' | 'meta'> {
  winemakerId: number
  terroirId: number
  meta: Omit<
    WineMeta,
    'terroirSlug' | 'terroirName' | 'terroirCode' | 'winemakerSlug' | 'winemakerName' | 'winemakerCode'
  >
  isVisible: boolean
}
