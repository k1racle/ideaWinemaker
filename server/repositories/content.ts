import { and, asc, count, eq, inArray, type SQL } from 'drizzle-orm'
import { createError } from 'h3'
import type {
  AdminContentOverview,
  AdminStoreEditorData,
  AdminTerroirEditorData,
  AdminWineEditorData,
  AdminWinemakerEditorData,
  AdminWineryEditorData,
  Store,
  Terroir,
  Wine,
  Winemaker,
} from '../../shared/types/content'
import type { CreateStoreInput, CreateTerroirInput, CreateWineInput, CreateWinemakerInput, CreateWineryInput, UpdateWineInput } from '../validation/content'
import {
  stores,
  terroirBounds,
  terroirGallery,
  terroirs,
  terroirTags,
  wineDetailGroups,
  wineDetailItems,
  wineGallery,
  wines,
  winemakerBiography,
  winemakers,
  wineries,
} from '../database/schema'
import { useContentDatabase } from '../utils/database'

type WinemakerRow = typeof winemakers.$inferSelect
type TerroirRow = typeof terroirs.$inferSelect
type WineRow = typeof wines.$inferSelect

interface WineWithRelations {
  wine: WineRow
  winemaker: WinemakerRow
  terroir: TerroirRow
}

export interface WineQueryFilters {
  year?: string
  terroir?: string
  winemaker?: string
  method?: string
}

export interface PublicContentSitemapEntry {
  loc: string
  lastmod: Date
}

const latestDate = (...dates: Date[]) => new Date(Math.max(...dates.map(date => date.getTime())))

const hydrateWinemakers = (rows: WinemakerRow[]): Winemaker[] => {
  if (!rows.length) return []
  const { db } = useContentDatabase()
  const ids = rows.map(row => row.id)
  const biographyRows = db.select().from(winemakerBiography)
    .where(inArray(winemakerBiography.winemakerId, ids))
    .orderBy(asc(winemakerBiography.winemakerId), asc(winemakerBiography.position))
    .all()
  const relatedWines = db.select({
    winemakerId: wines.winemakerId,
    slug: wines.slug,
  }).from(wines)
    .innerJoin(terroirs, eq(wines.terroirId, terroirs.id))
    .where(and(
      inArray(wines.winemakerId, ids),
      eq(wines.isVisible, true),
      eq(terroirs.isVisible, true),
    ))
    .orderBy(asc(wines.id))
    .all()

  return rows.map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    quote: row.quote,
    biography: biographyRows.filter(item => item.winemakerId === row.id).map(item => item.text),
    meta: {
      initials: row.initials,
      location: row.location,
      aboutBrand: row.aboutBrand,
      wineSlugs: relatedWines.filter(item => item.winemakerId === row.id).map(item => item.slug),
    },
  }))
}

const hydrateTerroirs = (rows: TerroirRow[]): Terroir[] => {
  if (!rows.length) return []
  const { db } = useContentDatabase()
  const ids = rows.map(row => row.id)
  const galleryRows = db.select().from(terroirGallery)
    .where(inArray(terroirGallery.terroirId, ids))
    .orderBy(asc(terroirGallery.terroirId), asc(terroirGallery.position))
    .all()
  const tagRows = db.select().from(terroirTags)
    .where(inArray(terroirTags.terroirId, ids))
    .orderBy(asc(terroirTags.terroirId), asc(terroirTags.position))
    .all()
  const boundRows = db.select().from(terroirBounds)
    .where(inArray(terroirBounds.terroirId, ids))
    .orderBy(asc(terroirBounds.terroirId), asc(terroirBounds.position))
    .all()
  const relatedWines = db.select({ terroirId: wines.terroirId, slug: wines.slug })
    .from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .where(and(
      inArray(wines.terroirId, ids),
      eq(wines.isVisible, true),
      eq(winemakers.isVisible, true),
    ))
    .orderBy(asc(wines.id))
    .all()

  return rows.map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    gallery: galleryRows.filter(item => item.terroirId === row.id).map(item => item.image),
    meta: {
      code: row.code,
      climate: row.climate,
      tags: tagRows.filter(item => item.terroirId === row.id).map(item => item.text),
      soil: row.soil,
      coordinates: row.coordinates,
      center: [row.centerLatitude, row.centerLongitude],
      bounds: boundRows.filter(item => item.terroirId === row.id).map(item => [item.latitude, item.longitude]),
      area: row.area,
      humidity: row.humidity,
      slope: row.slope,
      altitude: row.altitude,
      wineSlugs: relatedWines.filter(item => item.terroirId === row.id).map(item => item.slug),
    },
  }))
}

const hydrateWines = (rows: WineWithRelations[]): Wine[] => {
  if (!rows.length) return []
  const { db } = useContentDatabase()
  const wineIds = rows.map(row => row.wine.id)
  const galleryRows = db.select().from(wineGallery)
    .where(inArray(wineGallery.wineId, wineIds))
    .orderBy(asc(wineGallery.wineId), asc(wineGallery.position))
    .all()
  const groupRows = db.select().from(wineDetailGroups)
    .where(inArray(wineDetailGroups.wineId, wineIds))
    .orderBy(asc(wineDetailGroups.wineId), asc(wineDetailGroups.position))
    .all()
  const groupIds = groupRows.map(group => group.id)
  const itemRows = groupIds.length
    ? db.select().from(wineDetailItems)
        .where(inArray(wineDetailItems.groupId, groupIds))
        .orderBy(asc(wineDetailItems.groupId), asc(wineDetailItems.position))
        .all()
    : []

  return rows.map(({ wine, winemaker, terroir }) => {
    const gallery = galleryRows.filter(item => item.wineId === wine.id).map(item => item.image)
    return {
      id: wine.id,
      slug: wine.slug,
      title: wine.title,
      excerpt: wine.excerpt,
      content: wine.content,
      image: wine.image,
      ...(gallery.length ? { gallery } : {}),
      authorQuote: wine.authorQuote,
      terroir: terroir.content.split(/\n\s*\n/).filter(Boolean),
      details: groupRows.filter(group => group.wineId === wine.id).map(group => ({
        title: group.title,
        items: itemRows.filter(item => item.groupId === group.id).map(item => item.text),
      })),
      meta: {
        wineType: wine.wineType,
        variety: wine.variety,
        method: wine.method,
        methodCode: wine.methodCode,
        year: wine.year,
        alcohol: wine.alcohol,
        volume: wine.volume,
        terroirSlug: terroir.slug,
        terroirName: terroir.title,
        terroirCode: terroir.code,
        winemakerSlug: winemaker.slug,
        winemakerName: winemaker.title,
        winemakerCode: winemaker.initials,
        batch: wine.batch,
        bottleNumber: wine.bottleNumber,
        servingTemperature: wine.servingTemperature,
        color: wine.color,
        aroma: wine.aroma,
        taste: wine.taste,
        pairing: wine.pairing,
      },
    }
  })
}

export const listPublicWinemakers = () => {
  const { db } = useContentDatabase()
  const rows = db.select().from(winemakers)
    .where(eq(winemakers.isVisible, true))
    .orderBy(asc(winemakers.id))
    .all()
  return hydrateWinemakers(rows)
}

export const getPublicWinemakerBySlug = (slug: string) => {
  const { db } = useContentDatabase()
  const row = db.select().from(winemakers)
    .where(and(eq(winemakers.slug, slug), eq(winemakers.isVisible, true)))
    .get()
  return row ? hydrateWinemakers([row])[0] : undefined
}

export const listPublicTerroirs = () => {
  const { db } = useContentDatabase()
  const rows = db.select().from(terroirs)
    .where(eq(terroirs.isVisible, true))
    .orderBy(asc(terroirs.id))
    .all()
  return hydrateTerroirs(rows)
}

export const getPublicTerroirBySlug = (slug: string) => {
  const { db } = useContentDatabase()
  const row = db.select().from(terroirs)
    .where(and(eq(terroirs.slug, slug), eq(terroirs.isVisible, true)))
    .get()
  return row ? hydrateTerroirs([row])[0] : undefined
}

export const listPublicWines = (filters: WineQueryFilters = {}) => {
  const { db } = useContentDatabase()
  const clauses: SQL[] = [
    eq(wines.isVisible, true),
    eq(winemakers.isVisible, true),
    eq(terroirs.isVisible, true),
  ]
  if (filters.year) clauses.push(eq(wines.year, filters.year))
  if (filters.terroir) clauses.push(eq(terroirs.slug, filters.terroir))
  if (filters.winemaker) clauses.push(eq(winemakers.slug, filters.winemaker))
  if (filters.method) clauses.push(eq(wines.methodCode, filters.method))

  const rows = db.select({ wine: wines, winemaker: winemakers, terroir: terroirs })
    .from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .innerJoin(terroirs, eq(wines.terroirId, terroirs.id))
    .where(and(...clauses))
    .orderBy(asc(wines.id))
    .all()
  return hydrateWines(rows)
}

export const getPublicWineBySlug = (slug: string) => {
  const { db } = useContentDatabase()
  const row = db.select({ wine: wines, winemaker: winemakers, terroir: terroirs })
    .from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .innerJoin(terroirs, eq(wines.terroirId, terroirs.id))
    .where(and(
      eq(wines.slug, slug),
      eq(wines.isVisible, true),
      eq(winemakers.isVisible, true),
      eq(terroirs.isVisible, true),
    ))
    .get()
  return row ? hydrateWines([row])[0] : undefined
}

export const listPublicContentSitemapEntries = (): PublicContentSitemapEntry[] => {
  const { db } = useContentDatabase()
  const publicWinemakers = db.select({
    id: winemakers.id,
    slug: winemakers.slug,
    updatedAt: winemakers.updatedAt,
  }).from(winemakers)
    .where(eq(winemakers.isVisible, true))
    .orderBy(asc(winemakers.id))
    .all()

  const publicWines = db.select({
    slug: wines.slug,
    winemakerId: wines.winemakerId,
    updatedAt: wines.updatedAt,
    winemakerUpdatedAt: winemakers.updatedAt,
    terroirUpdatedAt: terroirs.updatedAt,
  }).from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .innerJoin(terroirs, eq(wines.terroirId, terroirs.id))
    .where(and(
      eq(wines.isVisible, true),
      eq(winemakers.isVisible, true),
      eq(terroirs.isVisible, true),
    ))
    .orderBy(asc(wines.id))
    .all()
    .map(row => ({
      ...row,
      lastmod: latestDate(row.updatedAt, row.winemakerUpdatedAt, row.terroirUpdatedAt),
    }))

  const winemakerEntries = publicWinemakers.map((winemaker) => {
    const relatedWineDates = publicWines
      .filter(wine => wine.winemakerId === winemaker.id)
      .map(wine => wine.lastmod)

    return {
      loc: `/vinodely/${winemaker.slug}`,
      lastmod: latestDate(winemaker.updatedAt, ...relatedWineDates),
    }
  })

  const wineEntries = publicWines.map(wine => ({
    loc: `/wine/${wine.slug}`,
    lastmod: wine.lastmod,
  }))

  return [...winemakerEntries, ...wineEntries]
}

export const listPublicStores = (): Store[] => {
  const { db } = useContentDatabase()
  return db.select().from(stores)
    .where(eq(stores.isVisible, true))
    .orderBy(asc(stores.id))
    .all()
    .map(row => ({
    id: row.id,
    title: row.title,
    city: row.city,
    address: row.address,
    website: row.website,
    coordinates: [row.latitude, row.longitude],
  }))
}

export const getAdminContentOverview = (): AdminContentOverview => {
  const { db } = useContentDatabase()
  const wineryRows = db.select({
    id: wineries.id,
    slug: wineries.slug,
    title: wineries.title,
    region: wineries.region,
    foundedYear: wineries.foundedYear,
    isVisible: wineries.isVisible,
  }).from(wineries)
    .orderBy(asc(wineries.id))
    .all()

  const storeRows = db.select().from(stores).orderBy(asc(stores.id)).all().map(row => ({
    id: row.id,
    title: row.title,
    city: row.city,
    address: row.address,
    website: row.website,
    coordinates: [row.latitude, row.longitude] as [number, number],
    isVisible: row.isVisible,
  }))

  const winemakerRows = db.select({
    id: winemakers.id,
    slug: winemakers.slug,
    title: winemakers.title,
    initials: winemakers.initials,
    isVisible: winemakers.isVisible,
    winesCount: count(wines.id),
  }).from(winemakers)
    .leftJoin(wines, eq(wines.winemakerId, winemakers.id))
    .groupBy(winemakers.id)
    .orderBy(asc(winemakers.id))
    .all()

  const terroirRows = db.select({
    id: terroirs.id,
    slug: terroirs.slug,
    title: terroirs.title,
    content: terroirs.content,
    code: terroirs.code,
    isVisible: terroirs.isVisible,
    winesCount: count(wines.id),
  }).from(terroirs)
    .leftJoin(wines, eq(wines.terroirId, terroirs.id))
    .groupBy(terroirs.id)
    .orderBy(asc(terroirs.id))
    .all()

  const wineRows = db.select({
    id: wines.id,
    slug: wines.slug,
    title: wines.title,
    variety: wines.variety,
    winemakerTitle: winemakers.title,
    isVisible: wines.isVisible,
  }).from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .orderBy(asc(wines.id))
    .all()

  return { wineries: wineryRows, stores: storeRows, winemakers: winemakerRows, terroirs: terroirRows, wines: wineRows }
}

export const getAdminWineryById = (id: number): AdminWineryEditorData | undefined => {
  const { db } = useContentDatabase()
  const row = db.select().from(wineries).where(eq(wineries.id, id)).get()
  if (!row) return undefined

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    legalName: row.legalName,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    foundedYear: row.foundedYear,
    region: row.region,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    website: row.website,
    email: row.email,
    phone: row.phone,
    vineyardArea: row.vineyardArea,
    annualProduction: row.annualProduction,
    specialization: row.specialization,
    visitInfo: row.visitInfo,
    isVisible: row.isVisible,
  }
}

export const getAdminStoreById = (id: number): AdminStoreEditorData | undefined => {
  const { db } = useContentDatabase()
  const row = db.select().from(stores).where(eq(stores.id, id)).get()
  if (!row) return undefined

  return {
    id: row.id,
    title: row.title,
    city: row.city,
    address: row.address,
    website: row.website,
    coordinates: [row.latitude, row.longitude],
    isVisible: row.isVisible,
  }
}

export const getAdminWinemakerById = (id: number): AdminWinemakerEditorData | undefined => {
  const { db } = useContentDatabase()
  const row = db.select().from(winemakers).where(eq(winemakers.id, id)).get()
  if (!row) return undefined

  const hydrated = hydrateWinemakers([row])[0]!
  return {
    id: hydrated.id,
    slug: hydrated.slug,
    title: hydrated.title,
    excerpt: hydrated.excerpt,
    content: hydrated.content,
    image: hydrated.image,
    quote: hydrated.quote,
    biography: hydrated.biography,
    meta: {
      initials: hydrated.meta.initials,
      location: hydrated.meta.location,
      aboutBrand: hydrated.meta.aboutBrand,
    },
    isVisible: row.isVisible,
  }
}

export const getAdminTerroirById = (id: number): AdminTerroirEditorData | undefined => {
  const { db } = useContentDatabase()
  const row = db.select().from(terroirs).where(eq(terroirs.id, id)).get()
  if (!row) return undefined

  const hydrated = hydrateTerroirs([row])[0]!
  return {
    id: hydrated.id,
    slug: hydrated.slug,
    title: hydrated.title,
    excerpt: hydrated.excerpt,
    content: hydrated.content,
    image: hydrated.image,
    gallery: hydrated.gallery,
    meta: {
      code: hydrated.meta.code,
      climate: hydrated.meta.climate,
      tags: hydrated.meta.tags,
      soil: hydrated.meta.soil,
      coordinates: hydrated.meta.coordinates,
      center: hydrated.meta.center,
      bounds: hydrated.meta.bounds,
      area: hydrated.meta.area,
      humidity: hydrated.meta.humidity,
      slope: hydrated.meta.slope,
      altitude: hydrated.meta.altitude,
    },
    isVisible: row.isVisible,
  }
}

export const getAdminWineById = (id: number): AdminWineEditorData | undefined => {
  const { db } = useContentDatabase()
  const row = db.select({ wine: wines, winemaker: winemakers, terroir: terroirs })
    .from(wines)
    .innerJoin(winemakers, eq(wines.winemakerId, winemakers.id))
    .innerJoin(terroirs, eq(wines.terroirId, terroirs.id))
    .where(eq(wines.id, id))
    .get()
  if (!row) return undefined

  const hydrated = hydrateWines([row])[0]!
  return {
    id: hydrated.id,
    winemakerId: row.wine.winemakerId,
    terroirId: row.wine.terroirId,
    slug: hydrated.slug,
    title: hydrated.title,
    excerpt: hydrated.excerpt,
    content: hydrated.content,
    image: hydrated.image,
    authorQuote: hydrated.authorQuote,
    details: hydrated.details,
    meta: {
      wineType: hydrated.meta.wineType,
      variety: hydrated.meta.variety,
      method: hydrated.meta.method,
      methodCode: hydrated.meta.methodCode,
      year: hydrated.meta.year,
      alcohol: hydrated.meta.alcohol,
      volume: hydrated.meta.volume,
      batch: hydrated.meta.batch,
      bottleNumber: hydrated.meta.bottleNumber,
      servingTemperature: hydrated.meta.servingTemperature,
      color: hydrated.meta.color,
      aroma: hydrated.meta.aroma,
      taste: hydrated.meta.taste,
      pairing: hydrated.meta.pairing,
    },
    isVisible: row.wine.isVisible,
  }
}

export const createWinemaker = (input: CreateWinemakerInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const created = tx.insert(winemakers).values({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      quote: input.quote,
      initials: input.meta.initials,
      location: input.meta.location,
      aboutBrand: input.meta.aboutBrand,
      isVisible: input.isVisible,
    }).returning({ id: winemakers.id, slug: winemakers.slug }).get()

    tx.insert(winemakerBiography).values(input.biography.map((text, position) => ({
      winemakerId: created.id,
      position,
      text,
    }))).run()

    return created
  })
}

export const createWinery = (input: CreateWineryInput) => {
  const { db } = useContentDatabase()
  return db.insert(wineries).values(input)
    .returning({ id: wineries.id, slug: wineries.slug })
    .get()
}

export const createStore = (input: CreateStoreInput) => {
  const { db } = useContentDatabase()
  return db.insert(stores).values({
    title: input.title,
    city: input.city,
    address: input.address,
    website: input.website,
    latitude: input.coordinates[0],
    longitude: input.coordinates[1],
    isVisible: input.isVisible,
  }).returning({ id: stores.id }).get()
}

export const createTerroir = (input: CreateTerroirInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const created = tx.insert(terroirs).values({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      code: input.meta.code,
      climate: input.meta.climate,
      soil: input.meta.soil,
      coordinates: input.meta.coordinates,
      centerLatitude: input.meta.center[0],
      centerLongitude: input.meta.center[1],
      area: input.meta.area,
      humidity: input.meta.humidity,
      slope: input.meta.slope,
      altitude: input.meta.altitude,
      isVisible: input.isVisible,
    }).returning({ id: terroirs.id, slug: terroirs.slug }).get()

    if (input.gallery.length) {
      tx.insert(terroirGallery).values(input.gallery.map((image, position) => ({
        terroirId: created.id,
        position,
        image,
      }))).run()
    }
    tx.insert(terroirTags).values(input.meta.tags.map((text, position) => ({
      terroirId: created.id,
      position,
      text,
    }))).run()
    tx.insert(terroirBounds).values(input.meta.bounds.map(([latitude, longitude], position) => ({
      terroirId: created.id,
      position,
      latitude,
      longitude,
    }))).run()

    return created
  })
}

export const createWine = (input: CreateWineInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const winemaker = tx.select({ id: winemakers.id }).from(winemakers)
      .where(eq(winemakers.id, input.winemakerId))
      .get()
    if (!winemaker) throw createError({ statusCode: 422, message: 'Выбранный винодел не найден' })

    const terroir = tx.select({ id: terroirs.id }).from(terroirs)
      .where(eq(terroirs.id, input.terroirId))
      .get()
    if (!terroir) throw createError({ statusCode: 422, message: 'Выбранный терруар не найден' })

    const created = tx.insert(wines).values({
      winemakerId: input.winemakerId,
      terroirId: input.terroirId,
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      authorQuote: input.authorQuote,
      wineType: input.meta.wineType,
      variety: input.meta.variety,
      method: input.meta.method,
      methodCode: input.meta.methodCode,
      year: input.meta.year,
      alcohol: input.meta.alcohol,
      volume: input.meta.volume,
      batch: input.meta.batch,
      bottleNumber: input.meta.bottleNumber,
      servingTemperature: input.meta.servingTemperature,
      color: input.meta.color,
      aroma: input.meta.aroma,
      taste: input.meta.taste,
      pairing: input.meta.pairing,
      isVisible: input.isVisible,
    }).returning({ id: wines.id, slug: wines.slug }).get()

    if (input.gallery.length) {
      tx.insert(wineGallery).values(input.gallery.map((image, position) => ({ wineId: created.id, position, image }))).run()
    }
    input.details.forEach((group, position) => {
      const createdGroup = tx.insert(wineDetailGroups).values({
        wineId: created.id,
        position,
        title: group.title,
      }).returning({ id: wineDetailGroups.id }).get()
      tx.insert(wineDetailItems).values(group.items.map((text, itemPosition) => ({
        groupId: createdGroup.id,
        position: itemPosition,
        text,
      }))).run()
    })

    return created
  })
}

export const updateWinery = (id: number, input: CreateWineryInput) => {
  const { db } = useContentDatabase()
  return db.update(wineries).set({
    slug: input.slug,
    title: input.title,
    legalName: input.legalName,
    excerpt: input.excerpt,
    content: input.content,
    image: input.image,
    foundedYear: input.foundedYear,
    region: input.region,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    website: input.website,
    email: input.email,
    phone: input.phone,
    vineyardArea: input.vineyardArea,
    annualProduction: input.annualProduction,
    specialization: input.specialization,
    visitInfo: input.visitInfo,
    isVisible: input.isVisible,
    updatedAt: new Date(),
  }).where(eq(wineries.id, id))
    .returning({ id: wineries.id, slug: wineries.slug })
    .get()
}

export const updateStore = (id: number, input: CreateStoreInput) => {
  const { db } = useContentDatabase()
  return db.update(stores).set({
    title: input.title,
    city: input.city,
    address: input.address,
    website: input.website,
    latitude: input.coordinates[0],
    longitude: input.coordinates[1],
    isVisible: input.isVisible,
    updatedAt: new Date(),
  }).where(eq(stores.id, id))
    .returning({ id: stores.id })
    .get()
}

export const updateWinemaker = (id: number, input: CreateWinemakerInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const updated = tx.update(winemakers).set({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      quote: input.quote,
      initials: input.meta.initials,
      location: input.meta.location,
      aboutBrand: input.meta.aboutBrand,
      isVisible: input.isVisible,
      updatedAt: new Date(),
    }).where(eq(winemakers.id, id))
      .returning({ id: winemakers.id, slug: winemakers.slug })
      .get()

    if (!updated) return undefined

    tx.delete(winemakerBiography).where(eq(winemakerBiography.winemakerId, id)).run()
    tx.insert(winemakerBiography).values(input.biography.map((text, position) => ({
      winemakerId: id,
      position,
      text,
    }))).run()

    return updated
  })
}

export const updateTerroir = (id: number, input: CreateTerroirInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const updated = tx.update(terroirs).set({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      code: input.meta.code,
      climate: input.meta.climate,
      soil: input.meta.soil,
      coordinates: input.meta.coordinates,
      centerLatitude: input.meta.center[0],
      centerLongitude: input.meta.center[1],
      area: input.meta.area,
      humidity: input.meta.humidity,
      slope: input.meta.slope,
      altitude: input.meta.altitude,
      isVisible: input.isVisible,
      updatedAt: new Date(),
    }).where(eq(terroirs.id, id))
      .returning({ id: terroirs.id, slug: terroirs.slug })
      .get()

    if (!updated) return undefined

    tx.delete(terroirGallery).where(eq(terroirGallery.terroirId, id)).run()
    if (input.gallery.length) {
      tx.insert(terroirGallery).values(input.gallery.map((image, position) => ({
        terroirId: id,
        position,
        image,
      }))).run()
    }
    tx.delete(terroirTags).where(eq(terroirTags.terroirId, id)).run()
    tx.insert(terroirTags).values(input.meta.tags.map((text, position) => ({
      terroirId: id,
      position,
      text,
    }))).run()
    tx.delete(terroirBounds).where(eq(terroirBounds.terroirId, id)).run()
    tx.insert(terroirBounds).values(input.meta.bounds.map(([latitude, longitude], position) => ({
      terroirId: id,
      position,
      latitude,
      longitude,
    }))).run()

    return updated
  })
}

export const updateWine = (id: number, input: UpdateWineInput) => {
  const { db } = useContentDatabase()
  return db.transaction((tx) => {
    const winemaker = tx.select({ id: winemakers.id }).from(winemakers)
      .where(eq(winemakers.id, input.winemakerId))
      .get()
    if (!winemaker) throw createError({ statusCode: 422, message: 'Выбранный винодел не найден' })

    const terroir = tx.select({ id: terroirs.id }).from(terroirs)
      .where(eq(terroirs.id, input.terroirId))
      .get()
    if (!terroir) throw createError({ statusCode: 422, message: 'Выбранный терруар не найден' })

    const updated = tx.update(wines).set({
      winemakerId: input.winemakerId,
      terroirId: input.terroirId,
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      authorQuote: input.authorQuote,
      wineType: input.meta.wineType,
      variety: input.meta.variety,
      method: input.meta.method,
      methodCode: input.meta.methodCode,
      year: input.meta.year,
      alcohol: input.meta.alcohol,
      volume: input.meta.volume,
      batch: input.meta.batch,
      bottleNumber: input.meta.bottleNumber,
      servingTemperature: input.meta.servingTemperature,
      color: input.meta.color,
      aroma: input.meta.aroma,
      taste: input.meta.taste,
      pairing: input.meta.pairing,
      isVisible: input.isVisible,
      updatedAt: new Date(),
    }).where(eq(wines.id, id))
      .returning({ id: wines.id, slug: wines.slug })
      .get()

    if (!updated) return undefined

    tx.delete(wineDetailGroups).where(eq(wineDetailGroups.wineId, id)).run()
    input.details.forEach((group, position) => {
      const createdGroup = tx.insert(wineDetailGroups).values({
        wineId: id,
        position,
        title: group.title,
      }).returning({ id: wineDetailGroups.id }).get()
      tx.insert(wineDetailItems).values(group.items.map((text, itemPosition) => ({
        groupId: createdGroup.id,
        position: itemPosition,
        text,
      }))).run()
    })

    return updated
  })
}

export const setWinemakerVisibility = (id: number, isVisible: boolean) => {
  const { db } = useContentDatabase()
  return db.update(winemakers)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(winemakers.id, id))
    .returning({ id: winemakers.id, isVisible: winemakers.isVisible })
    .get()
}

export const setTerroirVisibility = (id: number, isVisible: boolean) => {
  const { db } = useContentDatabase()
  return db.update(terroirs)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(terroirs.id, id))
    .returning({ id: terroirs.id, isVisible: terroirs.isVisible })
    .get()
}

export const setWineVisibility = (id: number, isVisible: boolean) => {
  const { db } = useContentDatabase()
  return db.update(wines)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(wines.id, id))
    .returning({ id: wines.id, isVisible: wines.isVisible })
    .get()
}

export const setWineryVisibility = (id: number, isVisible: boolean) => {
  const { db } = useContentDatabase()
  return db.update(wineries)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(wineries.id, id))
    .returning({ id: wineries.id, isVisible: wineries.isVisible })
    .get()
}

export const setStoreVisibility = (id: number, isVisible: boolean) => {
  const { db } = useContentDatabase()
  return db.update(stores)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(stores.id, id))
    .returning({ id: stores.id, isVisible: stores.isVisible })
    .get()
}
