CREATE TABLE `a_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `a_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `a_account` (`user_id`);--> statement-breakpoint
CREATE TABLE `a_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `a_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `a_session_token_unique` ON `a_session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `a_session` (`user_id`);--> statement-breakpoint
CREATE TABLE `a_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `a_user_email_unique` ON `a_user` (`email`);--> statement-breakpoint
CREATE TABLE `a_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `a_verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `b_passbank` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`title` text NOT NULL,
	`username` text,
	`password` text,
	`note` text
);
--> statement-breakpoint
CREATE TABLE `c_weapons` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`status` text DEFAULT 'unreleased',
	`group` text NOT NULL,
	`classname` text NOT NULL,
	`printname` text NOT NULL,
	`weapon_type` text,
	`damage` integer,
	`cycle_time` real,
	`range` integer,
	`range_modifier` real,
	`penetration` integer,
	`clip_size` integer DEFAULT 30,
	`default_clip` integer,
	`weight` integer,
	`viewmodel` text,
	`playermodel` text,
	`primary_ammo` text,
	`weapon_price` integer,
	`full_auto` integer,
	`date_added` text,
	`flag` text DEFAULT 'WF_NONE',
	`caliber_ammo` text,
	`firing_mode` text DEFAULT 'AUTO',
	`credit` integer,
	`source` text,
	`check_vmdl` integer,
	`check_wmdl` integer,
	`check_sfx` integer,
	`check_anims` integer,
	`check_inspect` integer,
	`check_ads` integer,
	`check_tac_reload` integer,
	`check_2nd_hand` integer,
	`check_buy_menu_pic` integer,
	`check_hud_icon` integer
);
