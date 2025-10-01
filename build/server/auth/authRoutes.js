import express from 'express';
import { authController } from './authController';
import { rateLimitMiddleware, authMiddleware } from './authMiddleware';
/**
 * AuthRoutes - Organizes all authentication-related routes
 * Implements route protection, rate limiting, and proper HTTP methods
 */
export function createAuthRoutes() {
    var router = express.Router();
    // Rate limiting for authentication endpoints
    var authRateLimit = rateLimitMiddleware({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // limit each IP to 10 requests per windowMs for auth endpoints
        message: {
            error: 'Demasiados intentos de autenticación',
            details: 'Inténtalo de nuevo en 15 minutos'
        }
    });
    // Stricter rate limiting for login attempts
    var loginRateLimit = rateLimitMiddleware({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 login attempts per windowMs
        message: {
            error: 'Demasiados intentos de login',
            details: 'Inténtalo de nuevo en 15 minutos'
        }
    });
    /**
     * PUBLIC ROUTES - No authentication required
     */
    // POST /api/auth/register/client - Register new client
    router.post('/register/client', authRateLimit, authController.registerClient.bind(authController));
    // POST /api/auth/register/admin - Register new admin
    router.post('/register/admin', authRateLimit, authController.registerAdmin.bind(authController));
    // POST /api/auth/login - User login
    router.post('/login', loginRateLimit, authController.login.bind(authController));
    /**
     * PROTECTED ROUTES - Authentication required
     */
    // POST /api/auth/logout - User logout
    router.post('/logout', authMiddleware, authController.logout.bind(authController));
    // GET /api/auth/me - Get current user
    router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));
    // GET /api/auth/session/validate - Validate current session
    router.get('/session/validate', authMiddleware, authController.validateSession.bind(authController));
    /**
     * MFA ROUTES - Multi-Factor Authentication
     */
    // POST /api/auth/mfa/enable - Enable MFA for user
    router.post('/mfa/enable', authMiddleware, authController.enableMFA.bind(authController));
    // POST /api/auth/mfa/verify - Verify MFA code and enable
    router.post('/mfa/verify', authController.verifyMFA.bind(authController));
    // POST /api/auth/mfa/disable - Disable MFA for user
    router.post('/mfa/disable', authMiddleware, authController.disableMFA.bind(authController));
    /**
     * EMAIL VERIFICATION ROUTES
     */
    // POST /api/auth/verify-email - Verify user email with token
    router.post('/verify-email', authController.verifyEmail.bind(authController));
    // POST /api/auth/forgot-password - Send password reset email
    router.post('/forgot-password', authController.forgotPassword.bind(authController));
    // POST /api/auth/reset-password - Reset password with token
    router.post('/reset-password', authController.resetPassword.bind(authController));
    console.log('✅ Auth routes configured successfully');
    return router;
}
/**
 * Role-based route protection middleware
 * Usage: router.get('/admin-only', roleMiddleware(['admin']), handler)
 */
export function roleMiddleware(allowedRoles) {
    return function (req, res, next) {
        var _a;
        var userRole = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userRole;
        if (!userRole) {
            return res.status(401).json({
                error: 'No autenticado',
                details: 'Rol de usuario requerido'
            });
        }
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: "Se requiere rol: ".concat(allowedRoles.join(' o '))
            });
        }
        next();
    };
}
/**
 * Admin-only middleware
 */
export var adminOnly = roleMiddleware(['admin']);
/**
 * Client-only middleware
 */
export var clientOnly = roleMiddleware(['client']);
