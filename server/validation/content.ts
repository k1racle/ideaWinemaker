import { z } from 'zod'

const requiredText = (label: string, max = 10000) => z.string()
  .trim()
  .min(1, `${label}: заполните поле`)
  .max(max, `${label}: превышена максимальная длина`)

const slug = z.string()
  .trim()
  .min(1, 'Заполните slug')
  .max(160, 'Slug слишком длинный')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug может содержать строчные латинские буквы, цифры и дефисы')

const imagePath = requiredText('Путь к изображению', 2048).refine((value) => {
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}, 'Укажите абсолютный путь от / или URL http(s)')

const optionalText = (label: string, max = 10000) => z.string()
  .trim()
  .max(max, `${label}: превышена максимальная длина`)

const optionalImagePath = optionalText('Путь к изображению', 2048).refine((value) => {
  if (!value || value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}, 'Изображение: укажите абсолютный путь от / или URL http(s)')

const optionalWebsite = optionalText('Сайт', 2048).refine((value) => {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}, 'Сайт: укажите полный URL http(s)')

const website = requiredText('Сайт', 2048).refine((value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}, 'Сайт: укажите полный URL http(s)')

const normalizedCode = (label: string, max = 30) => requiredText(label, max)
  .transform(value => value.toUpperCase())

const coordinatePair = z.tuple([
  z.number().finite().min(-90, 'Широта должна быть от -90 до 90').max(90, 'Широта должна быть от -90 до 90'),
  z.number().finite().min(-180, 'Долгота должна быть от -180 до 180').max(180, 'Долгота должна быть от -180 до 180'),
])

export const createWinemakerSchema = z.object({
  slug,
  title: requiredText('Заголовок', 300),
  excerpt: requiredText('Краткое описание', 3000),
  content: requiredText('Описание', 10000),
  image: imagePath,
  quote: requiredText('Цитата', 15000),
  biography: z.array(requiredText('Абзац биографии', 15000)).min(1, 'Добавьте хотя бы один абзац биографии').max(100),
  meta: z.object({
    initials: requiredText('Инициалы', 20),
    location: requiredText('Локация', 300),
    aboutBrand: requiredText('Подпись к цитате', 500),
  }).strict(),
  isVisible: z.boolean().default(true),
}).strict()

export const createWinerySchema = z.object({
  slug,
  title: requiredText('Название винодельни', 300),
  legalName: optionalText('Юридическое название', 500),
  excerpt: optionalText('Краткое описание', 3000),
  content: optionalText('Полное описание', 20000),
  image: optionalImagePath,
  foundedYear: z.number().int('Год основания должен быть целым числом')
    .min(1000, 'Год основания должен быть не меньше 1000')
    .max(2100, 'Год основания должен быть не больше 2100')
    .nullable(),
  region: requiredText('Регион', 500),
  address: optionalText('Адрес', 1000),
  latitude: z.number().finite().min(-90, 'Широта должна быть от -90 до 90').max(90, 'Широта должна быть от -90 до 90').nullable(),
  longitude: z.number().finite().min(-180, 'Долгота должна быть от -180 до 180').max(180, 'Долгота должна быть от -180 до 180').nullable(),
  website: optionalWebsite,
  email: z.union([z.literal(''), z.email('Email: укажите корректный адрес')]),
  phone: optionalText('Телефон', 100),
  vineyardArea: optionalText('Площадь виноградников', 100),
  annualProduction: optionalText('Годовой объём производства', 100),
  specialization: optionalText('Специализация', 3000),
  visitInfo: optionalText('Посещение и экскурсии', 3000),
}).strict().superRefine((value, context) => {
  if ((value.latitude === null) !== (value.longitude === null)) {
    context.addIssue({
      code: 'custom',
      message: 'Координаты: заполните и широту, и долготу либо оставьте оба поля пустыми',
      path: ['latitude'],
    })
  }
})

export const createStoreSchema = z.object({
  title: requiredText('Название магазина', 500),
  city: requiredText('Город', 300),
  address: requiredText('Адрес', 1000),
  website,
  coordinates: coordinatePair,
}).strict()

export const createWineSchema = z.object({
  winemakerId: z.number().int().positive('Выберите винодела'),
  terroirId: z.number().int().positive('Выберите терруар'),
  slug,
  title: requiredText('Заголовок', 300),
  excerpt: requiredText('Краткое описание', 3000),
  content: requiredText('Авторский замысел', 20000),
  image: imagePath,
  gallery: z.array(imagePath).max(50).default([]),
  authorQuote: requiredText('Цитата автора', 20000),
  details: z.array(z.object({
    title: requiredText('Название группы', 200),
    items: z.array(requiredText('Строка группы', 5000)).min(1, 'Добавьте хотя бы одну строку').max(100),
  }).strict()).min(1, 'Добавьте хотя бы одну группу деталей').max(30),
  meta: z.object({
    wineType: requiredText('Тип вина', 200),
    variety: requiredText('Сорт', 300),
    method: requiredText('Метод', 500),
    methodCode: normalizedCode('Код метода'),
    year: requiredText('Год', 20),
    alcohol: requiredText('Крепость', 50),
    volume: requiredText('Объём', 50),
    batch: requiredText('Тираж', 100),
    bottleNumber: requiredText('Номер бутылки', 100),
    servingTemperature: requiredText('Температура подачи', 100),
    color: requiredText('Цвет', 3000),
    aroma: requiredText('Аромат', 5000),
    taste: requiredText('Вкус', 5000),
    pairing: requiredText('Гастропара', 5000),
  }).strict(),
  isVisible: z.boolean().default(true),
}).strict()

export const createTerroirSchema = z.object({
  slug,
  title: requiredText('Название терруара', 300),
  excerpt: requiredText('Краткое описание', 3000),
  content: requiredText('Описание терруара', 20000),
  image: imagePath,
  gallery: z.array(imagePath).max(50).default([]),
  meta: z.object({
    code: normalizedCode('Код терруара'),
    climate: requiredText('Климат', 1000),
    tags: z.array(requiredText('Тег', 200)).min(1, 'Добавьте хотя бы один тег').max(50),
    soil: requiredText('Почва', 1000),
    coordinates: requiredText('Координаты', 200),
    center: coordinatePair,
    bounds: z.array(coordinatePair).min(3, 'Добавьте хотя бы три точки границы').max(100),
    area: requiredText('Площадь', 200),
    humidity: requiredText('Влажность', 200),
    slope: requiredText('Склон', 200),
    altitude: requiredText('Высота', 200),
  }).strict(),
  isVisible: z.boolean().default(true),
}).strict()

export const updateWinemakerSchema = createWinemakerSchema
export const updateWineSchema = createWineSchema.omit({ gallery: true })
export const updateTerroirSchema = createTerroirSchema

export const visibilitySchema = z.object({
  isVisible: z.boolean(),
}).strict()

export const loginSchema = z.object({
  login: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(1000),
}).strict()

export type CreateWinemakerInput = z.infer<typeof createWinemakerSchema>
export type CreateWineryInput = z.infer<typeof createWinerySchema>
export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type CreateWineInput = z.infer<typeof createWineSchema>
export type UpdateWineInput = z.infer<typeof updateWineSchema>
export type CreateTerroirInput = z.infer<typeof createTerroirSchema>
