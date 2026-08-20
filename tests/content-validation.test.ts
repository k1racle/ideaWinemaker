import { describe, expect, it } from 'vitest'
import { validateStoreForm, validateWinemakerForm, validateWineryForm, validateWineForm } from '../app/utils/admin-content-validation'
import { createStoreSchema, createTerroirSchema, createWinemakerSchema, createWinerySchema, createWineSchema } from '../server/validation/content'

const completeWinemaker = {
  slug: 'test-winemaker',
  title: 'Тестовый винодел',
  excerpt: 'Краткое описание',
  content: 'Основное описание',
  image: '/uploads/test-winemaker.jpg',
  quote: 'Цитата',
  biography: ['Биография'],
  meta: { initials: 'TW', location: 'Краснодарский край', aboutBrand: 'О бренде' },
  isVisible: true,
}

const completeWine = {
  winemakerId: 1,
  terroirId: 1,
  slug: 'test-wine',
  title: 'Тестовое вино',
  excerpt: 'Краткое описание',
  content: 'Авторский замысел',
  image: '/uploads/test-wine.png',
  authorQuote: 'Цитата автора',
  details: [
    { title: 'Урожай', items: ['Ручной сбор'] },
    { title: 'Сезон', items: ['Тёплое лето'] },
    { title: 'Технология', items: ['Ферментация'] },
  ],
  meta: {
    wineType: 'Вино белое сухое', variety: 'Тестовый сорт', method: 'Тестовый метод', methodCode: 'TM',
    year: '2026', alcohol: '12%', volume: '0,75 л.', batch: '100 бут.', bottleNumber: '001 / 100', servingTemperature: '8–10°С',
    color: 'Светлый', aroma: 'Свежий', taste: 'Сбалансированный', pairing: 'Сыры',
  },
  isVisible: true,
}

describe('admin content validation', () => {
  it('rejects unsafe slugs and image paths', () => {
    const result = createWinemakerSchema.safeParse({
      slug: 'Винодел 1',
      title: 'Тест',
      excerpt: 'Тест',
      content: 'Тест',
      image: '../secret.jpg',
      quote: 'Тест',
      biography: ['Тест'],
      meta: { initials: 'TT', location: 'Тест', aboutBrand: 'Тест' },
      isVisible: true,
    })
    expect(result.success).toBe(false)
  })

  it('requires a real winemaker id and nested wine details', () => {
    const result = createWineSchema.safeParse({
      winemakerId: 0,
      terroirId: 0,
      slug: 'test-wine',
      title: 'Тест',
      excerpt: 'Тест',
      content: 'Тест',
      image: '/uploads/test.png',
      gallery: [],
      authorQuote: 'Тест',
      details: [],
      meta: {},
      isVisible: true,
    })
    expect(result.success).toBe(false)
  })

  it('returns readable grouped errors for incomplete admin forms', () => {
    const winemakerErrors = validateWinemakerForm({
      ...completeWinemaker,
      title: '',
      biography: [''],
      meta: { ...completeWinemaker.meta, location: '' },
    })
    expect(winemakerErrors).toContain('Основная информация: заполните Заголовок, Локация.')
    expect(winemakerErrors).toContain('Биография: добавьте хотя бы один заполненный абзац.')

    const wineErrors = validateWineForm({
      ...completeWine,
      winemakerId: 0,
      terroirId: 0,
      details: [{ title: 'Технология', items: [''] }],
      meta: { ...completeWine.meta, aroma: '', pairing: '' },
    })
    expect(wineErrors).toContain('Винодел: выберите винодела из списка.')
    expect(wineErrors).toContain('Терруар: выберите терруар из списка.')
    expect(wineErrors).toContain('Органолептика: заполните Аромат, Гастропара.')
    expect(wineErrors).toContain('Технология: добавьте хотя бы один заполненный пункт.')
  })

  it('accepts complete records in client-side validation', () => {
    expect(validateWinemakerForm(completeWinemaker)).toEqual([])
    expect(validateWineForm(completeWine)).toEqual([])
  })

  it('normalizes terroir and method codes to uppercase', () => {
    const terroirResult = createTerroirSchema.safeParse({
      slug: 'test-terroir',
      title: 'Тестовый терруар',
      excerpt: 'Описание',
      content: 'Полное описание',
      image: '/uploads/terroir.jpg',
      gallery: [],
      meta: {
        code: ' nvr ', climate: 'Климат', tags: ['морской'], soil: 'Почва', coordinates: '44, 37',
        center: [44, 37], bounds: [[44, 37], [44.1, 37], [44, 37.1]], area: '5 га', humidity: 'умеренная',
        slope: 'южный', altitude: '200 м',
      },
      isVisible: true,
    })
    expect(terroirResult.success && terroirResult.data.meta.code).toBe('NVR')
  })

  it('accepts a standalone winery and validates its optional coordinates', () => {
    const winery = {
      slug: 'test-winery',
      title: 'Тестовая винодельня',
      legalName: '', excerpt: '', content: '', image: '', foundedYear: null,
      region: 'Краснодарский край', address: '', latitude: null, longitude: null,
      website: '', email: '', phone: '', vineyardArea: '', annualProduction: '', specialization: '', visitInfo: '',
      isVisible: true,
    }

    expect(createWinerySchema.safeParse(winery).success).toBe(true)
    expect(createWinerySchema.safeParse({ ...winery, latitude: 44.7 }).success).toBe(false)
    expect(validateWineryForm({
      ...winery,
      foundedYear: '',
      latitude: '44.7',
      longitude: '',
    })).toContain('Координаты: заполните и широту, и долготу либо оставьте оба поля пустыми.')
  })

  it('validates store fields from commerce.ts', () => {
    expect(createStoreSchema.safeParse({
      title: 'Тестовая винотека',
      city: 'Краснодар',
      address: 'ул. Тестовая, 1',
      website: 'https://example.com/',
      coordinates: [45.03, 38.97],
    }).success).toBe(true)

    expect(validateStoreForm({
      title: 'Тестовая винотека',
      city: 'Краснодар',
      address: 'ул. Тестовая, 1',
      website: 'example.com',
      latitude: '100',
      longitude: '38.97',
      isVisible: true,
    })).toEqual([
      'Сайт: укажите полный URL, начинающийся с http:// или https://.',
      'Координаты: широта должна быть числом от -90 до 90.',
    ])
  })
})
