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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import 'dotenv/config';
import express from "express";
import session from 'express-session';
import path from 'path';
import { setupVite, serveStatic } from "./vite";
import helmet from 'helmet';
import cors from 'cors';
// Import new authentication system
import { createAuthRoutes } from './auth/authRoutes';
import { securityHeaders, securityLogger, sanitizeInput, rateLimitMiddleware } from './auth/authMiddleware';
// Import existing functionality
import { registerRoutes } from "./routes";
/**
 * Production-ready Express server with comprehensive authentication system
 * Implements security best practices, rate limiting, session management, and logging
 */
var app = express();
var isDevelopment = app.get("env") === "development";
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
var rateLimitConfig = isDevelopment ? {
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
    verify: function (req, res, buf) {
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
    app.use(function (req, res, next) {
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
app.use(function (req, res, next) {
    var start = Date.now();
    var path = req.path;
    var capturedJsonResponse = undefined;
    var originalResJson = res.json;
    res.json = function (bodyJson) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, __spreadArray([bodyJson], args, true));
    };
    res.on("finish", function () {
        var duration = Date.now() - start;
        if (path.startsWith("/api")) {
            var logLine = "".concat(req.method, " ").concat(path, " ").concat(res.statusCode, " in ").concat(duration, "ms");
            // Add response preview for debugging
            if (capturedJsonResponse && isDevelopment) {
                var responsePreview = JSON.stringify(capturedJsonResponse);
                logLine += " :: ".concat(responsePreview.length > 100 ?
                    responsePreview.slice(0, 97) + "..." :
                    responsePreview);
            }
            // Color coding for different status codes
            if (res.statusCode >= 400) {
                console.log("\u274C ".concat(logLine));
            }
            else if (res.statusCode >= 300) {
                console.log("\u26A0\uFE0F ".concat(logLine));
            }
            else {
                console.log("\u2705 ".concat(logLine));
            }
        }
    });
    next();
});
// =============================================
// ROUTES SETUP
// =============================================
function setupRoutes() {
    return __awaiter(this, void 0, void 0, function () {
        var server, attachedAssetsPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Mount authentication routes
                    console.log('🔐 Setting up authentication routes...');
                    app.use('/api/auth', createAuthRoutes());
                    // Mount existing application routes
                    console.log('📚 Setting up application routes...');
                    return [4 /*yield*/, registerRoutes(app)];
                case 1:
                    server = _a.sent();
                    attachedAssetsPath = path.join(process.cwd(), 'attached_assets');
                    app.use('/attached_assets', express.static(attachedAssetsPath, {
                        maxAge: isDevelopment ? 0 : '1d', // Cache in production
                        etag: true,
                    }));
                    console.log('✅ All routes configured successfully');
                    return [2 /*return*/, server];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ Error setting up routes:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// =============================================
// ERROR HANDLING
// =============================================
// Global error handler
app.use(function (err, req, res, next) {
    var _a;
    var status = err.status || err.statusCode || 500;
    var message = err.message || "Internal Server Error";
    // Log error with context
    console.error("\u274C Error in ".concat(req.method, " ").concat(req.path, ":"), {
        error: message,
        status: status,
        stack: isDevelopment ? err.stack : undefined,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: ((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId) || 'Anonymous'
    });
    // Don't expose internal errors in production
    var clientMessage = status === 500 && !isDevelopment ?
        'Error interno del servidor' : message;
    // Always return JSON for API routes
    if (req.path.startsWith('/api')) {
        if (!res.headersSent) {
            res.status(status).json({
                error: clientMessage,
                details: isDevelopment ? err.stack : undefined
            });
        }
    }
    else {
        if (!res.headersSent) {
            res.status(status).json({ message: clientMessage });
        }
    }
});
// =============================================
// SERVER INITIALIZATION
// =============================================
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, port_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log('🔧 Initializing server...');
                return [4 /*yield*/, setupRoutes()];
            case 1:
                server = _a.sent();
                if (!isDevelopment) return [3 /*break*/, 3];
                console.log('🔧 Setting up Vite development server...');
                return [4 /*yield*/, setupVite(app, server)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                console.log('🔧 Setting up static file serving for production...');
                serveStatic(app);
                _a.label = 4;
            case 4:
                port_1 = parseInt(process.env.PORT || '5000', 10);
                server.listen(port_1, function () {
                    console.log('🎉 Server started successfully!');
                    console.log("\uD83C\uDF10 Server running on port ".concat(port_1));
                    console.log("\uD83D\uDD17 Environment: ".concat(isDevelopment ? 'development' : 'production'));
                    console.log("\uD83D\uDD10 Authentication system: ENABLED");
                    console.log("\uD83D\uDEE1\uFE0F Security features: ENABLED");
                    console.log("\u26A1 Rate limiting: ACTIVE");
                    console.log("\uD83D\uDCDD Request logging: ACTIVE");
                    console.log('─'.repeat(50));
                    if (isDevelopment) {
                        console.log('🔧 Development mode features:');
                        console.log('  • Detailed request/response logging');
                        console.log('  • CORS enabled for all origins');
                        console.log('  • Hot module replacement via Vite');
                        console.log('  • Session cookies over HTTP');
                        console.log('─'.repeat(50));
                        console.log('📋 Test credentials available in seed data');
                        console.log('🔗 Access: http://localhost:' + port_1);
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('❌ Failed to start server:', error_2);
                process.exit(1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
// =============================================
// GRACEFUL SHUTDOWN
// =============================================
process.on('SIGTERM', function () {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', function () {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    process.exit(0);
});
// Handle uncaught exceptions
process.on('uncaughtException', function (error) {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', function (reason, promise) {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
