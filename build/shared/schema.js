import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Simplified Users table for authentication testing
export var users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    password: text("password"),
    role: text("role").notNull().default("client"),
    language: text("language").notNull().default("es"),
    isGuest: text("is_guest").default("true").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Simplified Vehicles table
export var vehicles = pgTable("vehicles", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }),
    plate: text("plate").notNull(),
    type: text("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Simplified Services table for testing
export var services = pgTable("services", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    prices: text("prices").$type(),
    durationMin: integer("duration_min"),
    imageUrl: text("image_url"),
    active: text("active").default("true").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Simplified Bookings table
export var bookings = pgTable("bookings", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }),
    vehicleId: text("vehicle_id").notNull().references(function () { return vehicles.id; }),
    serviceId: text("service_id").notNull().references(function () { return services.id; }),
    date: text("date").notNull(),
    timeSlot: text("time_slot").notNull(),
    status: text("status").notNull().default("waiting"),
    price: integer("price").notNull(),
    paymentMethod: text("payment_method"),
    paymentCaptureUrl: text("payment_capture_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Relations
export var usersRelations = relations(users, function (_a) {
    var many = _a.many;
    return ({
        vehicles: many(vehicles),
        bookings: many(bookings),
    });
});
export var vehiclesRelations = relations(vehicles, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(users, {
            fields: [vehicles.userId],
            references: [users.id],
        }),
        bookings: many(bookings),
    });
});
export var servicesRelations = relations(services, function (_a) {
    var many = _a.many;
    return ({
        bookings: many(bookings),
    });
});
export var bookingsRelations = relations(bookings, function (_a) {
    var one = _a.one;
    return ({
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
    });
});
// Insert schemas
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});
export var insertVehicleSchema = createInsertSchema(vehicles).omit({
    id: true,
    createdAt: true,
});
export var insertServiceSchema = createInsertSchema(services).omit({
    id: true,
    createdAt: true,
});
export var insertBookingSchema = createInsertSchema(bookings).omit({
    id: true,
    createdAt: true,
});
