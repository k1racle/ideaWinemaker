CREATE TABLE `winemakers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`image` text NOT NULL,
	`quote` text NOT NULL,
	`initials` text NOT NULL,
	`location` text NOT NULL,
	`about_brand` text NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `winemakers_slug_unique` ON `winemakers` (`slug`);
--> statement-breakpoint
CREATE INDEX `winemakers_visible_idx` ON `winemakers` (`is_visible`);
--> statement-breakpoint
CREATE TABLE `winemaker_biography` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`winemaker_id` integer NOT NULL,
	`position` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`winemaker_id`) REFERENCES `winemakers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `winemaker_biography_position_unique` ON `winemaker_biography` (`winemaker_id`,`position`);
--> statement-breakpoint
CREATE INDEX `winemaker_biography_winemaker_idx` ON `winemaker_biography` (`winemaker_id`);
--> statement-breakpoint
CREATE TABLE `wines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`winemaker_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`image` text NOT NULL,
	`author_quote` text NOT NULL,
	`wine_type` text NOT NULL,
	`variety` text NOT NULL,
	`method` text NOT NULL,
	`method_code` text NOT NULL,
	`year` text NOT NULL,
	`alcohol` text NOT NULL,
	`volume` text NOT NULL,
	`terroir_slug` text NOT NULL,
	`terroir_name` text NOT NULL,
	`terroir_code` text NOT NULL,
	`batch` text NOT NULL,
	`bottle_number` text NOT NULL,
	`serving_temperature` text NOT NULL,
	`color` text NOT NULL,
	`aroma` text NOT NULL,
	`taste` text NOT NULL,
	`pairing` text NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`winemaker_id`) REFERENCES `winemakers`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wines_slug_unique` ON `wines` (`slug`);
--> statement-breakpoint
CREATE INDEX `wines_winemaker_idx` ON `wines` (`winemaker_id`);
--> statement-breakpoint
CREATE INDEX `wines_visible_idx` ON `wines` (`is_visible`);
--> statement-breakpoint
CREATE INDEX `wines_filters_idx` ON `wines` (`year`,`terroir_slug`,`method_code`);
--> statement-breakpoint
CREATE TABLE `wine_gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wine_id` integer NOT NULL,
	`position` integer NOT NULL,
	`image` text NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wine_gallery_position_unique` ON `wine_gallery` (`wine_id`,`position`);
--> statement-breakpoint
CREATE INDEX `wine_gallery_wine_idx` ON `wine_gallery` (`wine_id`);
--> statement-breakpoint
CREATE TABLE `wine_terroir_paragraphs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wine_id` integer NOT NULL,
	`position` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wine_terroir_position_unique` ON `wine_terroir_paragraphs` (`wine_id`,`position`);
--> statement-breakpoint
CREATE INDEX `wine_terroir_wine_idx` ON `wine_terroir_paragraphs` (`wine_id`);
--> statement-breakpoint
CREATE TABLE `wine_detail_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wine_id` integer NOT NULL,
	`position` integer NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`wine_id`) REFERENCES `wines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wine_detail_groups_position_unique` ON `wine_detail_groups` (`wine_id`,`position`);
--> statement-breakpoint
CREATE INDEX `wine_detail_groups_wine_idx` ON `wine_detail_groups` (`wine_id`);
--> statement-breakpoint
CREATE TABLE `wine_detail_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`position` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `wine_detail_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wine_detail_items_position_unique` ON `wine_detail_items` (`group_id`,`position`);
--> statement-breakpoint
CREATE INDEX `wine_detail_items_group_idx` ON `wine_detail_items` (`group_id`);
