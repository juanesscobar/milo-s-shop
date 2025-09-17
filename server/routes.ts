import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServiceSchema, insertUserSchema, insertVehicleSchema, insertBookingSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Services API
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Users API
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists by phone - return existing user if found
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(200).json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Vehicles API
  app.get("/api/users/:userId/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getUserVehicles(req.params.userId);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid vehicle data", details: error.errors });
      }
      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getTodayBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/today", async (req, res) => {
    try {
      const bookings = await storage.getTodayBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      res.status(500).json({ error: "Failed to fetch today's bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Validate that service exists and get pricing
      const service = await storage.getService(bookingData.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Validate that vehicle exists and belongs to user
      const vehicles = await storage.getUserVehicles(bookingData.userId);
      const vehicle = vehicles.find(v => v.id === bookingData.vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found or does not belong to user" });
      }
      
      // Validate price matches service pricing for vehicle type
      const expectedPrice = service.prices[vehicle.type];
      if (!expectedPrice || bookingData.price !== expectedPrice) {
        return res.status(400).json({ 
          error: "Price mismatch", 
          expected: expectedPrice, 
          provided: bookingData.price 
        });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !["waiting", "washing", "done", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // Payments API
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      
      // Verify booking exists before creating payment
      const booking = await storage.getBooking(paymentData.bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment data", details: error.errors });
      }
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  app.patch("/api/payments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !["pending", "paid", "failed"].includes(status)) {
        return res.status(400).json({ error: "Invalid payment status" });
      }
      
      const payment = await storage.updatePaymentStatus(req.params.id, status);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Failed to update payment status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
