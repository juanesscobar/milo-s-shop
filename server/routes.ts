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
import bcrypt from 'bcrypt';
import { storage } from "./storage";
import { insertServiceSchema, insertUserSchema, insertVehicleSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { ImageOptimizer } from './imageOptimizer';
import { db } from "./db";
import { eq } from "drizzle-orm";

// Import new auth schema
import { users as authUsers, type InsertUser as AuthInsertUser } from "@shared/auth-schema";

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

  // Client Authentication API
  app.post("/api/auth/register", async (req, res) => {
    console.log('POST /api/auth/register called with body:', req.body);
    console.log('🔍 DEBUG: Password validation check');
    try {
      const { name, phone, email, password } = req.body;

      if (!name || !phone || !password) {
        console.log('❌ Validation failed: missing required fields');
        return res.status(400).json({ error: "Name, phone and password are required" });
      }

      // DEBUG: Log password details
      console.log('🔍 DEBUG: Password length:', password.length);
      console.log('🔍 DEBUG: Password value:', password);

      // Validate password strength - TEMPORARILY RELAXED FOR TESTING
      if (password.length < 6) {
        console.log('❌ Password validation failed: too short (minimum 6 for testing)');
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      // TEMPORARILY DISABLED strict validation for testing
      /*
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasNumber = /\d/.test(password);
      if (!hasSpecialChar || !hasNumber) {
        console.log('❌ Password validation failed: missing special char or number');
        return res.status(400).json({ error: "Password must contain at least one special character and one number" });
      }
      */
      console.log('✅ Password validation passed');

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        console.log('User already exists with phone:', phone);
        return res.status(409).json({ error: "User with this phone already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new client user
      const userData = {
        name,
        phone,
        email: email || null,
        password: hashedPassword,
        role: 'client' as const,
        isGuest: false
      };

      const user = await storage.createUser(userData);

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    console.log('POST /api/auth/login called with body:', req.body);
    console.log('🔍 DEBUG: Login attempt analysis');
    try {
      const { phone, email, password } = req.body;

      if ((!phone && !email) || !password) {
        console.log('❌ Validation failed: missing phone/email or password');
        return res.status(400).json({ error: "Phone/email and password are required" });
      }

      // DEBUG: Log search criteria
      console.log('🔍 DEBUG: Search criteria - phone:', phone, 'email:', email);

      // Find user by phone or email
      let user;
      if (phone) {
        console.log('🔍 Searching user by phone:', phone);
        user = await storage.getUserByPhone(phone);
        console.log('🔍 DEBUG: Phone search result:', user ? 'FOUND' : 'NOT FOUND');
        if (user) {
          console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, phone: user.phone, hasPassword: !!user.password });
        }
      } else if (email) {
        console.log('🔍 Searching user by email:', email);
        user = await storage.getUserByEmail(email);
        console.log('🔍 DEBUG: Email search result:', user ? 'FOUND' : 'NOT FOUND');
        if (user) {
          console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, email: user.email, hasPassword: !!user.password });
        }
      }

      if (!user) {
        console.log('❌ User not found - Let me check what users exist in DB');
        // DEBUG: List all users to see what's in the database
        const allUsers = await db.select().from(authUsers);
        console.log('🔍 DEBUG: All users in database:', allUsers.map((u: any) => ({ id: u.id, name: u.name, phone: u.phone, email: u.email })));
        return res.status(404).json({ error: "User not found" });
      }

      console.log('User found:', user.id);

      // Check password
      if (!user.password) {
        return res.status(400).json({ error: "Password authentication required" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "Login successful" });
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
      if (!(req.session as any).userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser((req.session as any).userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: user });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  // DEBUG: Temporary endpoint to check users in database
  app.get("/api/debug/users", async (req, res) => {
    try {
      console.log('🔍 DEBUG: Testing authUsers schema query');
      const allUsers = await db.select().from(authUsers);
      console.log('🔍 DEBUG: Query successful, found', allUsers.length, 'users');
      console.log('🔍 DEBUG: All users in database:');
      allUsers.forEach((user: any) => {
        console.log(`   - ID: ${user.id}, Name: ${user.name}, Phone: ${user.phone}, Email: ${user.email}, HasPassword: ${!!user.passwordHash}`);
      });
      res.json({
        count: allUsers.length,
        users: allUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          role: u.role,
          hasPassword: !!u.passwordHash,
          createdAt: u.createdAt
        }))
      });
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack');
      res.status(500).json({ error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Create user (for booking flow) - UPDATED FOR NEW AUTH SYSTEM
  app.post("/api/users", async (req, res) => {
    console.log('POST /api/users called with body:', req.body);
    console.log('Headers:', req.headers['content-type']);
    try {
      const { name, phone, email, language, role } = req.body;

      if (!name || !phone) {
        console.log('Validation failed: name or phone missing');
        return res.status(400).json({ error: "Name and phone are required" });
      }

      console.log('🔍 DEBUG: Checking if user exists with phone:', phone);
      // Check if user already exists using new auth schema
      const [existingUser] = await db.select().from(authUsers).where(eq(authUsers.phone, phone));
      console.log('🔍 DEBUG: Existing user query result:', existingUser ? 'FOUND' : 'NOT FOUND');
      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        // Return existing user instead of error for booking flow compatibility
        const { passwordHash: _, ...userWithoutPassword } = existingUser;
        return res.status(200).json(userWithoutPassword);
      }

      console.log('🔍 DEBUG: Creating new guest user');
      // Create new client user WITHOUT password (for booking flow compatibility)
      // In production, users should register through /api/auth/register
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const userData = {
        id: userId,
        name: name.trim(),
        phone: phone,
        email: email || null,
        passwordHash: '', // Empty password hash for booking flow users (they can't login)
        role: (role as 'client' | 'admin') || 'client',
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('🔍 DEBUG: Inserting user data:', { ...userData, passwordHash: '[HIDDEN]' });
      await db.insert(authUsers).values(userData);
      console.log('Created guest user:', userId);

      // Return user without password field
      const { passwordHash: _, ...userWithoutPassword } = userData;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("❌ Error creating user:", error);
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack');
      console.error("❌ Error message:", error instanceof Error ? error.message : String(error));
      res.status(500).json({ error: "Failed to create user", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Create vehicle (for booking flow)
  app.post("/api/vehicles", async (req, res) => {
    console.log('POST /api/vehicles called with body:', req.body);
    console.log('Headers:', req.headers['content-type']);
    try {
      const { userId, plate, type } = req.body;

      if (!userId || !plate || !type) {
        console.log('Validation failed: userId, plate or type missing');
        return res.status(400).json({ error: "User ID, plate and type are required" });
      }

      const vehicleData = {
        userId,
        plate,
        type
      };

      const vehicle = await storage.createVehicle(vehicleData);
      console.log('Created vehicle:', vehicle);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      console.error("Error type:", typeof error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      res.status(500).json({ error: "Failed to create vehicle", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Bookings API
  app.post("/api/bookings", async (req, res) => {
    console.log('POST /api/bookings called with body:', req.body);
    console.log('Headers:', req.headers['content-type']);
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      console.log('Parsed booking data:', bookingData);
      const booking = await storage.createBooking(bookingData);
      console.log('Created booking:', booking);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      console.error("Error type:", typeof error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      if (error instanceof z.ZodError) {
        console.log('Zod validation error:', error.errors);
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      // Check authentication
      if (!(req.session as any).userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Return user bookings
      const userBookings = await storage.getUserBookings((req.session as any).userId);
      res.json(userBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get today's bookings (for admin dashboard)
  app.get("/api/bookings/today", async (req, res) => {
    try {
      console.log("Fetching today's bookings");
      const bookings = await storage.getTodayBookings();
      console.log(`Found ${bookings.length} bookings for today`);
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

      // Emit real-time update to admin dashboard
      if (app.locals.io) {
        app.locals.io.to('admin').emit('new-booking', {
          booking: booking,
          message: `Nueva reserva creada para hoy a las ${booking.timeSlot}`
        });
        console.log('New booking notification sent to admin:', booking.id);
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

  // Update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(`Updating booking ${id} status to ${status}`);

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const updatedBooking = await storage.updateBookingStatus(id, status);
      if (!updatedBooking) {
        console.log(`Booking ${id} not found`);
        return res.status(404).json({ error: "Booking not found" });
      }

      console.log(`Booking ${id} status updated successfully`);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
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
