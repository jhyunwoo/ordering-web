CREATE TYPE "public"."status" AS ENUM('WAITING', 'PENDING', 'COMPLETE');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"userRequestId" integer NOT NULL,
	"menuName" text NOT NULL,
	"menuPrice" integer DEFAULT 0,
	"status" "status" DEFAULT 'WAITING'
);
--> statement-breakpoint
CREATE TABLE "table" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"key" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	CONSTRAINT "table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "userRequests" (
	"id" serial PRIMARY KEY NOT NULL,
	"tableId" text NOT NULL,
	"amount" integer DEFAULT 0,
	"paid" boolean DEFAULT false NOT NULL
);
