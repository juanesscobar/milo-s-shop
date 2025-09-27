<<<<<<< HEAD
/**
 * Archivo principal del servidor Milos-Shop
 *
 * Este archivo configura y inicia el servidor Express.js que maneja tanto la API REST
 * como el servicio de archivos estáticos del frontend. Incluye middlewares de seguridad,
 * compresión, rate limiting y configuración de sesiones.
 */

import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
=======
import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
>>>>>>> 9c8b4b8 (version milos-shop, con login cliente funcionando y panel de admin sin registro y login, funcionando)
import path from 'path';
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import bodyParser from 'body-parser';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Add profiling integration
    nodeProfilingIntegration(),
    // Add Express integration
    Sentry.expressIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

const app = express();

<<<<<<< HEAD
// Configure compression middleware
app.use(compression());

// Configure security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Demasiados intentos de autenticación, por favor intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/', authLimiter);

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'milos-shop-secret-key',
=======
// Debug middleware to log raw request data
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/api')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      console.log('Raw request data:', data);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Content-Length:', req.headers['content-length']);
      try {
        const parsed = JSON.parse(data);
        console.log('Manual JSON.parse successful:', parsed);
      } catch (e) {
        console.log('Manual JSON.parse failed:', (e as Error).message);
      }
    });
  }
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

// Remove raw parser to allow json parser to work

// Debug middleware to log parsed request body
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/api')) {
    console.log('Parsed request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
  }
  next();
});

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
>>>>>>> 9c8b4b8 (version milos-shop, con login cliente funcionando y panel de admin sin registro y login, funcionando)
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
<<<<<<< HEAD
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
=======
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
>>>>>>> 9c8b4b8 (version milos-shop, con login cliente funcionando y panel de admin sin registro y login, funcionando)

// Serve static files from attached_assets directory BEFORE other routes
const attachedAssetsPath = path.join(process.cwd(), 'attached_assets');
app.use('/attached_assets', express.static(attachedAssetsPath));

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
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
<<<<<<< HEAD

    // Capture error with Sentry
    Sentry.captureException(err);

    res.status(status).json({ message });
    throw err;
=======
  
    console.error(`Error in ${req.method} ${req.path}:`, err);
  
    // Ensure API routes always return JSON
    if (req.path.startsWith('/api')) {
      console.error(`API Error on ${req.path}:`, err);
      if (!res.headersSent) {
        res.status(status).json({ error: message, details: err.stack });
      }
    } else {
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    }
    // Don't throw err to prevent it from reaching Vite catch-all
>>>>>>> 9c8b4b8 (version milos-shop, con login cliente funcionando y panel de admin sin registro y login, funcionando)
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Global error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error no manejado:', err);

    // Capture error with Sentry
    Sentry.captureException(err);

    // Don't leak error details in production
    const isDevelopment = app.get("env") === "development";

    res.status(err.status || err.statusCode || 500).json({
      error: isDevelopment ? err.message : 'Error interno del servidor',
      ...(isDevelopment && { stack: err.stack })
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    Sentry.captureException(err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    Sentry.captureException(reason);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    server.close(() => {
      console.log('Servidor cerrado');
      process.exit(0);
    });
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5001 for testing if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
<<<<<<< HEAD
  const port = parseInt(process.env.PORT || '5001', 10);
  server.listen(port, "0.0.0.0", () => {
=======
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
>>>>>>> 9c8b4b8 (version milos-shop, con login cliente funcionando y panel de admin sin registro y login, funcionando)
    log(`serving on port ${port}`);
  });
})();
