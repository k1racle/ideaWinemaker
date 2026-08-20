import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { openDatabase, type DatabaseContext } from '../server/database/connection'
import { getPublicSiteContent } from '../server/repositories/site-content'
import {
  createTerroir,
  createStore,
  createWine,
  createWinemaker,
  createWinery,
  getAdminContentOverview,
  getAdminStoreById,
  getAdminTerroirById,
  getAdminWineById,
  getAdminWinemakerById,
  getAdminWineryById,
  getPublicTerroirBySlug,
  getPublicWineBySlug,
  getPublicWinemakerBySlug,
  listPublicTerroirs,
  listPublicContentSitemapEntries,
  listPublicStores,
  listPublicWinemakers,
  listPublicWines,
  setStoreVisibility,
  setTerroirVisibility,
  setWinemakerVisibility,
  setWineryVisibility,
  setWineVisibility,
  updateStore,
  updateTerroir,
  updateWine,
  updateWinemaker,
  updateWinery,
} from '../server/repositories/content'

let context: DatabaseContext
let testDirectory: string

beforeEach(() => {
  testDirectory = mkdtempSync(join(tmpdir(), 'ideawinemaker-test-'))
  context = openDatabase(join(testDirectory, 'content.sqlite'))
  globalThis.__ideaWinemakerDatabase = context
})

afterEach(() => {
  globalThis.__ideaWinemakerDatabase = undefined
  context.sqlite.close()
  rmSync(testDirectory, { recursive: true, force: true })
})

describe('SQLite content migration', () => {
  it('initializes a new writable database from the versioned SQLite baseline', () => {
    expect(listPublicWinemakers()).toHaveLength(3)
    expect(listPublicTerroirs()).toHaveLength(2)
    expect(listPublicWines()).toHaveLength(6)
    expect(listPublicStores()).toHaveLength(9)
    expect(listPublicWines()[0]).toMatchObject({
      meta: { winemakerSlug: expect.any(String), terroirSlug: expect.any(String) },
      details: expect.any(Array),
    })

    const siteContent = getPublicSiteContent()
    expect(siteContent).toMatchObject({
      site: { mainMenu: expect.any(Array), headerSocials: expect.any(Array) },
      partners: expect.any(Array),
      policies: { privacyPolicy: expect.any(Object), cookiesPolicy: expect.any(Object) },
      news: expect.any(Array),
      events: expect.any(Array),
    })
    expect(siteContent.site.mainMenu).toHaveLength(5)
    expect(siteContent.site.headerSocials).toHaveLength(7)
    expect(siteContent.partners).toHaveLength(2)
    expect(siteContent.news).toHaveLength(1)
    expect(siteContent.events).toHaveLength(1)
  })

  it('enforces the required wine-to-winemaker foreign key', () => {
    expect(() => context.sqlite.prepare('UPDATE wines SET winemaker_id = 999999 WHERE id = 1').run()).toThrow()
    expect(() => context.sqlite.prepare('UPDATE wines SET terroir_id = 999999 WHERE id = 1').run()).toThrow()
    expect(() => context.sqlite.prepare('DELETE FROM winemakers WHERE id = 1').run()).toThrow()
    expect(() => context.sqlite.prepare('DELETE FROM terroirs WHERE id = 1').run()).toThrow()
  })

  it('hides wine directly and masks all wines of a hidden winemaker', () => {
    const firstWine = listPublicWines()[0]!
    const firstWinemaker = listPublicWinemakers()[0]!

    expect(listPublicContentSitemapEntries().filter(entry => entry.loc.startsWith('/wine/'))).toHaveLength(6)
    expect(listPublicContentSitemapEntries().filter(entry => entry.loc.startsWith('/vinodely/'))).toHaveLength(3)

    setWineVisibility(1, false)
    expect(listPublicWines()).toHaveLength(5)
    expect(listPublicContentSitemapEntries().some(entry => entry.loc === `/wine/${firstWine.slug}`)).toBe(false)
    expect(listPublicWinemakers().find(item => item.id === 1)?.meta.wineSlugs).toHaveLength(2)
    expect(getPublicWineBySlug(firstWine.slug)).toBeUndefined()

    setWineVisibility(1, true)
    setWinemakerVisibility(1, false)
    expect(listPublicWinemakers()).toHaveLength(2)
    expect(listPublicWines()).toHaveLength(3)
    expect(listPublicContentSitemapEntries().some(entry => entry.loc === `/vinodely/${firstWinemaker.slug}`)).toBe(false)

    setWinemakerVisibility(1, true)
    expect(listPublicWines()).toHaveLength(6)

    setTerroirVisibility(1, false)
    expect(listPublicTerroirs()).toHaveLength(1)
    expect(listPublicWines()).toHaveLength(3)

    setTerroirVisibility(1, true)
    expect(listPublicWines()).toHaveLength(6)
  })

  it('creates a winemaker and a strongly linked wine with ordered nested fields', () => {
    const createdWinemaker = createWinemaker({
      slug: 'test-winemaker',
      title: 'Тестовый винодел',
      excerpt: 'Краткое описание',
      content: 'Описание',
      image: '/uploads/test-winemaker.jpg',
      quote: 'Цитата',
      biography: ['Первый абзац', 'Второй абзац'],
      meta: { initials: 'TW', location: 'Тестовый регион', aboutBrand: 'О бренде' },
      isVisible: true,
    })

    const createdTerroir = createTerroir({
      slug: 'test-region',
      title: 'Тестовый регион',
      excerpt: 'Краткое описание терруара',
      content: 'Первый абзац терруара\n\nВторой абзац терруара',
      image: '/uploads/test-terroir.jpg',
      gallery: ['/uploads/test-terroir-gallery.jpg'],
      meta: {
        code: 'TST', climate: 'Тестовый климат', tags: ['тест'], soil: 'Тестовая почва',
        coordinates: '44, 37', center: [44, 37], bounds: [[44, 37], [44.1, 37], [44, 37.1]],
        area: '5 га', humidity: 'умеренная', slope: 'южный', altitude: '200 м',
      },
      isVisible: true,
    })

    const createdWine = createWine({
      winemakerId: createdWinemaker.id,
      terroirId: createdTerroir.id,
      slug: 'test-wine',
      title: 'Тестовое вино',
      excerpt: 'Краткое описание вина',
      content: 'Авторский замысел',
      image: '/uploads/test-wine.png',
      gallery: ['/uploads/test-gallery-1.png', '/uploads/test-gallery-2.png'],
      authorQuote: 'Цитата автора',
      details: [{ title: 'Технология', items: ['Шаг 1', 'Шаг 2'] }],
      meta: {
        wineType: 'Вино белое сухое', variety: 'Тестовый сорт', method: 'Тестовый метод', methodCode: 'TM',
        year: '2026', alcohol: '12%', volume: '0,75 л.', batch: '100 бут.', bottleNumber: '001 / 100', servingTemperature: '8–10°С',
        color: 'Светлый', aroma: 'Свежий', taste: 'Сбалансированный', pairing: 'Сыры',
      },
      isVisible: true,
    })

    expect(getPublicWinemakerBySlug(createdWinemaker.slug)?.meta.wineSlugs).toEqual([createdWine.slug])
    expect(getPublicTerroirBySlug(createdTerroir.slug)?.meta.wineSlugs).toEqual([createdWine.slug])
    expect(getPublicWineBySlug(createdWine.slug)).toMatchObject({
      gallery: ['/uploads/test-gallery-1.png', '/uploads/test-gallery-2.png'],
      terroir: ['Первый абзац терруара', 'Второй абзац терруара'],
      details: [{ title: 'Технология', items: ['Шаг 1', 'Шаг 2'] }],
      meta: { winemakerSlug: createdWinemaker.slug, winemakerName: 'Тестовый винодел', winemakerCode: 'TW' },
    })
  })

  it('stores a winery independently without foreign keys or public content output', () => {
    const created = createWinery({
      slug: 'test-winery',
      title: 'Тестовая винодельня',
      legalName: 'ООО «Тест»',
      excerpt: 'Краткое описание',
      content: 'Полное описание',
      image: '/uploads/test-winery.jpg',
      foundedYear: 2018,
      region: 'Краснодарский край',
      address: 'Тестовый адрес',
      latitude: 44.7,
      longitude: 37.7,
      website: 'https://example.com',
      email: 'info@example.com',
      phone: '+7 900 000-00-00',
      vineyardArea: '25 га',
      annualProduction: '100000 бут./год',
      specialization: 'Тихие вина',
      visitInfo: 'По предварительной записи',
      isVisible: true,
    })

    expect(context.sqlite.prepare('SELECT title, region, vineyard_area FROM wineries WHERE id = ?').get(created.id)).toEqual({
      title: 'Тестовая винодельня',
      region: 'Краснодарский край',
      vineyard_area: '25 га',
    })
    expect(context.sqlite.prepare("PRAGMA foreign_key_list('wineries')").all()).toEqual([])
    expect(getAdminContentOverview().wineries).toEqual([{
      id: created.id,
      slug: 'test-winery',
      title: 'Тестовая винодельня',
      region: 'Краснодарский край',
      foundedYear: 2018,
      isVisible: true,
    }])

    const original = getAdminWineryById(created.id)!
    updateWinery(created.id, {
      ...original,
      title: 'Обновлённая винодельня',
      region: 'Ростовская область',
      isVisible: false,
    })
    expect(getAdminWineryById(created.id)).toMatchObject({
      title: 'Обновлённая винодельня',
      region: 'Ростовская область',
      isVisible: false,
    })
    expect(setWineryVisibility(created.id, true)).toEqual({ id: created.id, isVisible: true })
  })

  it('stores a new shop point with the commerce.ts fields and exposes it publicly', () => {
    const created = createStore({
      title: 'Тестовая винотека',
      city: 'Краснодар',
      address: 'ул. Тестовая, 1',
      website: 'https://example.com/',
      coordinates: [45.03, 38.97],
      isVisible: true,
    })

    expect(listPublicStores().at(-1)).toEqual({
      id: created.id,
      title: 'Тестовая винотека',
      city: 'Краснодар',
      address: 'ул. Тестовая, 1',
      website: 'https://example.com/',
      coordinates: [45.03, 38.97],
    })
    expect(() => createStore({
      title: 'Тестовая винотека',
      city: 'Краснодар',
      address: 'ул. Тестовая, 1',
      website: 'https://another.example.com/',
      coordinates: [45.04, 38.98],
      isVisible: true,
    })).toThrow()

    expect(setStoreVisibility(created.id, false)).toEqual({ id: created.id, isVisible: false })
    expect(listPublicStores().some(store => store.id === created.id)).toBe(false)
    expect(getAdminStoreById(created.id)?.isVisible).toBe(false)

    updateStore(created.id, {
      title: 'Обновлённая винотека',
      city: 'Анапа',
      address: 'ул. Новая, 2',
      website: 'https://example.com/updated',
      coordinates: [44.89, 37.31],
      isVisible: true,
    })
    expect(listPublicStores().at(-1)).toMatchObject({
      id: created.id,
      title: 'Обновлённая винотека',
      city: 'Анапа',
      coordinates: [44.89, 37.31],
    })
  })

  it('edits records and their nested fields while preserving the hidden gallery', () => {
    const originalWinemaker = getAdminWinemakerById(1)!
    const originalTerroir = getAdminTerroirById(1)!
    const originalWine = getAdminWineById(1)!
    const originalGallery = context.sqlite.prepare(
      'SELECT position, image FROM wine_gallery WHERE wine_id = ? ORDER BY position',
    ).all(originalWine.id)

    const updatedWinemaker = updateWinemaker(originalWinemaker.id, {
      slug: `${originalWinemaker.slug}-edited`,
      title: `${originalWinemaker.title} — редакция`,
      excerpt: originalWinemaker.excerpt,
      content: originalWinemaker.content,
      image: originalWinemaker.image,
      quote: originalWinemaker.quote,
      biography: ['Новая первая строка', 'Новая вторая строка'],
      meta: { ...originalWinemaker.meta, location: 'Обновлённая локация' },
      isVisible: false,
    })

    expect(updatedWinemaker?.slug).toBe(`${originalWinemaker.slug}-edited`)
    expect(getAdminWinemakerById(originalWinemaker.id)).toMatchObject({
      biography: ['Новая первая строка', 'Новая вторая строка'],
      meta: { location: 'Обновлённая локация' },
      isVisible: false,
    })
    expect(getPublicWinemakerBySlug(updatedWinemaker!.slug)).toBeUndefined()

    const updatedTerroir = updateTerroir(originalTerroir.id, {
      slug: `${originalTerroir.slug}-edited`,
      title: `${originalTerroir.title} — редакция`,
      excerpt: originalTerroir.excerpt,
      content: 'Обновлённое описание отдельного терруара',
      image: originalTerroir.image,
      gallery: originalTerroir.gallery,
      meta: { ...originalTerroir.meta, tags: ['обновлённый'], area: '12 га' },
      isVisible: true,
    })
    expect(updatedTerroir?.slug).toBe(`${originalTerroir.slug}-edited`)
    expect(getAdminTerroirById(originalTerroir.id)).toMatchObject({
      content: 'Обновлённое описание отдельного терруара',
      meta: { tags: ['обновлённый'], area: '12 га' },
    })

    const replacementWinemaker = getAdminWinemakerById(2)!
    const replacementTerroir = getAdminTerroirById(2)!
    const updatedWine = updateWine(originalWine.id, {
      winemakerId: replacementWinemaker.id,
      terroirId: replacementTerroir.id,
      slug: `${originalWine.slug}-edited`,
      title: `${originalWine.title} — редакция`,
      excerpt: originalWine.excerpt,
      content: originalWine.content,
      image: originalWine.image,
      authorQuote: originalWine.authorQuote,
      details: [
        { title: 'Урожай', items: ['Ручной сбор'] },
        { title: 'Технология', items: ['Охлаждение', 'Ферментация'] },
      ],
      meta: { ...originalWine.meta, alcohol: '13%' },
      isVisible: true,
    })

    expect(updatedWine?.slug).toBe(`${originalWine.slug}-edited`)
    expect(getPublicWineBySlug(originalWine.slug)).toBeUndefined()
    expect(getAdminWineById(originalWine.id)).toMatchObject({
      winemakerId: replacementWinemaker.id,
      terroirId: replacementTerroir.id,
      details: [
        { title: 'Урожай', items: ['Ручной сбор'] },
        { title: 'Технология', items: ['Охлаждение', 'Ферментация'] },
      ],
      meta: { alcohol: '13%' },
      isVisible: true,
    })
    expect(getPublicWineBySlug(updatedWine!.slug)?.meta).toMatchObject({
      winemakerSlug: replacementWinemaker.slug,
      winemakerName: replacementWinemaker.title,
      terroirSlug: replacementTerroir.slug,
      terroirCode: replacementTerroir.meta.code,
    })
    expect(context.sqlite.prepare(
      'SELECT position, image FROM wine_gallery WHERE wine_id = ? ORDER BY position',
    ).all(originalWine.id)).toEqual(originalGallery)
  })
})
