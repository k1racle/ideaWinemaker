CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`website` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stores_location_unique` ON `stores` (`title`,`city`,`address`);
--> statement-breakpoint
CREATE INDEX `stores_city_idx` ON `stores` (`city`);
