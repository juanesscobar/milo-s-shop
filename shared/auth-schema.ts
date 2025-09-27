import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Production-ready Users table according to specifications
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(), // Unique email constraint
  phone: text("phone").notNull().unique(), // Unique phone constraint
  passwordHash: text("password_hash").notNull(), // Never exposed in API responses
  role: text("role", { enum: ['client', 'admin'] }).notNull().default('client'),
  companyId: integer("company_id"), // Nullable integer for admins only
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Companies table for admin management
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Sessions table for PostgreSQL session store (using SQLite for compatibility)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  data: text("data").notNull(), // Serialized session data
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  sessions: many(sessions),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Comprehensive Zod Schemas for Validation
export const registerClientSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z.string()
    .email("Email inválido")
    .min(5, "Email muy corto")
    .max(255, "Email muy largo")
    .optional(),
  phone: z.string()
    .min(8, "Teléfono debe tener al menos 8 dígitos")
    .max(20, "Teléfono muy largo")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Formato de teléfono inválido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "Contraseña muy larga")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "La contraseña debe contener: minúscula, mayúscula, número y carácter especial"),
});

export const registerAdminSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  companyName: z.string()
    .min(2, "El nombre de empresa debe tener al menos 2 caracteres")
    .max(200, "El nombre de empresa no puede exceder 200 caracteres"),
  phone: z.string()
    .min(8, "Teléfono debe tener al menos 8 dígitos")
    .max(20, "Teléfono muy largo")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Formato de teléfono inválido"),
  email: z.string()
    .email("Email inválido")
    .min(5, "Email muy corto")
    .max(255, "Email muy largo"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "Contraseña muy larga")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "La contraseña debe contener: minúscula, mayúscula, número y carácter especial"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Insert and Select schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users).omit({
  passwordHash: true, // Never expose password hash
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  createdAt: true,
});

// Types
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type RegisterClientData = z.infer<typeof registerClientSchema>;
export type RegisterAdminData = z.infer<typeof registerAdminSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// API Response Types
export type AuthResponse = {
  user: User;
  message: string;
};

export type ErrorResponse = {
  error: string;
  details?: string | string[];
};