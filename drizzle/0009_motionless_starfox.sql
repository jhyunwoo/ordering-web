ALTER TABLE "userRequests" ADD COLUMN "key" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "userRequests" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "userRequests" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "table" DROP COLUMN "key";