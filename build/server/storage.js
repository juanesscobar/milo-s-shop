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
import { users, vehicles, services, bookings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
// Simplified Database storage implementation for authentication testing
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // Users
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByPhone = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.phone, phone))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.email, email))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 DEBUG: Creating user with data:', insertUser);
                        userId = "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        userData = {
                            id: userId,
                            name: insertUser.name,
                            phone: insertUser.phone,
                            email: insertUser.email || null,
                            password: insertUser.password || null,
                            role: insertUser.role || "client",
                            language: insertUser.language || "es",
                            isGuest: String(insertUser.isGuest || "true"),
                            createdAt: new Date()
                        };
                        console.log('🔍 DEBUG: User data to insert:', __assign(__assign({}, userData), { password: userData.password ? '[HIDDEN]' : 'null' }));
                        return [4 /*yield*/, db.insert(users).values(userData)];
                    case 1:
                        _a.sent();
                        console.log('✅ User created successfully with ID:', userId);
                        return [2 /*return*/, userData];
                }
            });
        });
    };
    // Services
    DatabaseStorage.prototype.getAllServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(services).where(eq(services.active, "true"))];
                    case 1:
                        result = _a.sent();
                        console.log('getAllServices result:', result.length, 'services');
                        // Parse prices from JSON string to object if needed
                        return [2 /*return*/, result.map(function (service) {
                                var parsedPrices = service.prices;
                                // If prices is a string and looks like JSON, parse it
                                // Note: prices is typed as object but stored as text in DB
                                var pricesValue = service.prices;
                                if (typeof pricesValue === 'string') {
                                    try {
                                        var trimmedPrices = pricesValue.trim();
                                        // Check if it's a JSON string (starts with { or [)
                                        if (trimmedPrices.startsWith('{') || trimmedPrices.startsWith('[')) {
                                            parsedPrices = JSON.parse(trimmedPrices);
                                        }
                                    }
                                    catch (e) {
                                        console.warn('Failed to parse prices for service', service.id, ':', e);
                                    }
                                }
                                return __assign(__assign({}, service), { prices: parsedPrices });
                            })];
                }
            });
        });
    };
    DatabaseStorage.prototype.getService = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(services).where(eq(services.id, id))];
                    case 1:
                        service = (_a.sent())[0];
                        return [2 /*return*/, service || undefined];
                }
            });
        });
    };
    // Vehicles
    DatabaseStorage.prototype.getUserVehicles = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(vehicles).where(eq(vehicles.userId, userId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createVehicle = function (insertVehicle) {
        return __awaiter(this, void 0, void 0, function () {
            var vehicleId, vehicleData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vehicleId = "vehicle_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        vehicleData = {
                            id: vehicleId,
                            userId: insertVehicle.userId,
                            plate: insertVehicle.plate,
                            type: insertVehicle.type,
                            createdAt: new Date()
                        };
                        return [4 /*yield*/, db.insert(vehicles).values([vehicleData])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, vehicleData];
                }
            });
        });
    };
    // Bookings
    DatabaseStorage.prototype.getUserBookings = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings)
                            .where(eq(bookings.userId, userId))
                            .orderBy(desc(bookings.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTodayBookings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date().toISOString().split('T')[0];
                        return [4 /*yield*/, db.select().from(bookings)
                                .where(eq(bookings.date, today))
                                .orderBy(desc(bookings.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateBookingStatus = function (bookingId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedBooking;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.update(bookings)
                            .set({ status: status })
                            .where(eq(bookings.id, bookingId))
                            .returning()];
                    case 1:
                        updatedBooking = (_a.sent())[0];
                        return [2 /*return*/, updatedBooking || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createBooking = function (insertBooking) {
        return __awaiter(this, void 0, void 0, function () {
            var bookingId, bookingData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bookingId = "booking_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        bookingData = {
                            id: bookingId,
                            userId: insertBooking.userId,
                            vehicleId: insertBooking.vehicleId,
                            serviceId: insertBooking.serviceId,
                            date: insertBooking.date,
                            timeSlot: insertBooking.timeSlot,
                            price: insertBooking.price,
                            status: insertBooking.status || "waiting",
                            paymentMethod: insertBooking.paymentMethod,
                            paymentCaptureUrl: insertBooking.paymentCaptureUrl,
                            notes: insertBooking.notes,
                            createdAt: new Date()
                        };
                        return [4 /*yield*/, db.insert(bookings).values([bookingData])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, bookingData];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
export var storage = new DatabaseStorage();
