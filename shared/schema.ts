import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'privacy-policy', 'terms-of-service', 'cookie-consent'
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Store business info, customizations, etc.
  status: text("status").default("draft"), // 'draft', 'generated', 'purchased'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  documentId: varchar("document_id").references(() => documents.id),
  documentType: text("document_type").notNull(),
  messages: jsonb("messages").default([]).notNull(), // Array of chat messages
  businessInfo: jsonb("business_info").default({}), // Collected business information
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  documentId: varchar("document_id").references(() => documents.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  amount: integer("amount").notNull(), // Amount in cents
  status: text("status").notNull(), // 'pending', 'succeeded', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  type: true,
  title: true,
  content: true,
  metadata: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  documentType: true,
  messages: true,
  businessInfo: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  documentId: true,
  stripePaymentIntentId: true,
  amount: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
