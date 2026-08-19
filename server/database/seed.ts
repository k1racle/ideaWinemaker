import { and, count, eq, or } from 'drizzle-orm'
import { stores as legacyStores } from '../../shared/mock/commerce.ts'
import { terroirs as legacyTerroirs } from '../../shared/mock/terroirs.ts'
import { wines as legacyWines } from '../../shared/mock/wines.ts'
import { winemakers as legacyWinemakers } from '../../shared/mock/winemakers.ts'
import type { DatabaseContext } from './connection.ts'
import {
  stores,
  wineDetailGroups,
  wineDetailItems,
  wineGallery,
  wines,
  wineTerroirParagraphs,
  winemakerBiography,
  winemakers,
  terroirBounds,
  terroirGallery,
  terroirs,
  terroirTags,
} from './schema.ts'

export const seedExistingContent = (context: DatabaseContext) => {
  context.db.transaction((tx) => {
    for (const legacyStore of legacyStores) {
      tx.insert(stores).values({
        title: legacyStore.title,
        city: legacyStore.city,
        address: legacyStore.address,
        website: legacyStore.website,
        latitude: legacyStore.coordinates[0],
        longitude: legacyStore.coordinates[1],
      }).onConflictDoNothing({
        target: [stores.title, stores.city, stores.address],
      }).run()
    }

    for (const legacyTerroir of legacyTerroirs) {
      const normalizedCode = legacyTerroir.meta.code.trim().toUpperCase()
      const existing = tx.select().from(terroirs)
        .where(or(eq(terroirs.slug, legacyTerroir.slug), eq(terroirs.code, normalizedCode)))
        .get()

      const storedTerroir = existing || tx.insert(terroirs).values({
        slug: legacyTerroir.slug,
        title: legacyTerroir.title,
        excerpt: legacyTerroir.excerpt,
        content: legacyTerroir.content,
        image: legacyTerroir.image,
        code: normalizedCode,
        climate: legacyTerroir.meta.climate,
        soil: legacyTerroir.meta.soil,
        coordinates: legacyTerroir.meta.coordinates,
        centerLatitude: legacyTerroir.meta.center[0],
        centerLongitude: legacyTerroir.meta.center[1],
        area: legacyTerroir.meta.area,
        humidity: legacyTerroir.meta.humidity,
        slope: legacyTerroir.meta.slope,
        altitude: legacyTerroir.meta.altitude,
        isVisible: true,
      }).returning().get()

      if (!storedTerroir.image) {
        tx.update(terroirs).set({
          slug: legacyTerroir.slug,
          title: legacyTerroir.title,
          excerpt: legacyTerroir.excerpt,
          content: legacyTerroir.content,
          image: legacyTerroir.image,
          code: normalizedCode,
          climate: legacyTerroir.meta.climate,
          soil: legacyTerroir.meta.soil,
          coordinates: legacyTerroir.meta.coordinates,
          centerLatitude: legacyTerroir.meta.center[0],
          centerLongitude: legacyTerroir.meta.center[1],
          area: legacyTerroir.meta.area,
          humidity: legacyTerroir.meta.humidity,
          slope: legacyTerroir.meta.slope,
          altitude: legacyTerroir.meta.altitude,
        }).where(eq(terroirs.id, storedTerroir.id)).run()
      }

      legacyTerroir.gallery.forEach((image, position) => {
        tx.insert(terroirGallery).values({ terroirId: storedTerroir.id, position, image })
          .onConflictDoNothing({ target: [terroirGallery.terroirId, terroirGallery.position] })
          .run()
      })
      legacyTerroir.meta.tags.forEach((text, position) => {
        tx.insert(terroirTags).values({ terroirId: storedTerroir.id, position, text })
          .onConflictDoNothing({ target: [terroirTags.terroirId, terroirTags.position] })
          .run()
      })
      legacyTerroir.meta.bounds.forEach(([latitude, longitude], position) => {
        tx.insert(terroirBounds).values({ terroirId: storedTerroir.id, position, latitude, longitude })
          .onConflictDoNothing({ target: [terroirBounds.terroirId, terroirBounds.position] })
          .run()
      })
    }

    for (const legacyWinemaker of legacyWinemakers) {
      tx.insert(winemakers).values({
        id: legacyWinemaker.id,
        slug: legacyWinemaker.slug,
        title: legacyWinemaker.title,
        excerpt: legacyWinemaker.excerpt,
        content: legacyWinemaker.content,
        image: legacyWinemaker.image,
        quote: legacyWinemaker.quote,
        initials: legacyWinemaker.meta.initials,
        location: legacyWinemaker.meta.location,
        aboutBrand: legacyWinemaker.meta.aboutBrand,
        isVisible: true,
      }).onConflictDoNothing({ target: winemakers.slug }).run()

      const storedWinemaker = tx.select({ id: winemakers.id })
        .from(winemakers)
        .where(eq(winemakers.slug, legacyWinemaker.slug))
        .get()

      if (!storedWinemaker) throw new Error(`Не удалось импортировать винодела ${legacyWinemaker.slug}`)

      legacyWinemaker.biography.forEach((text, position) => {
        tx.insert(winemakerBiography).values({
          winemakerId: storedWinemaker.id,
          position,
          text,
        }).onConflictDoNothing({
          target: [winemakerBiography.winemakerId, winemakerBiography.position],
        }).run()
      })
    }

    for (const legacyWine of legacyWines) {
      const storedWinemaker = tx.select({ id: winemakers.id })
        .from(winemakers)
        .where(eq(winemakers.slug, legacyWine.meta.winemakerSlug))
        .get()

      if (!storedWinemaker) throw new Error(`Для вина ${legacyWine.slug} не найден винодел`)

      const storedTerroir = tx.select({ id: terroirs.id }).from(terroirs)
        .where(eq(terroirs.slug, legacyWine.meta.terroirSlug))
        .get()

      if (!storedTerroir) throw new Error(`Для вина ${legacyWine.slug} не найден терруар`)

      tx.insert(wines).values({
        id: legacyWine.id,
        winemakerId: storedWinemaker.id,
        terroirId: storedTerroir.id,
        slug: legacyWine.slug,
        title: legacyWine.title,
        excerpt: legacyWine.excerpt,
        content: legacyWine.content,
        image: legacyWine.image,
        authorQuote: legacyWine.authorQuote,
        wineType: legacyWine.meta.wineType,
        variety: legacyWine.meta.variety,
        method: legacyWine.meta.method,
        methodCode: legacyWine.meta.methodCode,
        year: legacyWine.meta.year,
        alcohol: legacyWine.meta.alcohol,
        volume: legacyWine.meta.volume,
        batch: legacyWine.meta.batch,
        bottleNumber: legacyWine.meta.bottleNumber,
        servingTemperature: legacyWine.meta.servingTemperature,
        color: legacyWine.meta.color,
        aroma: legacyWine.meta.aroma,
        taste: legacyWine.meta.taste,
        pairing: legacyWine.meta.pairing,
        isVisible: true,
      }).onConflictDoNothing({ target: wines.slug }).run()

      const storedWine = tx.select({ id: wines.id })
        .from(wines)
        .where(eq(wines.slug, legacyWine.slug))
        .get()

      if (!storedWine) throw new Error(`Не удалось импортировать вино ${legacyWine.slug}`)

      legacyWine.gallery?.forEach((image, position) => {
        tx.insert(wineGallery).values({ wineId: storedWine.id, position, image })
          .onConflictDoNothing({ target: [wineGallery.wineId, wineGallery.position] })
          .run()
      })

      legacyWine.terroir.forEach((text, position) => {
        tx.insert(wineTerroirParagraphs).values({ wineId: storedWine.id, position, text })
          .onConflictDoNothing({ target: [wineTerroirParagraphs.wineId, wineTerroirParagraphs.position] })
          .run()
      })

      legacyWine.details.forEach((group, position) => {
        tx.insert(wineDetailGroups).values({ wineId: storedWine.id, position, title: group.title })
          .onConflictDoNothing({ target: [wineDetailGroups.wineId, wineDetailGroups.position] })
          .run()

        const storedGroup = tx.select({ id: wineDetailGroups.id })
          .from(wineDetailGroups)
          .where(and(
            eq(wineDetailGroups.wineId, storedWine.id),
            eq(wineDetailGroups.position, position),
          ))
          .get()

        if (!storedGroup) throw new Error(`Не удалось импортировать группу деталей вина ${legacyWine.slug}`)

        group.items.forEach((text, itemPosition) => {
          tx.insert(wineDetailItems).values({ groupId: storedGroup.id, position: itemPosition, text })
            .onConflictDoNothing({ target: [wineDetailItems.groupId, wineDetailItems.position] })
            .run()
        })
      })
    }
  })

  const winemakersCount = context.db.select({ value: count() }).from(winemakers).get()?.value ?? 0
  const terroirsCount = context.db.select({ value: count() }).from(terroirs).get()?.value ?? 0
  const winesCount = context.db.select({ value: count() }).from(wines).get()?.value ?? 0
  const storesCount = context.db.select({ value: count() }).from(stores).get()?.value ?? 0

  return { winemakersCount, terroirsCount, winesCount, storesCount }
}
