import { Request, Response } from 'express';
import { authService } from './authService';
import { CaptchaService } from './captchaService';
import {
  registerClientSchema,
  registerAdminSchema,
  loginSchema,
  type ErrorResponse
} from '@shared/auth-schema';
import { z } from 'zod';

/**
 * AuthController - Handles all HTTP authentication endpoints
 * Implements comprehensive validation, error handling, and security practices
 */
export class AuthController {

  /**
   * POST /api/auth/register/client
   * Register a new client user
   */
  async registerClient(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Client registration request received');

    try {
      // Validate request body
      const validatedData = registerClientSchema.parse(req.body);
      console.log('✅ AuthController: Client data validation passed');

      // Verify CAPTCHA if required
      if (CaptchaService.isRequired()) {
        const captchaToken = req.body.captchaToken;
        if (!captchaToken) {
          res.status(400).json({
            error: 'CAPTCHA requerido',
            details: 'Por favor complete el CAPTCHA'
          } as ErrorResponse);
          return;
        }

        const captchaValid = await CaptchaService.verifyToken(captchaToken, req.ip);
        if (!captchaValid) {
          res.status(400).json({
            error: 'CAPTCHA inválido',
            details: 'Por favor complete el CAPTCHA correctamente'
          } as ErrorResponse);
          return;
        }
        console.log('✅ AuthController: CAPTCHA verification passed');
      }

      // Register client through service
      const result = await authService.registerClient(validatedData);

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role;
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session save error:', err);
          } else {
            console.log('✅ Session created for user:', result.user.id);
          }
        });
      }

      console.log('✅ AuthController: Client registration successful');
      res.status(201).json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al registrar cliente');
    }
  }

  /**
   * POST /api/auth/register/admin
   * Register a new admin user
   */
  async registerAdmin(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Admin registration request received');
    
    try {
      // Validate request body
      const validatedData = registerAdminSchema.parse(req.body);
      console.log('✅ AuthController: Admin data validation passed');

      // Register admin through service
      const result = await authService.registerAdmin(validatedData);

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role;
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session save error:', err);
          } else {
            console.log('✅ Session created for admin:', result.user.id);
          }
        });
      }

      console.log('✅ AuthController: Admin registration successful');
      res.status(201).json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al registrar administrador');
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user login
   */
  async login(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Login request received');
    
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      console.log('✅ AuthController: Login data validation passed');

      // Authenticate through service
      const result = await authService.login(validatedData);

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role;
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session save error:', err);
          } else {
            console.log('✅ Session created for user:', result.user.id);
          }
        });
      }

      console.log('✅ AuthController: Login successful for user:', result.user.id);
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error de autenticación');
    }
  }

  /**
   * POST /api/auth/logout
   * Destroy user session
   */
  async logout(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Logout request received');
    
    try {
      const userId = req.session?.userId;

      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('❌ Session destroy error:', err);
            res.status(500).json({ 
              error: 'Error al cerrar sesión',
              details: 'No se pudo destruir la sesión' 
            } as ErrorResponse);
          } else {
            console.log('✅ Session destroyed for user:', userId);
            res.json({ message: 'Sesión cerrada exitosamente' });
          }
        });
      } else {
        res.json({ message: 'No hay sesión activa' });
      }

    } catch (error) {
      this.handleError(res, error, 'Error al cerrar sesión');
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Get current user request');
    
    try {
      const userId = req.session?.userId;

      if (!userId) {
        console.log('❌ AuthController: No user session found');
        res.status(401).json({ 
          error: 'No autenticado',
          details: 'No hay sesión activa' 
        } as ErrorResponse);
        return;
      }

      // Get user data through service
      const user = await authService.getUserById(userId);
      
      if (!user) {
        console.log('❌ AuthController: User not found in database:', userId);
        res.status(404).json({ 
          error: 'Usuario no encontrado',
          details: 'El usuario de la sesión no existe' 
        } as ErrorResponse);
        return;
      }

      console.log('✅ AuthController: Current user retrieved:', user.id);
      res.json({ user });

    } catch (error) {
      this.handleError(res, error, 'Error al obtener usuario actual');
    }
  }

  /**
   * GET /api/auth/session/validate
   * Validate current session
   */
  async validateSession(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Session validation request');

    try {
      const { userId, userRole } = req.session || {};

      if (!userId || !userRole) {
        res.status(401).json({
          valid: false,
          error: 'Sesión inválida o expirada'
        });
        return;
      }

      // Verify user still exists in database
      const user = await authService.getUserById(userId);
      if (!user) {
        res.status(401).json({
          valid: false,
          error: 'Usuario no encontrado'
        });
        return;
      }

      console.log('✅ AuthController: Session valid for user:', userId);
      res.json({
        valid: true,
        user,
        sessionInfo: {
          userId,
          userRole,
          lastAccess: new Date().toISOString()
        }
      });

    } catch (error) {
      this.handleError(res, error, 'Error al validar sesión');
    }
  }

  /**
   * POST /api/auth/verify-email
   * Verify user email with token
   */
  async verifyEmail(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Email verification request');

    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          error: 'Token requerido',
          details: 'Se requiere un token de verificación'
        } as ErrorResponse);
        return;
      }

      const result = await authService.verifyEmail(token);

      console.log('✅ AuthController: Email verified successfully');
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al verificar email');
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Send password reset email
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Forgot password request');

    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          error: 'Email requerido',
          details: 'Se requiere una dirección de email'
        } as ErrorResponse);
        return;
      }

      const result = await authService.forgotPassword(email);

      console.log('✅ AuthController: Password reset email sent');
      res.json({
        message: 'Si existe una cuenta con ese email, se ha enviado un enlace de restablecimiento de contraseña'
      });

    } catch (error) {
      this.handleError(res, error, 'Error al enviar email de restablecimiento');
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Password reset request');

    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          error: 'Datos requeridos',
          details: 'Se requiere token y nueva contraseña'
        } as ErrorResponse);
        return;
      }

      const result = await authService.resetPassword(token, newPassword);

      console.log('✅ AuthController: Password reset successfully');
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al restablecer contraseña');
    }
  }

  /**
   * POST /api/auth/enable-mfa
   * Enable MFA for user
   */
  async enableMFA(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Enable MFA request');

    try {
      const userId = req.session?.userId;

      if (!userId) {
        res.status(401).json({
          error: 'No autenticado',
          details: 'Se requiere sesión activa'
        } as ErrorResponse);
        return;
      }

      const result = await authService.enableMFA(userId);

      console.log('✅ AuthController: MFA enabled successfully');
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al habilitar MFA');
    }
  }

  /**
   * POST /api/auth/verify-mfa
   * Verify MFA code
   */
  async verifyMFA(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Verify MFA request');

    try {
      const { code, userId } = req.body;

      if (!code || !userId) {
        res.status(400).json({
          error: 'Datos requeridos',
          details: 'Se requiere código MFA y ID de usuario'
        } as ErrorResponse);
        return;
      }

      const result = await authService.verifyMFA(userId, code);

      console.log('✅ AuthController: MFA verified successfully');
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al verificar MFA');
    }
  }

  /**
   * POST /api/auth/disable-mfa
   * Disable MFA for user
   */
  async disableMFA(req: Request, res: Response): Promise<void> {
    console.log('🔐 AuthController: Disable MFA request');

    try {
      const userId = req.session?.userId;

      if (!userId) {
        res.status(401).json({
          error: 'No autenticado',
          details: 'Se requiere sesión activa'
        } as ErrorResponse);
        return;
      }

      const result = await authService.disableMFA(userId);

      console.log('✅ AuthController: MFA disabled successfully');
      res.json(result);

    } catch (error) {
      this.handleError(res, error, 'Error al deshabilitar MFA');
    }
  }

  /**
   * Private method to handle errors consistently
   */
  private handleError(res: Response, error: any, defaultMessage: string): void {
    console.error('❌ AuthController Error:', error);

    if (error instanceof z.ZodError) {
      // Validation errors
      const errorDetails = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errorDetails
      } as ErrorResponse);
      
    } else if (error.message) {
      // Known application errors
      const statusCode = this.getStatusCodeForError(error.message);
      res.status(statusCode).json({
        error: error.message,
        details: defaultMessage
      } as ErrorResponse);
      
    } else {
      // Unknown errors
      res.status(500).json({
        error: 'Error interno del servidor',
        details: defaultMessage
      } as ErrorResponse);
    }
  }

  /**
   * Map error messages to appropriate HTTP status codes
   */
  private getStatusCodeForError(message: string): number {
    const statusMap: Record<string, number> = {
      'Ya existe un usuario con este teléfono o email': 409,
      'Credenciales inválidas': 401,
      'Usuario no encontrado': 404,
      'Sesión inválida o expirada': 401,
    };

    return statusMap[message] || 500;
  }
}

export const authController = new AuthController();