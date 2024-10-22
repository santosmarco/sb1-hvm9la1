CREATE TABLE IF NOT EXISTS "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"webhook_id" integer,
	"method" text NOT NULL,
	"headers" jsonb NOT NULL,
	"query_params" jsonb,
	"body" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"ip" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"hashed_password" text NOT NULL,
	"verification_token" text,
	"verified" boolean DEFAULT false,
	"reset_token" text,
	"reset_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"description" text,
	"endpoint" text NOT NULL,
	"secret" text NOT NULL,
	"notifications" jsonb,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	"expires_at" timestamp,
	CONSTRAINT "webhooks_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_webhook_id_webhooks_id_fk" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
