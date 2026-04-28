CREATE TABLE "social_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"platform" text NOT NULL,
	"account_name" text NOT NULL,
	"account_handle" text,
	"encrypted_credentials" text NOT NULL,
	"credential_type" text DEFAULT 'api_key',
	"status" text DEFAULT 'active',
	"last_verified" timestamp,
	"last_error" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "business_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "monthly_fee" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "monthly_fee" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "social_account_id" integer;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bots" ADD CONSTRAINT "bots_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE no action ON UPDATE no action;