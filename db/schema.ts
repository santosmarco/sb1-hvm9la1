import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  verificationToken: text("verification_token"),
  verified: boolean("verified").default(false),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  endpoint: text("endpoint").notNull().unique(),
  secret: text("secret").notNull(),
  notifications: jsonb("notifications").$type<{
    email: boolean;
    slack: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id").references(() => webhooks.id),
  method: text("method").notNull(),
  headers: jsonb("headers").notNull(),
  queryParams: jsonb("query_params"),
  body: jsonb("body"),
  timestamp: timestamp("timestamp").defaultNow(),
  ip: text("ip"),
  userAgent: text("user_agent"),
});