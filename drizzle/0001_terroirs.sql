CREATE TABLE `terroirs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`image` text NOT NULL,
	`code` text NOT NULL,
	`climate` text NOT NULL,
	`soil` text NOT NULL,
	`coordinates` text NOT NULL,
	`center_latitude` real NOT NULL,
	`center_longitude` real NOT NULL,
	`area` text NOT NULL,
	`humidity` text NOT NULL,
	`slope` text NOT NULL,
	`altitude` text NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `terroirs_slug_unique` ON `terroirs` (`slug`);
--> statement-breakpoint
CREATE UNIQUE INDEX `terroirs_code_unique` ON `terroirs` (`code`);
--> statement-breakpoint
CREATE INDEX `terroirs_visible_idx` ON `terroirs` (`is_visible`);
--> statement-breakpoint
CREATE TABLE `terroir_gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`terroir_id` integer NOT NULL,
	`position` integer NOT NULL,
	`image` text NOT NULL,
	FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `terroir_gallery_position_unique` ON `terroir_gallery` (`terroir_id`,`position`);
--> statement-breakpoint
CREATE INDEX `terroir_gallery_terroir_idx` ON `terroir_gallery` (`terroir_id`);
--> statement-breakpoint
CREATE TABLE `terroir_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`terroir_id` integer NOT NULL,
	`position` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `terroir_tags_position_unique` ON `terroir_tags` (`terroir_id`,`position`);
--> statement-breakpoint
CREATE INDEX `terroir_tags_terroir_idx` ON `terroir_tags` (`terroir_id`);
--> statement-breakpoint
CREATE TABLE `terroir_bounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`terroir_id` integer NOT NULL,
	`position` integer NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	FOREIGN KEY (`terroir_id`) REFERENCES `terroirs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `terroir_bounds_position_unique` ON `terroir_bounds` (`terroir_id`,`position`);
--> statement-breakpoint
CREATE INDEX `terroir_bounds_terroir_idx` ON `terroir_bounds` (`terroir_id`);
--> statement-breakpoint
INSERT INTO `terroirs` (
	`slug`, `title`, `excerpt`, `content`, `image`, `code`, `climate`, `soil`, `coordinates`,
	`center_latitude`, `center_longitude`, `area`, `humidity`, `slope`, `altitude`, `is_visible`
)
SELECT
	MIN(`terroir_slug`), MAX(`terroir_name`), MAX(`terroir_name`), MAX(`terroir_name`), '',
	UPPER(TRIM(`terroir_code`)), '', '', '', 0, 0, '', '', '', '', true
FROM `wines`
GROUP BY UPPER(TRIM(`terroir_code`));
--> statement-breakpoint
UPDATE `terroirs`
SET `content` = COALESCE((
	SELECT group_concat(`text`, char(10) || char(10))
	FROM (
		SELECT `wine_terroir_paragraphs`.`text` AS `text`
		FROM `wine_terroir_paragraphs`
		INNER JOIN `wines` ON `wines`.`id` = `wine_terroir_paragraphs`.`wine_id`
		WHERE UPPER(TRIM(`wines`.`terroir_code`)) = `terroirs`.`code`
		ORDER BY `wines`.`id`, `wine_terroir_paragraphs`.`position`
	)
), `content`);
--> statement-breakpoint
ALTER TABLE `wines` ADD `terroir_id` integer REFERENCES `terroirs`(`id`) ON DELETE restrict;
--> statement-breakpoint
UPDATE `wines`
SET `terroir_id` = (
	SELECT `terroirs`.`id`
	FROM `terroirs`
	WHERE `terroirs`.`code` = UPPER(TRIM(`wines`.`terroir_code`))
	LIMIT 1
);
--> statement-breakpoint
DROP INDEX `wines_filters_idx`;
--> statement-breakpoint
ALTER TABLE `wines` DROP COLUMN `terroir_slug`;
--> statement-breakpoint
ALTER TABLE `wines` DROP COLUMN `terroir_name`;
--> statement-breakpoint
ALTER TABLE `wines` DROP COLUMN `terroir_code`;
--> statement-breakpoint
CREATE INDEX `wines_terroir_idx` ON `wines` (`terroir_id`);
--> statement-breakpoint
CREATE INDEX `wines_filters_idx` ON `wines` (`year`,`terroir_id`,`method_code`);
--> statement-breakpoint
CREATE TRIGGER `wines_terroir_required_insert`
BEFORE INSERT ON `wines`
WHEN NEW.`terroir_id` IS NULL
BEGIN
	SELECT RAISE(ABORT, 'wine terroir is required');
END;
--> statement-breakpoint
CREATE TRIGGER `wines_terroir_required_update`
BEFORE UPDATE OF `terroir_id` ON `wines`
WHEN NEW.`terroir_id` IS NULL
BEGIN
	SELECT RAISE(ABORT, 'wine terroir is required');
END;
