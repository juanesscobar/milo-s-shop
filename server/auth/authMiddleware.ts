import rateLimit from 'express-rate-limit';
import { authService } from './authService.js';
import express from 'express';

/**
 * AuthMiddleware - Security middleware for authentication system
 * Implements rate limiting, CSRF protection, and session validation
 */

/**
 * Rate limit configuration options
 */
interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: {
    error: string;
    details: string;
  };
}

/**
 * Rate limiting middleware factory
 * @param options Rate limit configuration
 */
export function rateLimitMiddleware(options: RateLimitOptions) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req: express.Request, res: express.Response) {
      console.log(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json(options.message);
    },
    skip: function (req: express.Request) {
      // Skip rate limiting for certain conditions if needed
      // For example, skip for admin users in production
      return false;
    }
  });
}

/**
 * Authentication middleware - validates user session
 */
export async function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  console.log('🔐 AuthMiddleware: Validating authentication');

  try {
    const userId = req.session?.userId;
    const userRole = req.session?.userRole;

    if (!userId || !userRole) {
      console.log('❌ AuthMiddleware: No valid session found');
      res.status(401).json({
        error: 'No autenticado',
        details: 'Sesión requerida para acceder a este recurso'
      });
      return;
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      console.log('❌ AuthMiddleware: User not found in database:', userId);
      // Destroy invalid session
      req.session.destroy((err) => {
        if (err) console.error('Error destroying invalid session:', err);
      });
      res.status(401).json({
        error: 'Usuario no encontrado',
        details: 'La sesión es inválida'
      });
      return;
    }

    // Attach user info to request for use in controllers
    (req as any).user = user;
    (req as any).userId = userId;
    (req as any).userRole = userRole;

    console.log('✅ AuthMiddleware: Authentication successful for user:', userId);
    next();
  } catch (error) {
    console.error('❌ AuthMiddleware: Error during authentication:', error);
    res.status(500).json({
      error: 'Error de autenticación',
      details: 'Error interno del servidor'
    });
  }
}

/**
 * Optional authentication middleware - allows both authenticated and guest users
 */
export async function optionalAuthMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) return next();

  try {
    const user = await authService.getUserById(userId);
    if (user) {
      (req as any).user = user;
      (req as any).userId = userId;
      (req as any).userRole = req.session?.userRole;
      console.log('✅ OptionalAuth: User authenticated:', userId);
    }
  } catch (error) {
    console.log('⚠️ OptionalAuth: Error validating user:', error);
  }

  next();
}

/**
 * CSRF Protection Middleware
 * Simple CSRF token validation for critical operations
 */
export function csrfProtection(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromSession = req.session?.csrfToken;

  if (!tokenFromHeader || !tokenFromSession) {
    console.log('❌ CSRF: Missing CSRF token');
    res.status(403).json({
      error: 'Token CSRF requerido',
      details: 'Solicitud rechazada por seguridad'
    });
    return;
  }

  if (tokenFromHeader !== tokenFromSession) {
    console.log('❌ CSRF: Invalid CSRF token');
    res.status(403).json({
      error: 'Token CSRF inválido',
      details: 'Solicitud rechazada por seguridad'
    });
    return;
  }

  console.log('✅ CSRF: Token validation successful');
  next();
}

/**
 * Generate and set CSRF token for session
 */
export function generateCSRFToken(req: express.Request): string {
  const token = `csrf_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  if (req.session) {
    req.session.csrfToken = token;
  }
  return token;
}

/**
 * Security headers middleware
 */
export function securityHeaders(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Remove server information
  res.removeHeader('X-Powered-By');
  next();
}

/**
 * Request logging middleware for security audit
 */
export function securityLogger(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const userId = req.session?.userId || 'Anonymous';

  console.log(`🔍 [${new Date().toISOString()}] ${method} ${url} - IP: ${ip} - User: ${userId} - UserAgent: ${userAgent}`);

  // Log response details
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    if (statusCode >= 400) {
      console.log(`⚠️ [${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userId}`);
    } else {
      console.log(`✅ [${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userId}`);
    }
  });

  next();
}

/**
 * Input sanitization middleware
 */
export function sanitizeInput(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.body && typeof req.body === 'object') {
    // Basic sanitization - trim strings and remove potential XSS
    const sanitizeObject = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
          // Remove potentially dangerous characters
          obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
      return obj;
    };
    req.body = sanitizeObject(req.body);
  }
  next();
}