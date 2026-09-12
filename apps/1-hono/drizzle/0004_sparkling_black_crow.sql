CREATE TABLE "z_app_ips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"ip_public" varchar(45) NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "z_apps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "z_app_ips" ADD CONSTRAINT "z_app_ips_app_id_z_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."z_apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "z_app_ips_app_id_idx" ON "z_app_ips" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "z_app_ips_ip_public_idx" ON "z_app_ips" USING btree ("ip_public");