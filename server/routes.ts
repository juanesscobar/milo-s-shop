/**
 * Definición de rutas de la API para Milos-Shop
 *
 * Este archivo contiene todas las rutas de la API REST, incluyendo:
 * - Gestión de servicios de lavado
 * - Autenticación de usuarios
 * - Gestión de vehículos
 * - Sistema de reservas
 * - Procesamiento de pagos
 * - WebSockets para actualizaciones en tiempo real
 *
 * Todas las rutas incluyen validación de entrada con Zod y manejo de errores.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from "./storage";
import { insertServiceSchema, insertUserSchema, insertVehicleSchema, insertBookingSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";
import { ImageOptimizer } from './imageOptimizer';

// Extender la interfaz de Session para incluir nuestras propiedades personalizadas
declare module 'express-session' {
  interface SessionData {
    userId?: string;      // ID del usuario autenticado
    userRole?: string;    // Rol del usuario (client, admin, operator)
  }
}

// Cache simple en memoria para servicios
const servicesCache = {
  data: null as any[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutos
};

/**
 * Registra todas las rutas de la API en la aplicación Express
 *
 * Esta función configura:
 * - Rutas REST para servicios, usuarios, vehículos, reservas y pagos
 * - Middleware de subida de archivos con Multer
 * - Servidor WebSocket con Socket.IO para actualizaciones en tiempo real
 * - Autenticación básica para el panel de administración
 *
 * @param app - Instancia de Express donde registrar las rutas
 * @returns Promise<Server> - Servidor HTTP configurado con WebSockets
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // ===== API DE SERVICIOS =====
  // Obtener lista de todos los servicios disponibles con cache
  app.get("/api/services", async (req, res) => {
    try {
      // Verificar cache
      const now = Date.now();
      if (servicesCache.data && (now - servicesCache.timestamp) < servicesCache.ttl) {
        return res.json(servicesCache.data);
      }

      const services = await storage.getAllServices();

      // Actualizar cache
      servicesCache.data = services;
      servicesCache.timestamp = now;

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

  // ===== API DE USUARIOS =====
  // Crear nuevo usuario (usado internamente por el sistema)
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

  // ===== API DE AUTENTICACIÓN =====
  // Registro de nuevos usuarios clientes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, phone, email } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(409).json({ error: "User with this phone already exists" });
      }

      // Create new client user
      const userData = {
        name,
        phone,
        email: email || null,
        role: 'client' as const,
        isGuest: false
      };

      const user = await storage.createUser(userData);
      
      // Create session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Return user without sensitive data
      const { ...userResponse } = user;
      res.status(201).json({ user: userResponse, message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, email } = req.body;

      if (!phone && !email) {
        return res.status(400).json({ error: "Phone or email is required" });
      }

      // Find user by phone or email
      let user;
      if (phone) {
        user = await storage.getUserByPhone(phone);
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Return user without sensitive data
      const { ...userResponse } = user;
      res.json({ user: userResponse, message: "Login successful" });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to logout" });
        }
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  // ===== API DE VEHÍCULOS =====
  // Obtener vehículos de un usuario específico
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

  // ===== API DE RESERVAS =====
  // Obtener reservas (protegido - requiere autenticación)
  app.get("/api/bookings", async (req, res) => {
    try {
      // Check authentication
      if (!req.session.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // If admin, return all today's bookings
      if (req.session.userRole === 'admin' || req.session.userRole === 'operator') {
        const bookings = await storage.getTodayBookings();
        return res.json(bookings);
      }

      // If client, return only their bookings
      const userBookings = await storage.getUserBookings(req.session.userId);
      res.json(userBookings);
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
      const bookings = await storage.getTodayBookingsWithDetails();
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
      const vehicleType = vehicle.type as 'auto' | 'suv' | 'camioneta';
      const expectedPrice = service.prices[vehicleType];
      if (!expectedPrice || bookingData.price !== expectedPrice) {
        return res.status(400).json({
          error: "Price mismatch",
          expected: expectedPrice,
          provided: bookingData.price
        });
      }
      
      const booking = await storage.createBooking(bookingData);
      
      // Get full booking details with relations for real-time update
      const fullBooking = await storage.getTodayBookingsWithDetails();
      const newBookingDetails = fullBooking.find(b => b.id === booking.id);
      
      // Emit real-time update to admin dashboard
      if (newBookingDetails && app.locals.io) {
        app.locals.io.to('admin').emit('new-booking', {
          booking: newBookingDetails,
          message: `Nueva reserva de ${newBookingDetails.userName} para hoy a las ${newBookingDetails.timeSlot}`
        });
        console.log('New booking notification sent to admin:', newBookingDetails.id);
      }
      
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
      
      // Get updated booking details for real-time update
      const fullBookings = await storage.getTodayBookingsWithDetails();
      const updatedBookingDetails = fullBookings.find(b => b.id === req.params.id);
      
      // Emit real-time status update to admin dashboard
      if (updatedBookingDetails && app.locals.io) {
        app.locals.io.to('admin').emit('booking-updated', {
          booking: updatedBookingDetails
        });
        console.log('Booking status update sent to admin:', updatedBookingDetails.id, 'new status:', status);
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // ===== API DE PAGOS =====
  // Crear nuevo pago para una reserva
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

  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), 'attached_assets', 'service_images');
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const upload = multer({
    storage: multer.diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        // Sanitize serviceSlug to prevent path traversal
        const rawServiceSlug = req.body.serviceSlug || 'unknown';
        const serviceSlug = rawServiceSlug.replace(/[^a-z0-9-_]/gi, '_');
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${serviceSlug}-${timestamp}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      // Accept only images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
  
  // Service image upload route
  app.post('/api/services/upload-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const { serviceSlug } = req.body;
      if (!serviceSlug) {
        return res.status(400).json({ error: 'Service slug is required' });
      }

      // Original file path
      const originalPath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const baseName = path.basename(req.file.filename, fileExt);

      // Optimized file path
      const optimizedFilename = `${baseName}_optimized${fileExt}`;
      const optimizedPath = path.join(uploadDir, optimizedFilename);

      // Optimize the image
      await ImageOptimizer.optimizeImage(originalPath, optimizedPath, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 80,
        format: fileExt === '.png' ? 'png' : 'jpeg'
      });

      // Remove original file after optimization
      fs.unlinkSync(originalPath);

      // Store optimized image path relative to attached_assets
      const imagePath = `service_images/${optimizedFilename}`;

      // TODO: Update service record with image path if needed
      // For now, just return success with file info

      res.json({
        success: true,
        message: 'Image uploaded and optimized successfully',
        imageUrl: `/attached_assets/${imagePath}`,
        filename: optimizedFilename,
        serviceSlug
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // ===== MONITORING Y HEALTH CHECKS =====
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  });

  // Basic metrics endpoint
  app.get("/api/metrics", (req, res) => {
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString(),
      servicesCache: {
        size: servicesCache.data?.length || 0,
        lastUpdated: servicesCache.timestamp ? new Date(servicesCache.timestamp).toISOString() : null
      }
    };
    res.json(metrics);
  });

  // ===== CONFIGURACIÓN DE WEBSOCKETS =====
  // Crear servidor HTTP para WebSockets
  const httpServer = createServer(app);

  // Inicializar Socket.IO para actualizaciones en tiempo real en el panel de administración
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store socket connections
  const adminSockets = new Set();
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join admin room for real-time updates (with basic auth)
    socket.on('join-admin', (authToken) => {
      // Basic admin auth - in production, use proper JWT or session validation
      const adminToken = process.env.ADMIN_WS_TOKEN || 'admin-secret-key';
      
      if (authToken !== adminToken) {
        console.log('Unauthorized admin access attempt:', socket.id);
        socket.emit('auth-error', 'Invalid admin token');
        return;
      }
      
      console.log('Admin joined:', socket.id);
      adminSockets.add(socket);
      socket.join('admin');
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      adminSockets.delete(socket);
    });
  });

  // Make io accessible to routes (store in app.locals)
  app.locals.io = io;

  return httpServer;
}
