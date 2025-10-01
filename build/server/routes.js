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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { storage } from "./storage";
import { insertBookingSchema, services, users } from "@shared/schema";
import { z } from "zod";
// Import schema from db configuration
import { db } from "./db";
import { eq } from "drizzle-orm";
// Admin middleware
var requireAdmin = function (req, res, next) {
    console.log('🔍 DEBUG: requireAdmin - Session userId:', req.session.userId);
    console.log('🔍 DEBUG: requireAdmin - Session userRole:', req.session.userRole);
    if (!req.session.userId) {
        console.log('❌ DEBUG: requireAdmin - No userId in session');
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.session.userRole !== 'admin') {
        console.log('❌ DEBUG: requireAdmin - User is not admin');
        return res.status(403).json({ error: 'Admin access required' });
    }
    console.log('✅ DEBUG: requireAdmin - Admin access granted');
    next();
};
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var uploadDir, upload, httpServer, io, adminSockets;
        var _this = this;
        return __generator(this, function (_a) {
            console.log('🔧 Registering routes...');
            // Health check endpoint
            app.get("/api/health", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var startTime, healthCheck, dbStartTime, dbResponseTime, dbError_1, serverStartTime, routeStack, error_1, responseTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            console.log("🔍 HEALTH CHECK: Request received from", req.ip);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            healthCheck = {
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
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            dbStartTime = Date.now();
                            return [4 /*yield*/, db.select().from(users).limit(1)];
                        case 3:
                            _a.sent();
                            dbResponseTime = Date.now() - dbStartTime;
                            healthCheck.database = "connected";
                            healthCheck.databaseResponseTime = dbResponseTime;
                            console.log("\uD83D\uDD0D HEALTH CHECK: Database check successful (".concat(dbResponseTime, "ms)"));
                            return [3 /*break*/, 5];
                        case 4:
                            dbError_1 = _a.sent();
                            console.error("❌ HEALTH CHECK: Database error:", dbError_1);
                            healthCheck.database = "disconnected";
                            healthCheck.databaseError = dbError_1 instanceof Error ? dbError_1.message : String(dbError_1);
                            return [3 /*break*/, 5];
                        case 5:
                            // Check if server can handle requests
                            try {
                                serverStartTime = Date.now();
                                routeStack = app._router.stack.length;
                                healthCheck.routes = routeStack;
                                healthCheck.serverResponseTime = Date.now() - serverStartTime;
                                console.log("\uD83D\uDD0D HEALTH CHECK: Server routes check successful (".concat(routeStack, " routes)"));
                            }
                            catch (serverError) {
                                console.error("❌ HEALTH CHECK: Server error:", serverError);
                                healthCheck.serverError = serverError instanceof Error ? serverError.message : String(serverError);
                            }
                            healthCheck.responseTime = Date.now() - startTime;
                            console.log("\u2705 HEALTH CHECK: Completed successfully in ".concat(healthCheck.responseTime, "ms"));
                            res.status(200).json(healthCheck);
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            responseTime = Date.now() - startTime;
                            console.error("\u274C HEALTH CHECK: Failed after ".concat(responseTime, "ms:"), error_1);
                            res.status(503).json({
                                status: "unhealthy",
                                error: error_1 instanceof Error ? error_1.message : "Unknown error",
                                responseTime: responseTime,
                                timestamp: new Date().toISOString(),
                                stack: error_1 instanceof Error ? error_1.stack : undefined
                            });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Services API
            app.get("/api/services", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var services_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getAllServices()];
                        case 1:
                            services_1 = _a.sent();
                            res.json(services_1);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.error("Error fetching services:", error_2);
                            res.status(500).json({ error: "Failed to fetch services" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/services/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var service, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getService(req.params.id)];
                        case 1:
                            service = _a.sent();
                            if (!service) {
                                return [2 /*return*/, res.status(404).json({ error: "Service not found" })];
                            }
                            res.json(service);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("Error fetching service:", error_3);
                            res.status(500).json({ error: "Failed to fetch service" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Client Authentication API
            app.post("/api/auth/register", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, name_1, phone, email, password, existingUser, emailResults, phoneResults, hashedPassword, userId, userData, _, userWithoutPassword, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('POST /api/auth/register called with body:', req.body);
                            console.log('🔍 DEBUG: Password validation check');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 8, , 9]);
                            _a = req.body, name_1 = _a.name, phone = _a.phone, email = _a.email, password = _a.password;
                            if (!name_1 || !phone || !password) {
                                console.log('❌ Validation failed: missing required fields');
                                return [2 /*return*/, res.status(400).json({ error: "Name, phone and password are required" })];
                            }
                            // DEBUG: Log password details
                            console.log('🔍 DEBUG: Password length:', password.length);
                            console.log('🔍 DEBUG: Password value:', password);
                            // Validate password strength - TEMPORARILY RELAXED FOR TESTING
                            if (password.length < 6) {
                                console.log('❌ Password validation failed: too short (minimum 6 for testing)');
                                return [2 /*return*/, res.status(400).json({ error: "Password must be at least 6 characters long" })];
                            }
                            console.log('✅ Password validation passed');
                            existingUser = void 0;
                            if (!email) return [3 /*break*/, 3];
                            console.log('🔍 DEBUG: Checking by email:', email);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 2:
                            emailResults = _b.sent();
                            existingUser = emailResults[0];
                            _b.label = 3;
                        case 3:
                            if (!!existingUser) return [3 /*break*/, 5];
                            console.log('🔍 DEBUG: Checking by phone:', phone);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.phone, phone))];
                        case 4:
                            phoneResults = _b.sent();
                            existingUser = phoneResults[0];
                            _b.label = 5;
                        case 5:
                            if (existingUser) {
                                console.log('User already exists:', existingUser.id);
                                return [2 /*return*/, res.status(409).json({ error: "User with this phone or email already exists" })];
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 12)];
                        case 6:
                            hashedPassword = _b.sent();
                            userId = "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
                            userData = {
                                id: userId,
                                name: name_1.trim(),
                                phone: phone,
                                email: email || null,
                                password: hashedPassword,
                                role: 'client',
                                language: 'es',
                                isGuest: 'false',
                                createdAt: new Date(),
                            };
                            console.log('🔍 DEBUG: Inserting user data:', __assign(__assign({}, userData), { password: '[HIDDEN]' }));
                            return [4 /*yield*/, db.insert(users).values(userData)];
                        case 7:
                            _b.sent();
                            console.log('✅ User created successfully with ID:', userId);
                            // Create session
                            req.session.userId = userId;
                            req.session.userRole = 'client';
                            _ = userData.password, userWithoutPassword = __rest(userData, ["password"]);
                            res.status(201).json({ user: userWithoutPassword, message: "User registered successfully" });
                            return [3 /*break*/, 9];
                        case 8:
                            error_4 = _b.sent();
                            console.error("Error registering user:", error_4);
                            res.status(500).json({ error: "Failed to register user" });
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
            // Admin Registration API
            app.post("/api/auth/register/admin", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, name_2, companyName, phone, email, password, existingUser, emailResults, phoneResults, hashedPassword, userId, userData, _, userWithoutPassword, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('POST /api/auth/register/admin called with body:', req.body);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 8, , 9]);
                            _a = req.body, name_2 = _a.name, companyName = _a.companyName, phone = _a.phone, email = _a.email, password = _a.password;
                            if (!name_2 || !companyName || !phone || !email || !password) {
                                console.log('❌ Validation failed: missing required fields');
                                return [2 /*return*/, res.status(400).json({ error: "All fields are required for admin registration" })];
                            }
                            // Validate password strength
                            if (password.length < 8) {
                                console.log('❌ Password validation failed: too short');
                                return [2 /*return*/, res.status(400).json({ error: "Password must be at least 8 characters long" })];
                            }
                            console.log('✅ Password validation passed');
                            existingUser = void 0;
                            if (!email) return [3 /*break*/, 3];
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 2:
                            emailResults = _b.sent();
                            existingUser = emailResults[0];
                            _b.label = 3;
                        case 3:
                            if (!!existingUser) return [3 /*break*/, 5];
                            return [4 /*yield*/, db.select().from(users).where(eq(users.phone, phone))];
                        case 4:
                            phoneResults = _b.sent();
                            existingUser = phoneResults[0];
                            _b.label = 5;
                        case 5:
                            if (existingUser) {
                                console.log('User already exists:', existingUser.id);
                                return [2 /*return*/, res.status(409).json({ error: "User with this phone or email already exists" })];
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 12)];
                        case 6:
                            hashedPassword = _b.sent();
                            userId = "admin_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
                            userData = {
                                id: userId,
                                name: name_2.trim(),
                                phone: phone,
                                email: email,
                                password: hashedPassword,
                                role: 'admin',
                                language: 'es',
                                isGuest: 'false',
                                createdAt: new Date(),
                            };
                            console.log('🔍 DEBUG: Inserting admin user data:', __assign(__assign({}, userData), { password: '[HIDDEN]' }));
                            return [4 /*yield*/, db.insert(users).values(userData)];
                        case 7:
                            _b.sent();
                            console.log('✅ Admin user created successfully with ID:', userId);
                            // Create session
                            req.session.userId = userId;
                            req.session.userRole = 'admin';
                            _ = userData.password, userWithoutPassword = __rest(userData, ["password"]);
                            res.status(201).json({ user: userWithoutPassword, message: "Admin registered successfully" });
                            return [3 /*break*/, 9];
                        case 8:
                            error_5 = _b.sent();
                            console.error("Error registering admin:", error_5);
                            res.status(500).json({ error: "Failed to register admin" });
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/auth/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, phone, email, password, user, phoneResults, emailResults, allUsers, isValidPassword, _, userWithoutPassword, error_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('POST /api/auth/login called with body:', req.body);
                            console.log('🔍 DEBUG: Login attempt analysis');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 9, , 10]);
                            _a = req.body, phone = _a.phone, email = _a.email, password = _a.password;
                            if ((!phone && !email) || !password) {
                                console.log('❌ Validation failed: missing phone/email or password');
                                return [2 /*return*/, res.status(400).json({ error: "Phone/email and password are required" })];
                            }
                            // DEBUG: Log search criteria
                            console.log('🔍 DEBUG: Search criteria - phone:', phone, 'email:', email);
                            user = void 0;
                            if (!phone) return [3 /*break*/, 3];
                            console.log('🔍 Searching user by phone:', phone);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.phone, phone))];
                        case 2:
                            phoneResults = _b.sent();
                            user = phoneResults[0];
                            console.log('🔍 DEBUG: Phone search result:', user ? 'FOUND' : 'NOT FOUND');
                            if (user) {
                                console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, phone: user.phone, hasPassword: !!user.password });
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            if (!email) return [3 /*break*/, 5];
                            console.log('🔍 Searching user by email:', email);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 4:
                            emailResults = _b.sent();
                            user = emailResults[0];
                            console.log('🔍 DEBUG: Email search result:', user ? 'FOUND' : 'NOT FOUND');
                            if (user) {
                                console.log('🔍 DEBUG: Found user details:', { id: user.id, name: user.name, email: user.email, hasPassword: !!user.password });
                            }
                            _b.label = 5;
                        case 5:
                            if (!!user) return [3 /*break*/, 7];
                            console.log('❌ User not found - Let me check what users exist in DB');
                            return [4 /*yield*/, db.select().from(users)];
                        case 6:
                            allUsers = _b.sent();
                            console.log('🔍 DEBUG: All users in database:', allUsers.map(function (u) { return ({ id: u.id, name: u.name, phone: u.phone, email: u.email }); }));
                            return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                        case 7:
                            console.log('User found:', user.id);
                            // Check password
                            if (!user.password) {
                                return [2 /*return*/, res.status(400).json({ error: "Password authentication required" })];
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user.password)];
                        case 8:
                            isValidPassword = _b.sent();
                            if (!isValidPassword) {
                                return [2 /*return*/, res.status(401).json({ error: "Invalid password" })];
                            }
                            // Create session
                            req.session.userId = user.id;
                            req.session.userRole = user.role;
                            _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                            res.json({ user: userWithoutPassword, message: "Login successful" });
                            return [3 /*break*/, 10];
                        case 9:
                            error_6 = _b.sent();
                            console.error("Error logging in user:", error_6);
                            res.status(500).json({ error: "Failed to login" });
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/auth/logout", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        req.session.destroy(function (err) {
                            if (err) {
                                return res.status(500).json({ error: "Failed to logout" });
                            }
                            res.json({ message: "Logout successful" });
                        });
                    }
                    catch (error) {
                        console.error("Error logging out:", error);
                        res.status(500).json({ error: "Failed to logout" });
                    }
                    return [2 /*return*/];
                });
            }); });
            app.get("/api/auth/me", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userResults, user, _, userWithoutPassword, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!req.session.userId) {
                                return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                            }
                            return [4 /*yield*/, db.select().from(users).where(eq(users.id, req.session.userId))];
                        case 1:
                            userResults = _a.sent();
                            user = userResults[0];
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                            }
                            _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                            res.json({ user: userWithoutPassword });
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            console.error("Error fetching current user:", error_7);
                            res.status(500).json({ error: "Failed to fetch user data" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // DEBUG: Temporary endpoint to check users in database
            app.get("/api/debug/users", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var allUsers, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('🔍 DEBUG: Testing users schema query');
                            return [4 /*yield*/, db.select().from(users)];
                        case 1:
                            allUsers = _a.sent();
                            console.log('🔍 DEBUG: Query successful, found', allUsers.length, 'users');
                            console.log('🔍 DEBUG: All users in database:');
                            allUsers.forEach(function (user) {
                                console.log("   - ID: ".concat(user.id, ", Name: ").concat(user.name, ", Phone: ").concat(user.phone, ", Email: ").concat(user.email, ", HasPassword: ").concat(!!user.password));
                            });
                            res.json({
                                count: allUsers.length,
                                users: allUsers.map(function (u) { return ({
                                    id: u.id,
                                    name: u.name,
                                    phone: u.phone,
                                    email: u.email,
                                    role: u.role,
                                    hasPassword: !!u.password,
                                    createdAt: u.createdAt
                                }); })
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            console.error("❌ Error fetching users:", error_8);
                            console.error("❌ Error type:", typeof error_8);
                            console.error("❌ Error stack:", error_8 instanceof Error ? error_8.stack : 'No stack');
                            res.status(500).json({ error: "Failed to fetch users", details: error_8 instanceof Error ? error_8.message : String(error_8) });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create user (for booking flow)
            console.log('🔧 Registering POST /api/users route');
            app.post("/api/users", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, name_3, phone, email, language, role, existingUser, emailResults, phoneResults, _1, userWithoutPassword_1, userId, userData, _, userWithoutPassword, error_9;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('POST /api/users called with body:', req.body);
                            console.log('Headers:', req.headers['content-type']);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            _a = req.body, name_3 = _a.name, phone = _a.phone, email = _a.email, language = _a.language, role = _a.role;
                            if (!name_3 || !phone) {
                                console.log('Validation failed: name or phone missing');
                                return [2 /*return*/, res.status(400).json({ error: "Name and phone are required" })];
                            }
                            console.log('🔍 DEBUG: Checking if user exists with phone:', phone, 'or email:', email);
                            existingUser = void 0;
                            if (!email) return [3 /*break*/, 3];
                            console.log('🔍 DEBUG: Searching by email:', email);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                        case 2:
                            emailResults = _b.sent();
                            console.log('🔍 DEBUG: Email query results:', emailResults.length);
                            existingUser = emailResults[0];
                            console.log('🔍 DEBUG: Email search result:', existingUser ? "FOUND (".concat(existingUser.id, ")") : 'NOT FOUND');
                            _b.label = 3;
                        case 3:
                            if (!!existingUser) return [3 /*break*/, 5];
                            console.log('🔍 DEBUG: Searching by phone:', phone);
                            return [4 /*yield*/, db.select().from(users).where(eq(users.phone, phone))];
                        case 4:
                            phoneResults = _b.sent();
                            console.log('🔍 DEBUG: Phone query results:', phoneResults.length);
                            existingUser = phoneResults[0];
                            console.log('🔍 DEBUG: Phone search result:', existingUser ? "FOUND (".concat(existingUser.id, ")") : 'NOT FOUND');
                            _b.label = 5;
                        case 5:
                            if (existingUser) {
                                console.log('User already exists:', existingUser.id);
                                _1 = existingUser.password, userWithoutPassword_1 = __rest(existingUser, ["password"]);
                                return [2 /*return*/, res.status(200).json(userWithoutPassword_1)];
                            }
                            console.log('🔍 DEBUG: Creating new guest user');
                            userId = "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
                            userData = {
                                id: userId,
                                name: name_3.trim(),
                                phone: phone,
                                email: email || null,
                                password: '', // Empty password for booking flow users (they can't login)
                                role: role || 'client',
                                language: language || 'es',
                                isGuest: 'true',
                                createdAt: new Date(),
                            };
                            console.log('🔍 DEBUG: Inserting user data:', __assign(__assign({}, userData), { password: '[HIDDEN]' }));
                            return [4 /*yield*/, db.insert(users).values(userData)];
                        case 6:
                            _b.sent();
                            console.log('Created guest user:', userId);
                            _ = userData.password, userWithoutPassword = __rest(userData, ["password"]);
                            res.status(201).json(userWithoutPassword);
                            return [3 /*break*/, 8];
                        case 7:
                            error_9 = _b.sent();
                            console.error("❌ Error creating user:", error_9);
                            console.error("❌ Error type:", typeof error_9);
                            console.error("❌ Error stack:", error_9 instanceof Error ? error_9.stack : 'No stack');
                            console.error("❌ Error message:", error_9 instanceof Error ? error_9.message : String(error_9));
                            res.status(500).json({ error: "Failed to create user", details: error_9 instanceof Error ? error_9.message : String(error_9) });
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            // Create vehicle (for booking flow)
            app.post("/api/vehicles", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, userId, plate, type, vehicleData, vehicle, error_10;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('POST /api/vehicles called with body:', req.body);
                            console.log('Headers:', req.headers['content-type']);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _a = req.body, userId = _a.userId, plate = _a.plate, type = _a.type;
                            if (!userId || !plate || !type) {
                                console.log('Validation failed: userId, plate or type missing');
                                return [2 /*return*/, res.status(400).json({ error: "User ID, plate and type are required" })];
                            }
                            vehicleData = {
                                userId: userId,
                                plate: plate,
                                type: type
                            };
                            return [4 /*yield*/, storage.createVehicle(vehicleData)];
                        case 2:
                            vehicle = _b.sent();
                            console.log('Created vehicle:', vehicle);
                            res.status(201).json(vehicle);
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _b.sent();
                            console.error("Error creating vehicle:", error_10);
                            console.error("Error type:", typeof error_10);
                            console.error("Error stack:", error_10 instanceof Error ? error_10.stack : 'No stack');
                            res.status(500).json({ error: "Failed to create vehicle", details: error_10 instanceof Error ? error_10.message : String(error_10) });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Bookings API
            app.post("/api/bookings", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var bookingData, booking, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('🔍 DEBUG: POST /api/bookings called');
                            console.log('🔍 DEBUG: Request body:', req.body);
                            console.log('🔍 DEBUG: Headers:', req.headers['content-type']);
                            console.log('🔍 DEBUG: Session userId:', req.session.userId);
                            console.log('🔍 DEBUG: Session userRole:', req.session.userRole);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            bookingData = insertBookingSchema.parse(req.body);
                            console.log('✅ DEBUG: Parsed booking data successfully:', bookingData);
                            return [4 /*yield*/, storage.createBooking(bookingData)];
                        case 2:
                            booking = _a.sent();
                            console.log('✅ DEBUG: Created booking successfully:', booking);
                            res.status(201).json(booking);
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _a.sent();
                            console.error("❌ DEBUG: Error creating booking:", error_11);
                            console.error("❌ DEBUG: Error type:", typeof error_11);
                            console.error("❌ DEBUG: Error stack:", error_11 instanceof Error ? error_11.stack : 'No stack');
                            console.error("❌ DEBUG: Error message:", error_11 instanceof Error ? error_11.message : String(error_11));
                            if (error_11 instanceof z.ZodError) {
                                console.log('❌ DEBUG: Zod validation error:', error_11.errors);
                                return [2 /*return*/, res.status(400).json({ error: "Invalid booking data", details: error_11.errors })];
                            }
                            res.status(500).json({ error: "Failed to create booking", details: error_11 instanceof Error ? error_11.message : String(error_11) });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/bookings", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userBookings, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('🔍 DEBUG: GET /api/bookings called');
                            console.log('🔍 DEBUG: Session userId:', req.session.userId);
                            console.log('🔍 DEBUG: Session userRole:', req.session.userRole);
                            // Check authentication
                            if (!req.session.userId) {
                                console.log('❌ DEBUG: No userId in session');
                                return [2 /*return*/, res.status(401).json({ error: "Authentication required" })];
                            }
                            console.log('🔍 DEBUG: Calling storage.getUserBookings with userId:', req.session.userId);
                            return [4 /*yield*/, storage.getUserBookings(req.session.userId)];
                        case 1:
                            userBookings = _a.sent();
                            console.log('🔍 DEBUG: getUserBookings returned:', userBookings.length, 'bookings');
                            console.log('🔍 DEBUG: Bookings data:', JSON.stringify(userBookings, null, 2));
                            res.json(userBookings);
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _a.sent();
                            console.error("❌ DEBUG: Error fetching bookings:", error_12);
                            res.status(500).json({ error: "Failed to fetch bookings", details: error_12 instanceof Error ? error_12.message : String(error_12) });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get today's bookings (for admin dashboard)
            app.get("/api/bookings/today", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var today, bookings, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log("🔍 DEBUG: GET /api/bookings/today called");
                            today = new Date().toISOString().split('T')[0];
                            console.log("🔍 DEBUG: Today's date:", today);
                            console.log("Fetching today's bookings");
                            return [4 /*yield*/, storage.getTodayBookings()];
                        case 1:
                            bookings = _a.sent();
                            console.log("Found ".concat(bookings.length, " bookings for today"));
                            console.log('🔍 DEBUG: Today bookings data:', bookings);
                            res.json(bookings);
                            return [3 /*break*/, 3];
                        case 2:
                            error_13 = _a.sent();
                            console.error("❌ DEBUG: Error fetching today's bookings:", error_13);
                            res.status(500).json({ error: "Failed to fetch today's bookings" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update booking status
            app.patch("/api/bookings/:id/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, status_1, updatedBooking, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = req.params.id;
                            status_1 = req.body.status;
                            console.log("Updating booking ".concat(id, " status to ").concat(status_1));
                            if (!status_1) {
                                return [2 /*return*/, res.status(400).json({ error: "Status is required" })];
                            }
                            return [4 /*yield*/, storage.updateBookingStatus(id, status_1)];
                        case 1:
                            updatedBooking = _a.sent();
                            if (!updatedBooking) {
                                console.log("Booking ".concat(id, " not found"));
                                return [2 /*return*/, res.status(404).json({ error: "Booking not found" })];
                            }
                            console.log("Booking ".concat(id, " status updated successfully"));
                            res.json(updatedBooking);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            console.error("Error updating booking status:", error_14);
                            res.status(500).json({ error: "Failed to update booking status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            uploadDir = path.join(process.cwd(), 'attached_assets', 'service_images');
            // Ensure upload directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            upload = multer({
                storage: multer.diskStorage({
                    destination: uploadDir,
                    filename: function (req, file, cb) {
                        // Sanitize serviceSlug to prevent path traversal
                        var rawServiceSlug = req.body.serviceSlug || 'unknown';
                        var serviceSlug = rawServiceSlug.replace(/[^a-z0-9-_]/gi, '_');
                        var timestamp = Date.now();
                        var ext = path.extname(file.originalname).toLowerCase();
                        // Validate file extension
                        var allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                        if (!allowedExtensions.includes(ext)) {
                            return cb(new Error('Tipo de archivo no permitido'), '');
                        }
                        cb(null, "".concat(serviceSlug, "-").concat(timestamp).concat(ext));
                    }
                }),
                fileFilter: function (req, file, cb) {
                    // Enhanced validation for image types
                    var allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
                    if (allowedMimes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, WebP)'));
                    }
                },
                limits: {
                    fileSize: 5 * 1024 * 1024, // 5MB limit
                    files: 1 // Only one file per request
                }
            });
            // Service image upload route
            app.post('/api/services/upload-image', upload.single('image'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var serviceSlug, existingService, imagePath, fullImageUrl, updatedService, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            if (!req.file) {
                                return [2 /*return*/, res.status(400).json({ error: 'No se recibió ningún archivo de imagen' })];
                            }
                            serviceSlug = req.body.serviceSlug;
                            if (!serviceSlug) {
                                return [2 /*return*/, res.status(400).json({ error: 'El slug del servicio es requerido' })];
                            }
                            return [4 /*yield*/, db.select()
                                    .from(services)
                                    .where(eq(services.slug, serviceSlug))
                                    .limit(1)];
                        case 1:
                            existingService = (_a.sent())[0];
                            if (!existingService) {
                                // Clean up uploaded file
                                fs.unlinkSync(req.file.path);
                                return [2 /*return*/, res.status(404).json({ error: 'Servicio no encontrado' })];
                            }
                            imagePath = "service_images/".concat(req.file.filename);
                            fullImageUrl = "/attached_assets/".concat(imagePath);
                            return [4 /*yield*/, db.update(services)
                                    .set({ imageUrl: fullImageUrl })
                                    .where(eq(services.slug, serviceSlug))
                                    .returning()];
                        case 2:
                            updatedService = (_a.sent())[0];
                            if (!updatedService) {
                                // Clean up uploaded file
                                fs.unlinkSync(req.file.path);
                                return [2 /*return*/, res.status(500).json({ error: 'Error al actualizar el servicio' })];
                            }
                            console.log("\u2705 Imagen subida exitosamente para servicio ".concat(serviceSlug, ": ").concat(req.file.filename));
                            res.json({
                                success: true,
                                message: 'Imagen subida y servicio actualizado exitosamente',
                                imageUrl: fullImageUrl,
                                filename: req.file.filename,
                                serviceSlug: serviceSlug,
                                service: updatedService
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_15 = _a.sent();
                            console.error('Error uploading image:', error_15);
                            // Clean up uploaded file if it exists
                            if (req.file && fs.existsSync(req.file.path)) {
                                fs.unlinkSync(req.file.path);
                            }
                            res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = createServer(app);
            io = new SocketIOServer(httpServer, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            adminSockets = new Set();
            io.on('connection', function (socket) {
                console.log('Client connected:', socket.id);
                // Join admin room for real-time updates (with basic auth)
                socket.on('join-admin', function (authToken) {
                    console.log('🔍 DEBUG: join-admin event received');
                    console.log('🔍 DEBUG: Received authToken:', authToken);
                    console.log('🔍 DEBUG: Socket ID:', socket.id);
                    // Basic admin auth - in production, use proper JWT or session validation
                    var adminToken = process.env.ADMIN_WS_TOKEN || 'admin-secret-key';
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
                socket.on('disconnect', function () {
                    console.log('Client disconnected:', socket.id);
                    adminSockets.delete(socket);
                });
            });
            // Make io accessible to routes (store in app.locals)
            app.locals.io = io;
            return [2 /*return*/, httpServer];
        });
    });
}
