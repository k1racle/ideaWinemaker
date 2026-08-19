export interface Partner {
  name: string
  image: string
  site: string
  url: string
}

export interface Store {
  id: number
  title: string
  city: string
  address: string
  website: string
  coordinates: [number, number]
}

export const partners: Partner[] = [
  { name: 'Vinotheque', image: '/uploads/2026/04/vinotheque.png', site: 'vinotheque.ru', url: 'https://vinotheque.ru/' },
  { name: 'Культура Крепкого', image: '/uploads/2026/04/kultura-krepkogo.png', site: 'liquorculture.ru', url: 'https://liquorculture.ru/' },
]

export const stores: Store[] = [
  { id: 1, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Белгород', address: 'ул. Есенина, д. 9, к. 2', website: 'https://liquorculture.ru/', coordinates: [50.554507, 36.568987] },
  { id: 2, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Белгород', address: 'Гражданский проспект, д. 34', website: 'https://liquorculture.ru/', coordinates: [50.594197, 36.597383] },
  { id: 3, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Белгород', address: 'ул. Чичерина, д. 1Л', website: 'https://liquorculture.ru/', coordinates: [50.617241, 36.537833] },
  { id: 4, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Краснодар', address: 'ул. Казбекская, д. 1', website: 'https://liquorculture.ru/', coordinates: [45.066195, 38.950088] },
  { id: 5, title: '«ВИНОТЕКА. Мильстрим»', city: 'Белгород', address: 'ул. Есенина, д. 9, к. 1', website: 'https://liquorculture.ru/', coordinates: [50.554676, 36.570190] },
  { id: 6, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Ульяновск', address: 'Дворцовая, 4а/1, ТЦ «Версаль»', website: 'https://liquorculture.ru/', coordinates: [54.317459, 48.399880] },
  { id: 7, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Старый Оскол', address: 'ул. Жукова, д. 48, ТЦ Mix', website: 'https://liquorculture.ru/', coordinates: [51.3088, 37.8834] },
  { id: 8, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Старый Оскол', address: 'мкр. Уютный, д. 4, ТЦ «Айсберг»', website: 'https://liquorculture.ru/', coordinates: [51.330390, 37.888603] },
  { id: 9, title: '«ВИНОТЕКА. Культура Крепкого»', city: 'Орёл', address: 'ул. 8 Марта, д. 8', website: 'https://liquorculture.ru/', coordinates: [52.978624, 36.078431] },
]
