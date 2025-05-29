import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role").default("USER").notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const tables = pgTable("table", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const tablesRelations = relations(tables, ({ many }) => ({
  posts: many(userRequests),
}));

export const userRequests = pgTable("userRequests", {
  id: serial("id").primaryKey(),
  tableId: text("tableId").notNull(),
  amount: integer("amount").default(0),
  paid: boolean("paid").default(false).notNull(),
  key: integer("key").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const userRequestsRelations = relations(
  userRequests,
  ({ one, many }) => ({
    table: one(tables, {
      fields: [userRequests.tableId],
      references: [tables.id],
    }),
    orders: many(orders),
  }),
);

export const orderStatusEnum = pgEnum("status", [
  "WAITING",
  "PENDING",
  "COMPLETE",
]);

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userRequestId: integer("userRequestId").notNull(),
  menuId: serial("menuId").notNull(),
  menuName: text("menuName").notNull(),
  menuPrice: integer("menuPrice").default(0),
  status: orderStatusEnum("status").default("WAITING"),
  tableName: text("tableName").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  userRequest: one(userRequests, {
    fields: [orders.userRequestId],
    references: [userRequests.id],
  }),
  menu: one(menus, {
    fields: [orders.menuId],
    references: [menus.id],
  }),
}));

export const deposits = pgTable("deposits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  quantity: integer("totalQuantity").notNull().default(0),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const menusRelations = relations(menus, ({ many }) => ({
  orders: many(orders),
}));
