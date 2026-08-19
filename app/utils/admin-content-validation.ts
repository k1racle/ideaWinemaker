interface WinemakerFormValue {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  quote: string
  biography: string[]
  meta: {
    initials: string
    location: string
    aboutBrand: string
  }
}

export interface WineryFormValue {
  slug: string
  title: string
  legalName: string
  excerpt: string
  content: string
  image: string
  foundedYear: string
  region: string
  address: string
  latitude: string
  longitude: string
  website: string
  email: string
  phone: string
  vineyardArea: string
  annualProduction: string
  specialization: string
  visitInfo: string
  isVisible: boolean
}

export interface StoreFormValue {
  title: string
  city: string
  address: string
  website: string
  latitude: string
  longitude: string
  isVisible: boolean
}

interface WineFormValue {
  winemakerId: number
  terroirId: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  authorQuote: string
  details: Array<{ title: string, items: string[] }>
  meta: {
    wineType: string
    variety: string
    method: string
    methodCode: string
    year: string
    alcohol: string
    volume: string
    batch: string
    bottleNumber: string
    servingTemperature: string
    color: string
    aroma: string
    taste: string
    pairing: string
  }
}

export interface TerroirFormValue {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  gallery: string[]
  meta: {
    code: string
    climate: string
    tags: string[]
    soil: string
    coordinates: string
    center: [string, string]
    bounds: string[]
    area: string
    humidity: string
    slope: string
    altitude: string
  }
  isVisible: boolean
}

type TextField = readonly [label: string, value: string]

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const isBlank = (value: string) => !value.trim()
const isValidImageReference = (value: string) => {
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
const addMissingFields = (errors: string[], section: string, fields: TextField[]) => {
  const missing = fields.filter(([, value]) => isBlank(value)).map(([label]) => label)
  if (missing.length) errors.push(`${section}: заполните ${missing.join(', ')}.`)
}

export const validateWinemakerForm = (form: WinemakerFormValue) => {
  const errors: string[] = []

  addMissingFields(errors, 'Основная информация', [
    ['Заголовок', form.title],
    ['Slug', form.slug],
    ['Инициалы / код', form.meta.initials],
    ['Локация', form.meta.location],
    ['Путь к изображению', form.image],
  ])
  addMissingFields(errors, 'Тексты', [
    ['Краткое описание', form.excerpt],
    ['Основное описание', form.content],
    ['Цитата', form.quote],
    ['Подпись к цитате', form.meta.aboutBrand],
  ])

  if (form.slug.trim() && !slugPattern.test(form.slug.trim())) {
    errors.push('Slug: используйте только строчные латинские буквы, цифры и дефисы.')
  }
  if (form.image.trim() && !isValidImageReference(form.image.trim())) {
    errors.push('Изображение: укажите путь, начинающийся с /, либо полный URL http(s).')
  }
  if (!form.biography.some(item => item.trim())) {
    errors.push('Биография: добавьте хотя бы один заполненный абзац.')
  } else if (form.biography.some(item => isBlank(item))) {
    errors.push('Биография: заполните или удалите пустые абзацы.')
  }

  return errors
}

export const validateWineryForm = (form: WineryFormValue) => {
  const errors: string[] = []

  addMissingFields(errors, 'Основная информация', [
    ['Название', form.title],
    ['Slug', form.slug],
    ['Регион', form.region],
  ])

  if (form.slug.trim() && !slugPattern.test(form.slug.trim())) {
    errors.push('Slug винодельни: используйте только строчные латинские буквы, цифры и дефисы.')
  }
  if (form.image.trim() && !isValidImageReference(form.image.trim())) {
    errors.push('Изображение: укажите путь, начинающийся с /, либо полный URL http(s).')
  }
  if (form.website.trim() && !isValidHttpUrl(form.website.trim())) {
    errors.push('Сайт: укажите полный URL, начинающийся с http:// или https://.')
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.push('Email: укажите корректный адрес.')
  }

  if (form.foundedYear.trim()) {
    const foundedYear = Number(form.foundedYear)
    if (!/^\d+$/.test(form.foundedYear.trim()) || !Number.isInteger(foundedYear) || foundedYear < 1000 || foundedYear > 2100) {
      errors.push('Год основания: укажите целое число от 1000 до 2100.')
    }
  }

  const hasLatitude = Boolean(form.latitude.trim())
  const hasLongitude = Boolean(form.longitude.trim())
  if (hasLatitude !== hasLongitude) {
    errors.push('Координаты: заполните и широту, и долготу либо оставьте оба поля пустыми.')
  } else if (hasLatitude && hasLongitude) {
    const latitude = Number(form.latitude.replace(',', '.'))
    const longitude = Number(form.longitude.replace(',', '.'))
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.push('Координаты: широта должна быть числом от -90 до 90.')
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.push('Координаты: долгота должна быть числом от -180 до 180.')
    }
  }

  return errors
}

export const toWineryPayload = (form: WineryFormValue) => ({
  slug: form.slug.trim(),
  title: form.title.trim(),
  legalName: form.legalName.trim(),
  excerpt: form.excerpt.trim(),
  content: form.content.trim(),
  image: form.image.trim(),
  foundedYear: form.foundedYear.trim() ? Number(form.foundedYear) : null,
  region: form.region.trim(),
  address: form.address.trim(),
  latitude: form.latitude.trim() ? Number(form.latitude.replace(',', '.')) : null,
  longitude: form.longitude.trim() ? Number(form.longitude.replace(',', '.')) : null,
  website: form.website.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  vineyardArea: form.vineyardArea.trim(),
  annualProduction: form.annualProduction.trim(),
  specialization: form.specialization.trim(),
  visitInfo: form.visitInfo.trim(),
  isVisible: form.isVisible,
})

export const validateStoreForm = (form: StoreFormValue) => {
  const errors: string[] = []

  addMissingFields(errors, 'Точка магазина', [
    ['Название', form.title],
    ['Город', form.city],
    ['Адрес', form.address],
    ['Сайт', form.website],
    ['Широта', form.latitude],
    ['Долгота', form.longitude],
  ])

  if (form.website.trim() && !isValidHttpUrl(form.website.trim())) {
    errors.push('Сайт: укажите полный URL, начинающийся с http:// или https://.')
  }

  if (form.latitude.trim()) {
    const latitude = Number(form.latitude.replace(',', '.'))
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.push('Координаты: широта должна быть числом от -90 до 90.')
    }
  }
  if (form.longitude.trim()) {
    const longitude = Number(form.longitude.replace(',', '.'))
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.push('Координаты: долгота должна быть числом от -180 до 180.')
    }
  }

  return errors
}

export const toStorePayload = (form: StoreFormValue) => ({
  title: form.title.trim(),
  city: form.city.trim(),
  address: form.address.trim(),
  website: form.website.trim(),
  coordinates: [
    Number(form.latitude.replace(',', '.')),
    Number(form.longitude.replace(',', '.')),
  ] as [number, number],
  isVisible: form.isVisible,
})

export const validateWineForm = (form: WineFormValue) => {
  const errors: string[] = []

  if (!Number.isInteger(form.winemakerId) || form.winemakerId <= 0) {
    errors.push('Винодел: выберите винодела из списка.')
  }
  if (!Number.isInteger(form.terroirId) || form.terroirId <= 0) {
    errors.push('Терруар: выберите терруар из списка.')
  }

  addMissingFields(errors, 'Основная информация', [
    ['Заголовок', form.title],
    ['Slug', form.slug],
    ['Тип вина', form.meta.wineType],
    ['Сорт', form.meta.variety],
    ['Метод', form.meta.method],
    ['Код метода', form.meta.methodCode],
    ['Год урожая', form.meta.year],
    ['Крепость', form.meta.alcohol],
    ['Объём', form.meta.volume],
    ['Путь к изображению', form.image],
  ])
  addMissingFields(errors, 'Основные тексты', [
    ['Краткое описание', form.excerpt],
    ['Авторский замысел', form.content],
    ['Цитата автора', form.authorQuote],
  ])
  addMissingFields(errors, 'Выпуск', [
    ['Тираж', form.meta.batch],
    ['Номер / тираж', form.meta.bottleNumber],
    ['Температура подачи', form.meta.servingTemperature],
  ])
  addMissingFields(errors, 'Органолептика', [
    ['Цвет', form.meta.color],
    ['Аромат', form.meta.aroma],
    ['Вкус', form.meta.taste],
    ['Гастропара', form.meta.pairing],
  ])

  if (form.slug.trim() && !slugPattern.test(form.slug.trim())) {
    errors.push('Slug вина: используйте только строчные латинские буквы, цифры и дефисы.')
  }
  if (form.image.trim() && !isValidImageReference(form.image.trim())) {
    errors.push('Основное изображение: укажите путь, начинающийся с /, либо полный URL http(s).')
  }

  if (!form.details.length) {
    errors.push('Группы характеристик: добавьте хотя бы одну группу.')
  }
  form.details.forEach((group, index) => {
    const groupName = group.title.trim() || `Группа ${index + 1}`
    if (!group.title.trim()) errors.push(`Группа ${index + 1}: заполните название.`)
    if (!group.items.some(item => item.trim())) {
      errors.push(`${groupName}: добавьте хотя бы один заполненный пункт.`)
    } else if (group.items.some(item => isBlank(item))) {
      errors.push(`${groupName}: заполните или удалите пустые пункты.`)
    }
  })

  return errors
}

export const parseCoordinatePair = (value: string): [number, number] | undefined => {
  const parts = value.split(',').map(part => Number(part.trim()))
  if (parts.length !== 2 || parts.some(part => !Number.isFinite(part))) return undefined
  const [latitude, longitude] = parts
  if (latitude === undefined || longitude === undefined || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return undefined
  return [latitude, longitude]
}

export const validateTerroirForm = (form: TerroirFormValue) => {
  const errors: string[] = []

  addMissingFields(errors, 'Основная информация', [
    ['Название', form.title],
    ['Slug', form.slug],
    ['Код', form.meta.code],
    ['Путь к изображению', form.image],
  ])
  addMissingFields(errors, 'Описание', [
    ['Краткое описание', form.excerpt],
    ['Основной текст', form.content],
    ['Климат', form.meta.climate],
    ['Почва', form.meta.soil],
  ])
  addMissingFields(errors, 'Характеристики участка', [
    ['Координаты', form.meta.coordinates],
    ['Широта центра', form.meta.center[0]],
    ['Долгота центра', form.meta.center[1]],
    ['Площадь', form.meta.area],
    ['Влажность', form.meta.humidity],
    ['Склон', form.meta.slope],
    ['Высота', form.meta.altitude],
  ])

  if (form.slug.trim() && !slugPattern.test(form.slug.trim())) {
    errors.push('Slug терруара: используйте только строчные латинские буквы, цифры и дефисы.')
  }
  if (form.image.trim() && !isValidImageReference(form.image.trim())) {
    errors.push('Изображение: укажите путь, начинающийся с /, либо полный URL http(s).')
  }
  if (form.gallery.some(item => item.trim() && !isValidImageReference(item.trim()))) {
    errors.push('Галерея: каждый путь должен начинаться с / либо быть полным URL http(s).')
  }
  if (!form.meta.tags.some(item => item.trim())) {
    errors.push('Теги: добавьте хотя бы один заполненный тег.')
  } else if (form.meta.tags.some(item => isBlank(item))) {
    errors.push('Теги: заполните или удалите пустые строки.')
  }

  const center = parseCoordinatePair(`${form.meta.center[0]},${form.meta.center[1]}`)
  if (!center) errors.push('Центр карты: укажите корректные широту и долготу.')

  if (form.meta.bounds.length < 3) {
    errors.push('Границы участка: добавьте минимум три точки.')
  } else if (form.meta.bounds.some(point => !parseCoordinatePair(point))) {
    errors.push('Границы участка: каждая точка должна иметь формат «широта, долгота».')
  }

  return errors
}

export const toTerroirPayload = (form: TerroirFormValue) => ({
  ...form,
  gallery: form.gallery.filter(item => item.trim()),
  meta: {
    ...form.meta,
    code: form.meta.code.trim().toUpperCase(),
    tags: form.meta.tags.filter(item => item.trim()),
    center: [Number(form.meta.center[0]), Number(form.meta.center[1])] as [number, number],
    bounds: form.meta.bounds.map(point => parseCoordinatePair(point)!),
  },
})
