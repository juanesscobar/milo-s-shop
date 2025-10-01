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
import 'dotenv/config';
import { db } from "./db";
import { services, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("🔍 Testing database connection...");
                    return [4 /*yield*/, db.select().from(services).limit(1)];
                case 1:
                    result = _a.sent();
                    console.log("✅ Database connection successful");
                    console.log("📊 Current services in DB:", result.length);
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error("❌ Database connection failed:", error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createTestService() {
    return __awaiter(this, void 0, void 0, function () {
        var testService, verifyResult, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("🔧 Creating a test service manually...");
                    testService = {
                        id: "test_service_manual",
                        slug: "test_manual",
                        title: "Servicio de Prueba Manual",
                        description: "Este es un servicio de prueba creado manualmente",
                        prices: {
                            auto: 50000,
                            suv: 60000,
                            camioneta: 70000
                        },
                        active: "true"
                    };
                    console.log("📝 Test service data:", JSON.stringify(testService, null, 2));
                    return [4 /*yield*/, db.insert(services).values(testService)];
                case 1:
                    _a.sent();
                    console.log("✅ Test service created successfully");
                    return [4 /*yield*/, db.select().from(services).where(eq(services.id, "test_service_manual"))];
                case 2:
                    verifyResult = _a.sent();
                    console.log("🔍 Verification - services found:", verifyResult.length);
                    if (verifyResult.length > 0) {
                        console.log("✅ Service verified in database:", verifyResult[0]);
                    }
                    return [2 /*return*/, true];
                case 3:
                    error_2 = _a.sent();
                    console.error("❌ Failed to create test service:", error_2);
                    console.error("❌ Error details:", error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                    console.error("❌ Error stack:", error_2 === null || error_2 === void 0 ? void 0 : error_2.stack);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var seedServices = [
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
        active: "true"
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
        active: "true"
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
        active: "true"
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
        active: "true"
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
        active: "true"
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
        active: "true"
    }
];
export function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var dbConnected, testCreated, i, service, serviceError_1, testUsers, _a, _i, testUsers_1, testUser, error_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 18, , 19]);
                    console.log("🌱 Starting database seeding...");
                    return [4 /*yield*/, testDatabaseConnection()];
                case 1:
                    dbConnected = _e.sent();
                    if (!dbConnected) {
                        throw new Error("Cannot connect to database");
                    }
                    // First, let's try to create just one test service manually
                    console.log("🧪 Creating test service manually first...");
                    return [4 /*yield*/, createTestService()];
                case 2:
                    testCreated = _e.sent();
                    if (!testCreated) {
                        throw new Error("Failed to create test service");
                    }
                    // If manual creation works, then proceed with full seeding
                    console.log("✅ Manual test service created successfully");
                    console.log("🚀 Proceeding with full seeding...");
                    // Clear existing services and users
                    console.log("🗑️ Clearing existing data...");
                    return [4 /*yield*/, db.delete(services)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, db.delete(users)];
                case 4:
                    _e.sent();
                    console.log("✅ Existing data cleared");
                    console.log("\uD83D\uDCCB Inserting ".concat(seedServices.length, " services..."));
                    i = 0;
                    _e.label = 5;
                case 5:
                    if (!(i < seedServices.length)) return [3 /*break*/, 10];
                    service = seedServices[i];
                    console.log("  \u2795 [".concat(i + 1, "/").concat(seedServices.length, "] Inserting service: ").concat(service.title, " (").concat(service.slug, ")"));
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, db.insert(services).values(service)];
                case 7:
                    _e.sent();
                    console.log("    \u2705 Service inserted successfully: ".concat(service.id));
                    return [3 /*break*/, 9];
                case 8:
                    serviceError_1 = _e.sent();
                    console.error("    \u274C Failed to insert service ".concat(service.slug, ":"), serviceError_1);
                    throw serviceError_1;
                case 9:
                    i++;
                    return [3 /*break*/, 5];
                case 10:
                    _b = {
                        id: "user_test_123",
                        name: "Usuario Test",
                        email: "test@example.com",
                        phone: "123456789"
                    };
                    return [4 /*yield*/, bcrypt.hash("Test123!", 12)];
                case 11:
                    _a = [
                        (_b.password = _e.sent(),
                            _b.role = "client",
                            _b.language = "es",
                            _b.isGuest = "false",
                            _b.createdAt = new Date(),
                            _b)
                    ];
                    _c = {
                        id: "user_juan_escobar",
                        name: "Juan Escobar",
                        email: "escobarbvega.juanandres21@gmail.com",
                        phone: "+595973640191"
                    };
                    return [4 /*yield*/, bcrypt.hash("123456", 12)];
                case 12:
                    _a = _a.concat([
                        (_c.password = _e.sent(),
                            _c.role = "client",
                            _c.language = "es",
                            _c.isGuest = "false",
                            _c.createdAt = new Date(),
                            _c)
                    ]);
                    _d = {
                        id: "user_juan_escobar_alt",
                        name: "Juan Escobar Alt",
                        email: "escobarbvega.juanandres21@gmail.com",
                        phone: "0973640191"
                    };
                    return [4 /*yield*/, bcrypt.hash("123456", 12)];
                case 13:
                    testUsers = _a.concat([
                        (_d.password = _e.sent(),
                            _d.role = "client",
                            _d.language = "es",
                            _d.isGuest = "false",
                            _d.createdAt = new Date(),
                            _d)
                    ]);
                    _i = 0, testUsers_1 = testUsers;
                    _e.label = 14;
                case 14:
                    if (!(_i < testUsers_1.length)) return [3 /*break*/, 17];
                    testUser = testUsers_1[_i];
                    return [4 /*yield*/, db.insert(users).values(testUser)];
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17:
                    console.log("✅ Database seeded successfully!");
                    console.log("\uD83D\uDCCB Added ".concat(seedServices.length, " services"));
                    console.log("\uD83D\uDC64 Added ".concat(testUsers.length, " test users:"));
                    testUsers.forEach(function (user) {
                        console.log("   - ".concat(user.name, ": ").concat(user.email, " / ").concat(user.phone));
                    });
                    return [3 /*break*/, 19];
                case 18:
                    error_3 = _e.sent();
                    console.error("❌ Error seeding database:", error_3);
                    throw error_3;
                case 19: return [2 /*return*/];
            }
        });
    });
}
// Run seed if this file is executed directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    console.log("🚀 Starting seeding process...");
    console.log("🔧 Process args:", process.argv);
    console.log("📄 Script URL:", import.meta.url);
    // First, just test database connection and create one service
    console.log("🔍 Testing database connection and creating one test service...");
    testDatabaseConnection()
        .then(function (connected) {
        if (connected) {
            console.log("✅ Database connection successful");
            return createTestService();
        }
        else {
            throw new Error("Database connection failed");
        }
    })
        .then(function (serviceCreated) {
        if (serviceCreated) {
            console.log("✅ Test service created successfully");
            console.log("🎉 Basic database operations working!");
        }
        else {
            throw new Error("Failed to create test service");
        }
    })
        .then(function () {
        console.log("✅ All tests passed");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Test failed:", error);
        console.error("❌ Error stack:", error.stack);
        process.exit(1);
    });
}
