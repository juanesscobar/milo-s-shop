import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Simplified Users table for authentication testing
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  password: text("password"),
  role: text("role").notNull().default("client"),
  language: text("language").notNull().default("es"),
  isGuest: integer("is_guest", { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`unixepoch()`).notNull(),
});

// Simplified Vehicles table
export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  plate: text("plate").notNull(),
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Simplified Services table for testing
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prices: text("prices", { mode: 'json' }).$type<{auto?: number; suv?: number; camioneta?: number}>(),
  imageUrl: text("image_url"),
  active: integer("active", { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Simplified Bookings table
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  serviceId: text("service_id").notNull().references(() => services.id),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status").notNull().default("waiting"),
  price: integer("price").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
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
