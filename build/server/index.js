var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
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
var app = express();
console.log('🚀 Iniciando servidor Milo\'s Shop...');
console.log('📋 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
// IMPORTANT: Body parsers MUST come before any middleware that reads the request stream
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
// Debug middleware to log parsed request body (AFTER body parsers)
app.use(function (req, res, next) {
    var _a;
    if (req.method === 'POST' && req.path.startsWith('/api')) {
        console.log('📝 POST request to:', req.path);
        console.log('📊 Parsed request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Content-Length:', req.headers['content-length']);
        // For multipart/form-data, body will be handled by multer later
        if ((_a = req.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('multipart/form-data')) {
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
var attachedAssetsPath = path.join(process.cwd(), 'attached_assets');
app.use('/attached_assets', express.static(attachedAssetsPath));
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
            if (capturedJsonResponse) {
                logLine += " :: ".concat(JSON.stringify(capturedJsonResponse));
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            log(logLine);
        }
    });
    next();
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, setupVite_1, port;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('🔧 Registrando rutas...');
                return [4 /*yield*/, registerRoutes(app)];
            case 1:
                server = _a.sent();
                console.log('✅ Rutas registradas exitosamente');
                app.use(function (err, req, res, _next) {
                    var status = err.status || err.statusCode || 500;
                    var message = err.message || "Internal Server Error";
                    console.error("Error in ".concat(req.method, " ").concat(req.path, ":"), err);
                    // Ensure API routes always return JSON
                    if (req.path.startsWith('/api')) {
                        console.error("API Error on ".concat(req.path, ":"), err);
                        if (!res.headersSent) {
                            res.status(status).json({ error: message, details: err.stack });
                        }
                    }
                    else {
                        if (!res.headersSent) {
                            res.status(status).json({ message: message });
                        }
                    }
                    // Don't throw err to prevent it from reaching Vite catch-all
                });
                if (!(app.get("env") === "development")) return [3 /*break*/, 4];
                return [4 /*yield*/, import("./vite")];
            case 2:
                setupVite_1 = (_a.sent()).setupVite;
                return [4 /*yield*/, setupVite_1(app, server)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                serveStatic(app);
                _a.label = 5;
            case 5:
                // Global error handling middleware
                app.use(function (err, req, res, next) {
                    console.error('Error no manejado:', err);
                    // Capture error with Sentry
                    Sentry.captureException(err);
                    // Don't leak error details in production
                    var isDevelopment = app.get("env") === "development";
                    res.status(err.status || err.statusCode || 500).json(__assign({ error: isDevelopment ? err.message : 'Error interno del servidor' }, (isDevelopment && { stack: err.stack })));
                });
                // 404 handler
                app.use(function (req, res) {
                    res.status(404).json({ error: 'Ruta no encontrada' });
                });
                // Handle uncaught exceptions and unhandled rejections
                process.on('uncaughtException', function (err) {
                    console.error('Uncaught Exception:', err);
                    Sentry.captureException(err);
                    process.exit(1);
                });
                process.on('unhandledRejection', function (reason, promise) {
                    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
                    Sentry.captureException(reason);
                    process.exit(1);
                });
                // Graceful shutdown
                process.on('SIGTERM', function () {
                    console.log('SIGTERM recibido, cerrando servidor...');
                    server.close(function () {
                        console.log('Servidor cerrado');
                        process.exit(0);
                    });
                });
                port = parseInt(process.env.PORT || '3000', 10);
                console.log("\uD83C\uDF10 Intentando escuchar en puerto ".concat(port, " en 0.0.0.0"));
                server.listen(port, '0.0.0.0', function () {
                    console.log("\u2705 Servidor escuchando en puerto ".concat(port));
                    log("serving on port ".concat(port));
                });
                return [2 /*return*/];
        }
    });
}); })();
