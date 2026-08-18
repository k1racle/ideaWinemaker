CREATE TABLE `wineries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`legal_name` text DEFAULT '' NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`founded_year` integer,
	`region` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`latitude` real,
	`longitude` real,
	`website` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`vineyard_area` text DEFAULT '' NOT NULL,
	`annual_production` text DEFAULT '' NOT NULL,
	`specialization` text DEFAULT '' NOT NULL,
	`visit_info` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wineries_slug_unique` ON `wineries` (`slug`);
--> statement-breakpoint
CREATE INDEX `wineries_region_idx` ON `wineries` (`region`);
