PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_g_entertainment_tracker` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`type_id` text NOT NULL,
	`franchise_title` text,
	`entry_title` text NOT NULL,
	`season` text,
	`year` text,
	`status_publication` text,
	`status_dl` text,
	`link_dl` text,
	`last_mark` text,
	FOREIGN KEY (`type_id`) REFERENCES `g_entertainment_tracker_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_g_entertainment_tracker`("id", "created_at", "updated_at", "deleted_at", "created_by", "updated_by", "deleted_by", "type_id", "franchise_title", "entry_title", "season", "year", "status_publication", "status_dl", "link_dl", "last_mark") SELECT "id", "created_at", "updated_at", "deleted_at", "created_by", "updated_by", "deleted_by", "type_id", "franchise_title", "entry_title", "season", "year", "status_publication", "status_dl", "link_dl", "last_mark" FROM `g_entertainment_tracker`;--> statement-breakpoint
DROP TABLE `g_entertainment_tracker`;--> statement-breakpoint
ALTER TABLE `__new_g_entertainment_tracker` RENAME TO `g_entertainment_tracker`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_g_entertainment_tracker_type` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text
);
--> statement-breakpoint
INSERT INTO `__new_g_entertainment_tracker_type`("id", "created_at", "updated_at", "deleted_at", "created_by", "updated_by", "deleted_by", "name", "desc") SELECT "id", "created_at", "updated_at", "deleted_at", "created_by", "updated_by", "deleted_by", "name", "desc" FROM `g_entertainment_tracker_type`;--> statement-breakpoint
DROP TABLE `g_entertainment_tracker_type`;--> statement-breakpoint
ALTER TABLE `__new_g_entertainment_tracker_type` RENAME TO `g_entertainment_tracker_type`;