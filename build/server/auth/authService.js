var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { eq, or, sql } from 'drizzle-orm';
import { db } from '../db';
import { emailService } from './emailService';
import { users, companies, sessions, emailVerificationTokens, passwordResetTokens } from '@shared/auth-schema';
import crypto from 'crypto';
/**
 * AuthService - Centraliza toda la lógica de negocio de autenticación
 * Implementa mejores prácticas de seguridad con bcrypt, manejo de sesiones y validación completa
 */
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    /**
     * Registra un nuevo usuario cliente
     * @param data Datos de registro del cliente
     * @returns Promise<AuthResponse>
     */
    AuthService.prototype.registerClient = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, passwordHash, userId, userData, safeUser, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthService: Registrando nuevo cliente:', { name: data.name, phone: data.phone, email: data.email });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.findUserByPhoneOrEmail(data.phone, data.email)];
                    case 2:
                        existingUser = _b.sent();
                        if (existingUser) {
                            console.log('❌ AuthService: Usuario ya existe con teléfono/email');
                            throw new Error('Ya existe un usuario con este teléfono o email');
                        }
                        return [4 /*yield*/, bcrypt.hash(data.password, AuthService.SALT_ROUNDS)];
                    case 3:
                        passwordHash = _b.sent();
                        console.log('✅ AuthService: Contraseña hasheada exitosamente');
                        userId = this.generateUserId();
                        userData = {
                            id: userId,
                            name: data.name.trim(),
                            email: ((_a = data.email) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                            phone: this.normalizePhoneNumber(data.phone),
                            passwordHash: passwordHash,
                            role: 'client',
                            companyId: null,
                            emailVerified: false,
                            mfaEnabled: false,
                            mfaSecret: null,
                            mfaBackupCodes: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        // Insertar usuario en la base de datos
                        return [4 /*yield*/, db.insert(users).values(userData)];
                    case 4:
                        // Insertar usuario en la base de datos
                        _b.sent();
                        console.log('✅ AuthService: Usuario cliente creado exitosamente:', userId);
                        if (!data.email) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sendVerificationEmail(userId, data.email, data.name)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [4 /*yield*/, this.getSafeUser(userId)];
                    case 7:
                        safeUser = _b.sent();
                        return [2 /*return*/, {
                                user: safeUser,
                                message: 'Cliente registrado exitosamente. Revisa tu email para verificar tu cuenta.'
                            }];
                    case 8:
                        error_1 = _b.sent();
                        console.error('❌ AuthService: Error registrando cliente:', error_1);
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Registra un nuevo usuario administrador
     * @param data Datos de registro del administrador
     * @returns Promise<AuthResponse>
     */
    AuthService.prototype.registerAdmin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, passwordHash, companyId, userId, userData, safeUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Registrando nuevo administrador:', { name: data.name, companyName: data.companyName, phone: data.phone, email: data.email });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.findUserByPhoneOrEmail(data.phone, data.email)];
                    case 2:
                        existingUser = _a.sent();
                        if (existingUser) {
                            console.log('❌ AuthService: Usuario ya existe con teléfono/email');
                            throw new Error('Ya existe un usuario con este teléfono o email');
                        }
                        return [4 /*yield*/, bcrypt.hash(data.password, AuthService.SALT_ROUNDS)];
                    case 3:
                        passwordHash = _a.sent();
                        console.log('✅ AuthService: Contraseña hasheada exitosamente');
                        return [4 /*yield*/, this.createCompany(data.companyName)];
                    case 4:
                        companyId = _a.sent();
                        console.log('✅ AuthService: Compañía creada:', companyId);
                        userId = this.generateUserId();
                        userData = {
                            id: userId,
                            name: data.name.trim(),
                            email: data.email.trim(),
                            phone: this.normalizePhoneNumber(data.phone),
                            passwordHash: passwordHash,
                            role: 'admin',
                            companyId: companyId,
                            emailVerified: false,
                            mfaEnabled: false,
                            mfaSecret: null,
                            mfaBackupCodes: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        // Insertar usuario en la base de datos
                        return [4 /*yield*/, db.insert(users).values(userData)];
                    case 5:
                        // Insertar usuario en la base de datos
                        _a.sent();
                        console.log('✅ AuthService: Usuario administrador creado exitosamente:', userId);
                        return [4 /*yield*/, this.getSafeUser(userId)];
                    case 6:
                        safeUser = _a.sent();
                        return [2 /*return*/, {
                                user: safeUser,
                                message: 'Administrador registrado exitosamente'
                            }];
                    case 7:
                        error_2 = _a.sent();
                        console.error('❌ AuthService: Error registrando administrador:', error_2);
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Autentica el login del usuario
     * @param data Datos de login
     * @returns Promise<AuthResponse>
     */
    AuthService.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidPassword, safeUser, isValidMFA, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Procesando login para email:', data.email);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.findUserByEmail(data.email)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            console.log('❌ AuthService: Usuario no encontrado para email:', data.email);
                            throw new Error('Credenciales inválidas');
                        }
                        console.log('✅ AuthService: Usuario encontrado:', user.id);
                        return [4 /*yield*/, bcrypt.compare(data.password, user.passwordHash)];
                    case 3:
                        isValidPassword = _a.sent();
                        if (!isValidPassword) {
                            console.log('❌ AuthService: Contraseña inválida para usuario:', user.id);
                            throw new Error('Credenciales inválidas');
                        }
                        console.log('✅ AuthService: Contraseña verificada exitosamente');
                        return [4 /*yield*/, this.getSafeUser(user.id)];
                    case 4:
                        safeUser = _a.sent();
                        if (!(safeUser === null || safeUser === void 0 ? void 0 : safeUser.mfaEnabled)) return [3 /*break*/, 6];
                        // MFA está habilitado, requerir token MFA
                        if (!data.mfaToken) {
                            console.log('⚠️ AuthService: MFA requerido para usuario:', user.id);
                            return [2 /*return*/, {
                                    user: safeUser,
                                    message: 'MFA requerido',
                                    requiresMFA: true
                                }];
                        }
                        return [4 /*yield*/, this.verifyMFA(user.id, data.mfaToken)];
                    case 5:
                        isValidMFA = _a.sent();
                        if (!isValidMFA) {
                            console.log('❌ AuthService: Token MFA inválido para usuario:', user.id);
                            throw new Error('Código MFA inválido');
                        }
                        console.log('✅ AuthService: MFA verificado exitosamente');
                        _a.label = 6;
                    case 6: return [2 /*return*/, {
                            user: safeUser,
                            message: 'Login exitoso'
                        }];
                    case 7:
                        error_3 = _a.sent();
                        console.error('❌ AuthService: Error durante login:', error_3);
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene usuario por ID (seguro, sin hash de contraseña)
     * @param userId ID del usuario
     * @returns Promise<User | null>
     */
    AuthService.prototype.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSafeUser(userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Crea una nueva sesión
     * @param userId ID del usuario
     * @param sessionData Datos de sesión
     * @returns Promise<string> ID de sesión
     */
    AuthService.prototype.createSession = function (userId, sessionData) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, expiresAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = this.generateSessionId();
                        expiresAt = new Date(Date.now() + AuthService.SESSION_DURATION);
                        return [4 /*yield*/, db.insert(sessions).values({
                                id: sessionId,
                                userId: userId,
                                data: JSON.stringify(sessionData),
                                expiresAt: expiresAt,
                                createdAt: new Date(),
                            })];
                    case 1:
                        _a.sent();
                        console.log('✅ AuthService: Sesión creada:', sessionId);
                        return [2 /*return*/, sessionId];
                }
            });
        });
    };
    /**
     * Destruye una sesión
     * @param sessionId ID de sesión
     */
    AuthService.prototype.destroySession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.delete(sessions).where(eq(sessions.id, sessionId))];
                    case 1:
                        _a.sent();
                        console.log('✅ AuthService: Sesión destruida:', sessionId);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Limpia sesiones expiradas
     */
    AuthService.prototype.cleanExpiredSessions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Math.floor(Date.now() / 1000);
                        return [4 /*yield*/, db.delete(sessions).where(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["expires_at < ", ""], ["expires_at < ", ""])), now))];
                    case 1:
                        result = _a.sent();
                        console.log('🧹 AuthService: Sesiones expiradas limpiadas');
                        return [2 /*return*/];
                }
            });
        });
    };
    // Métodos auxiliares privados
    AuthService.prototype.findUserByPhoneOrEmail = function (phone, email) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedPhone, conditions, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedPhone = this.normalizePhoneNumber(phone);
                        conditions = [eq(users.phone, normalizedPhone)];
                        if (email) {
                            conditions.push(eq(users.email, email));
                        }
                        return [4 /*yield*/, db.select()
                                .from(users)
                                .where(or.apply(void 0, conditions))
                                .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.prototype.findUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select()
                            .from(users)
                            .where(eq(users.email, email))
                            .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.prototype.getSafeUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select({
                            id: users.id,
                            name: users.name,
                            email: users.email,
                            phone: users.phone,
                            role: users.role,
                            companyId: users.companyId,
                            mfaEnabled: users.mfaEnabled,
                            mfaSecret: users.mfaSecret,
                            mfaBackupCodes: users.mfaBackupCodes,
                            createdAt: users.createdAt,
                            updatedAt: users.updatedAt,
                        }).from(users).where(eq(users.id, userId)).limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || null];
                }
            });
        });
    };
    AuthService.prototype.createCompany = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var company;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(companies).values({
                            name: name.trim(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }).returning({ id: companies.id })];
                    case 1:
                        company = (_a.sent())[0];
                        return [2 /*return*/, company.id];
                }
            });
        });
    };
    AuthService.prototype.generateUserId = function () {
        return "user_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
    };
    AuthService.prototype.generateSessionId = function () {
        return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
    };
    AuthService.prototype.normalizePhoneNumber = function (phone) {
        // Remover todos los caracteres no dígitos y normalizar
        var cleaned = phone.replace(/\D/g, '');
        // Manejar diferentes formatos
        if (cleaned.startsWith('595')) {
            return "+".concat(cleaned);
        }
        else if (cleaned.startsWith('0')) {
            return "+595".concat(cleaned.substring(1));
        }
        else {
            return "+595".concat(cleaned);
        }
    };
    /**
     * Envía email de verificación al usuario
     * @param userId ID del usuario
     * @param email Email del usuario
     * @param userName Nombre del usuario
     */
    AuthService.prototype.sendVerificationEmail = function (userId, email, userName) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationToken, expiresAt, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        verificationToken = this.generateVerificationToken();
                        expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
                        // Almacenar token de verificación en la base de datos
                        return [4 /*yield*/, db.insert(emailVerificationTokens).values({
                                id: this.generateTokenId(),
                                userId: userId,
                                token: verificationToken,
                                expiresAt: expiresAt,
                                createdAt: new Date(),
                            })];
                    case 1:
                        // Almacenar token de verificación en la base de datos
                        _a.sent();
                        // Enviar email de verificación
                        return [4 /*yield*/, emailService.sendVerificationEmail(email, verificationToken, userName)];
                    case 2:
                        // Enviar email de verificación
                        _a.sent();
                        console.log('✅ AuthService: Email de verificación enviado a:', email);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('❌ AuthService: Error enviando email de verificación:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica email con token
     * @param token Token de verificación
     * @returns Promise<boolean> Estado de éxito
     */
    AuthService.prototype.verifyEmail = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenRecord, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, db.select()
                                .from(emailVerificationTokens)
                                .where(eq(emailVerificationTokens.token, token))
                                .limit(1)];
                    case 1:
                        tokenRecord = (_a.sent())[0];
                        if (!tokenRecord) {
                            console.log('❌ AuthService: Token de verificación no encontrado');
                            return [2 /*return*/, false];
                        }
                        if (!(tokenRecord.expiresAt.getTime() < Date.now())) return [3 /*break*/, 3];
                        console.log('❌ AuthService: Token de verificación expirado');
                        // Limpiar token expirado
                        return [4 /*yield*/, db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id))];
                    case 2:
                        // Limpiar token expirado
                        _a.sent();
                        return [2 /*return*/, false];
                    case 3: 
                    // Actualizar usuario como verificado
                    return [4 /*yield*/, db.update(users)
                            .set({ emailVerified: true, updatedAt: new Date() })
                            .where(eq(users.id, tokenRecord.userId))];
                    case 4:
                        // Actualizar usuario como verificado
                        _a.sent();
                        // Limpiar token usado
                        return [4 /*yield*/, db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id))];
                    case 5:
                        // Limpiar token usado
                        _a.sent();
                        console.log('✅ AuthService: Email verificado para usuario:', tokenRecord.userId);
                        return [2 /*return*/, true];
                    case 6:
                        error_5 = _a.sent();
                        console.error('❌ AuthService: Error verificando email:', error_5);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Envía email de restablecimiento de contraseña
     * @param email Email del usuario
     * @returns Promise<boolean> Estado de éxito
     */
    AuthService.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken, expiresAt, safeUser, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.findUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            console.log('❌ AuthService: Usuario no encontrado para restablecimiento de contraseña:', email);
                            // No revelar si el email existe por seguridad
                            return [2 /*return*/, true];
                        }
                        resetToken = this.generateVerificationToken();
                        expiresAt = new Date(Date.now() + (60 * 60 * 1000));
                        // Almacenar token de restablecimiento en la base de datos
                        return [4 /*yield*/, db.insert(passwordResetTokens).values({
                                id: this.generateTokenId(),
                                userId: user.id,
                                token: resetToken,
                                expiresAt: expiresAt,
                                createdAt: new Date(),
                            })];
                    case 2:
                        // Almacenar token de restablecimiento en la base de datos
                        _a.sent();
                        return [4 /*yield*/, this.getSafeUser(user.id)];
                    case 3:
                        safeUser = _a.sent();
                        if (!safeUser) {
                            return [2 /*return*/, false];
                        }
                        // Enviar email de restablecimiento
                        return [4 /*yield*/, emailService.sendPasswordResetEmail(email, resetToken, safeUser.name)];
                    case 4:
                        // Enviar email de restablecimiento
                        _a.sent();
                        console.log('✅ AuthService: Email de restablecimiento de contraseña enviado a:', email);
                        return [2 /*return*/, true];
                    case 5:
                        error_6 = _a.sent();
                        console.error('❌ AuthService: Error enviando email de restablecimiento de contraseña:', error_6);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Restablece contraseña con token
     * @param token Token de restablecimiento
     * @param newPassword Nueva contraseña
     * @returns Promise<boolean> Estado de éxito
     */
    AuthService.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenRecord, passwordHash, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, db.select()
                                .from(passwordResetTokens)
                                .where(eq(passwordResetTokens.token, token))
                                .limit(1)];
                    case 1:
                        tokenRecord = (_a.sent())[0];
                        if (!tokenRecord) {
                            console.log('❌ AuthService: Token de restablecimiento de contraseña no encontrado');
                            return [2 /*return*/, false];
                        }
                        if (!(tokenRecord.expiresAt.getTime() < Date.now())) return [3 /*break*/, 3];
                        console.log('❌ AuthService: Token de restablecimiento de contraseña expirado');
                        // Limpiar token expirado
                        return [4 /*yield*/, db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenRecord.id))];
                    case 2:
                        // Limpiar token expirado
                        _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [4 /*yield*/, bcrypt.hash(newPassword, AuthService.SALT_ROUNDS)];
                    case 4:
                        passwordHash = _a.sent();
                        // Actualizar contraseña del usuario
                        return [4 /*yield*/, db.update(users)
                                .set({ passwordHash: passwordHash, updatedAt: new Date() })
                                .where(eq(users.id, tokenRecord.userId))];
                    case 5:
                        // Actualizar contraseña del usuario
                        _a.sent();
                        // Limpiar token usado
                        return [4 /*yield*/, db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenRecord.id))];
                    case 6:
                        // Limpiar token usado
                        _a.sent();
                        console.log('✅ AuthService: Restablecimiento de contraseña exitoso para usuario:', tokenRecord.userId);
                        return [2 /*return*/, true];
                    case 7:
                        error_7 = _a.sent();
                        console.error('❌ AuthService: Error restableciendo contraseña:', error_7);
                        return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.generateVerificationToken = function () {
        return crypto.randomBytes(32).toString('hex');
    };
    AuthService.prototype.generateTokenId = function () {
        return "token_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 15));
    };
    /**
     * Genera códigos de respaldo para MFA
     * @param count Cantidad de códigos a generar
     * @returns Array de códigos de respaldo
     */
    AuthService.prototype.generateBackupCodes = function (count) {
        var codes = [];
        for (var i = 0; i < count; i++) {
            codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    };
    /**
     * Habilita MFA para un usuario - Genera secreto TOTP y códigos de respaldo
     * Este método configura MFA pero no lo activa hasta que se verifique el primer código
     * @param userId ID del usuario
     * @returns Promise<{secret: string, qrCodeUrl: string, backupCodes: string[]}>
     *          - secret: Secreto TOTP en base32
     *          - qrCodeUrl: URL para generar código QR en aplicaciones autenticadoras
     *          - backupCodes: Array de códigos de respaldo para acceso de emergencia
     */
    AuthService.prototype.enableMFA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var secret, backupCodes, qrCodeUrl, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Habilitando MFA para usuario:', userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        secret = speakeasy.generateSecret({
                            name: 'Milo\'s Shop',
                            issuer: 'Milo\'s Shop',
                            length: 32
                        });
                        backupCodes = this.generateBackupCodes(10);
                        qrCodeUrl = speakeasy.otpauthURL({
                            secret: secret.base32,
                            label: 'Milo\'s Shop',
                            issuer: 'Milo\'s Shop',
                            encoding: 'base32'
                        });
                        // Actualizar usuario en la base de datos
                        return [4 /*yield*/, db.update(users)
                                .set({
                                mfaSecret: secret.base32,
                                mfaBackupCodes: JSON.stringify(backupCodes),
                                mfaEnabled: false, // Se habilita después de verificar el primer código
                                updatedAt: new Date()
                            })
                                .where(eq(users.id, userId))];
                    case 2:
                        // Actualizar usuario en la base de datos
                        _a.sent();
                        console.log('✅ AuthService: MFA configurado para usuario:', userId);
                        return [2 /*return*/, {
                                secret: secret.base32,
                                qrCodeUrl: qrCodeUrl,
                                backupCodes: backupCodes
                            }];
                    case 3:
                        error_8 = _a.sent();
                        console.error('❌ AuthService: Error habilitando MFA:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica código MFA y habilita definitivamente
     * Este método valida el primer código TOTP generado por la app autenticadora
     * y habilita permanentemente MFA para el usuario
     * @param userId ID del usuario
     * @param token Código TOTP de 6 dígitos generado por la app autenticadora
     * @returns Promise<boolean> true si la verificación fue exitosa y MFA se habilitó
     */
    AuthService.prototype.verifyAndEnableMFA = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user, verified, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Verificando y habilitando MFA para usuario:', userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getSafeUser(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user || !user.mfaSecret) {
                            console.log('❌ AuthService: Usuario no encontrado o MFA no configurado');
                            return [2 /*return*/, false];
                        }
                        verified = speakeasy.totp.verify({
                            secret: user.mfaSecret,
                            encoding: 'base32',
                            token: token,
                            window: 2 // Permitir ventana de 2 intervalos (30 segundos antes/después)
                        });
                        if (!verified) {
                            console.log('❌ AuthService: Código MFA inválido');
                            return [2 /*return*/, false];
                        }
                        // Habilitar MFA definitivamente
                        return [4 /*yield*/, db.update(users)
                                .set({
                                mfaEnabled: true,
                                updatedAt: new Date()
                            })
                                .where(eq(users.id, userId))];
                    case 3:
                        // Habilitar MFA definitivamente
                        _a.sent();
                        console.log('✅ AuthService: MFA habilitado exitosamente para usuario:', userId);
                        return [2 /*return*/, true];
                    case 4:
                        error_9 = _a.sent();
                        console.error('❌ AuthService: Error verificando MFA:', error_9);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica código MFA durante login
     * Soporta tanto códigos TOTP como códigos de respaldo para acceso de emergencia
     * @param userId ID del usuario
     * @param token Código TOTP de 6 dígitos o código de respaldo de 8 caracteres
     * @returns Promise<boolean> true si el código es válido
     */
    AuthService.prototype.verifyMFA = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user, verified, backupCodes, codeIndex, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Verificando MFA para usuario:', userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.getSafeUser(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user || !user.mfaEnabled || !user.mfaSecret) {
                            console.log('❌ AuthService: Usuario no encontrado o MFA no habilitado');
                            return [2 /*return*/, false];
                        }
                        verified = speakeasy.totp.verify({
                            secret: user.mfaSecret,
                            encoding: 'base32',
                            token: token,
                            window: 2
                        });
                        if (verified) {
                            console.log('✅ AuthService: Código TOTP válido');
                            return [2 /*return*/, true];
                        }
                        if (!user.mfaBackupCodes) return [3 /*break*/, 4];
                        backupCodes = JSON.parse(user.mfaBackupCodes);
                        codeIndex = backupCodes.indexOf(token);
                        if (!(codeIndex !== -1)) return [3 /*break*/, 4];
                        // Remover el código usado
                        backupCodes.splice(codeIndex, 1);
                        // Actualizar códigos de respaldo en la base de datos
                        return [4 /*yield*/, db.update(users)
                                .set({
                                mfaBackupCodes: JSON.stringify(backupCodes),
                                updatedAt: new Date()
                            })
                                .where(eq(users.id, userId))];
                    case 3:
                        // Actualizar códigos de respaldo en la base de datos
                        _a.sent();
                        console.log('✅ AuthService: Código de respaldo válido usado');
                        return [2 /*return*/, true];
                    case 4:
                        console.log('❌ AuthService: Código MFA inválido');
                        return [2 /*return*/, false];
                    case 5:
                        error_10 = _a.sent();
                        console.error('❌ AuthService: Error verificando MFA:', error_10);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deshabilita MFA para un usuario
     * Elimina completamente la configuración MFA del usuario, incluyendo secreto y códigos de respaldo
     * @param userId ID del usuario
     * @returns Promise<boolean> true si MFA fue deshabilitado exitosamente
     */
    AuthService.prototype.disableMFA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthService: Deshabilitando MFA para usuario:', userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db.update(users)
                                .set({
                                mfaSecret: null,
                                mfaEnabled: false,
                                mfaBackupCodes: null,
                                updatedAt: new Date()
                            })
                                .where(eq(users.id, userId))];
                    case 2:
                        _a.sent();
                        console.log('✅ AuthService: MFA deshabilitado para usuario:', userId);
                        return [2 /*return*/, true];
                    case 3:
                        error_11 = _a.sent();
                        console.error('❌ AuthService: Error deshabilitando MFA:', error_11);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifica si un usuario tiene MFA habilitado
     * @param userId ID del usuario
     * @returns Promise<boolean>
     */
    AuthService.prototype.hasMFAEnabled = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select({ mfaEnabled: users.mfaEnabled })
                                .from(users)
                                .where(eq(users.id, userId))
                                .limit(1)];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.mfaEnabled) === true];
                    case 2:
                        error_12 = _a.sent();
                        console.error('❌ AuthService: Error verificando estado MFA:', error_12);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.SALT_ROUNDS = 12; // Rondas de sal de alta seguridad
    AuthService.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
    return AuthService;
}());
export { AuthService };
export var authService = new AuthService();
var templateObject_1;
