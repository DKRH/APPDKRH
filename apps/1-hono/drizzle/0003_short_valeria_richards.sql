CREATE TABLE "a1_audit_logging" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"request_id" text,
	"method" text,
	"path" text,
	"old_data" jsonb,
	"new_data" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "m_tcg_card_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL,
	"desc" text
);
--> statement-breakpoint
CREATE TABLE "m_tcg_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"supertype_id_1" uuid NOT NULL,
	"supertype_id_2" uuid NOT NULL,
	"card_type_id" uuid NOT NULL,
	"familia_id_1" uuid NOT NULL,
	"familia_id_2" uuid NOT NULL,
	"familia_id_3" uuid NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"power" integer,
	"toughness" integer,
	"cast_cost" text,
	"effect" text
);
--> statement-breakpoint
CREATE TABLE "m_tcg_element" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"desc" text
);
--> statement-breakpoint
CREATE TABLE "m_tcg_familia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL,
	"desc" text
);
--> statement-breakpoint
CREATE TABLE "m_tcg_keyword" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"desc" text
);
--> statement-breakpoint
CREATE TABLE "m_tcg_supertype" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL,
	"desc" text
);
--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_supertype_id_1_m_tcg_supertype_id_fk" FOREIGN KEY ("supertype_id_1") REFERENCES "public"."m_tcg_supertype"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_supertype_id_2_m_tcg_supertype_id_fk" FOREIGN KEY ("supertype_id_2") REFERENCES "public"."m_tcg_supertype"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_card_type_id_m_tcg_card_type_id_fk" FOREIGN KEY ("card_type_id") REFERENCES "public"."m_tcg_card_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_familia_id_1_m_tcg_familia_id_fk" FOREIGN KEY ("familia_id_1") REFERENCES "public"."m_tcg_familia"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_familia_id_2_m_tcg_familia_id_fk" FOREIGN KEY ("familia_id_2") REFERENCES "public"."m_tcg_familia"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m_tcg_cards" ADD CONSTRAINT "m_tcg_cards_familia_id_3_m_tcg_familia_id_fk" FOREIGN KEY ("familia_id_3") REFERENCES "public"."m_tcg_familia"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logging_table_record_idx" ON "audit_logging" USING btree ("table_name","record_id");--> statement-breakpoint
CREATE INDEX "audit_logging_user_idx" ON "audit_logging" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logging_created_at_idx" ON "audit_logging" USING btree ("created_at");