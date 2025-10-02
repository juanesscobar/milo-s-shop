import { db } from '../db.js';
import { users, insertUserSchema } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * AuthService - Core authentication business logic
 * Handles user registration, login, and user management
 */
export class AuthService {
  /**
   * Register a new client user
   */
  async registerClient(data: { name: string; phone: string; email?: string; password?: string }) {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, data.phone))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Ya existe un usuario con este teléfono o email');
    }

    // Hash password if provided
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : null;

    // Create user
    const [user] = await db
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
      .returning();

    return {
      user,
      message: 'Cliente registrado exitosamente'
    };
  }

  /**
   * Register a new admin user
   */
  async registerAdmin(data: { name: string; phone: string; email: string; password: string }) {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, data.phone))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Ya existe un usuario con este teléfono o email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create admin user
    const [user] = await db
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
      .returning();

    return {
      user,
      message: 'Administrador registrado exitosamente'
    };
  }

  /**
   * Authenticate user login
   */
  async login(data: { email?: string; password: string }) {
    if (!data.email) {
      throw new Error('Email es requerido para login');
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Check password
    if (!user.password || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Credenciales inválidas');
    }

    return {
      user,
      message: 'Login exitoso'
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  }

  /**
   * Verify email with token (stub)
   */
  async verifyEmail(token: string) {
    // TODO: Implement email verification
    throw new Error('Email verification not implemented');
  }

  /**
   * Send password reset email (stub)
   */
  async forgotPassword(email: string) {
    // TODO: Implement password reset
    throw new Error('Password reset not implemented');
  }

  /**
   * Reset password with token (stub)
   */
  async resetPassword(token: string, newPassword: string) {
    // TODO: Implement password reset
    throw new Error('Password reset not implemented');
  }

  /**
   * Enable MFA (stub)
   */
  async enableMFA(userId: string) {
    // TODO: Implement MFA
    throw new Error('MFA not implemented');
  }

  /**
   * Verify MFA code (stub)
   */
  async verifyMFA(userId: string, code: string) {
    // TODO: Implement MFA
    throw new Error('MFA not implemented');
  }

  /**
   * Disable MFA (stub)
   */
  async disableMFA(userId: string) {
    // TODO: Implement MFA
    throw new Error('MFA not implemented');
  }
}

export const authService = new AuthService();