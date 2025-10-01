var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
// Simplified Users table for authentication testing
export var users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    password: text("password"),
    role: text("role").notNull().default("client"),
    language: text("language").notNull().default("es"),
    isGuest: integer("is_guest", { mode: 'boolean' }).default(true).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["unixepoch()"], ["unixepoch()"])))).notNull(),
});
// Simplified Vehicles table
export var vehicles = sqliteTable("vehicles", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }),
    plate: text("plate").notNull(),
    type: text("type").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Simplified Services table for testing
export var services = sqliteTable("services", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    prices: text("prices", { mode: 'json' }).$type(),
    durationMin: integer("duration_min"),
    imageUrl: text("image_url"),
    active: integer("active", { mode: 'boolean' }).default(true).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Simplified Bookings table
export var bookings = sqliteTable("bookings", {
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
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
