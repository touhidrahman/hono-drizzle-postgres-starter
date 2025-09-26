CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) DEFAULT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"emailVerifiedAt" timestamp with time zone DEFAULT NULL,
	"loginAt" timestamp with time zone DEFAULT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone DEFAULT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
