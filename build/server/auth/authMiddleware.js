var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import rateLimit from 'express-rate-limit';
import { authService } from './authService';
/**
 * AuthMiddleware - Security middleware for authentication system
 * Implements rate limiting, CSRF protection, and session validation
 */
/**
 * Rate limiting middleware factory
 * @param options Rate limit configuration
 */
export function rateLimitMiddleware(options) {
    return rateLimit({
        windowMs: options.windowMs,
        max: options.max,
        message: options.message,
        standardHeaders: true,
        legacyHeaders: false,
        handler: function (req, res) {
            console.log("\u26A0\uFE0F Rate limit exceeded for IP: ".concat(req.ip));
            res.status(429).json(options.message);
        },
        skip: function (req) {
            // Skip rate limiting for certain conditions if needed
            // For example, skip for admin users in production
            return false;
        }
    });
}
/**
 * Authentication middleware - validates user session
 */
export function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, userRole, user, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🔐 AuthMiddleware: Validating authentication');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                    userRole = (_b = req.session) === null || _b === void 0 ? void 0 : _b.userRole;
                    if (!userId || !userRole) {
                        console.log('❌ AuthMiddleware: No valid session found');
                        res.status(401).json({
                            error: 'No autenticado',
                            details: 'Sesión requerida para acceder a este recurso'
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, authService.getUserById(userId)];
                case 2:
                    user = _c.sent();
                    if (!user) {
                        console.log('❌ AuthMiddleware: User not found in database:', userId);
                        // Destroy invalid session
                        req.session.destroy(function (err) {
                            if (err)
                                console.error('Error destroying invalid session:', err);
                        });
                        res.status(401).json({
                            error: 'Usuario no encontrado',
                            details: 'La sesión es inválida'
                        });
                        return [2 /*return*/];
                    }
                    // Attach user info to request for use in controllers
                    req.user = user;
                    req.userId = userId;
                    req.userRole = userRole;
                    console.log('✅ AuthMiddleware: Authentication successful for user:', userId);
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    console.error('❌ AuthMiddleware: Error during authentication:', error_1);
                    res.status(500).json({
                        error: 'Error de autenticación',
                        details: 'Error interno del servidor'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Optional authentication middleware - allows both authenticated and guest users
 */
export function optionalAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                    if (!userId) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, authService.getUserById(userId)];
                case 2:
                    user = _c.sent();
                    if (user) {
                        req.user = user;
                        req.userId = userId;
                        req.userRole = (_b = req.session) === null || _b === void 0 ? void 0 : _b.userRole;
                        console.log('✅ OptionalAuth: User authenticated:', userId);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    console.log('⚠️ OptionalAuth: Error validating user:', error_2);
                    return [3 /*break*/, 4];
                case 4:
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * CSRF Protection Middleware
 * Simple CSRF token validation for critical operations
 */
export function csrfProtection(req, res, next) {
    var _a;
    // Skip CSRF for GET requests
    if (req.method === 'GET') {
        return next();
    }
    var tokenFromHeader = req.headers['x-csrf-token'];
    var tokenFromSession = (_a = req.session) === null || _a === void 0 ? void 0 : _a.csrfToken;
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
export function generateCSRFToken(req) {
    var token = "csrf_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2));
    if (req.session) {
        req.session.csrfToken = token;
    }
    return token;
}
/**
 * Security headers middleware
 */
export function securityHeaders(req, res, next) {
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
export function securityLogger(req, res, next) {
    var _a;
    var startTime = Date.now();
    var method = req.method, url = req.url, ip = req.ip;
    var userAgent = req.get('User-Agent') || 'Unknown';
    var userId = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId) || 'Anonymous';
    console.log("\uD83D\uDD0D [".concat(new Date().toISOString(), "] ").concat(method, " ").concat(url, " - IP: ").concat(ip, " - User: ").concat(userId, " - UserAgent: ").concat(userAgent));
    // Log response details
    res.on('finish', function () {
        var duration = Date.now() - startTime;
        var statusCode = res.statusCode;
        if (statusCode >= 400) {
            console.log("\u26A0\uFE0F [".concat(new Date().toISOString(), "] ").concat(method, " ").concat(url, " - ").concat(statusCode, " - ").concat(duration, "ms - User: ").concat(userId));
        }
        else {
            console.log("\u2705 [".concat(new Date().toISOString(), "] ").concat(method, " ").concat(url, " - ").concat(statusCode, " - ").concat(duration, "ms - User: ").concat(userId));
        }
    });
    next();
}
/**
 * Input sanitization middleware
 */
export function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        // Basic sanitization - trim strings and remove potential XSS
        var sanitizeObject_1 = function (obj) {
            for (var key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].trim();
                    // Remove potentially dangerous characters
                    obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                }
                else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject_1(obj[key]);
                }
            }
            return obj;
        };
        req.body = sanitizeObject_1(req.body);
    }
    next();
}
