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
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users, companies } from '@shared/auth-schema';
import { services } from '@shared/schema';
/**
 * AuthSeed - Production-ready seeding system for authentication
 * Creates test users, companies, and services with proper security
 */
var AuthSeed = /** @class */ (function () {
    function AuthSeed() {
    }
    /**
     * Seed the database with initial data
     */
    AuthSeed.seedAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🌱 Starting comprehensive authentication seeding...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        // Clear existing data
                        return [4 /*yield*/, this.clearExistingData()];
                    case 2:
                        // Clear existing data
                        _a.sent();
                        // Seed companies first (required for admin users)
                        return [4 /*yield*/, this.seedCompanies()];
                    case 3:
                        // Seed companies first (required for admin users)
                        _a.sent();
                        // Seed users (both clients and admins)
                        return [4 /*yield*/, this.seedUsers()];
                    case 4:
                        // Seed users (both clients and admins)
                        _a.sent();
                        // Seed services (existing functionality)
                        return [4 /*yield*/, this.seedServices()];
                    case 5:
                        // Seed services (existing functionality)
                        _a.sent();
                        console.log('🎉 Authentication seeding completed successfully!');
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('❌ Seeding failed:', error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear existing data for clean seeding
     */
    AuthSeed.clearExistingData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🧹 Clearing existing data...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Delete in correct order due to foreign key constraints
                        return [4 /*yield*/, db.delete(users)];
                    case 2:
                        // Delete in correct order due to foreign key constraints
                        _a.sent();
                        return [4 /*yield*/, db.delete(companies)];
                    case 3:
                        _a.sent();
                        console.log('✅ Cleared existing authentication data');
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log('⚠️ No existing data to clear or error clearing:', error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Seed companies for admin users
     */
    AuthSeed.seedCompanies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companiesData, _i, companiesData_1, companyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🏢 Seeding companies...');
                        companiesData = [
                            {
                                name: 'Milos Car Wash',
                            },
                            {
                                name: 'Premium Auto Services',
                            },
                            {
                                name: 'Express Car Care',
                            }
                        ];
                        _i = 0, companiesData_1 = companiesData;
                        _a.label = 1;
                    case 1:
                        if (!(_i < companiesData_1.length)) return [3 /*break*/, 4];
                        companyData = companiesData_1[_i];
                        return [4 /*yield*/, db.insert(companies).values(__assign(__assign({}, companyData), { createdAt: new Date(), updatedAt: new Date() }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log("\u2705 Created ".concat(companiesData.length, " companies"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Seed users with proper authentication data
     */
    AuthSeed.seedUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clientUsers, adminUsers, allUsers, _i, allUsers_1, userData, passwordHash, userId, dbUserData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('👥 Seeding users...');
                        clientUsers = [
                            {
                                name: 'Juan Escobar',
                                email: 'escobarbvega.juanandres21@gmail.com',
                                phone: '+595973640191',
                                password: '123456Aa!', // Meets all security requirements
                                role: 'client',
                            },
                            {
                                name: 'María García',
                                email: 'maria.garcia@gmail.com',
                                phone: '+595984123456',
                                password: 'MariaPass123!',
                                role: 'client',
                            },
                            {
                                name: 'Carlos López',
                                email: 'carlos.lopez@hotmail.com',
                                phone: '+595971234567',
                                password: 'Carlos2024@',
                                role: 'client',
                            },
                        ];
                        adminUsers = [
                            {
                                name: 'Admin Principal',
                                email: 'admin@miloscarwash.com',
                                phone: '+595961000001',
                                password: 'AdminPass123!',
                                role: 'admin',
                                companyId: 1,
                            },
                            {
                                name: 'Laura Administradora',
                                email: 'laura@premiumauto.com',
                                phone: '+595961000002',
                                password: 'LauraAdmin2024@',
                                role: 'admin',
                                companyId: 2,
                            },
                        ];
                        allUsers = __spreadArray(__spreadArray([], clientUsers, true), adminUsers, true);
                        _i = 0, allUsers_1 = allUsers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < allUsers_1.length)) return [3 /*break*/, 6];
                        userData = allUsers_1[_i];
                        return [4 /*yield*/, bcrypt.hash(userData.password, this.SALT_ROUNDS)];
                    case 2:
                        passwordHash = _a.sent();
                        userId = "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
                        dbUserData = {
                            id: userId,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            passwordHash: passwordHash,
                            role: userData.role,
                            companyId: userData.role === 'admin' ? userData.companyId : null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        return [4 /*yield*/, db.insert(users).values(dbUserData)];
                    case 3:
                        _a.sent();
                        console.log("\u2705 Created ".concat(userData.role, " user: ").concat(userData.name, " (").concat(userData.email, ")"));
                        // Add a small delay to ensure unique timestamps
                        return [4 /*yield*/, this.delay(10)];
                    case 4:
                        // Add a small delay to ensure unique timestamps
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        console.log("\u2705 Created ".concat(allUsers.length, " users total"));
                        // Display login credentials for testing
                        this.displayLoginCredentials(allUsers);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Seed services (maintain existing functionality)
     */
    AuthSeed.seedServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var servicesData, error_3, _i, servicesData_1, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🚗 Seeding services...');
                        servicesData = [
                            {
                                id: "service_basic_wash",
                                slug: "basic_wash",
                                title: "Lavado Básico",
                                description: "Lavado exterior completo con jabón, enjuague y secado. Incluye llantas y rines.",
                                prices: {
                                    auto: 25000,
                                    suv: 30000,
                                    camioneta: 35000
                                },
                                active: true
                            },
                            {
                                id: "service_premium_wash",
                                slug: "premium_wash",
                                title: "Lavado Premium",
                                description: "Lavado completo exterior e interior, aspirado, tablero, cristales y perfumado.",
                                prices: {
                                    auto: 45000,
                                    suv: 55000,
                                    camioneta: 65000
                                },
                                active: true
                            },
                            {
                                id: "service_detail_complete",
                                slug: "detail_complete",
                                title: "Detallado Completo",
                                description: "Servicio premium con cera, pulido, tratamiento de cuero y protección UV.",
                                prices: {
                                    auto: 80000,
                                    suv: 100000,
                                    camioneta: 120000
                                },
                                active: true
                            },
                            {
                                id: "service_express_wash",
                                slug: "express_wash",
                                title: "Lavado Express",
                                description: "Lavado rápido exterior, ideal para mantenimiento semanal.",
                                prices: {
                                    auto: 15000,
                                    suv: 18000,
                                    camioneta: 22000
                                },
                                active: true
                            },
                            {
                                id: "service_engine_wash",
                                slug: "engine_wash",
                                title: "Lavado de Motor",
                                description: "Limpieza especializada del compartimento del motor con productos específicos.",
                                prices: {
                                    auto: 35000,
                                    suv: 40000,
                                    camioneta: 45000
                                },
                                active: true
                            },
                            {
                                id: "service_ceramic_coating",
                                slug: "ceramic_coating",
                                title: "Recubrimiento Cerámico",
                                description: "Protección avanzada con recubrimiento cerámico de larga duración.",
                                prices: {
                                    auto: 150000,
                                    suv: 180000,
                                    camioneta: 220000
                                },
                                active: true
                            }
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db.delete(services)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.log('⚠️ No existing services to clear');
                        return [3 /*break*/, 4];
                    case 4:
                        _i = 0, servicesData_1 = servicesData;
                        _a.label = 5;
                    case 5:
                        if (!(_i < servicesData_1.length)) return [3 /*break*/, 8];
                        service = servicesData_1[_i];
                        return [4 /*yield*/, db.insert(services).values(__assign(__assign({}, service), { createdAt: new Date() }))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        console.log("\u2705 Created ".concat(servicesData.length, " services"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Display login credentials for testing
     */
    AuthSeed.displayLoginCredentials = function (users) {
        console.log('\n📋 LOGIN CREDENTIALS FOR TESTING:');
        console.log('='.repeat(60));
        var clients = users.filter(function (u) { return u.role === 'client'; });
        var admins = users.filter(function (u) { return u.role === 'admin'; });
        if (clients.length > 0) {
            console.log('\n👤 CLIENTES:');
            clients.forEach(function (user) {
                console.log("   \uD83D\uDCE7 ".concat(user.email));
                console.log("   \uD83D\uDCF1 ".concat(user.phone));
                console.log("   \uD83D\uDD11 ".concat(user.password));
                console.log("   ---");
            });
        }
        if (admins.length > 0) {
            console.log('\n🔐 ADMINISTRADORES:');
            admins.forEach(function (user) {
                console.log("   \uD83D\uDCE7 ".concat(user.email));
                console.log("   \uD83D\uDCF1 ".concat(user.phone));
                console.log("   \uD83D\uDD11 ".concat(user.password));
                console.log("   ---");
            });
        }
        console.log('\n✅ Usa estas credenciales para probar el sistema de autenticación');
        console.log('='.repeat(60));
    };
    /**
     * Utility function to add delay
     */
    AuthSeed.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    /**
     * Get user statistics
     */
    AuthSeed.getUserStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allUsers, allCompanies, clientCount, adminCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n📊 USER STATISTICS:');
                        return [4 /*yield*/, db.select().from(users)];
                    case 1:
                        allUsers = _a.sent();
                        return [4 /*yield*/, db.select().from(companies)];
                    case 2:
                        allCompanies = _a.sent();
                        clientCount = allUsers.filter(function (u) { return u.role === 'client'; }).length;
                        adminCount = allUsers.filter(function (u) { return u.role === 'admin'; }).length;
                        console.log("   Total Users: ".concat(allUsers.length));
                        console.log("   Clients: ".concat(clientCount));
                        console.log("   Admins: ".concat(adminCount));
                        console.log("   Companies: ".concat(allCompanies.length));
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthSeed.SALT_ROUNDS = 12;
    return AuthSeed;
}());
export { AuthSeed };
// Execute seeding directly
AuthSeed.seedAll()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, AuthSeed.getUserStats()];
            case 1:
                _a.sent();
                console.log('✅ Seeding script completed successfully');
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (error) {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
});
