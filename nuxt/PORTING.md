# Портирование темы ideawinemaker: WordPress → Nuxt 4

Рабочая папка — `C:/ideaWinemaker/nuxt` (Nuxt 4.5: `app/`, `shared/`, `public/`).
Стек: Tailwind CSS 4 (`@tailwindcss/vite`, конфиг через `@theme` в `app/assets/css/main.css`),
`@nuxt/fonts` (Inter + Cormorant Garamond уже подключены), `@nuxt/image`, `@nuxt/icon`,
`@vueuse/nuxt` (auto-import), `@nuxtjs/device`, `swiper` (установлен), Яндекс Карты API 2.1,
`imask` (директива `v-imask` уже зарегистрирована в `app/plugins/imask.client.ts`).

## Спецификация (READ-ONLY, ничего там не менять)

- PHP-шаблоны: `C:/ideaWinemaker/wp-content/themes/ideawinemaker/*.php`
- CSS-спека (как должно выглядеть): `C:/ideaWinemaker/wp-content/themes/ideawinemaker/assets/css/style.css`
  (4612 строк — ищи нужные селекторы через Grep и читай диапазоны)
- Поведение интерактива: `C:/ideaWinemaker/wp-content/themes/ideawinemaker/assets/js/*.js`
  (legacy, НЕ подключаем — переписываем на Vue)

## Правила порта

1. Структура секций и весь русский текст — 1:1 из PHP-шаблона. PHP-классы НЕ копируем:
   внешний вид воспроизводим Tailwind-утилитами, сверяясь с CSS-спекой (цвета, отступы, размеры, сетки).
2. Данные из PHP (Carbon Fields, meta, WP_Query) → моки `shared/mock/<domain>.ts`.
   Форма записей: `{ id, slug, title, excerpt, content, image, meta: {...} }` — как будущий экспорт WP REST.
   Свой mock-файл создай сам, если его нет. Чужие mock-файлы не редактируй.
3. Картинки: реальные файлы из `/uploads/2026/04` и `/uploads/2026/05`
   (список: `ls C:/ideaWinemaker/wp-content/uploads/2026/04/`); картинки темы — в `/img/`.
   Тег `<img>` (NuxtImg пока не используем).
4. Внутренние ссылки — `<NuxtLink to>`, внешние — `<a target="_blank" rel="noopener noreferrer">`.
5. Токены Tailwind (уже в `@theme`): брендовые `primary`, `primary-hover`, `secondary`, `tertiary`;
   состояния `success`, `success-text`, `map-area`; текст `ink`, `copy`, `muted`; фоны `canvas`,
   `surface`, `surface-accent`, `surface-input`; границы `border`, `border-strong`, `border-warm`;
   `font-sans` = Inter,
   `font-serif` = Cormorant Garamond (оригинальный `.serif` → `font-serif`).
   Контейнер: готовый класс `container-iw` (min(100%−40px, 1320px), центрирован).
   Брейкпоинт шапки: `nav:` / `max-nav:` = 900px. Прочие медиа-запросы — arbitrary values
   (`max-[600px]:`, `min-[1280px]:` и т.п. — смотри спеку).
6. Слайдеры: `import { Swiper, SwiperSlide } from 'swiper/vue'` + `import 'swiper/css'`
   (+ модули Navigation/Pagination/Autoplay по необходимости). Параметры (slidesPerView, breakpoints,
   loop) смотри в соответствующем legacy JS (`wine-slider.js`, `splide.js`, `script.js`).
7. Карты: Яндекс Карты API 2.1, только внутри `<ClientOnly>`. API-ключ берётся из
   `NUXT_PUBLIC_YANDEX_MAPS_API_KEY`; координаты, маркеры и полигоны — из моков.
8. Кнопки открытия контактного попапа: `const { open } = useContactPopup()` + `@click="open"`.
9. Каждая страница: `useHead({ title, meta: [description] })` из своих данных.
10. TypeScript + ESLint (`@nuxt/eslint`): типизируй моки (`export interface Wine ...`),
    без `any` без нужды, без новых зависимостей.
11. Не запускай dev-сервер и не ставь пакеты — только пишешь код. Проверка — на родителе.

## Уже готово (использовать, не переписывать)

- `app/layouts/default.vue` — шапка/футер/попап
- `app/components/AppHeader.vue` (мобильное меню на Vue), `AppFooter.vue`, `ContactPopup.vue`
- `app/composables/useContactPopup.ts`, `app/plugins/imask.client.ts`
- `app/assets/css/main.css` — токены + `container-iw`
- `shared/mock/site.ts` — меню, соцсети (реальные значения)

## Карта маршрутов (целевые URL как на проде)

`/` главная · `/wines` каталог вин · `/wine/[slug]` · `/vinodely` виноделы · `/vinodely/[slug]` ·
`/events` · `/events/[slug]` · `/terroir/[slug]` · `/about` · `/novosti` (блог) · `/novosti/[slug]` ·
`/spektakl` · `/privacy-policy` · `/cookies` · `/search` · 404 = `app/error.vue`
