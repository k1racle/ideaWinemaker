import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3002,
    host: '0.0.0.0',
  },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'nuxt-auth-utils',
  ],

  image: {
    format: ['webp'],
    quality: 82,
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://ideawinemaker.ru',
    name: 'ИДЕЯ ВИНОДЕЛА',
    description: 'Портал о вине и виноделах Кубани',
  },

  sitemap: {
    // The public sitemap is assembled explicitly so that admin, search and
    // other technical routes never leak into it through Nuxt page discovery.
    excludeAppSources: true,
    sources: ['/api/_sitemap-urls'],
    cacheMaxAgeSeconds: 60,
  },

  // The project does not define OG image templates yet. Disabling only this
  // optional SEO renderer keeps the rest of the SEO suite available without
  // adding renderer packages that are outside the migration dependency set.
  ogImage: {
    enabled: false,
  },

  runtimeConfig: {
    databasePath: process.env.NUXT_DATABASE_PATH || process.env.DATABASE_PATH || '.data/ideawinemaker.sqlite',
    adminLogin: process.env.NUXT_ADMIN_LOGIN || process.env.ADMIN_LOGIN || '',
    adminPasswordHash: process.env.NUXT_ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD_HASH || '',
    // session: {
    //   password: process.env.NUXT_SESSION_PASSWORD || '',
    //   maxAge: 60 * 60 * 24 * 7,
    //   cookie: {
    //     sameSite: 'lax',
    //     secure: process.env.NODE_ENV === 'production',
    //   },
    // },
    public: {
      yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '',
    },
  },

  routeRules: {
    '/admin': { robots: 'noindex, nofollow, noarchive' },
    '/admin/**': { robots: 'noindex, nofollow, noarchive' },
    '/api/**': { robots: 'noindex, nofollow, noarchive' },
    '/search': { robots: 'noindex, follow' },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
      { name: 'Cormorant Garamond', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'ИДЕЯ ВИНОДЕЛА',
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/uploads/2026/04/iw-icon.jpg' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
