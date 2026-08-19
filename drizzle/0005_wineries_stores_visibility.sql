ALTER TABLE `wineries` ADD `is_visible` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE INDEX `wineries_visible_idx` ON `wineries` (`is_visible`);
--> statement-breakpoint
ALTER TABLE `stores` ADD `is_visible` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE INDEX `stores_visible_idx` ON `stores` (`is_visible`);
