import {
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Service, type InsertService,
  type Booking, type InsertBooking,
  users, vehicles, services, bookings
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// Simplified Storage interface for authentication testing
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;

  // Vehicles
  getUserVehicles(userId: string): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;

  // Bookings
  getUserBookings(userId: string): Promise<Booking[]>;
  getTodayBookings(): Promise<Booking[]>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

// Simplified Database storage implementation for authentication testing
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    console.log('🔍 DEBUG: Creating user with data:', insertUser);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      id: userId,
      name: insertUser.name,
      phone: insertUser.phone,
      email: insertUser.email || null,
      password: (insertUser as any).password || null,
      role: insertUser.role || "client",
      language: insertUser.language || "es",
      isGuest: String(insertUser.isGuest || "true"),
      createdAt: new Date()
    };
    console.log('🔍 DEBUG: User data to insert:', { ...userData, password: userData.password ? '[HIDDEN]' : 'null' });
    await db.insert(users).values(userData);
    console.log('✅ User created successfully with ID:', userId);
    return userData as User;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    const result = await db.select().from(services).where(eq(services.active, "true"));
    console.log('getAllServices result:', result.length, 'services');
    
    // Parse prices from JSON string to object if needed
    return result.map(service => {
      let parsedPrices = service.prices;
      
      // If prices is a string and looks like JSON, parse it
      if (typeof service.prices === 'string') {
        try {
          const pricesStr = service.prices;
          // Check if it's a JSON string (starts with { or [)
          if (pricesStr.trim().startsWith('{') || pricesStr.trim().startsWith('[')) {
            parsedPrices = JSON.parse(pricesStr) as any;
          }
        } catch (e) {
          console.warn('Failed to parse prices for service', service.id, ':', e);
        }
      }
      
      return {
        ...service,
        prices: parsedPrices
      };
    });
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  // Vehicles
  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.userId, userId));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const vehicleId = `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const vehicleData = {
      id: vehicleId,
      userId: insertVehicle.userId,
      plate: insertVehicle.plate,
      type: insertVehicle.type,
      createdAt: new Date()
    };
    await db.insert(vehicles).values([vehicleData]);
    return vehicleData as Vehicle;
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

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings)
      .set({ status })
      .where(eq(bookings.id, bookingId))
      .returning();
    return updatedBooking || undefined;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bookingData = {
      id: bookingId,
      userId: insertBooking.userId,
      vehicleId: insertBooking.vehicleId,
      serviceId: insertBooking.serviceId,
      date: insertBooking.date,
      timeSlot: insertBooking.timeSlot,
      price: insertBooking.price,
      status: insertBooking.status || "waiting",
      paymentMethod: insertBooking.paymentMethod,
      paymentCaptureUrl: insertBooking.paymentCaptureUrl,
      notes: insertBooking.notes,
      createdAt: new Date()
    };
    await db.insert(bookings).values([bookingData]);
    return bookingData as Booking;
  }
}

export const storage = new DatabaseStorage();
