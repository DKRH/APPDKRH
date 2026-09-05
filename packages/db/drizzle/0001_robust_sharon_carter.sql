CREATE TABLE "n_gacha_banner_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"banner_id" uuid NOT NULL,
	"item_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "n_gacha_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text,
	"soft_pity_start" integer,
	"hard_pity_start" integer,
	"uprate5" numeric,
	"uprate4" numeric
);
--> statement-breakpoint
CREATE TABLE "n_gacha_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text,
	"rarity" integer,
	"image_url" text,
	"video_url" text
);
--> statement-breakpoint
CREATE TABLE "n_gacha_user_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"user_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"name" text,
	"rarity" integer,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "n_gacha_user_pity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"user_id" uuid NOT NULL,
	"pity5" integer DEFAULT 0,
	"pity4" integer DEFAULT 0,
	"guarantee5" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "n_gacha_banner_items" ADD CONSTRAINT "n_gacha_banner_items_banner_id_n_gacha_banners_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."n_gacha_banners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "n_gacha_banner_items" ADD CONSTRAINT "n_gacha_banner_items_item_id_n_gacha_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."n_gacha_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "n_gacha_user_history" ADD CONSTRAINT "n_gacha_user_history_user_id_a_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."a_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "n_gacha_user_history" ADD CONSTRAINT "n_gacha_user_history_item_id_n_gacha_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."n_gacha_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "n_gacha_user_pity" ADD CONSTRAINT "n_gacha_user_pity_user_id_a_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."a_user"("id") ON DELETE no action ON UPDATE no action;