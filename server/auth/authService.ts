import bcrypt from 'bcrypt';
import { eq, and, or, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  users,
  companies,
  sessions,
  type RegisterClientData,
  type RegisterAdminData,
  type LoginData,
  type AuthResponse,
  type ErrorResponse
} from '@shared/auth-schema';

type UserWithPassword = typeof users.$inferSelect;
type User = Omit<UserWithPassword, 'passwordHash'>;

/**
 * AuthService - Centralizes all authentication business logic
 * Implements security best practices with bcrypt, session management, and comprehensive validation
 */
export class AuthService {
  private static readonly SALT_ROUNDS = 12; // High security salt rounds
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Register a new client user
   * @param data Client registration data
   * @returns Promise<AuthResponse>
   */
  async registerClient(data: RegisterClientData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Registering new client:', { name: data.name, phone: data.phone, email: data.email });
    
    try {
      // Check for existing user by phone or email
      const existingUser = await this.findUserByPhoneOrEmail(data.phone, data.email);
      if (existingUser) {
        console.log('❌ AuthService: User already exists with phone/email');
        throw new Error('Ya existe un usuario con este teléfono o email');
      }

      // Hash password with high salt rounds
      const passwordHash = await bcrypt.hash(data.password, AuthService.SALT_ROUNDS);
      console.log('✅ AuthService: Password hashed successfully');

      // Generate unique user ID
      const userId = this.generateUserId();

      // Prepare user data
      const userData = {
        id: userId,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: this.normalizePhoneNumber(data.phone),
        passwordHash,
        role: 'client' as const,
        companyId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert user into database
      await db.insert(users).values(userData);
      console.log('✅ AuthService: Client user created successfully:', userId);

      // Return user without sensitive data
      const safeUser = await this.getSafeUser(userId);
      return {
        user: safeUser!,
        message: 'Cliente registrado exitosamente'
      };

    } catch (error) {
      console.error('❌ AuthService: Error registering client:', error);
      throw error;
    }
  }

  /**
   * Register a new admin user
   * @param data Admin registration data
   * @returns Promise<AuthResponse>
   */
  async registerAdmin(data: RegisterAdminData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Registering new admin:', { name: data.name, companyName: data.companyName, phone: data.phone, email: data.email });
    
    try {
      // Check for existing user by phone or email
      const existingUser = await this.findUserByPhoneOrEmail(data.phone, data.email);
      if (existingUser) {
        console.log('❌ AuthService: User already exists with phone/email');
        throw new Error('Ya existe un usuario con este teléfono o email');
      }

      // Hash password with high salt rounds
      const passwordHash = await bcrypt.hash(data.password, AuthService.SALT_ROUNDS);
      console.log('✅ AuthService: Password hashed successfully');

      // Create company first
      const companyId = await this.createCompany(data.companyName);
      console.log('✅ AuthService: Company created:', companyId);

      // Generate unique user ID
      const userId = this.generateUserId();

      // Prepare user data
      const userData = {
        id: userId,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: this.normalizePhoneNumber(data.phone),
        passwordHash,
        role: 'admin' as const,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert user into database
      await db.insert(users).values(userData);
      console.log('✅ AuthService: Admin user created successfully:', userId);

      // Return user without sensitive data
      const safeUser = await this.getSafeUser(userId);
      return {
        user: safeUser!,
        message: 'Administrador registrado exitosamente'
      };

    } catch (error) {
      console.error('❌ AuthService: Error registering admin:', error);
      throw error;
    }
  }

  /**
   * Authenticate user login
   * @param data Login data
   * @returns Promise<AuthResponse>
   */
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Processing login for email:', data.email);
    
    try {
      // Find user by email
      const user = await this.findUserByEmail(data.email!);
      if (!user) {
        console.log('❌ AuthService: User not found for email:', data.email);
        throw new Error('Credenciales inválidas');
      }

      console.log('✅ AuthService: User found:', user.id);

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValidPassword) {
        console.log('❌ AuthService: Invalid password for user:', user.id);
        throw new Error('Credenciales inválidas');
      }

      console.log('✅ AuthService: Password verified successfully');

      // Return safe user data
      const safeUser = await this.getSafeUser(user.id);
      return {
        user: safeUser!,
        message: 'Login exitoso'
      };

    } catch (error) {
      console.error('❌ AuthService: Error during login:', error);
      throw error;
    }
  }

  /**
   * Get user by ID (safe, without password hash)
   * @param userId User ID
   * @returns Promise<User | null>
   */
  async getUserById(userId: string): Promise<User | null> {
    return await this.getSafeUser(userId);
  }

  /**
   * Create a new session
   * @param userId User ID
   * @param sessionData Session data
   * @returns Promise<string> Session ID
   */
  async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + AuthService.SESSION_DURATION);

    await db.insert(sessions).values({
      id: sessionId,
      userId,
      data: JSON.stringify(sessionData),
      expiresAt,
      createdAt: new Date(),
    });

    console.log('✅ AuthService: Session created:', sessionId);
    return sessionId;
  }

  /**
   * Destroy a session
   * @param sessionId Session ID
   */
  async destroySession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    console.log('✅ AuthService: Session destroyed:', sessionId);
  }

  /**
   * Clean expired sessions
   */
  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    const result = await db.delete(sessions).where(sql`expires_at < ${now.getTime()}`);
    console.log('🧹 AuthService: Cleaned expired sessions');
  }

  // Private helper methods

  private async findUserByPhoneOrEmail(phone: string, email?: string): Promise<UserWithPassword | undefined> {
    const normalizedPhone = this.normalizePhoneNumber(phone);
    
    const conditions = [eq(users.phone, normalizedPhone)];
    if (email) {
      conditions.push(eq(users.email, email));
    }

    const [user] = await db.select()
      .from(users)
      .where(or(...conditions))
      .limit(1);

    return user;
  }

  private async findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  private async getSafeUser(userId: string): Promise<User | null> {
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      companyId: users.companyId,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, userId)).limit(1);

    return user as User || null;
  }

  private async createCompany(name: string): Promise<number> {
    const [company] = await db.insert(companies).values({
      name: name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: companies.id });

    return company.id;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters and normalize
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('595')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+595${cleaned.substring(1)}`;
    } else {
      return `+595${cleaned}`;
    }
  }
}

export const authService = new AuthService();