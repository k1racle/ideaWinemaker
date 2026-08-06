<script setup lang="ts">
interface YandexMapInstance {
  geoObjects: {
    add: (object: unknown) => void
  }
  behaviors: {
    disable: (behavior: string) => void
  }
  setBounds: (
    bounds: [[number, number], [number, number]],
    options?: Record<string, unknown>,
  ) => void
  destroy: () => void
}

interface YandexMapsApi {
  ready: (callback: () => void) => void
  Map: new (
    element: HTMLElement,
    state: {
      center: [number, number]
      zoom: number
      type: 'yandex#map'
      controls: string[]
    },
    options: Record<string, unknown>,
  ) => YandexMapInstance
  Placemark: new (
    coordinates: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => unknown
  Polygon: new (
    coordinates: [number, number][][],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => unknown
}

type YandexMapsWindow = Window & {
  ymaps?: YandexMapsApi
  __iwYandexMapsV2Promise?: Promise<YandexMapsApi>
}

const props = defineProps<{
  center: [number, number]
  bounds: [number, number][]
  title: string
}>()

const config = useRuntimeConfig()
const apiKey = String(config.public.yandexMapsApiKey || '')
const mapElement = ref<HTMLDivElement>()
const status = ref<'loading' | 'ready' | 'missing-key' | 'error'>(apiKey ? 'loading' : 'missing-key')
let map: YandexMapInstance | undefined

const waitForYandexMaps = (timeout = 15000) => new Promise<YandexMapsApi>((resolve, reject) => {
  const startedAt = Date.now()
  const yandexWindow = window as unknown as YandexMapsWindow

  const check = () => {
    if (yandexWindow.ymaps) {
      yandexWindow.ymaps.ready(() => resolve(yandexWindow.ymaps!))
      return
    }

    if (Date.now() - startedAt >= timeout) {
      reject(new Error('Яндекс Карты не загрузились'))
      return
    }

    window.setTimeout(check, 50)
  }

  check()
})

const loadYandexMaps = () => {
  const yandexWindow = window as unknown as YandexMapsWindow

  if (yandexWindow.ymaps) return waitForYandexMaps()
  if (yandexWindow.__iwYandexMapsV2Promise) return yandexWindow.__iwYandexMapsV2Promise

  yandexWindow.__iwYandexMapsV2Promise = new Promise<YandexMapsApi>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-iw-yandex-maps-v2]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.dataset.iwYandexMapsV2 = 'true'
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
      script.async = true
      script.addEventListener('error', () => reject(new Error('Ошибка загрузки Яндекс Карт')), { once: true })
      document.head.appendChild(script)
    }

    void waitForYandexMaps().then(resolve, reject)
  })

  yandexWindow.__iwYandexMapsV2Promise.catch(() => {
    yandexWindow.__iwYandexMapsV2Promise = undefined
  })

  return yandexWindow.__iwYandexMapsV2Promise
}

const renderMap = async () => {
  if (!apiKey || props.bounds.length === 0) return

  status.value = 'loading'

  try {
    await nextTick()
    const ymaps = await loadYandexMaps()
    if (!mapElement.value) return

    map?.destroy()
    map = new ymaps.Map(
      mapElement.value,
      {
        center: props.center,
        zoom: 13,
        type: 'yandex#map',
        controls: ['zoomControl', 'fullscreenControl'],
      },
      {
        minZoom: 2,
        maxZoom: 18,
        zoomControlSize: 'large',
        zoomControlPosition: { left: 10, top: 84 },
        fullscreenControlPosition: { right: 10, top: 10 },
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
      },
    )

    map.behaviors.disable('scrollZoom')

    const themeStyles = getComputedStyle(document.documentElement)
    const mapAreaColor = themeStyles.getPropertyValue('--color-map-area').trim()
    const primaryColor = themeStyles.getPropertyValue('--color-primary').trim()

    const polygon = new ymaps.Polygon(
      [props.bounds],
      { hintContent: props.title, balloonContent: `Терруар ${props.title}` },
      {
        fillColor: mapAreaColor,
        fillOpacity: 0.52,
        strokeColor: mapAreaColor,
        strokeOpacity: 1,
        strokeWidth: 4,
      },
    )
    const placemark = new ymaps.Placemark(
      props.center,
      { hintContent: `Терруар ${props.title}`, balloonContent: props.title },
      { preset: 'islands#icon', iconColor: primaryColor },
    )

    map.geoObjects.add(polygon)
    map.geoObjects.add(placemark)

    const latitudes = props.bounds.map(point => point[0])
    const longitudes = props.bounds.map(point => point[1])
    map.setBounds(
      [
        [Math.min(...latitudes), Math.min(...longitudes)],
        [Math.max(...latitudes), Math.max(...longitudes)],
      ],
      { checkZoomRange: true, zoomMargin: 30 },
    )

    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

onMounted(() => {
  void renderMap()
})

onBeforeUnmount(() => map?.destroy())
</script>

<template>
  <div class="relative h-[360px] w-full overflow-hidden rounded-[14px] bg-surface" :aria-label="`Карта терруара ${title}`">
    <div ref="mapElement" class="h-full w-full" />
    <div v-if="status !== 'ready'" class="absolute inset-0 flex items-center justify-center bg-surface px-7 text-center text-sm leading-relaxed text-ink/65">
      <span v-if="status === 'loading'">Загружаем Яндекс Карты…</span>
      <span v-else-if="status === 'missing-key'">Добавьте <code>NUXT_PUBLIC_YANDEX_MAPS_API_KEY</code> в файл <code>nuxt/.env</code>, чтобы показать карту.</span>
      <span v-else>Не удалось загрузить Яндекс Карты. Проверьте API-ключ и ограничения по HTTP Referer.</span>
    </div>
  </div>
</template>
