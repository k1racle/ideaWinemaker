type YandexMetrika = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: YandexMetrika
  }
}

const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/')

const createMetrikaQueue = () => {
  const queue = ((...args: unknown[]) => {
    (queue.a ||= []).push(args)
  }) as YandexMetrika

  queue.l = Date.now()
  return queue
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const counterId = Number(config.public.yandexMetrikaId)

  if (!Number.isSafeInteger(counterId) || counterId <= 0) return

  let initialized = false
  let lastTrackedUrl = ''
  let previousUrl = document.referrer

  const initialize = () => {
    if (initialized) return

    window.ym ||= createMetrikaQueue()

    if (!document.querySelector('script[data-yandex-metrika]')) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.dataset.yandexMetrika = 'true'
      document.head.appendChild(script)
    }

    window.ym(counterId, 'init', {
      defer: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    })
    initialized = true
  }

  const destroy = () => {
    if (!initialized || !window.ym) return
    window.ym(counterId, 'destruct')
    initialized = false
    lastTrackedUrl = ''
  }

  const trackPage = () => {
    if (isAdminPath(router.currentRoute.value.path)) {
      destroy()
      return
    }

    initialize()
    const url = window.location.href
    if (url === lastTrackedUrl || !window.ym) return

    window.ym(counterId, 'hit', url, {
      title: document.title,
      ...(previousUrl ? { referer: previousUrl } : {}),
    })

    previousUrl = url
    lastTrackedUrl = url
  }

  router.beforeEach((to) => {
    if (isAdminPath(to.path)) destroy()
  })

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(trackPage)
  })
})
