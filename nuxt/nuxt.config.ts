import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3002,
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
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://ideawinemaker.ru',
    name: 'ИДЕЯ ВИНОДЕЛА',
    description: 'Портал о вине и виноделах Кубани',
  },

  // The project does not define OG image templates yet. Disabling only this
  // optional SEO renderer keeps the rest of the SEO suite available without
  // adding renderer packages that are outside the migration dependency set.
  ogImage: {
    enabled: false,
  },

  runtimeConfig: {
    public: {
      yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    },
  },

  routeRules: {
    '/vina': { redirect: '/wines' },
    '/novostnaya-lenta': { redirect: '/novosti' },
    '/meropriyatiya': { redirect: '/events' },
    '/3233232-2': { redirect: '/about' },
    '/brend-ideya-vinodela-kollekcziya-avtorskih-vin-vpervye-budet-predstavlen-na-vystavke-vinodelcheskoj-produkczii-vinorus-vinoteh-v-krasnodare': {
      redirect: '/novosti/brend-ideya-vinodela-na-vinorus-vinoteh',
    },
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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
