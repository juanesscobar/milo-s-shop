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
import { authService } from './authService';
import { CaptchaService } from './captchaService';
import { registerClientSchema, registerAdminSchema, loginSchema } from '@shared/auth-schema';
import { z } from 'zod';
/**
 * AuthController - Handles all HTTP authentication endpoints
 * Implements comprehensive validation, error handling, and security practices
 */
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    /**
     * POST /api/auth/register/client
     * Register a new client user
     */
    AuthController.prototype.registerClient = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, captchaToken, captchaValid, result_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthController: Client registration request received');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        validatedData = registerClientSchema.parse(req.body);
                        console.log('✅ AuthController: Client data validation passed');
                        if (!CaptchaService.isRequired()) return [3 /*break*/, 3];
                        captchaToken = req.body.captchaToken;
                        if (!captchaToken) {
                            res.status(400).json({
                                error: 'CAPTCHA requerido',
                                details: 'Por favor complete el CAPTCHA'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, CaptchaService.verifyToken(captchaToken, req.ip)];
                    case 2:
                        captchaValid = _a.sent();
                        if (!captchaValid) {
                            res.status(400).json({
                                error: 'CAPTCHA inválido',
                                details: 'Por favor complete el CAPTCHA correctamente'
                            });
                            return [2 /*return*/];
                        }
                        console.log('✅ AuthController: CAPTCHA verification passed');
                        _a.label = 3;
                    case 3: return [4 /*yield*/, authService.registerClient(validatedData)];
                    case 4:
                        result_1 = _a.sent();
                        // Create session
                        if (req.session) {
                            req.session.userId = result_1.user.id;
                            req.session.userRole = result_1.user.role;
                            req.session.save(function (err) {
                                if (err) {
                                    console.error('❌ Session save error:', err);
                                }
                                else {
                                    console.log('✅ Session created for user:', result_1.user.id);
                                }
                            });
                        }
                        console.log('✅ AuthController: Client registration successful');
                        res.status(201).json(result_1);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.handleError(res, error_1, 'Error al registrar cliente');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/register/admin
     * Register a new admin user
     */
    AuthController.prototype.registerAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, result_2, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthController: Admin registration request received');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        validatedData = registerAdminSchema.parse(req.body);
                        console.log('✅ AuthController: Admin data validation passed');
                        return [4 /*yield*/, authService.registerAdmin(validatedData)];
                    case 2:
                        result_2 = _a.sent();
                        // Create session
                        if (req.session) {
                            req.session.userId = result_2.user.id;
                            req.session.userRole = result_2.user.role;
                            req.session.save(function (err) {
                                if (err) {
                                    console.error('❌ Session save error:', err);
                                }
                                else {
                                    console.log('✅ Session created for admin:', result_2.user.id);
                                }
                            });
                        }
                        console.log('✅ AuthController: Admin registration successful');
                        res.status(201).json(result_2);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(res, error_2, 'Error al registrar administrador');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/login
     * Authenticate user login
     */
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, result_3, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthController: Login request received');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        validatedData = loginSchema.parse(req.body);
                        console.log('✅ AuthController: Login data validation passed');
                        return [4 /*yield*/, authService.login(validatedData)];
                    case 2:
                        result_3 = _a.sent();
                        // Create session
                        if (req.session) {
                            req.session.userId = result_3.user.id;
                            req.session.userRole = result_3.user.role;
                            req.session.save(function (err) {
                                if (err) {
                                    console.error('❌ Session save error:', err);
                                }
                                else {
                                    console.log('✅ Session created for user:', result_3.user.id);
                                }
                            });
                        }
                        console.log('✅ AuthController: Login successful for user:', result_3.user.id);
                        res.json(result_3);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        this.handleError(res, error_3, 'Error de autenticación');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/logout
     * Destroy user session
     */
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId_1;
            var _a;
            return __generator(this, function (_b) {
                console.log('🔐 AuthController: Logout request received');
                try {
                    userId_1 = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                    if (req.session) {
                        req.session.destroy(function (err) {
                            if (err) {
                                console.error('❌ Session destroy error:', err);
                                res.status(500).json({
                                    error: 'Error al cerrar sesión',
                                    details: 'No se pudo destruir la sesión'
                                });
                            }
                            else {
                                console.log('✅ Session destroyed for user:', userId_1);
                                res.json({ message: 'Sesión cerrada exitosamente' });
                            }
                        });
                    }
                    else {
                        res.json({ message: 'No hay sesión activa' });
                    }
                }
                catch (error) {
                    this.handleError(res, error, 'Error al cerrar sesión');
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * GET /api/auth/me
     * Get current authenticated user
     */
    AuthController.prototype.getCurrentUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Get current user request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            console.log('❌ AuthController: No user session found');
                            res.status(401).json({
                                error: 'No autenticado',
                                details: 'No hay sesión activa'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.getUserById(userId)];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            console.log('❌ AuthController: User not found in database:', userId);
                            res.status(404).json({
                                error: 'Usuario no encontrado',
                                details: 'El usuario de la sesión no existe'
                            });
                            return [2 /*return*/];
                        }
                        console.log('✅ AuthController: Current user retrieved:', user.id);
                        res.json({ user: user });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        this.handleError(res, error_4, 'Error al obtener usuario actual');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/auth/session/validate
     * Validate current session
     */
    AuthController.prototype.validateSession = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, userRole, user, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Session validation request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = req.session || {}, userId = _a.userId, userRole = _a.userRole;
                        if (!userId || !userRole) {
                            res.status(401).json({
                                valid: false,
                                error: 'Sesión inválida o expirada'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.getUserById(userId)];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            res.status(401).json({
                                valid: false,
                                error: 'Usuario no encontrado'
                            });
                            return [2 /*return*/];
                        }
                        console.log('✅ AuthController: Session valid for user:', userId);
                        res.json({
                            valid: true,
                            user: user,
                            sessionInfo: {
                                userId: userId,
                                userRole: userRole,
                                lastAccess: new Date().toISOString()
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _b.sent();
                        this.handleError(res, error_5, 'Error al validar sesión');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/verify-email
     * Verify user email with token
     */
    AuthController.prototype.verifyEmail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthController: Email verification request');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = req.body.token;
                        if (!token) {
                            res.status(400).json({
                                error: 'Token requerido',
                                details: 'Se requiere un token de verificación'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.verifyEmail(token)];
                    case 2:
                        result = _a.sent();
                        console.log('✅ AuthController: Email verified successfully');
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        this.handleError(res, error_6, 'Error al verificar email');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/forgot-password
     * Send password reset email
     */
    AuthController.prototype.forgotPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔐 AuthController: Forgot password request');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        email = req.body.email;
                        if (!email) {
                            res.status(400).json({
                                error: 'Email requerido',
                                details: 'Se requiere una dirección de email'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.forgotPassword(email)];
                    case 2:
                        result = _a.sent();
                        console.log('✅ AuthController: Password reset email sent');
                        res.json({
                            message: 'Si existe una cuenta con ese email, se ha enviado un enlace de restablecimiento de contraseña'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        this.handleError(res, error_7, 'Error al enviar email de restablecimiento');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/reset-password
     * Reset password with token
     */
    AuthController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, token, newPassword, result, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Password reset request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = req.body, token = _a.token, newPassword = _a.newPassword;
                        if (!token || !newPassword) {
                            res.status(400).json({
                                error: 'Datos requeridos',
                                details: 'Se requiere token y nueva contraseña'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.resetPassword(token, newPassword)];
                    case 2:
                        result = _b.sent();
                        console.log('✅ AuthController: Password reset successfully');
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _b.sent();
                        this.handleError(res, error_8, 'Error al restablecer contraseña');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/enable-mfa
     * Enable MFA for user
     */
    AuthController.prototype.enableMFA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, result, error_9;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Enable MFA request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            res.status(401).json({
                                error: 'No autenticado',
                                details: 'Se requiere sesión activa'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.enableMFA(userId)];
                    case 2:
                        result = _b.sent();
                        console.log('✅ AuthController: MFA enabled successfully');
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _b.sent();
                        this.handleError(res, error_9, 'Error al habilitar MFA');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/verify-mfa
     * Verify MFA code
     */
    AuthController.prototype.verifyMFA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, userId, result, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Verify MFA request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = req.body, code = _a.code, userId = _a.userId;
                        if (!code || !userId) {
                            res.status(400).json({
                                error: 'Datos requeridos',
                                details: 'Se requiere código MFA y ID de usuario'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.verifyMFA(userId, code)];
                    case 2:
                        result = _b.sent();
                        console.log('✅ AuthController: MFA verified successfully');
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _b.sent();
                        this.handleError(res, error_10, 'Error al verificar MFA');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/auth/disable-mfa
     * Disable MFA for user
     */
    AuthController.prototype.disableMFA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, result, error_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔐 AuthController: Disable MFA request');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            res.status(401).json({
                                error: 'No autenticado',
                                details: 'Se requiere sesión activa'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService.disableMFA(userId)];
                    case 2:
                        result = _b.sent();
                        console.log('✅ AuthController: MFA disabled successfully');
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _b.sent();
                        this.handleError(res, error_11, 'Error al deshabilitar MFA');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Private method to handle errors consistently
     */
    AuthController.prototype.handleError = function (res, error, defaultMessage) {
        console.error('❌ AuthController Error:', error);
        if (error instanceof z.ZodError) {
            // Validation errors
            var errorDetails = error.errors.map(function (err) {
                return "".concat(err.path.join('.'), ": ").concat(err.message);
            });
            res.status(400).json({
                error: 'Datos de entrada inválidos',
                details: errorDetails
            });
        }
        else if (error.message) {
            // Known application errors
            var statusCode = this.getStatusCodeForError(error.message);
            res.status(statusCode).json({
                error: error.message,
                details: defaultMessage
            });
        }
        else {
            // Unknown errors
            res.status(500).json({
                error: 'Error interno del servidor',
                details: defaultMessage
            });
        }
    };
    /**
     * Map error messages to appropriate HTTP status codes
     */
    AuthController.prototype.getStatusCodeForError = function (message) {
        var statusMap = {
            'Ya existe un usuario con este teléfono o email': 409,
            'Credenciales inválidas': 401,
            'Usuario no encontrado': 404,
            'Sesión inválida o expirada': 401,
        };
        return statusMap[message] || 500;
    };
    return AuthController;
}());
export { AuthController };
export var authController = new AuthController();
