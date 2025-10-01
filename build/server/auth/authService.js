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
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
/**
 * AuthService - Core authentication business logic
 * Handles user registration, login, and user management
 */
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    /**
     * Register a new client user
     */
    AuthService.prototype.registerClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, _a, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(users)
                            .where(eq(users.phone, data.phone))
                            .limit(1)];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser.length > 0) {
                            throw new Error('Ya existe un usuario con este teléfono o email');
                        }
                        if (!data.password) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.hash(data.password, 12)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _b.label = 4;
                    case 4:
                        hashedPassword = _a;
                        return [4 /*yield*/, db
                                .insert(users)
                                .values({
                                id: randomUUID(),
                                name: data.name,
                                phone: data.phone,
                                email: data.email || null,
                                password: hashedPassword,
                                role: 'client',
                                language: 'es',
                                isGuest: data.password ? 'false' : 'true',
                            })
                                .returning()];
                    case 5:
                        user = (_b.sent())[0];
                        return [2 /*return*/, {
                                user: user,
                                message: 'Cliente registrado exitosamente'
                            }];
                }
            });
        });
    };
    /**
     * Register a new admin user
     */
    AuthService.prototype.registerAdmin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(users)
                            .where(eq(users.phone, data.phone))
                            .limit(1)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser.length > 0) {
                            throw new Error('Ya existe un usuario con este teléfono o email');
                        }
                        return [4 /*yield*/, bcrypt.hash(data.password, 12)];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, db
                                .insert(users)
                                .values({
                                id: randomUUID(),
                                name: data.name,
                                phone: data.phone,
                                email: data.email,
                                password: hashedPassword,
                                role: 'admin',
                                language: 'es',
                                isGuest: 'false',
                            })
                                .returning()];
                    case 3:
                        user = (_a.sent())[0];
                        return [2 /*return*/, {
                                user: user,
                                message: 'Administrador registrado exitosamente'
                            }];
                }
            });
        });
    };
    /**
     * Authenticate user login
     */
    AuthService.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!data.email) {
                            throw new Error('Email es requerido para login');
                        }
                        return [4 /*yield*/, db
                                .select()
                                .from(users)
                                .where(eq(users.email, data.email))
                                .limit(1)];
                    case 1:
                        user = (_b.sent())[0];
                        if (!user) {
                            throw new Error('Credenciales inválidas');
                        }
                        _a = !user.password;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.compare(data.password, user.password)];
                    case 2:
                        _a = !(_b.sent());
                        _b.label = 3;
                    case 3:
                        // Check password
                        if (_a) {
                            throw new Error('Credenciales inválidas');
                        }
                        return [2 /*return*/, {
                                user: user,
                                message: 'Login exitoso'
                            }];
                }
            });
        });
    };
    /**
     * Get user by ID
     */
    AuthService.prototype.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(users)
                            .where(eq(users.id, userId))
                            .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || null];
                }
            });
        });
    };
    /**
     * Verify email with token (stub)
     */
    AuthService.prototype.verifyEmail = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement email verification
                throw new Error('Email verification not implemented');
            });
        });
    };
    /**
     * Send password reset email (stub)
     */
    AuthService.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement password reset
                throw new Error('Password reset not implemented');
            });
        });
    };
    /**
     * Reset password with token (stub)
     */
    AuthService.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement password reset
                throw new Error('Password reset not implemented');
            });
        });
    };
    /**
     * Enable MFA (stub)
     */
    AuthService.prototype.enableMFA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement MFA
                throw new Error('MFA not implemented');
            });
        });
    };
    /**
     * Verify MFA code (stub)
     */
    AuthService.prototype.verifyMFA = function (userId, code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement MFA
                throw new Error('MFA not implemented');
            });
        });
    };
    /**
     * Disable MFA (stub)
     */
    AuthService.prototype.disableMFA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement MFA
                throw new Error('MFA not implemented');
            });
        });
    };
    return AuthService;
}());
export { AuthService };
export var authService = new AuthService();
