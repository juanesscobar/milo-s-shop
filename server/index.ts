import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
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
console.log('🚀 Iniciando servidor Milo\'s Shop...');
console.log('📋 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);

// IMPORTANT: Body parsers MUST come before any middleware that reads the request stream
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

// Debug middleware to log parsed request body (AFTER body parsers)
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/api')) {
    console.log('📝 POST request to:', req.path);
    console.log('📊 Parsed request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    
    // For multipart/form-data, body will be handled by multer later
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('📤 Multipart data detected - will be processed by multer');
    }
  }
  next();
});

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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
  console.log('🔧 Registrando rutas...');
  const server = await registerRoutes(app);
  console.log('✅ Rutas registradas exitosamente');

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

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
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
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
  // Other ports are firewalled. Default to 3000 for testing if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  console.log(`🌐 Intentando escuchar en puerto ${port} en 0.0.0.0`);
  server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Servidor escuchando en puerto ${port}`);
    log(`serving on port ${port}`);
  });
})();
