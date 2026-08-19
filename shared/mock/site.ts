// Shared site-wide mock data.
// Shapes mirror what the WordPress export will provide later (menus, options),
// so swapping mocks for real data means editing only these files.

export interface MenuItem {
  title: string
  url: string
}

export interface SocialItem {
  name: string
  url: string
  icon: string
}

export const siteName = 'ИДЕЯ ВИНОДЕЛА'

// Main navigation (lives in the WP database; these are placeholders
// matching the theme's page structure — real items come from the DB export).
export const mainMenu: MenuItem[] = [
  { title: 'Манифест', url: '/manifest' },
  { title: 'Виноделы', url: '/vinodely' },
  { title: 'Вино', url: '/wine' },
  { title: 'Спектакль', url: '/spektakl/' },
  { title: 'Новости', url: '/novosti' },
]

export const footerMenu: MenuItem[] = [
  { title: 'Вина', url: '/wines' },
  { title: 'Виноделы', url: '/vinodely' },
  { title: 'Мероприятия', url: '/events' },
  { title: 'О проекте', url: '/about' },
]

// Real values taken from the theme's header.php defaults.
export const headerSocials: SocialItem[] = [
  { name: 'MAX', url: 'https://max.ru/id2304059056_biz', icon: '/uploads/2026/04/max-1.svg' },
  { name: 'Telegram', url: 'https://t.me/ideawinemaker', icon: '/uploads/2026/04/telegram-1.svg' },
  { name: 'Dzen', url: 'https://dzen.ru/ideawinemaker', icon: '/uploads/2026/04/dzen-1.svg' },
  { name: 'VK', url: 'https://vk.com/ideawinemaker', icon: '/uploads/2026/04/vkontakte-1.svg' },
  { name: 'Rutube', url: 'https://rutube.ru/channel/76720409/', icon: '/uploads/2026/04/rutube-1.svg' },
  { name: 'YouTube', url: 'https://youtube.com/@ИдеяВинодела', icon: '/uploads/2026/04/youtube-1.svg' },
  { name: 'Instagram', url: 'https://instagram.com/idea_winemaker', icon: '/uploads/2026/04/instagram-1.svg' },
]

// Pick a few real images that exist in wp-content/uploads for mock content.
export const mockImages = {
  founder: '/uploads/2026/04/aleksey-batagov-1-768x768.jpg',
  hero: '/uploads/2026/04/23f0ebd9-d28a-4db9-8b4f-106f9fe67430-1536x864.jpg',
  wide: '/uploads/2026/04/23f0ebd9-d28a-4db9-8b4f-106f9fe67430-1024x576.jpg',
}
