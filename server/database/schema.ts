import { sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
}

export const winemakers = sqliteTable('winemakers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  image: text('image').notNull(),
  quote: text('quote').notNull(),
  initials: text('initials').notNull(),
  location: text('location').notNull(),
  aboutBrand: text('about_brand').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
}, table => [
  uniqueIndex('winemakers_slug_unique').on(table.slug),
  index('winemakers_visible_idx').on(table.isVisible),
])

export const wineries = sqliteTable('wineries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  legalName: text('legal_name').notNull().default(''),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull().default(''),
  image: text('image').notNull().default(''),
  foundedYear: integer('founded_year'),
  region: text('region').notNull(),
  address: text('address').notNull().default(''),
  latitude: real('latitude'),
  longitude: real('longitude'),
  website: text('website').notNull().default(''),
  email: text('email').notNull().default(''),
  phone: text('phone').notNull().default(''),
  vineyardArea: text('vineyard_area').notNull().default(''),
  annualProduction: text('annual_production').notNull().default(''),
  specialization: text('specialization').notNull().default(''),
  visitInfo: text('visit_info').notNull().default(''),
  ...timestamps,
}, table => [
  uniqueIndex('wineries_slug_unique').on(table.slug),
  index('wineries_region_idx').on(table.region),
])

export const stores = sqliteTable('stores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  website: text('website').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  ...timestamps,
}, table => [
  uniqueIndex('stores_location_unique').on(table.title, table.city, table.address),
  index('stores_city_idx').on(table.city),
])

export const winemakerBiography = sqliteTable('winemaker_biography', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  winemakerId: integer('winemaker_id').notNull().references(() => winemakers.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  text: text('text').notNull(),
}, table => [
  uniqueIndex('winemaker_biography_position_unique').on(table.winemakerId, table.position),
  index('winemaker_biography_winemaker_idx').on(table.winemakerId),
])

export const terroirs = sqliteTable('terroirs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  image: text('image').notNull(),
  code: text('code').notNull(),
  climate: text('climate').notNull(),
  soil: text('soil').notNull(),
  coordinates: text('coordinates').notNull(),
  centerLatitude: real('center_latitude').notNull(),
  centerLongitude: real('center_longitude').notNull(),
  area: text('area').notNull(),
  humidity: text('humidity').notNull(),
  slope: text('slope').notNull(),
  altitude: text('altitude').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
}, table => [
  uniqueIndex('terroirs_slug_unique').on(table.slug),
  uniqueIndex('terroirs_code_unique').on(table.code),
  index('terroirs_visible_idx').on(table.isVisible),
])

export const terroirGallery = sqliteTable('terroir_gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  terroirId: integer('terroir_id').notNull().references(() => terroirs.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  image: text('image').notNull(),
}, table => [
  uniqueIndex('terroir_gallery_position_unique').on(table.terroirId, table.position),
  index('terroir_gallery_terroir_idx').on(table.terroirId),
])

export const terroirTags = sqliteTable('terroir_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  terroirId: integer('terroir_id').notNull().references(() => terroirs.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  text: text('text').notNull(),
}, table => [
  uniqueIndex('terroir_tags_position_unique').on(table.terroirId, table.position),
  index('terroir_tags_terroir_idx').on(table.terroirId),
])

export const terroirBounds = sqliteTable('terroir_bounds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  terroirId: integer('terroir_id').notNull().references(() => terroirs.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
}, table => [
  uniqueIndex('terroir_bounds_position_unique').on(table.terroirId, table.position),
  index('terroir_bounds_terroir_idx').on(table.terroirId),
])

export const wines = sqliteTable('wines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  winemakerId: integer('winemaker_id').notNull().references(() => winemakers.id, { onDelete: 'restrict' }),
  terroirId: integer('terroir_id').notNull().references(() => terroirs.id, { onDelete: 'restrict' }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  image: text('image').notNull(),
  authorQuote: text('author_quote').notNull(),
  wineType: text('wine_type').notNull(),
  variety: text('variety').notNull(),
  method: text('method').notNull(),
  methodCode: text('method_code').notNull(),
  year: text('year').notNull(),
  alcohol: text('alcohol').notNull(),
  volume: text('volume').notNull(),
  batch: text('batch').notNull(),
  bottleNumber: text('bottle_number').notNull(),
  servingTemperature: text('serving_temperature').notNull(),
  color: text('color').notNull(),
  aroma: text('aroma').notNull(),
  taste: text('taste').notNull(),
  pairing: text('pairing').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
}, table => [
  uniqueIndex('wines_slug_unique').on(table.slug),
  index('wines_winemaker_idx').on(table.winemakerId),
  index('wines_terroir_idx').on(table.terroirId),
  index('wines_visible_idx').on(table.isVisible),
  index('wines_filters_idx').on(table.year, table.terroirId, table.methodCode),
])

export const wineGallery = sqliteTable('wine_gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  wineId: integer('wine_id').notNull().references(() => wines.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  image: text('image').notNull(),
}, table => [
  uniqueIndex('wine_gallery_position_unique').on(table.wineId, table.position),
  index('wine_gallery_wine_idx').on(table.wineId),
])

export const wineTerroirParagraphs = sqliteTable('wine_terroir_paragraphs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  wineId: integer('wine_id').notNull().references(() => wines.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  text: text('text').notNull(),
}, table => [
  uniqueIndex('wine_terroir_position_unique').on(table.wineId, table.position),
  index('wine_terroir_wine_idx').on(table.wineId),
])

export const wineDetailGroups = sqliteTable('wine_detail_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  wineId: integer('wine_id').notNull().references(() => wines.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  title: text('title').notNull(),
}, table => [
  uniqueIndex('wine_detail_groups_position_unique').on(table.wineId, table.position),
  index('wine_detail_groups_wine_idx').on(table.wineId),
])

export const wineDetailItems = sqliteTable('wine_detail_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').notNull().references(() => wineDetailGroups.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  text: text('text').notNull(),
}, table => [
  uniqueIndex('wine_detail_items_position_unique').on(table.groupId, table.position),
  index('wine_detail_items_group_idx').on(table.groupId),
])
