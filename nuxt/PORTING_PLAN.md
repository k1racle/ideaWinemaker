# WordPress → Nuxt porting plan

## Scope and source of truth

- PHP structure and Russian interface copy: `wp-content/themes/ideawinemaker/*.php`.
- Exact dimensions, spacing, typography, cards, filters, responsive rules, and wine layouts:
  `wp-content/themes/ideawinemaker/assets/css/style.css`.
- Vue behavior replacements: `assets/js/custom-select.js`, `wine-slider.js`, `wine_page.js`, and
  `script.js` (the legacy files themselves will not be loaded).
- Brand tokens and responsive guidance: `nuxt/DESIGN.md`.
- Dynamic WordPress records become typed fixtures in `shared/mock`; their shapes deliberately mirror a
  future REST export. The production inventory used for the fixtures is six wines, three winemakers,
  one news post, the manifesto/about copy, and the spectacle page. Events and terroirs remain supported
  with representative records because the PHP templates exist even though no live records are published.

## Route and template mapping

| Nuxt route | WordPress source | Nuxt implementation |
|---|---|---|
| `/` | `front-page.php` | Hero title, wine-code filter, founder, winemaker and wine grids, spectacle poster, latest news, store map, social links |
| `/wines` | `archive-wine.php` | Filterable wine catalogue and buy section |
| `/wine/[slug]` | `single-wine.php` | Bottle/specification hero, author statement, winemaker, terroir, process details, gallery/collection, buy section |
| `/vinodely` | `archive-winemaker.php` | Three-column winemaker archive |
| `/vinodely/[slug]` | `single-winemaker.php` | Sticky portrait, quotation, biography, related wines |
| `/events` | `archive-events.php` | Two-column event archive with empty-state-safe data |
| `/events/[slug]` | `single-events.php` | Event hero, body/details split, gallery |
| `/terroir/[slug]` | `single-terroir.php` | Terroir hero, climate/soil facts, Leaflet polygon map, related wines |
| `/about` | `about-page.php` | Manifesto/founder split and winemaker grid |
| `/novosti` | `home.php` | News archive grid |
| `/novosti/[slug]` | `single.php` | Article hero/body split and related stories |
| `/spektakl` | `page-spektakl.php` | Title, full-width production image, editorial copy |
| `/privacy-policy`, `/cookies` | legal page templates | Long-form legal typography and structured policy content |
| `/search` | `search.php` | Client-side wine search/filter results |
| error route | `404.php` | Branded Nuxt `error.vue` |

Legacy production aliases (`/wine`, `/vinodely/*` source slugs, and the published long news slug) are
handled through Nuxt route rules or fixture aliases where useful, while the target URLs above stay canonical.

## Shared implementation

1. Add typed domain fixtures for wines, winemakers, events, terroirs, news, page copy, partners, stores,
   and legal sections. Use only media already copied to `public/uploads/2026/04` and `public/img`.
2. Add reusable presentation components:
   - section heading and cards for wines, winemakers, news, and events;
   - the five-part wine-code filter shared by home, catalogue, wine detail, and search;
   - buy-partner/store map section;
   - collection and social sections.
3. Preserve the original desktop geometry: 1320px container, 52px section rhythm, 28px grids,
   460–520px portrait media, centred wine cards, borderless editorial surfaces, and the burgundy/oak accents.
4. Reproduce the PHP breakpoints: header at 900px, stacked grids and filter below tablet widths,
   one-column content on mobile, and minimum 44px interactive targets.
5. Replace legacy JavaScript with Vue state:
   - native Vue `<select>` controls and URL query synchronisation;
   - computed filtering/search;
   - accessible expandable wine details;
   - Swiper only where the source layout is actually a carousel;
   - dynamic client-only Leaflet initialization for maps.
6. Add per-route metadata and not-found handling for unknown dynamic slugs.

## Implementation order

1. Fixtures and shared visual components.
2. Home and catalogue, establishing the reusable grids/filter/store section.
3. Wine and winemaker detail routes.
4. Events, terroir map, news, about, spectacle, legal, search, and error routes.
5. Responsive and accessibility pass, then Nuxt production build and route-level smoke checks.

## Acceptance checks

- Every route in the target map renders without runtime errors and unknown dynamic slugs return 404.
- All internal navigation uses `NuxtLink`; external destinations open safely in a new tab.
- Text hierarchy, image aspect ratios, grid counts, gaps, and section order match the PHP templates.
- Filters work from both controls and URL query parameters.
- Mobile layouts do not overflow and all menu/dialog/filter controls are keyboard accessible.
- `npm run build` completes successfully without adding dependencies.
