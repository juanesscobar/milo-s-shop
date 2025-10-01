import { sql, relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Production-ready Users table according to specifications
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"), // Unique constraint will be added via migration
  phone: text("phone").notNull(), // Unique constraint will be added via migration
  password: text("password").notNull(), // Never exposed in API responses
  role: text("role").$type<'client' | 'admin'>().notNull().default('client'),
  language: text("language").notNull().default('es'),
  isGuest: text("is_guest").default('true').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Companies table for admin management
export const companies = pgTable("companies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions table for PostgreSQL session store
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  data: text("data").notNull(), // Serialized session data
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email verification tokens table
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  emailVerificationTokens: many(emailVerificationTokens),
  passwordResetTokens: many(passwordResetTokens),
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

export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [emailVerificationTokens.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
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
  passwordConfirm: z.string()
    .min(1, "La confirmación de contraseña es requerida"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
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
  passwordConfirm: z.string()
    .min(1, "La confirmación de contraseña es requerida"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(1, "La contraseña es requerida"),
  mfaToken: z.string().optional(),
});

// Insert and Select schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(users).omit({
  password: true, // Never expose password hash
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
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type RegisterClientData = z.infer<typeof registerClientSchema>;
export type RegisterAdminData = z.infer<typeof registerAdminSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// API Response Types
export type AuthResponse = {
  user: User;
  message: string;
  requiresMFA?: boolean;
};

export type ErrorResponse = {
  error: string;
  details?: string | string[];
};