import type { Terroir } from '../types/content'

export type TerroirRecord = Terroir

export const terroirs: TerroirRecord[] = [
  {
    id: 1,
    slug: 'sevastopol',
    title: 'Севастополь',
    excerpt: 'Предгорная часть Крыма на стыке морского и умеренно-континентального климата.',
    content: 'Виноградники села Тенистого в Бахчисарайской долине расположены в предгорной части Крыма. Близость Чёрного моря смягчает температуру, рельеф обеспечивает вентиляцию и дневные перепады, а известняковые почвы помогают сохранять кислотность и формируют выраженную минеральность.',
    image: '/uploads/2026/04/terr.jpg',
    gallery: [],
    meta: {
      code: 'SVS', climate: 'Сухой морской и умеренно-континентальный', tags: ['морской ветер', 'сухой климат', 'прохладные ночи'], soil: 'Глинисто-известняковая с каменистыми включениями', coordinates: '44.7315, 33.7078', center: [44.7315, 33.7078], bounds: [[44.724, 33.694], [44.739, 33.697], [44.742, 33.716], [44.728, 33.722]], area: '10 га', humidity: 'умеренная', slope: 'северо-западный', altitude: '170–240 м', wineSlugs: ['savinyon-blan-andryus-yuczis-kulturnyj', 'savinyon-blan-andryus-yutsis-dikiy', 'shardone-andryus-yuczis-syur-li'],
    },
  },
  {
    id: 2,
    slug: 'novorossiysk',
    title: 'Новороссийск',
    excerpt: 'Естественный амфитеатр Семигорья с морским влиянием и карбонатной структурой почв.',
    content: 'Виноградники Семигорья лежат в естественном амфитеатре холмов. Участки защищены от холодных масс, хорошо прогреваются, а циркуляция воздуха со стороны Чёрного моря снижает риск болезней и помогает дольше выдерживать ягоду на лозе.',
    image: '/uploads/2026/04/deli_2-1024x683.jpg',
    gallery: [],
    meta: {
      code: 'NVR', climate: 'Умеренно-континентальный с морским влиянием', tags: ['длинная осень', 'морская свежесть', 'южная спелость'], soil: 'Известняковая с примесью глины и камня', coordinates: '44.7974, 37.6532', center: [44.7974, 37.6532], bounds: [[44.790, 37.641], [44.805, 37.644], [44.808, 37.663], [44.794, 37.668]], area: '5,8 га', humidity: 'умеренная', slope: 'южный', altitude: '180–260 м', wineSlugs: ['shardone-semya-vinodelov-natalya-i-aleksandr', 'saperavi-semya-vinodelov-dorotenko-natalya-i-aleksandr', 'rubin-golodrigi-anna-nesterova'],
    },
  },
]

export const terroirBySlug = (slug: string) => terroirs.find(terroir => terroir.slug === slug)
