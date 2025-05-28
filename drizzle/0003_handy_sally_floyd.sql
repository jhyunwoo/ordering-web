CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"totalQuantity" integer DEFAULT 0 NOT NULL
);
