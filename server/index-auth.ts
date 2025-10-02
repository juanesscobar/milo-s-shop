import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import path from 'path';
import { setupVite, serveStatic, log } from "./vite.js";
import helmet from 'helmet';
import cors from 'cors';

// Import new authentication system
import { createAuthRoutes } from './auth/authRoutes.js';
import {
  securityHeaders,
  securityLogger,
  sanitizeInput,
  rateLimitMiddleware
} from './auth/authMiddleware.js';

// Import existing functionality
import { registerRoutes } from "./routes.js";

/**
 * Production-ready Express server with comprehensive authentication system
 * Implements security best practices, rate limiting, session management, and logging
 */

const app = express();
const isDevelopment = app.get("env") === "development";

console.log('🚀 Starting Milos Shop Server with Authentication System...');

// =============================================
// SECURITY MIDDLEWARE (Applied First)
// =============================================

// Basic security headers
app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Custom security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: isDevelopment ? true : process.env.FRONTEND_URL || false,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

// Rate limiting for general requests (more permissive in development)
const rateLimitConfig = isDevelopment ? {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs in development
  message: {
    error: 'Demasiadas solicitudes',
    details: 'Inténtalo de nuevo en 15 minutos'
  }
} : {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Demasiadas solicitudes',
    details: 'Inténtalo de nuevo en 15 minutos'
  }
};

app.use(rateLimitMiddleware(rateLimitConfig));

// Security logging
app.use(securityLogger);

// =============================================
// BODY PARSING AND REQUEST PROCESSING
// =============================================

// Input sanitization
app.use(sanitizeInput);

// Body parsing with security limits
app.use(express.json({
  limit: '10mb',
  verify: (req: express.Request, res, buf) => {
    // Log raw request data for debugging (development only)
    if (isDevelopment && req.method === 'POST' && req.path.startsWith('/api/auth')) {
      console.log('🔍 Raw request data:', buf.toString());
      console.log('🔍 Content-Type:', req.headers['content-type']);
      console.log('🔍 Content-Length:', req.headers['content-length']);
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Request body logging (development only)
if (isDevelopment) {
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.path.startsWith('/api/auth')) {
      console.log('🔍 Parsed request body:', req.body);
    }
    next();
  });
}

// =============================================
// SESSION CONFIGURATION
// =============================================

// Production-ready session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'milos-shop-secret-change-in-production',
  name: 'milos.session', // Custom session name
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiration on activity
  cookie: {
    secure: !isDevelopment, // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // CSRF protection
  },
  // In production, use a proper session store (Redis, MongoDB, etc.)
  // store: new RedisStore({ client: redisClient })
}));

// =============================================
// API RESPONSE LOGGING
// =============================================

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Add response preview for debugging
      if (capturedJsonResponse && isDevelopment) {
        const responsePreview = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${responsePreview.length > 100 ? 
          responsePreview.slice(0, 97) + "..." : 
          responsePreview}`;
      }

      // Color coding for different status codes
      if (res.statusCode >= 400) {
        console.log(`❌ ${logLine}`);
      } else if (res.statusCode >= 300) {
        console.log(`⚠️ ${logLine}`);
      } else {
        console.log(`✅ ${logLine}`);
      }
    }
  });

  next();
});

// =============================================
// ROUTES SETUP
// =============================================

async function setupRoutes() {
  try {
    // Mount authentication routes
    console.log('🔐 Setting up authentication routes...');
    app.use('/api/auth', createAuthRoutes());

    // Mount existing application routes
    console.log('📚 Setting up application routes...');
    const server = await registerRoutes(app);

    // Serve static files from attached_assets directory
    const attachedAssetsPath = path.join(process.cwd(), 'attached_assets');
    app.use('/attached_assets', express.static(attachedAssetsPath, {
      maxAge: isDevelopment ? 0 : '1d', // Cache in production
      etag: true,
    }));

    console.log('✅ All routes configured successfully');
    return server;

  } catch (error) {
    console.error('❌ Error setting up routes:', error);
    throw error;
  }
}

// =============================================
// ERROR HANDLING
// =============================================

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Log error with context
  console.error(`❌ Error in ${req.method} ${req.path}:`, {
    error: message,
    status,
    stack: isDevelopment ? err.stack : undefined,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.session?.userId || 'Anonymous'
  });

  // Don't expose internal errors in production
  const clientMessage = status === 500 && !isDevelopment ? 
    'Error interno del servidor' : message;

  // Always return JSON for API routes
  if (req.path.startsWith('/api')) {
    if (!res.headersSent) {
      res.status(status).json({ 
        error: clientMessage,
        details: isDevelopment ? err.stack : undefined
      });
    }
  } else {
    if (!res.headersSent) {
      res.status(status).json({ message: clientMessage });
    }
  }
});

// =============================================
// SERVER INITIALIZATION
// =============================================

(async () => {
  try {
    console.log('🔧 Initializing server...');
    
    const server = await setupRoutes();

    // Setup development/production environment
    if (isDevelopment) {
      console.log('🔧 Setting up Vite development server...');
      await setupVite(app, server);
    } else {
      console.log('🔧 Setting up static file serving for production...');
      serveStatic(app);
    }

    // Start the server
    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen(port, () => {
      console.log('🎉 Server started successfully!');
      console.log(`🌐 Server running on port ${port}`);
      console.log(`🔗 Environment: ${isDevelopment ? 'development' : 'production'}`);
      console.log(`🔐 Authentication system: ENABLED`);
      console.log(`🛡️ Security features: ENABLED`);
      console.log(`⚡ Rate limiting: ACTIVE`);
      console.log(`📝 Request logging: ACTIVE`);
      console.log('─'.repeat(50));
      
      if (isDevelopment) {
        console.log('🔧 Development mode features:');
        console.log('  • Detailed request/response logging');
        console.log('  • CORS enabled for all origins');
        console.log('  • Hot module replacement via Vite');
        console.log('  • Session cookies over HTTP');
        console.log('─'.repeat(50));
        console.log('📋 Test credentials available in seed data');
        console.log('🔗 Access: http://localhost:' + port);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// =============================================
// GRACEFUL SHUTDOWN
// =============================================

process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});