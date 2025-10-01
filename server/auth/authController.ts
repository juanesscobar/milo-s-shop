import { authService } from './authService';
import { CaptchaService } from './captchaService';
import { registerClientSchema, registerAdminSchema, loginSchema } from '@shared/auth-schema';
import { z } from 'zod';
import express from 'express';

/**
 * AuthController - Handles all HTTP authentication endpoints
 * Implements comprehensive validation, error handling, and security practices
 */
export class AuthController {
  /**
   * POST /api/auth/register/client
   * Register a new client user
   */
  async registerClient(req: express.Request, res: express.Response): Promise<void> {
    console.log('🔐 AuthController: Client registration request received');

    try {
      const validatedData = registerClientSchema.parse(req.body);
      console.log('✅ AuthController: Client data validation passed');

      if (CaptchaService.isRequired()) {
        const captchaToken = req.body.captchaToken;
        if (!captchaToken) {
          res.status(400).json({
            error: 'CAPTCHA requerido',
            details: 'Por favor complete el CAPTCHA'
          });
          return;
        }
        const captchaValid = await CaptchaService.verifyToken(captchaToken, req.ip || '');
        if (!captchaValid) {
          res.status(400).json({
            error: 'CAPTCHA inválido',
            details: 'Por favor complete el CAPTCHA correctamente'
          });
          return;
        }
        console.log('✅ AuthController: CAPTCHA verification passed');
      }

      const result = await authService.registerClient(validatedData);

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role as 'client' | 'admin';
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
  async registerAdmin(req: express.Request, res: express.Response): Promise<void> {
    console.log('🔐 AuthController: Admin registration request received');

    try {
      const validatedData = registerAdminSchema.parse(req.body);
      console.log('✅ AuthController: Admin data validation passed');

      const result = await authService.registerAdmin(validatedData);

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role as 'client' | 'admin';
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
  async login(req: express.Request, res: express.Response): Promise<void> {
    console.log('🔐 AuthController: Login request received');

    try {
      const validatedData = loginSchema.parse(req.body);
      console.log('✅ AuthController: Login data validation passed');

      const result = await authService.login({
        email: validatedData.email,
        password: validatedData.password
      });

      // Create session
      if (req.session) {
        req.session.userId = result.user.id;
        req.session.userRole = result.user.role as 'client' | 'admin';
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
  async logout(req: express.Request, res: express.Response): Promise<void> {
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
            });
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
  async getCurrentUser(req: express.Request, res: express.Response): Promise<void> {
    console.log('🔐 AuthController: Get current user request');

    try {
      const userId = req.session?.userId;

      if (!userId) {
        console.log('❌ AuthController: No user session found');
        res.status(401).json({
          error: 'No autenticado',
          details: 'No hay sesión activa'
        });
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        console.log('❌ AuthController: User not found in database:', userId);
        res.status(404).json({
          error: 'Usuario no encontrado',
          details: 'El usuario de la sesión no existe'
        });
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
  async validateSession(req: express.Request, res: express.Response): Promise<void> {
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

  // Stub methods for remaining functionality
  async verifyEmail(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async forgotPassword(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async resetPassword(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async enableMFA(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async verifyMFA(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async disableMFA(req: express.Request, res: express.Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  /**
   * Private method to handle errors consistently
   */
  private handleError(res: express.Response, error: any, defaultMessage: string): void {
    console.error('❌ AuthController Error:', error);

    if (error instanceof z.ZodError) {
      // Validation errors
      const errorDetails = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errorDetails
      });
    } else if (error.message) {
      // Known application errors
      const statusCode = this.getStatusCodeForError(error.message);
      res.status(statusCode).json({
        error: error.message,
        details: defaultMessage
      });
    } else {
      // Unknown errors
      res.status(500).json({
        error: 'Error interno del servidor',
        details: defaultMessage
      });
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