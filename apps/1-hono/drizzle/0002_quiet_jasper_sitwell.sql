ALTER TABLE "d_notes" ADD COLUMN "color" text DEFAULT 'bg-zinc-900' NOT NULL;--> statement-breakpoint
ALTER TABLE "d_notes" ADD COLUMN "is_trashed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "d_j_note_labels" ADD CONSTRAINT "d_j_note_labels_note_label_unique" UNIQUE("note_id","label_id");