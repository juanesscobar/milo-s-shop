import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { storage } from "./storage.js";
import { insertServiceSchema, insertUserSchema, insertVehicleSchema, insertBookingSchema, services, users } from "../shared/schema.js";
import { z } from "zod";

// Import schema from db configuration
import { db } from "./db.js";
import { eq } from "drizzle-orm";

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  console.log('🔍 DEBUG: requireAdmin - Session userId:', (req.session as any).userId);
  console.log('🔍 DEBUG: requireAdmin - Session userRole:', (req.session as any).userRole);

  if (!(req.session as any).userId) {
    console.log('❌ DEBUG: requireAdmin - No userId in session');
    return res.status(401).json({ error: 'Authentication required' });
  }

  if ((req.session as any).userRole !== 'admin') {
    console.log('❌ DEBUG: requireAdmin - User is not admin');
    return res.status(403).json({ error: 'Admin access required' });
  }

  console.log('✅ DEBUG: requireAdmin - Admin access granted');
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('🔧 Registering routes...');

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    const startTime = Date.now();
    console.log("🔍 HEALTH CHECK: Request received from", req.ip);

    try {
      // Basic health check - verify database connection
      const healthCheck: any = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "unknown",
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        cpu: process.cpuUsage(),
        database: "unknown",
        responseTime: 0,
        requestInfo: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          headers: req.headers
        }
      };

      console.log("🔍 HEALTH CHECK: Basic system info collected");

      // Quick DB check (optional - comment out if causing issues)
      try {
        const dbStartTime = Date.now();
        await db.select().from(users).limit(1);
        const dbResponseTime = Date.now() - dbStartTime;
        healthCheck.database = "connected";
        healthCheck.databaseResponseTime = dbResponseTime;
        console.log(`🔍 HEALTH CHECK: Database check successful (${dbResponseTime}ms)`);
      } catch (dbError) {
        console.error("❌ HEALTH CHECK: Database error:", dbError);
        healthCheck.database = "disconnected";
        healthCheck.databaseError = dbError instanceof Error ? dbError.message : String(dbError);
        // Don't fail the entire health check for DB issues unless critical
      }

      // Check if server can handle requests
      try {
        const serverStartTime = Date.now();
        // Simple internal check - see if we can resolve routes
        const routeStack = app._router.stack.length;
        healthCheck.routes = routeStack;
        healthCheck.serverResponseTime = Date.now() - serverStartTime;
        console.log(`🔍 HEALTH CHECK: Server routes check successful (${routeStack} routes)`);
      } catch (serverError) {
        console.error("❌ HEALTH CHECK: Server error:", serverError);
        healthCheck.serverError = serverError instanceof Error ? serverError.message : String(serverError);
      }

      healthCheck.responseTime = Date.now() - startTime;
      console.log(`✅ HEALTH CHECK: Completed successfully in ${healthCheck.responseTime}ms`);

      res.status(200).json(healthCheck);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`❌ HEALTH CHECK: Failed after ${responseTime}ms:`, error);

      res.status(503).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // Services API
  app.get("/api/services", async (req, res) => {
    try {
      const vehicleType = (req.query.vehicleType as string | undefined)?.toLowerCase();
      console.log('🔍 DEBUG: GET /api/services vehicleType:', vehicleType);

      // 1) Intentar cargar desde DB
      let list = await storage.getAllServices();

      // 2) Si DB está vacía en producción, hacer fallback a services.json y sembrar simple
      if (!list || list.length === 0) {
        console.warn('⚠️ No hay servicios en DB. Usando fallback desde services.json');
        try {
          // Resolver ruta del seed JSON en producción o desarrollo
          const candidatePaths = [
            process.env.SERVICES_SEED_JSON_PATH,
            path.join(process.cwd(), 'build', 'server', 'assets', 'services.json'),
            path.join(process.cwd(), 'client', 'src', 'data', 'services.json'),
          ].filter(Boolean) as string[];

          let dataPath: string | null = null;
          for (const p of candidatePaths) {
            try {
              if (fs.existsSync(p)) {
                dataPath = p;
                break;
              }
            } catch {}
          }

          if (!dataPath) {
            throw new Error('Seed services.json not found in any known location');
          }

          console.log('🔍 Fallback usando services.json en:', dataPath);
          const raw = fs.readFileSync(dataPath, 'utf8');
          const json = JSON.parse(raw) as Array<any>;

          const now = new Date();
          const rows = json.map(s => ({
            id: `service_${s.slug}`, // id estable por slug
            slug: s.slug,
            title: s.titleEs ?? s.title ?? s.slug,
            description: s.copyEs ?? s.description ?? '',
            // Guardar JSON string para evitar "[object Object]" en columna text
            prices: JSON.stringify(s.prices) as any,
            durationMin: s.durationMin ?? s.duration ?? null,
            imageUrl: s.imageUrl ?? null,
            active: "true" as any,
            createdAt: now
          }));

          // Intentar insertar; si ya existen, ignorar errores
          try {
            await db.insert(services).values(rows);
            console.log(`✅ Fallback: insertados ${rows.length} servicios en DB`);
          } catch (e) {
            console.warn('⚠️ Fallback insert warning (posibles duplicados):', (e as Error).message);
          }

          // Releer desde DB para mantener formateo consistente
          list = await storage.getAllServices();
        } catch (e) {
          console.error('❌ Fallback services.json error:', e);
          list = [];
        }
      }

      // 3) Filtrar por vehicleType si viene en query: mantener solo los que tienen precio para ese tipo
      if (vehicleType) {
        list = list.filter(s => {
          const prices: any = s.prices || {};
          return prices && prices[vehicleType] != null;
        });
      }

      console.log(`✅ Servicios a responder: ${list.length}`);
      res.json(list);
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

      console.log('✅ Password validation passed');

      // Check if user already exists
      let existingUser;
      if (email) {
        console.log('🔍 DEBUG: Checking by email:', email);
        const emailResults = await db.select().from(users).where(eq(users.email, email));
        [existingUser] = emailResults;
      }
      if (!existingUser) {
        console.log('🔍 DEBUG: Checking by phone:', phone);
        const phoneResults = await db.select().from(users).where(eq(users.phone, phone));
        [existingUser] = phoneResults;
      }

      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        return res.status(409).json({ error: "User with this phone or email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new client user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const userData = {
        id: userId,
        name: name.trim(),
        phone: phone,
        email: email || null,
        password: hashedPassword,
        role: 'client',
        language: 'es',
        isGuest: 'false',
        createdAt: new Date(),
      };

      console.log('🔍 DEBUG: Inserting user data:', { ...userData, password: '[HIDDEN]' });
      await db.insert(users).values(userData);
      console.log('✅ User created successfully with ID:', userId);

      // Create session
      (req.session as any).userId = userId;
      (req.session as any).userRole = 'client';

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = userData;
      res.status(201).json({ user: userWithoutPassword, message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Admin Registration API
  app.post("/api/auth/register/admin", async (req, res) => {
    console.log('POST /api/auth/register/admin called');
    try {
      const { name, companyName, phone, email, password, adminSecret } = req.body || {};

      // Simple gate to evitar registros públicos no autorizados
      const expectedSecret = process.env.ADMIN_SIGNUP_SECRET;
      if (!expectedSecret) {
        console.error('❌ ADMIN_SIGNUP_SECRET no configurado en el servidor');
        return res.status(500).json({ error: "Server misconfiguration: ADMIN_SIGNUP_SECRET not set" });
      }
      if (!adminSecret || adminSecret !== expectedSecret) {
        console.warn('❌ Intento de registro admin bloqueado por secreto inválido');
        return res.status(403).json({ error: "Invalid admin access code" });
      }

      if (!name || !companyName || !phone || !email || !password) {
        console.log('❌ Validation failed: missing required fields');
        return res.status(400).json({ error: "All fields are required for admin registration" });
      }

      if (password.length < 8) {
        console.log('❌ Password validation failed: too short');
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }

      console.log('✅ Password validation passed');

      // Check if user already exists
      let existingUser;
      if (email) {
        const emailResults = await db.select().from(users).where(eq(users.email, email));
        [existingUser] = emailResults;
      }
      if (!existingUser) {
        const phoneResults = await db.select().from(users).where(eq(users.phone, phone));
        [existingUser] = phoneResults;
      }

      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        return res.status(409).json({ error: "User with this phone or email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin user
      const userId = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const userData = {
        id: userId,
        name: name.trim(),
        phone: phone,
        email: email,
        password: hashedPassword,
        role: 'admin',
        language: 'es',
        isGuest: 'false',
        createdAt: new Date(),
      };

      console.log('🔍 DEBUG: Inserting admin user data:', { ...userData, password: '[HIDDEN]' });
      await db.insert(users).values(userData);
      console.log('✅ Admin user created successfully with ID:', userId);

      // Create session
      (req.session as any).userId = userId;
      (req.session as any).userRole = 'admin';

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = userData;
      res.status(201).json({ user: userWithoutPassword, message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({ error: "Failed to register admin" });
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
        const phoneResults = await db.select().from(users).where(eq(users.phone, phone));
        [user] = phoneResults;
        console.log('🔍 DEBUG: Phone search result:', user ? 'FOUND' : 'NOT FOUND');
        if (user) {
          console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, phone: user.phone, hasPassword: !!user.password });
        }
      } else if (email) {
        console.log('🔍 Searching user by email:', email);
        const emailResults = await db.select().from(users).where(eq(users.email, email));
        [user] = emailResults;
        console.log('🔍 DEBUG: Email search result:', user ? 'FOUND' : 'NOT FOUND');
        if (user) {
          console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, email: user.email, hasPassword: !!user.password });
        }
      }

      if (!user) {
        console.log('❌ User not found - Let me check what users exist in DB');
        // DEBUG: List all users to see what's in the database
        const allUsers = await db.select().from(users);
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

      // Find user
      const userResults = await db.select().from(users).where(eq(users.id, (req.session as any).userId));
      const user = userResults[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  // DEBUG: Temporary endpoint to check users in database
  app.get("/api/debug/users", async (req, res) => {
    try {
      console.log('🔍 DEBUG: Testing users schema query');
      const allUsers = await db.select().from(users);
      console.log('🔍 DEBUG: Query successful, found', allUsers.length, 'users');
      console.log('🔍 DEBUG: All users in database:');
      allUsers.forEach((user: any) => {
        console.log(`   - ID: ${user.id}, Name: ${user.name}, Phone: ${user.phone}, Email: ${user.email}, HasPassword: ${!!user.password}`);
      });
      res.json({
        count: allUsers.length,
        users: allUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          role: u.role,
          hasPassword: !!u.password,
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

  // Create user (for booking flow)
  console.log('🔧 Registering POST /api/users route');
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
      // Check if user already exists - search by email first if provided, then by phone
      let existingUser;
      if (email) {
        console.log('🔍 DEBUG: Searching by email:', email);
        const emailResults = await db.select().from(users).where(eq(users.email, email));
        console.log('🔍 DEBUG: Email query results:', emailResults.length);
        [existingUser] = emailResults;
        console.log('🔍 DEBUG: Email search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
      }
      if (!existingUser) {
        console.log('🔍 DEBUG: Searching by phone:', phone);
        const phoneResults = await db.select().from(users).where(eq(users.phone, phone));
        console.log('🔍 DEBUG: Phone query results:', phoneResults.length);
        [existingUser] = phoneResults;
        console.log('🔍 DEBUG: Phone search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
      }
      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        // Return existing user instead of error for booking flow compatibility
        const { password: _, ...userWithoutPassword } = existingUser;
        return res.status(200).json(userWithoutPassword);
      }

      console.log('🔍 DEBUG: Creating new guest user');
      // Create new client user WITHOUT password (for booking flow compatibility)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const userData = {
        id: userId,
        name: name.trim(),
        phone: phone,
        email: email || null,
        password: '', // Empty password for booking flow users (they can't login)
        role: role || 'client',
        language: language || 'es',
        isGuest: 'true',
        createdAt: new Date(),
      };

      console.log('🔍 DEBUG: Inserting user data:', { ...userData, password: '[HIDDEN]' });
      await db.insert(users).values(userData);
      console.log('Created guest user:', userId);

      // Return user without password field
      const { password: _, ...userWithoutPassword } = userData;
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
    console.log('🔍 DEBUG: POST /api/bookings called');
    console.log('🔍 DEBUG: Request body:', req.body);
    console.log('🔍 DEBUG: Headers:', req.headers['content-type']);
    console.log('🔍 DEBUG: Session userId:', (req.session as any).userId);
    console.log('🔍 DEBUG: Session userRole:', (req.session as any).userRole);

    try {
      const bookingData = insertBookingSchema.parse(req.body);
      console.log('✅ DEBUG: Parsed booking data successfully:', bookingData);

      const booking = await storage.createBooking(bookingData);
      console.log('✅ DEBUG: Created booking successfully:', booking);
      res.status(201).json(booking);
    } catch (error) {
      console.error("❌ DEBUG: Error creating booking:", error);
      console.error("❌ DEBUG: Error type:", typeof error);
      console.error("❌ DEBUG: Error stack:", error instanceof Error ? error.stack : 'No stack');
      console.error("❌ DEBUG: Error message:", error instanceof Error ? error.message : String(error));

      if (error instanceof z.ZodError) {
        console.log('❌ DEBUG: Zod validation error:', error.errors);
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      console.log('🔍 DEBUG: GET /api/bookings called');
      console.log('🔍 DEBUG: Session userId:', (req.session as any).userId);
      console.log('🔍 DEBUG: Session userRole:', (req.session as any).userRole);

      // Check authentication
      if (!(req.session as any).userId) {
        console.log('❌ DEBUG: No userId in session');
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log('🔍 DEBUG: Calling storage.getUserBookings with userId:', (req.session as any).userId);
      // Return user bookings
      const userBookings = await storage.getUserBookings((req.session as any).userId);
      console.log('🔍 DEBUG: getUserBookings returned:', userBookings.length, 'bookings');
      console.log('🔍 DEBUG: Bookings data:', JSON.stringify(userBookings, null, 2));

      res.json(userBookings);
    } catch (error) {
      console.error("❌ DEBUG: Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get today's bookings (for admin dashboard)
  app.get("/api/bookings/today", async (req, res) => {
    try {
      console.log("🔍 DEBUG: GET /api/bookings/today called");
      const today = new Date().toISOString().split('T')[0];
      console.log("🔍 DEBUG: Today's date:", today);
      console.log("Fetching today's bookings");
      const bookings = await storage.getTodayBookings();
      console.log(`Found ${bookings.length} bookings for today`);
      console.log('🔍 DEBUG: Today bookings data:', bookings);
      res.json(bookings);
    } catch (error) {
      console.error("❌ DEBUG: Error fetching today's bookings:", error);
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
  app.post('/api/services/upload-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo de imagen' });
      }

      const { serviceSlug } = req.body;
      if (!serviceSlug) {
        return res.status(400).json({ error: 'El slug del servicio es requerido' });
      }

      // Special case: payment capture uploads are not tied to a service
      if (serviceSlug === 'payment-capture') {
        const imagePath = `service_images/${req.file.filename}`;
        const fullImageUrl = `/attached_assets/${imagePath}`;
        console.log(`✅ Payment capture uploaded: ${req.file.filename}`);

        return res.json({
          success: true,
          message: 'Captura de pago subida exitosamente',
          imageUrl: fullImageUrl,
          filename: req.file.filename,
          serviceSlug
        });
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
      console.log('🔍 DEBUG: join-admin event received');
      console.log('🔍 DEBUG: Received authToken:', authToken);
      console.log('🔍 DEBUG: Socket ID:', socket.id);

      // Basic admin auth - in production, use proper JWT or session validation
      const adminToken = process.env.ADMIN_WS_TOKEN || process.env.VITE_ADMIN_WS_TOKEN || 'admin-secret-key';
      console.log('🔍 DEBUG: Expected adminToken:', adminToken);

      if (authToken !== adminToken) {
        console.log('❌ Unauthorized admin access attempt:', socket.id);
        console.log('❌ DEBUG: Token mismatch - received:', authToken, 'expected:', adminToken);
        socket.emit('auth-error', 'Invalid admin token');
        return;
      }

      console.log('✅ Admin joined successfully:', socket.id);
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

