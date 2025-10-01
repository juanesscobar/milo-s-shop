var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
// Production-ready Users table according to specifications
export var users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique(), // Unique email constraint
    phone: text("phone").notNull().unique(), // Unique phone constraint
    passwordHash: text("password_hash").notNull(), // Never exposed in API responses
    role: text("role", { enum: ['client', 'admin'] }).notNull().default('client'),
    companyId: integer("company_id"), // Nullable integer for admins only
    emailVerified: integer("email_verified", { mode: 'boolean' }).default(false).notNull(),
    // MFA fields
    mfaSecret: text("mfa_secret"), // TOTP secret for MFA
    mfaEnabled: integer("mfa_enabled", { mode: 'boolean' }).default(false).notNull(), // Whether MFA is enabled
    mfaBackupCodes: text("mfa_backup_codes"), // JSON array of backup codes
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Companies table for admin management
export var companies = sqliteTable("companies", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Sessions table for PostgreSQL session store (using SQLite for compatibility)
export var sessions = sqliteTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    data: text("data").notNull(), // Serialized session data
    expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Email verification tokens table
export var emailVerificationTokens = sqliteTable("email_verification_tokens", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Password reset tokens table
export var passwordResetTokens = sqliteTable("password_reset_tokens", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(function () { return users.id; }, { onDelete: 'cascade' }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["(strftime('%s', 'now'))"], ["(strftime('%s', 'now'))"])))).notNull(),
});
// Relations
export var usersRelations = relations(users, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        company: one(companies, {
            fields: [users.companyId],
            references: [companies.id],
        }),
        sessions: many(sessions),
        emailVerificationTokens: many(emailVerificationTokens),
        passwordResetTokens: many(passwordResetTokens),
    });
});
export var companiesRelations = relations(companies, function (_a) {
    var many = _a.many;
    return ({
        users: many(users),
    });
});
export var sessionsRelations = relations(sessions, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [sessions.userId],
            references: [users.id],
        }),
    });
});
export var emailVerificationTokensRelations = relations(emailVerificationTokens, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [emailVerificationTokens.userId],
            references: [users.id],
        }),
    });
});
export var passwordResetTokensRelations = relations(passwordResetTokens, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [passwordResetTokens.userId],
            references: [users.id],
        }),
    });
});
// Comprehensive Zod Schemas for Validation
export var registerClientSchema = z.object({
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
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "La contraseña debe contener: minúscula, mayúscula, número y carácter especial"),
    passwordConfirm: z.string()
        .min(1, "La confirmación de contraseña es requerida"),
}).refine(function (data) { return data.password === data.passwordConfirm; }, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
});
export var registerAdminSchema = z.object({
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
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "La contraseña debe contener: minúscula, mayúscula, número y carácter especial"),
    passwordConfirm: z.string()
        .min(1, "La confirmación de contraseña es requerida"),
}).refine(function (data) { return data.password === data.passwordConfirm; }, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
});
export var loginSchema = z.object({
    email: z.string().email("Email inválido").optional(),
    password: z.string().min(1, "La contraseña es requerida"),
    mfaToken: z.string().optional(),
});
// Insert and Select schemas
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var selectUserSchema = createSelectSchema(users).omit({
    passwordHash: true, // Never expose password hash
    mfaSecret: true, // Never expose MFA secret
    mfaBackupCodes: true, // Never expose backup codes
});
export var insertCompanySchema = createInsertSchema(companies).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertSessionSchema = createInsertSchema(sessions).omit({
    createdAt: true,
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
