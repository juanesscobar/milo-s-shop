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
import bcrypt from 'bcrypt';
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
export function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, seedServices_1, service, testUsers, _a, _b, testUsers_1, testUser, error_1;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 14, , 15]);
                    console.log("🌱 Starting database seeding...");
                    // Clear existing services and users
                    return [4 /*yield*/, db.delete(services)];
                case 1:
                    // Clear existing services and users
                    _f.sent();
                    return [4 /*yield*/, db.delete(users)];
                case 2:
                    _f.sent();
                    _i = 0, seedServices_1 = seedServices;
                    _f.label = 3;
                case 3:
                    if (!(_i < seedServices_1.length)) return [3 /*break*/, 6];
                    service = seedServices_1[_i];
                    return [4 /*yield*/, db.insert(services).values(service)];
                case 4:
                    _f.sent();
                    _f.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    _c = {
                        id: "user_test_123",
                        name: "Usuario Test",
                        email: "test@example.com",
                        phone: "123456789"
                    };
                    return [4 /*yield*/, bcrypt.hash("Test123!", 12)];
                case 7:
                    _a = [
                        (_c.password = _f.sent(),
                            _c.role = "client",
                            _c.language = "es",
                            _c.isGuest = false,
                            _c.createdAt = new Date(),
                            _c)
                    ];
                    _d = {
                        id: "user_juan_escobar",
                        name: "Juan Escobar",
                        email: "escobarbvega.juanandres21@gmail.com",
                        phone: "+595973640191"
                    };
                    return [4 /*yield*/, bcrypt.hash("123456", 12)];
                case 8:
                    _a = _a.concat([
                        (_d.password = _f.sent(),
                            _d.role = "client",
                            _d.language = "es",
                            _d.isGuest = false,
                            _d.createdAt = new Date(),
                            _d)
                    ]);
                    _e = {
                        id: "user_juan_escobar_alt",
                        name: "Juan Escobar Alt",
                        email: "escobarbvega.juanandres21@gmail.com",
                        phone: "0973640191"
                    };
                    return [4 /*yield*/, bcrypt.hash("123456", 12)];
                case 9:
                    testUsers = _a.concat([
                        (_e.password = _f.sent(),
                            _e.role = "client",
                            _e.language = "es",
                            _e.isGuest = false,
                            _e.createdAt = new Date(),
                            _e)
                    ]);
                    _b = 0, testUsers_1 = testUsers;
                    _f.label = 10;
                case 10:
                    if (!(_b < testUsers_1.length)) return [3 /*break*/, 13];
                    testUser = testUsers_1[_b];
                    return [4 /*yield*/, db.insert(users).values(testUser)];
                case 11:
                    _f.sent();
                    _f.label = 12;
                case 12:
                    _b++;
                    return [3 /*break*/, 10];
                case 13:
                    console.log("✅ Database seeded successfully!");
                    console.log("\uD83D\uDCCB Added ".concat(seedServices.length, " services"));
                    console.log("\uD83D\uDC64 Added ".concat(testUsers.length, " test users:"));
                    testUsers.forEach(function (user) {
                        console.log("   - ".concat(user.name, ": ").concat(user.email, " / ").concat(user.phone));
                    });
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _f.sent();
                    console.error("❌ Error seeding database:", error_1);
                    throw error_1;
                case 15: return [2 /*return*/];
            }
        });
    });
}
// Run seed if this file is executed directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    seedDatabase()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
}
