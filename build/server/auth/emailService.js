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
import nodemailer from 'nodemailer';
/**
 * EmailService - Handles email sending for authentication features
 * Implements secure email delivery with proper error handling
 */
var EmailService = /** @class */ (function () {
    function EmailService() {
        // Create transporter with SMTP configuration
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    /**
     * Send email verification link
     */
    EmailService.prototype.sendVerificationEmail = function (email, token, userName) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationUrl, mailOptions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        verificationUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:5173', "/verify-email?token=").concat(token);
                        mailOptions = {
                            from: "\"Milos Shop\" <".concat(process.env.SMTP_USER, ">"),
                            to: email,
                            subject: 'Verifica tu cuenta - Milos Shop',
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <h2 style=\"color: #333;\">\u00A1Bienvenido a Milos Shop, ".concat(userName, "!</h2>\n          <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu direcci\u00F3n de email haciendo clic en el siguiente enlace:</p>\n          <div style=\"text-align: center; margin: 30px 0;\">\n            <a href=\"").concat(verificationUrl, "\" style=\"background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;\">Verificar Email</a>\n          </div>\n          <p>Este enlace expirar\u00E1 en 24 horas.</p>\n          <p>Si no solicitaste esta verificaci\u00F3n, puedes ignorar este email.</p>\n          <hr style=\"border: none; border-top: 1px solid #eee; margin: 20px 0;\">\n          <p style=\"color: #666; font-size: 12px;\">Milos Shop - Servicio de Lavado Automotriz</p>\n        </div>\n      "),
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transporter.sendMail(mailOptions)];
                    case 2:
                        _a.sent();
                        console.log('✅ EmailService: Verification email sent to:', email);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ EmailService: Failed to send verification email:', error_1);
                        throw new Error('Error al enviar email de verificación');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send password reset link
     */
    EmailService.prototype.sendPasswordResetEmail = function (email, token, userName) {
        return __awaiter(this, void 0, void 0, function () {
            var resetUrl, mailOptions, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:5173', "/reset-password?token=").concat(token);
                        mailOptions = {
                            from: "\"Milos Shop\" <".concat(process.env.SMTP_USER, ">"),
                            to: email,
                            subject: 'Restablecer Contraseña - Milos Shop',
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <h2 style=\"color: #333;\">Restablecer Contrase\u00F1a</h2>\n          <p>Hola ".concat(userName, ",</p>\n          <p>Recibimos una solicitud para restablecer tu contrase\u00F1a. Haz clic en el siguiente enlace para crear una nueva contrase\u00F1a:</p>\n          <div style=\"text-align: center; margin: 30px 0;\">\n            <a href=\"").concat(resetUrl, "\" style=\"background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;\">Restablecer Contrase\u00F1a</a>\n          </div>\n          <p>Este enlace expirar\u00E1 en 1 hora por razones de seguridad.</p>\n          <p>Si no solicitaste este cambio, puedes ignorar este email. Tu contrase\u00F1a permanecer\u00E1 sin cambios.</p>\n          <hr style=\"border: none; border-top: 1px solid #eee; margin: 20px 0;\">\n          <p style=\"color: #666; font-size: 12px;\">Milos Shop - Servicio de Lavado Automotriz</p>\n        </div>\n      "),
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transporter.sendMail(mailOptions)];
                    case 2:
                        _a.sent();
                        console.log('✅ EmailService: Password reset email sent to:', email);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('❌ EmailService: Failed to send password reset email:', error_2);
                        throw new Error('Error al enviar email de restablecimiento');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send MFA code via SMS (placeholder - would integrate with SMS service)
     */
    EmailService.prototype.sendMFACode = function (phone, code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This is a placeholder for SMS integration
                // In production, integrate with services like Twilio, AWS SNS, etc.
                console.log("\uD83D\uDCF1 MFA Code for ".concat(phone, ": ").concat(code));
                return [2 /*return*/];
            });
        });
    };
    return EmailService;
}());
export { EmailService };
export var emailService = new EmailService();
