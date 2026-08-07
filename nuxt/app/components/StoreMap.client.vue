<script setup lang="ts">
import type { Store } from '~~/shared/mock/commerce'

interface YandexMapInstance {
  geoObjects: {
    add: (object: unknown) => void
  }
  behaviors: {
    disable: (behavior: string) => void
  }
  setCenter: (
    coordinates: [number, number],
    zoom?: number,
    options?: Record<string, unknown>,
  ) => void
  destroy: () => void
}

interface YandexPlacemarkInstance {
  events: {
    add: (event: string, handler: () => void) => void
  }
  balloon: {
    open: () => void
  }
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
  ) => YandexPlacemarkInstance
}

declare global {
  interface Window {
    ymaps?: YandexMapsApi
    __iwYandexMapsV2Promise?: Promise<YandexMapsApi>
  }
}

const props = defineProps<{
  stores: Store[]
  selectedStoreId?: number
}>()
const emit = defineEmits<{
  'update:selectedStoreId': [id: number]
}>()
const config = useRuntimeConfig()
const apiKey = String(config.public.yandexMapsApiKey || '')
const mapElement = ref<HTMLDivElement>()
const status = ref<'loading' | 'ready' | 'missing-key' | 'error'>(apiKey ? 'loading' : 'missing-key')
let map: YandexMapInstance | undefined
const placemarks = new Map<number, YandexPlacemarkInstance>()

const focusStore = (storeId: number) => {
  const store = props.stores.find(item => item.id === storeId)
  const placemark = placemarks.get(storeId)
  if (!map || !store || !placemark) return

  map.setCenter(store.coordinates, 16, {
    duration: 400,
    checkZoomRange: true,
  })
  placemark.balloon.open()
}

const waitForYandexMaps = (timeout = 15000) => new Promise<YandexMapsApi>((resolve, reject) => {
  const startedAt = Date.now()

  const check = () => {
    if (window.ymaps) {
      window.ymaps.ready(() => resolve(window.ymaps!))
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
  if (window.ymaps) return waitForYandexMaps()
  if (window.__iwYandexMapsV2Promise) return window.__iwYandexMapsV2Promise

  window.__iwYandexMapsV2Promise = new Promise<YandexMapsApi>((resolve, reject) => {
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

  window.__iwYandexMapsV2Promise.catch(() => {
    window.__iwYandexMapsV2Promise = undefined
  })

  return window.__iwYandexMapsV2Promise
}

const renderMap = async () => {
  if (!apiKey || props.stores.length === 0) return

  status.value = 'loading'

  try {
    await nextTick()
    const ymaps = await loadYandexMaps()
    if (!mapElement.value) return

    map?.destroy()
    placemarks.clear()

    const center: [number, number] = [
      props.stores.reduce((sum, store) => sum + store.coordinates[0], 0) / props.stores.length,
      props.stores.reduce((sum, store) => sum + store.coordinates[1], 0) / props.stores.length,
    ]
    const oneCity = new Set(props.stores.map(store => store.city)).size === 1

    map = new ymaps.Map(
      mapElement.value,
      {
        center,
        zoom: oneCity ? 10 : 4,
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

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim()

    props.stores.forEach((store) => {
      const placemark = new ymaps.Placemark(
        store.coordinates,
        {
          hintContent: `${store.title}: ${store.city}, ${store.address}`,
          balloonContentHeader: store.title,
          balloonContentBody: `${store.city}, ${store.address}`,
        },
        {
          preset: 'islands#icon',
          iconColor: primaryColor,
        },
      )

      placemark.events.add('click', () => {
        emit('update:selectedStoreId', store.id)
        focusStore(store.id)
        document.getElementById(`store-${store.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      placemarks.set(store.id, placemark)
      map?.geoObjects.add(placemark)
    })

    status.value = 'ready'
    if (props.selectedStoreId) focusStore(props.selectedStoreId)
  } catch {
    status.value = 'error'
  }
}

onMounted(() => {
  void renderMap()
})

watch(() => props.stores, () => {
  void renderMap()
}, { deep: true })

watch(() => props.selectedStoreId, (storeId) => {
  if (storeId) focusStore(storeId)
})

onBeforeUnmount(() => map?.destroy())
</script>

<template>
  <div class="relative h-[500px] w-full overflow-hidden bg-surface max-[700px]:h-[360px]" aria-label="Карта магазинов">
    <div ref="mapElement" class="h-full w-full" />
    <div v-if="status !== 'ready'" class="absolute inset-0 flex items-center justify-center bg-surface px-7 text-center text-sm leading-relaxed text-ink/65">
      <span v-if="status === 'loading'">Загружаем Яндекс Карты…</span>
      <span v-else-if="status === 'missing-key'">Добавьте <code>NUXT_PUBLIC_YANDEX_MAPS_API_KEY</code> в файл <code>nuxt/.env</code>, чтобы показать карту.</span>
      <span v-else>Не удалось загрузить Яндекс Карты. Проверьте API-ключ и ограничения по HTTP Referer.</span>
    </div>
  </div>
</template>
