import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { storage } from "./storage";
import { insertServiceSchema, insertUserSchema, insertVehicleSchema, insertBookingSchema, services } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Import new auth schema
import { users as authUsers, type InsertUser as AuthInsertUser } from "@shared/auth-schema";

// Import auth controller
import { authController } from './auth/authController';

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if ((req.session as any).userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

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

  // Advanced Authentication Routes (MFA, Email Verification)
  app.post("/api/auth/enable-mfa", authController.enableMFA.bind(authController));
  app.post("/api/auth/verify-mfa", authController.verifyMFA.bind(authController));
  app.post("/api/auth/disable-mfa", authController.disableMFA.bind(authController));
  app.post("/api/auth/verify-email", authController.verifyEmail.bind(authController));
  app.post("/api/auth/forgot-password", authController.forgotPassword.bind(authController));
  app.post("/api/auth/reset-password", authController.resetPassword.bind(authController));
  app.get("/api/auth/session/validate", authController.validateSession.bind(authController));

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

      console.log('🔍 DEBUG: Checking if user exists with phone:', phone, 'or email:', email);
      // Check if user already exists using new auth schema - search by email first if provided, then by phone
      let existingUser;
      if (email) {
        console.log('🔍 DEBUG: Searching by email:', email);
        const emailResults = await db.select().from(authUsers).where(eq(authUsers.email, email));
        console.log('🔍 DEBUG: Email query results:', emailResults.length);
        [existingUser] = emailResults;
        console.log('🔍 DEBUG: Email search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
      }
      if (!existingUser) {
        console.log('🔍 DEBUG: Searching by phone:', phone);
        const phoneResults = await db.select().from(authUsers).where(eq(authUsers.phone, phone));
        console.log('🔍 DEBUG: Phone query results:', phoneResults.length);
        [existingUser] = phoneResults;
        console.log('🔍 DEBUG: Phone search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
      }
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
        const ext = path.extname(file.originalname).toLowerCase();

        // Validate file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!allowedExtensions.includes(ext)) {
          return cb(new Error('Tipo de archivo no permitido'), '');
        }

        cb(null, `${serviceSlug}-${timestamp}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      // Enhanced validation for image types
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, WebP)'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1 // Only one file per request
    }
  });
  
  // Service image upload route
  app.post('/api/services/upload-image', requireAdmin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer error
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB permitido.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Solo se permite un archivo por solicitud.' });
        }
        return res.status(400).json({ error: 'Error al procesar el archivo.' });
      } else if (err) {
        // Custom error from fileFilter
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo de imagen' });
      }

      const { serviceSlug } = req.body;
      if (!serviceSlug) {
        return res.status(400).json({ error: 'El slug del servicio es requerido' });
      }

      // Validate service exists
      const [existingService] = await db.select()
        .from(services)
        .where(eq(services.slug, serviceSlug))
        .limit(1);

      if (!existingService) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      // Store image path relative to attached_assets
      const imagePath = `service_images/${req.file.filename}`;
      const fullImageUrl = `/attached_assets/${imagePath}`;

      // Update service record with image URL
      const [updatedService] = await db.update(services)
        .set({ imageUrl: fullImageUrl })
        .where(eq(services.slug, serviceSlug))
        .returning();

      if (!updatedService) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Error al actualizar el servicio' });
      }

      console.log(`✅ Imagen subida exitosamente para servicio ${serviceSlug}: ${req.file.filename}`);

      res.json({
        success: true,
        message: 'Imagen subida y servicio actualizado exitosamente',
        imageUrl: fullImageUrl,
        filename: req.file.filename,
        serviceSlug,
        service: updatedService
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      // Clean up uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
    }
  });

  const httpServer = createServer(app);

  // Initialize Socket.IO for real-time updates
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
