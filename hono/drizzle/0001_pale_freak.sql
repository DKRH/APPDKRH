CREATE TABLE `c_j_note_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`note_id` text NOT NULL,
	`label_id` text NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `c_notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `c_labels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `c_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `c_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`title` text NOT NULL,
	`content` text,
	`is_pinned` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `b_todos` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`is_complete` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `e_url_shortener` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`original_url` text NOT NULL,
	`shorten_url` text NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_expire` integer DEFAULT false NOT NULL,
	`password` text,
	`expire_date` integer
);
--> statement-breakpoint
CREATE TABLE `f_text_storage` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`url` text NOT NULL,
	`content` text NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`is_expire` integer DEFAULT false NOT NULL,
	`password` text,
	`expire_date` integer
);
--> statement-breakpoint
CREATE TABLE `g_game_platform` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `g_game_whitelist` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text NOT NULL,
	`release_date` text NOT NULL,
	`platform_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `g_j_game_whitelist_platform` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`whitelist_id` text NOT NULL,
	`platform_id` text NOT NULL,
	`note` text,
	FOREIGN KEY (`whitelist_id`) REFERENCES `g_game_whitelist`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`platform_id`) REFERENCES `g_game_platform`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_whitelist_platform` ON `g_j_game_whitelist_platform` (`whitelist_id`,`platform_id`);--> statement-breakpoint
CREATE TABLE `g_entertainment_tracker` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`type_id` text NOT NULL,
	`franchise_title` text NOT NULL,
	`entry_title` text NOT NULL,
	`season` text NOT NULL,
	`year` text NOT NULL,
	`status_publication` text NOT NULL,
	`status_dl` text NOT NULL,
	`link_dl` text NOT NULL,
	`last_mark` text NOT NULL,
	FOREIGN KEY (`type_id`) REFERENCES `g_entertainment_tracker_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `g_entertainment_tracker_type` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `i_weapon_calibers` (
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
CREATE TABLE `i_weapon_classes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `i_weapon_origins` (
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
CREATE TABLE `i_weapon_refs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text,
	`origin_id` text NOT NULL,
	`caliber_id` text NOT NULL,
	`weapon_id` text NOT NULL,
	FOREIGN KEY (`origin_id`) REFERENCES `i_weapon_origins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`caliber_id`) REFERENCES `i_weapon_calibers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`weapon_id`) REFERENCES `i_weapons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `i_weapons` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`desc` text,
	`origin_id` text NOT NULL,
	`caliber_id` text NOT NULL,
	`class_id` text NOT NULL,
	FOREIGN KEY (`origin_id`) REFERENCES `i_weapon_origins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`caliber_id`) REFERENCES `i_weapon_calibers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `i_weapon_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_d_character_ascension` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`ascension_phase_id` text NOT NULL,
	`boss_material_id` text NOT NULL,
	`common_material_id` text NOT NULL,
	`favorite_material_id` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ascension_phase_id`) REFERENCES `k_m_ascension_phases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`boss_material_id`) REFERENCES `k_m_materials`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`common_material_id`) REFERENCES `k_m_materials`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`favorite_material_id`) REFERENCES `k_m_materials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_d_combat_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`skill_type_id` text NOT NULL,
	`name` text NOT NULL,
	`desc` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_type_id`) REFERENCES `k_m_combat_skill_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_d_images` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`order` integer,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_d_stories` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`unlock_condition` text,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_d_voice_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`title` text NOT NULL,
	`audio_url` text NOT NULL,
	`transcript` text,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_j_character_role` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`character_id` text NOT NULL,
	`role_id` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `k_m_characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `k_m_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_character_role` ON `k_j_character_role` (`character_id`,`role_id`);--> statement-breakpoint
CREATE TABLE `k_m_ascension_phases` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`phase` integer NOT NULL,
	`level_cap` integer NOT NULL,
	`boss_material_quantity` integer DEFAULT 0 NOT NULL,
	`common_material_quantity` integer DEFAULT 0 NOT NULL,
	`favorite_material_quantity` integer DEFAULT 0 NOT NULL,
	`currency` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `k_m_attributes` (
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
CREATE TABLE `k_m_characters` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`wp_id` text,
	`universe_id` text NOT NULL,
	`attribute_id` text NOT NULL,
	FOREIGN KEY (`wp_id`) REFERENCES `k_m_weapons`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`universe_id`) REFERENCES `k_m_universes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attribute_id`) REFERENCES `k_m_attributes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `k_m_combat_skill_types` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `k_m_leveling_exp` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`level` integer NOT NULL,
	`exp_need` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `k_m_materials` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`desc` text,
	`rarity` text
);
--> statement-breakpoint
CREATE TABLE `k_m_roles` (
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
CREATE TABLE `k_m_universes` (
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
CREATE TABLE `k_m_weapons` (
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
CREATE TABLE `m_tcg_card_type` (
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
CREATE TABLE `m_tcg_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text NOT NULL,
	`image_url` text,
	`power` integer,
	`toughness` integer,
	`supertype_id_1` text NOT NULL,
	`supertype_id_2` text NOT NULL,
	`card_type_id` text NOT NULL,
	`familia_id_1` text NOT NULL,
	`familia_id_2` text NOT NULL,
	`familia_id_3` text NOT NULL,
	`cast_cost` text,
	`effect` text,
	FOREIGN KEY (`supertype_id_1`) REFERENCES `m_tcg_supertype`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supertype_id_2`) REFERENCES `m_tcg_supertype`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`card_type_id`) REFERENCES `m_tcg_card_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`familia_id_1`) REFERENCES `m_tcg_familia`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`familia_id_2`) REFERENCES `m_tcg_familia`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`familia_id_3`) REFERENCES `m_tcg_familia`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `m_tcg_element` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `m_tcg_familia` (
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
CREATE TABLE `m_tcg_keyword` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `m_tcg_supertype` (
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
CREATE TABLE `n_gacha_banner_items` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`banner_id` text NOT NULL,
	`item_id` text NOT NULL,
	FOREIGN KEY (`banner_id`) REFERENCES `n_gacha_banners`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `n_gacha_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `n_gacha_banners` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text,
	`soft_pity_start` integer,
	`hard_pity_start` integer,
	`uprate5` integer,
	`uprate4` integer
);
--> statement-breakpoint
CREATE TABLE `n_gacha_items` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`name` text,
	`rarity` integer,
	`image_url` text,
	`video_url` text
);
--> statement-breakpoint
CREATE TABLE `n_gacha_user_history` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`name` text,
	`rarity` integer,
	`obtained_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `a_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `n_gacha_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `n_gacha_user_pity` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`user_id` text NOT NULL,
	`pity5` integer DEFAULT 0,
	`pity4` integer DEFAULT 0,
	`guarantee5` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `a_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `o_bom_items` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`bom_id` text NOT NULL,
	`component_item_id` text NOT NULL,
	`qty` real NOT NULL,
	`uom_id` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`bom_id`) REFERENCES `o_boms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`component_item_id`) REFERENCES `o_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uom_id`) REFERENCES `o_uoms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `o_boms` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`version` text NOT NULL,
	`is_active` integer DEFAULT false,
	`bom_type` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`item_variant_id`) REFERENCES `o_item_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueVersion` ON `o_boms` (`item_variant_id`,`version`);--> statement-breakpoint
CREATE TABLE `o_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `o_categories_code_unique` ON `o_categories` (`code`);--> statement-breakpoint
CREATE TABLE `o_item_attributes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_item_costs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`cost` real,
	`obtained_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_item_cross_refs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`ref_type` text NOT NULL,
	`ref_code` text NOT NULL,
	`ref_name` text
);
--> statement-breakpoint
CREATE TABLE `o_item_journals` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`qty` real,
	`uom_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_item_ledger_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`location_id` text,
	`qty` real,
	`uom_id` text NOT NULL,
	`type` text NOT NULL,
	`ref_id` text
);
--> statement-breakpoint
CREATE TABLE `o_item_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_variant_id` text NOT NULL,
	`price` real,
	`currency` text NOT NULL,
	`customer_group` text,
	`obtained_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_item_uoms` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_id` text NOT NULL,
	`uom_id` text NOT NULL,
	`conversion_value` real NOT NULL,
	`is_default` integer DEFAULT false,
	FOREIGN KEY (`item_id`) REFERENCES `o_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uom_id`) REFERENCES `o_uoms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueItemUom` ON `o_item_uoms` (`item_id`,`uom_id`);--> statement-breakpoint
CREATE TABLE `o_item_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`item_id` text NOT NULL,
	`variant_name` text NOT NULL,
	`length` real,
	`width` real,
	`height` real,
	`weight` real,
	FOREIGN KEY (`item_id`) REFERENCES `o_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueVariant` ON `o_item_variants` (`item_id`,`variant_name`);--> statement-breakpoint
CREATE TABLE `o_items` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`inventory_type` text NOT NULL,
	`type` text NOT NULL,
	`parent_item_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `o_items_code_unique` ON `o_items` (`code`);--> statement-breakpoint
CREATE TABLE `o_junc_purchase_order_line_requisition_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`purchase_order_line_id` text NOT NULL,
	`purchase_requisition_line_id` text NOT NULL,
	`qty_linked` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_posted_purchase_receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`source_id` text,
	`code` text NOT NULL,
	`vendor_id` text NOT NULL,
	`receipt_date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_purchase_invoice_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`invoice_id` text NOT NULL,
	`purchase_receipt_line_id` text NOT NULL,
	`item_variant_id` text NOT NULL,
	`item_name` text,
	`qty` real NOT NULL,
	`uom_id` text NOT NULL,
	`cost` real
);
--> statement-breakpoint
CREATE TABLE `o_purchase_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`vendor_id` text NOT NULL,
	`invoice_date` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_purchase_order_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`order_id` text NOT NULL,
	`item_variant_id` text NOT NULL,
	`item_name` text,
	`qty` real NOT NULL,
	`qty_received` real DEFAULT 0,
	`uom_id` text NOT NULL,
	`cost` real
);
--> statement-breakpoint
CREATE TABLE `o_purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`vendor_id` text NOT NULL,
	`status` text NOT NULL,
	`order_date` integer,
	`expected_date` integer
);
--> statement-breakpoint
CREATE TABLE `o_purchase_receipt_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`receipt_id` text NOT NULL,
	`purchase_order_line_id` text NOT NULL,
	`item_variant_id` text NOT NULL,
	`item_name` text,
	`qty` real NOT NULL,
	`qty_invoiced` real DEFAULT 0,
	`uom_id` text NOT NULL,
	`cost` real
);
--> statement-breakpoint
CREATE TABLE `o_purchase_receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`vendor_id` text NOT NULL,
	`purchase_order_id` text,
	`receipt_date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_purchase_requisition_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`requisition_id` text NOT NULL,
	`item_variant_id` text NOT NULL,
	`item_name` text,
	`qty` real NOT NULL,
	`qty_ordered` real DEFAULT 0,
	`conversion_value` real NOT NULL,
	`note` text,
	`uom_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `o_purchase_requisitions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`document_date` text NOT NULL,
	`status` text NOT NULL,
	`reason` text,
	`requested_by` text,
	`made_by` text,
	`known_by` text,
	`known_sign` integer,
	`approved_by` text,
	`approved_sign` integer
);
--> statement-breakpoint
CREATE TABLE `o_uoms` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `o_uoms_code_unique` ON `o_uoms` (`code`);--> statement-breakpoint
CREATE TABLE `o_vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`deleted_by` text,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`contact` text,
	`phone` text,
	`email` text,
	`website` text,
	`address` text
);
