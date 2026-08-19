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

export const events: EventRecord[] = [
  {
    id: 1,
    slug: 'vinorus-vinoteh-2026',
    title: 'Презентация коллекции на «Винорус.Винотех»',
    excerpt: 'Первая публичная презентация бренда «Идея Винодела. Коллекция авторских вин».',
    content: [
      'На стенде бренда гости выставки смогут познакомиться с шестью авторскими винами, узнать о технологических решениях их создателей и увидеть, как один сорт меняется в зависимости от метода работы винодела.',
      'Выставка объединяет производителей, поставщиков, дистрибьюторов, ритейл и HoReCa. Команда проекта будет ждать гостей в павильоне № 1 на стенде A415.',
    ],
    image: '/uploads/2026/04/vinoteh-vinorus-2026.png',
    gallery: ['/uploads/2026/04/vinotech-main.png', '/uploads/2026/04/uzhin-ideya-vinodela-16-9.jpg'],
    meta: {
      dateStart: '22 апреля 2026', dateEnd: '24 апреля 2026', timeStart: '10:00', timeEnd: '18:00', city: 'Краснодар', address: 'ул. Конгрессная, 1', location: 'ВКК «Экспоград Юг», павильон № 1, стенд A415', price: 0, currency: '₽', ageLimit: '18+', organizer: 'Винорус.Винотех', organizerUrl: 'https://vinorus.ru/',
    },
  },
]

export const eventBySlug = (slug: string) => events.find(event => event.slug === slug)

