import { 
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Service, type InsertService,
  type Booking, type InsertBooking,
  type Payment, type InsertPayment,
  type OtpToken, type InsertOtpToken,
  type MagicLink, type InsertMagicLink,
  type AdminSession, type InsertAdminSession,
  type AuditLog, type InsertAuditLog,
  users, vehicles, services, bookings, payments,
  otpTokens, magicLinks, adminSessions, auditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// Storage interface for Milos'Shop
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Vehicles
  getUserVehicles(userId: string): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  
  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Bookings
  getUserBookings(userId: string): Promise<Booking[]>;
  getTodayBookings(): Promise<Booking[]>;
  getTodayBookingsWithDetails(): Promise<any[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string): Promise<Payment | undefined>;
  
  // OTP Authentication
  createOtpToken(otp: InsertOtpToken): Promise<OtpToken>;
  getValidOtpToken(phone: string, code: string): Promise<OtpToken | undefined>;
  markOtpAsVerified(id: string): Promise<void>;
  incrementOtpAttempts(id: string): Promise<void>;
  
  // Magic Links
  createMagicLink(link: InsertMagicLink): Promise<MagicLink>;
  getMagicLink(token: string): Promise<MagicLink | undefined>;
  markMagicLinkAsUsed(id: string): Promise<void>;
  
  // Admin Sessions
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getValidAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<void>;
  
  // Audit Log
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values([insertUser]).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Vehicles
  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values([insertVehicle]).returning();
    return vehicle;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.active, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values([insertService as any]).returning();
    return service;
  }

  // Bookings
  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getTodayBookings(): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.select().from(bookings)
      .where(eq(bookings.date, today))
      .orderBy(desc(bookings.createdAt));
  }

  async getTodayBookingsWithDetails(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.select({
      id: bookings.id,
      userId: bookings.userId,
      vehicleId: bookings.vehicleId,
      serviceId: bookings.serviceId,
      date: bookings.date,
      timeSlot: bookings.timeSlot,
      status: bookings.status,
      price: bookings.price,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      // User details
      userName: users.name,
      userPhone: users.phone,
      userEmail: users.email,
      // Vehicle details
      vehiclePlate: vehicles.plate,
      vehicleType: vehicles.type,
      // Service details
      serviceName: services.titleEs,
      serviceTitle: services.title,
      // Payment info will be handled separately if needed
    })
    .from(bookings)
    .innerJoin(users, eq(bookings.userId, users.id))
    .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(bookings.date, today))
    .orderBy(desc(bookings.createdAt));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values([insertBooking]).returning();
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values([insertPayment]).returning();
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment | undefined> {
    const [payment] = await db.update(payments)
      .set({ status: status as any })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  // OTP Authentication
  async createOtpToken(insertOtpToken: InsertOtpToken): Promise<OtpToken> {
    const [otpToken] = await db.insert(otpTokens).values([insertOtpToken]).returning();
    return otpToken;
  }

  async getValidOtpToken(phone: string, code: string): Promise<OtpToken | undefined> {
    const [otpToken] = await db.select().from(otpTokens).where(
      eq(otpTokens.phone, phone) && 
      eq(otpTokens.code, code) &&
      eq(otpTokens.verified, false)
    ).orderBy(desc(otpTokens.createdAt)).limit(1);
    
    if (!otpToken || otpToken.expiresAt < new Date()) {
      return undefined;
    }
    
    return otpToken;
  }

  async markOtpAsVerified(id: string): Promise<void> {
    await db.update(otpTokens).set({ verified: true }).where(eq(otpTokens.id, id));
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await db.update(otpTokens).set({ attempts: sql`attempts + 1` }).where(eq(otpTokens.id, id));
  }

  // Magic Links
  async createMagicLink(insertMagicLink: InsertMagicLink): Promise<MagicLink> {
    const [magicLink] = await db.insert(magicLinks).values([insertMagicLink]).returning();
    return magicLink;
  }

  async getMagicLink(token: string): Promise<MagicLink | undefined> {
    const [magicLink] = await db.select().from(magicLinks).where(
      eq(magicLinks.token, token)
    );
    
    if (!magicLink || magicLink.expiresAt < new Date() || magicLink.usedAt) {
      return undefined;
    }
    
    return magicLink;
  }

  async markMagicLinkAsUsed(id: string): Promise<void> {
    await db.update(magicLinks).set({ usedAt: new Date() }).where(eq(magicLinks.id, id));
  }

  // Admin Sessions
  async createAdminSession(insertAdminSession: InsertAdminSession): Promise<AdminSession> {
    const [adminSession] = await db.insert(adminSessions).values([insertAdminSession]).returning();
    return adminSession;
  }

  async getValidAdminSession(token: string): Promise<AdminSession | undefined> {
    const [adminSession] = await db.select().from(adminSessions).where(
      eq(adminSessions.token, token)
    );
    
    if (!adminSession || adminSession.expiresAt < new Date()) {
      return undefined;
    }
    
    return adminSession;
  }

  async deleteAdminSession(token: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  // Audit Log
  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const [auditLogEntry] = await db.insert(auditLog).values([insertAuditLog]).returning();
    return auditLogEntry;
  }
}

export const storage = new DatabaseStorage();
