CREATE TABLE "a1_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"system_id" uuid NOT NULL,
	"code" varchar(150) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "a1_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "a1_role_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "a1_role_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "a1_system" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "a1_system_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "a1_user_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "a_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"issuer" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "a_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "a_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "a_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "a_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "a_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "b_passbank" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"title" text NOT NULL,
	"username" text,
	"password" text,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "c_todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "d_j_note_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"note_id" uuid NOT NULL,
	"label_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "d_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "d_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"title" text NOT NULL,
	"content" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "e_url_shortener" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"original_url" text NOT NULL,
	"shorten_url" text NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password" text,
	"expire_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "f_text_storage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"url" text NOT NULL,
	"content" text NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password" text,
	"expire_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "g_entertainment_tracker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"type_id" uuid NOT NULL,
	"franchise_title" text,
	"entry_title" text NOT NULL,
	"season" text,
	"year" text,
	"status_publication" text,
	"status_dl" text,
	"link_dl" text,
	"last_mark" text
);
--> statement-breakpoint
CREATE TABLE "g_entertainment_tracker_type" (
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
CREATE TABLE "k_m_attributes" (
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
CREATE TABLE "k_m_characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"name" text NOT NULL,
	"weapon" text,
	"release_version" text,
	"universe_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "k_m_roles" (
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
CREATE TABLE "k_m_universes" (
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
ALTER TABLE "a1_permission" ADD CONSTRAINT "a1_permission_system_id_a1_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."a1_system"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a1_role_permission" ADD CONSTRAINT "a1_role_permission_role_id_a1_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."a1_role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a1_role_permission" ADD CONSTRAINT "a1_role_permission_permission_id_a1_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."a1_permission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a1_user_role" ADD CONSTRAINT "a1_user_role_user_id_a_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."a_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a1_user_role" ADD CONSTRAINT "a1_user_role_role_id_a1_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."a1_role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a1_user_role" ADD CONSTRAINT "a1_user_role_created_by_a_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."a_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a_account" ADD CONSTRAINT "a_account_user_id_a_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."a_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "a_session" ADD CONSTRAINT "a_session_user_id_a_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."a_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "d_j_note_labels" ADD CONSTRAINT "d_j_note_labels_note_id_d_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."d_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "d_j_note_labels" ADD CONSTRAINT "d_j_note_labels_label_id_d_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."d_labels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "g_entertainment_tracker" ADD CONSTRAINT "g_entertainment_tracker_type_id_g_entertainment_tracker_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."g_entertainment_tracker_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "k_m_characters" ADD CONSTRAINT "k_m_characters_universe_id_k_m_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."k_m_universes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "k_m_characters" ADD CONSTRAINT "k_m_characters_attribute_id_k_m_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."k_m_attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "permission_system_code_unique" ON "a1_permission" USING btree ("system_id","code");--> statement-breakpoint
CREATE INDEX "permission_system_idx" ON "a1_permission" USING btree ("system_id");--> statement-breakpoint
CREATE UNIQUE INDEX "role_permission_unique" ON "a1_role_permission" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE INDEX "role_permission_role_idx" ON "a1_role_permission" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permission_permission_idx" ON "a1_role_permission" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_role_unique" ON "a1_user_role" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "user_role_user_idx" ON "a1_user_role" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_role_idx" ON "a1_user_role" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "a_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "a_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "a_verification" USING btree ("identifier");