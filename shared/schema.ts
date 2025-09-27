import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table ##esta funcion o esquema es para la lectura de la base de datos
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  password: text("password"),
  role: text("role").notNull().default("client"),
  language: text("language").notNull().default("es"),
  isGuest: integer("is_guest", { mode: 'boolean' }).default(true).notNull(),
  preferences: text("preferences", { mode: 'json' }).$type<{favoriteServices?: string[]; preferredTime?: string; notifications?: boolean}>(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Vehicles table
export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  userId: text("user_id").notNull().references(() => users.id),
  plate: text("plate").notNull(),
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Services table
export const services = sqliteTable("services", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  slug: text("slug").notNull().unique(),
  nameKey: text("name_key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleEs: text("title_es").notNull(),
  titlePt: text("title_pt").notNull(),
  subtitleEs: text("subtitle_es").notNull(),
  subtitlePt: text("subtitle_pt").notNull(),
  copyEs: text("copy_es").notNull(),
  copyPt: text("copy_pt").notNull(),
  prices: text("prices", { mode: 'json' }).notNull().$type<{auto?: number; suv?: number; camioneta?: number}>(),
  durationMin: integer("duration_min"),
  imageUrl: text("image_url"),
  active: integer("active", { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  userId: text("user_id").notNull().references(() => users.id),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  serviceId: text("service_id").notNull().references(() => services.id),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status").notNull().default("waiting"),
  price: integer("price").notNull(),
  paymentMethod: text("payment_method").default("cash"),
  paymentCaptureUrl: text("payment_capture_url"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Payments table
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  bookingId: text("booking_id").notNull().references(() => bookings.id),
  method: text("method").notNull(),
  amountGs: integer("amount_gs").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Organization settings table
export const organization = sqliteTable("organization", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  openingHours: text("opening_hours", { mode: 'json' }),
  address: text("address"),
  whatsapp: text("whatsapp"),
  gallery: text("gallery", { mode: 'json' }).$type<string[]>(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// OTP tokens table for passwordless authentication
export const otpTokens = sqliteTable("otp_tokens", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  verified: integer("verified", { mode: 'boolean' }).default(false).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Magic links table for booking management
export const magicLinks = sqliteTable("magic_links", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  token: text("token").notNull().unique(),
  bookingId: text("booking_id").notNull().references(() => bookings.id),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  usedAt: integer("used_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Admin sessions table
export const adminSessions = sqliteTable("admin_sessions", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  lastActivity: integer("last_activity", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Audit log table
export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  actorUserId: text("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  targetRef: text("target_ref"),
  metadata: text("metadata", { mode: 'json' }),
  timestamp: integer("timestamp", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  bookings: many(bookings),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
