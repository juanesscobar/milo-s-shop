import { 
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Service, type InsertService,
  type Booking, type InsertBooking,
  type Payment, type InsertPayment,
  users, vehicles, services, bookings, payments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface for Milos'Shop
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string): Promise<Payment | undefined>;
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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Vehicles
  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(insertVehicle).returning();
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
    const [service] = await db.insert(services).values(insertService).returning();
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

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
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
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment | undefined> {
    const [payment] = await db.update(payments)
      .set({ status: status as any })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }
}

export const storage = new DatabaseStorage();
