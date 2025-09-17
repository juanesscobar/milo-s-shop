import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  role: text("role", { enum: ["client", "admin"] }).notNull().default("client"),
  language: text("language", { enum: ["es", "pt"] }).notNull().default("es"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  plate: text("plate").notNull(),
  type: text("type", { enum: ["auto", "suv", "camioneta"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameKey: text("name_key").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prices: jsonb("prices").notNull().$type<{auto?: number; suv?: number; camioneta?: number}>(),
  durationMin: integer("duration_min"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status", { enum: ["waiting", "washing", "done", "cancelled"] }).notNull().default("waiting"),
  price: integer("price").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  method: text("method", { enum: ["card", "pix", "cash"] }).notNull(),
  amountGs: integer("amount_gs").notNull(),
  status: text("status", { enum: ["pending", "paid", "failed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Organization settings table
export const organization = pgTable("organization", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  openingHours: jsonb("opening_hours"),
  address: text("address"),
  whatsapp: text("whatsapp"),
  gallery: jsonb("gallery").$type<string[]>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit log table
export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: varchar("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  targetRef: text("target_ref"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  bookings: many(bookings),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  payment: one(payments, {
    fields: [bookings.id],
    references: [payments.bookingId],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
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
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertOrganizationSchema = createInsertSchema(organization).omit({
  id: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  timestamp: true,
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
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organization.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
