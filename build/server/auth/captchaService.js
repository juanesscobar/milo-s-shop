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
import axios from 'axios';
/**
 * CaptchaService - Handles CAPTCHA verification using Google reCAPTCHA v3
 */
var CaptchaService = /** @class */ (function () {
    function CaptchaService() {
    }
    /**
     * Verify reCAPTCHA token
     * @param token The reCAPTCHA token from the client
     * @param remoteIp Optional remote IP address
     * @returns Promise<boolean> True if verification passes
     */
    CaptchaService.verifyToken = function (token, remoteIp) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, success, score, errorCodes, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🔐 CaptchaService: Verifying reCAPTCHA token');
                        return [4 /*yield*/, axios.post(this.RECAPTCHA_VERIFY_URL, null, {
                                params: {
                                    secret: this.RECAPTCHA_SECRET_KEY,
                                    response: token,
                                    remoteip: remoteIp,
                                },
                                timeout: 10000, // 10 second timeout
                            })];
                    case 1:
                        response = _b.sent();
                        _a = response.data, success = _a.success, score = _a.score, errorCodes = _a["error-codes"];
                        if (!success) {
                            console.log('❌ CaptchaService: reCAPTCHA verification failed:', errorCodes);
                            return [2 /*return*/, false];
                        }
                        // For reCAPTCHA v3, check the score (0.0 - 1.0)
                        // Typically, scores >= 0.5 are considered valid
                        if (score !== undefined && score < 0.5) {
                            console.log('❌ CaptchaService: reCAPTCHA score too low:', score);
                            return [2 /*return*/, false];
                        }
                        console.log('✅ CaptchaService: reCAPTCHA verification successful, score:', score);
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _b.sent();
                        console.error('❌ CaptchaService: Error verifying reCAPTCHA:', error_1);
                        // In production, you might want to fail closed (return false)
                        // For development, you might want to allow if reCAPTCHA is not configured
                        return [2 /*return*/, process.env.NODE_ENV === 'development' && !this.RECAPTCHA_SECRET_KEY];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if CAPTCHA is required for the current environment
     */
    CaptchaService.isRequired = function () {
        return !!this.RECAPTCHA_SECRET_KEY && this.RECAPTCHA_SECRET_KEY !== 'your-secret-key-here';
    };
    CaptchaService.RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'your-secret-key-here';
    CaptchaService.RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
    return CaptchaService;
}());
export { CaptchaService };
export var captchaService = new CaptchaService();
