import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { eq, and, or, sql } from 'drizzle-orm';
import { db } from '../db';
import { emailService } from './emailService';
import {
  users,
  companies,
  sessions,
  emailVerificationTokens,
  passwordResetTokens,
  type RegisterClientData,
  type RegisterAdminData,
  type LoginData,
  type AuthResponse,
  type ErrorResponse
} from '@shared/auth-schema';
import crypto from 'crypto';

type UserWithPassword = typeof users.$inferSelect;
type User = Omit<UserWithPassword, 'passwordHash'>;

/**
 * AuthService - Centraliza toda la lógica de negocio de autenticación
 * Implementa mejores prácticas de seguridad con bcrypt, manejo de sesiones y validación completa
 */
export class AuthService {
  private static readonly SALT_ROUNDS = 12; // Rondas de sal de alta seguridad
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Registra un nuevo usuario cliente
   * @param data Datos de registro del cliente
   * @returns Promise<AuthResponse>
   */
  async registerClient(data: RegisterClientData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Registrando nuevo cliente:', { name: data.name, phone: data.phone, email: data.email });

    try {
      // Verificar usuario existente por teléfono o email
      const existingUser = await this.findUserByPhoneOrEmail(data.phone, data.email);
      if (existingUser) {
        console.log('❌ AuthService: Usuario ya existe con teléfono/email');
        throw new Error('Ya existe un usuario con este teléfono o email');
      }

      // Hashear contraseña con rondas de sal altas
      const passwordHash = await bcrypt.hash(data.password, AuthService.SALT_ROUNDS);
      console.log('✅ AuthService: Contraseña hasheada exitosamente');

      // Generar ID único de usuario
      const userId = this.generateUserId();

      // Preparar datos del usuario
      const userData = {
        id: userId,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: this.normalizePhoneNumber(data.phone),
        passwordHash,
        role: 'client' as const,
        companyId: null,
        emailVerified: false,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insertar usuario en la base de datos
      await db.insert(users).values(userData);
      console.log('✅ AuthService: Usuario cliente creado exitosamente:', userId);

      // Enviar email de verificación si se proporcionó email
      if (data.email) {
        await this.sendVerificationEmail(userId, data.email, data.name);
      }

      // Retornar usuario sin datos sensibles
      const safeUser = await this.getSafeUser(userId);
      return {
        user: safeUser!,
        message: 'Cliente registrado exitosamente. Revisa tu email para verificar tu cuenta.'
      };

    } catch (error) {
      console.error('❌ AuthService: Error registrando cliente:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario administrador
   * @param data Datos de registro del administrador
   * @returns Promise<AuthResponse>
   */
  async registerAdmin(data: RegisterAdminData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Registrando nuevo administrador:', { name: data.name, companyName: data.companyName, phone: data.phone, email: data.email });

    try {
      // Verificar usuario existente por teléfono o email
      const existingUser = await this.findUserByPhoneOrEmail(data.phone, data.email);
      if (existingUser) {
        console.log('❌ AuthService: Usuario ya existe con teléfono/email');
        throw new Error('Ya existe un usuario con este teléfono o email');
      }

      // Hashear contraseña con rondas de sal altas
      const passwordHash = await bcrypt.hash(data.password, AuthService.SALT_ROUNDS);
      console.log('✅ AuthService: Contraseña hasheada exitosamente');

      // Crear compañía primero
      const companyId = await this.createCompany(data.companyName);
      console.log('✅ AuthService: Compañía creada:', companyId);

      // Generar ID único de usuario
      const userId = this.generateUserId();

      // Preparar datos del usuario
      const userData = {
        id: userId,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: this.normalizePhoneNumber(data.phone),
        passwordHash,
        role: 'admin' as const,
        companyId,
        emailVerified: false,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insertar usuario en la base de datos
      await db.insert(users).values(userData);
      console.log('✅ AuthService: Usuario administrador creado exitosamente:', userId);

      // Retornar usuario sin datos sensibles
      const safeUser = await this.getSafeUser(userId);
      return {
        user: safeUser!,
        message: 'Administrador registrado exitosamente'
      };

    } catch (error) {
      console.error('❌ AuthService: Error registrando administrador:', error);
      throw error;
    }
  }

  /**
   * Autentica el login del usuario
   * @param data Datos de login
   * @returns Promise<AuthResponse>
   */
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 AuthService: Procesando login para email:', data.email);

    try {
      // Encontrar usuario por email
      const user = await this.findUserByEmail(data.email!);
      if (!user) {
        console.log('❌ AuthService: Usuario no encontrado para email:', data.email);
        throw new Error('Credenciales inválidas');
      }

      console.log('✅ AuthService: Usuario encontrado:', user.id);

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValidPassword) {
        console.log('❌ AuthService: Contraseña inválida para usuario:', user.id);
        throw new Error('Credenciales inválidas');
      }

      console.log('✅ AuthService: Contraseña verificada exitosamente');

      // Verificar si MFA está habilitado
      const safeUser = await this.getSafeUser(user.id);
      if (safeUser?.mfaEnabled) {
        // MFA está habilitado, requerir token MFA
        if (!data.mfaToken) {
          console.log('⚠️ AuthService: MFA requerido para usuario:', user.id);
          return {
            user: safeUser,
            message: 'MFA requerido',
            requiresMFA: true
          };
        }

        // Verificar token MFA
        const isValidMFA = await this.verifyMFA(user.id, data.mfaToken);
        if (!isValidMFA) {
          console.log('❌ AuthService: Token MFA inválido para usuario:', user.id);
          throw new Error('Código MFA inválido');
        }

        console.log('✅ AuthService: MFA verificado exitosamente');
      }

      return {
        user: safeUser!,
        message: 'Login exitoso'
      };

    } catch (error) {
      console.error('❌ AuthService: Error durante login:', error);
      throw error;
    }
  }

  /**
   * Obtiene usuario por ID (seguro, sin hash de contraseña)
   * @param userId ID del usuario
   * @returns Promise<User | null>
   */
  async getUserById(userId: string): Promise<User | null> {
    return await this.getSafeUser(userId);
  }

  /**
   * Crea una nueva sesión
   * @param userId ID del usuario
   * @param sessionData Datos de sesión
   * @returns Promise<string> ID de sesión
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

    console.log('✅ AuthService: Sesión creada:', sessionId);
    return sessionId;
  }

  /**
   * Destruye una sesión
   * @param sessionId ID de sesión
   */
  async destroySession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    console.log('✅ AuthService: Sesión destruida:', sessionId);
  }

  /**
   * Limpia sesiones expiradas
   */
  async cleanExpiredSessions(): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const result = await db.delete(sessions).where(sql`expires_at < ${now}`);
    console.log('🧹 AuthService: Sesiones expiradas limpiadas');
  }

  // Métodos auxiliares privados

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
      mfaEnabled: users.mfaEnabled,
      mfaSecret: users.mfaSecret,
      mfaBackupCodes: users.mfaBackupCodes,
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
    // Remover todos los caracteres no dígitos y normalizar
    const cleaned = phone.replace(/\D/g, '');

    // Manejar diferentes formatos
    if (cleaned.startsWith('595')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+595${cleaned.substring(1)}`;
    } else {
      return `+595${cleaned}`;
    }
  }

  /**
   * Envía email de verificación al usuario
   * @param userId ID del usuario
   * @param email Email del usuario
   * @param userName Nombre del usuario
   */
  private async sendVerificationEmail(userId: string, email: string, userName: string): Promise<void> {
    try {
      // Generar token de verificación
      const verificationToken = this.generateVerificationToken();

      // Calcular expiración (24 horas desde ahora)
      const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));

      // Almacenar token de verificación en la base de datos
      await db.insert(emailVerificationTokens).values({
        id: this.generateTokenId(),
        userId,
        token: verificationToken,
        expiresAt,
        createdAt: new Date(),
      });

      // Enviar email de verificación
      await emailService.sendVerificationEmail(email, verificationToken, userName);

      console.log('✅ AuthService: Email de verificación enviado a:', email);
    } catch (error) {
      console.error('❌ AuthService: Error enviando email de verificación:', error);
      // No lanzar error aquí - el registro debe suceder incluso si el email falla
    }
  }

  /**
   * Verifica email con token
   * @param token Token de verificación
   * @returns Promise<boolean> Estado de éxito
   */
  async verifyEmail(token: string): Promise<boolean> {
    try {
      // Encontrar token en la base de datos
      const [tokenRecord] = await db.select()
        .from(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token))
        .limit(1);

      if (!tokenRecord) {
        console.log('❌ AuthService: Token de verificación no encontrado');
        return false;
      }

      // Verificar si el token está expirado
      if (tokenRecord.expiresAt.getTime() < Date.now()) {
        console.log('❌ AuthService: Token de verificación expirado');
        // Limpiar token expirado
        await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id));
        return false;
      }

      // Actualizar usuario como verificado
      await db.update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, tokenRecord.userId));

      // Limpiar token usado
      await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id));

      console.log('✅ AuthService: Email verificado para usuario:', tokenRecord.userId);
      return true;
    } catch (error) {
      console.error('❌ AuthService: Error verificando email:', error);
      return false;
    }
  }

  /**
   * Envía email de restablecimiento de contraseña
   * @param email Email del usuario
   * @returns Promise<boolean> Estado de éxito
   */
  async forgotPassword(email: string): Promise<boolean> {
    try {
      // Encontrar usuario por email
      const user = await this.findUserByEmail(email);
      if (!user) {
        console.log('❌ AuthService: Usuario no encontrado para restablecimiento de contraseña:', email);
        // No revelar si el email existe por seguridad
        return true;
      }

      // Generar token de restablecimiento
      const resetToken = this.generateVerificationToken();

      // Calcular expiración (1 hora desde ahora)
      const expiresAt = new Date(Date.now() + (60 * 60 * 1000));

      // Almacenar token de restablecimiento en la base de datos
      await db.insert(passwordResetTokens).values({
        id: this.generateTokenId(),
        userId: user.id,
        token: resetToken,
        expiresAt,
        createdAt: new Date(),
      });

      // Obtener nombre del usuario
      const safeUser = await this.getSafeUser(user.id);
      if (!safeUser) {
        return false;
      }

      // Enviar email de restablecimiento
      await emailService.sendPasswordResetEmail(email, resetToken, safeUser.name);

      console.log('✅ AuthService: Email de restablecimiento de contraseña enviado a:', email);
      return true;
    } catch (error) {
      console.error('❌ AuthService: Error enviando email de restablecimiento de contraseña:', error);
      return false;
    }
  }

  /**
   * Restablece contraseña con token
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   * @returns Promise<boolean> Estado de éxito
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Encontrar token en la base de datos
      const [tokenRecord] = await db.select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token))
        .limit(1);

      if (!tokenRecord) {
        console.log('❌ AuthService: Token de restablecimiento de contraseña no encontrado');
        return false;
      }

      // Verificar si el token está expirado
      if (tokenRecord.expiresAt.getTime() < Date.now()) {
        console.log('❌ AuthService: Token de restablecimiento de contraseña expirado');
        // Limpiar token expirado
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenRecord.id));
        return false;
      }

      // Hashear nueva contraseña
      const passwordHash = await bcrypt.hash(newPassword, AuthService.SALT_ROUNDS);

      // Actualizar contraseña del usuario
      await db.update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, tokenRecord.userId));

      // Limpiar token usado
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenRecord.id));

      console.log('✅ AuthService: Restablecimiento de contraseña exitoso para usuario:', tokenRecord.userId);
      return true;
    } catch (error) {
      console.error('❌ AuthService: Error restableciendo contraseña:', error);
      return false;
    }
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateTokenId(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Genera códigos de respaldo para MFA
   * @param count Cantidad de códigos a generar
   * @returns Array de códigos de respaldo
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Habilita MFA para un usuario - Genera secreto TOTP y códigos de respaldo
   * Este método configura MFA pero no lo activa hasta que se verifique el primer código
   * @param userId ID del usuario
   * @returns Promise<{secret: string, qrCodeUrl: string, backupCodes: string[]}>
   *          - secret: Secreto TOTP en base32
   *          - qrCodeUrl: URL para generar código QR en aplicaciones autenticadoras
   *          - backupCodes: Array de códigos de respaldo para acceso de emergencia
   */
  async enableMFA(userId: string): Promise<{secret: string, qrCodeUrl: string, backupCodes: string[]}> {
    console.log('🔐 AuthService: Habilitando MFA para usuario:', userId);

    try {
      // Generar secreto TOTP
      const secret = speakeasy.generateSecret({
        name: 'Milo\'s Shop',
        issuer: 'Milo\'s Shop',
        length: 32
      });

      // Generar códigos de respaldo
      const backupCodes = this.generateBackupCodes(10);

      // Generar URL del código QR
      const qrCodeUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'Milo\'s Shop',
        issuer: 'Milo\'s Shop',
        encoding: 'base32'
      });

      // Actualizar usuario en la base de datos
      await db.update(users)
        .set({
          mfaSecret: secret.base32,
          mfaBackupCodes: JSON.stringify(backupCodes),
          mfaEnabled: false, // Se habilita después de verificar el primer código
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('✅ AuthService: MFA configurado para usuario:', userId);
      return {
        secret: secret.base32,
        qrCodeUrl,
        backupCodes
      };
    } catch (error) {
      console.error('❌ AuthService: Error habilitando MFA:', error);
      throw error;
    }
  }

  /**
   * Verifica código MFA y habilita definitivamente
   * Este método valida el primer código TOTP generado por la app autenticadora
   * y habilita permanentemente MFA para el usuario
   * @param userId ID del usuario
   * @param token Código TOTP de 6 dígitos generado por la app autenticadora
   * @returns Promise<boolean> true si la verificación fue exitosa y MFA se habilitó
   */
  async verifyAndEnableMFA(userId: string, token: string): Promise<boolean> {
    console.log('🔐 AuthService: Verificando y habilitando MFA para usuario:', userId);

    try {
      // Obtener usuario
      const user = await this.getSafeUser(userId);
      if (!user || !user.mfaSecret) {
        console.log('❌ AuthService: Usuario no encontrado o MFA no configurado');
        return false;
      }

      // Verificar token TOTP
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2 // Permitir ventana de 2 intervalos (30 segundos antes/después)
      });

      if (!verified) {
        console.log('❌ AuthService: Código MFA inválido');
        return false;
      }

      // Habilitar MFA definitivamente
      await db.update(users)
        .set({
          mfaEnabled: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('✅ AuthService: MFA habilitado exitosamente para usuario:', userId);
      return true;
    } catch (error) {
      console.error('❌ AuthService: Error verificando MFA:', error);
      return false;
    }
  }

  /**
   * Verifica código MFA durante login
   * Soporta tanto códigos TOTP como códigos de respaldo para acceso de emergencia
   * @param userId ID del usuario
   * @param token Código TOTP de 6 dígitos o código de respaldo de 8 caracteres
   * @returns Promise<boolean> true si el código es válido
   */
  async verifyMFA(userId: string, token: string): Promise<boolean> {
    console.log('🔐 AuthService: Verificando MFA para usuario:', userId);

    try {
      // Obtener usuario
      const user = await this.getSafeUser(userId);
      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        console.log('❌ AuthService: Usuario no encontrado o MFA no habilitado');
        return false;
      }

      // Primero intentar verificar como código TOTP
      let verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (verified) {
        console.log('✅ AuthService: Código TOTP válido');
        return true;
      }

      // Si no es TOTP válido, verificar códigos de respaldo
      if (user.mfaBackupCodes) {
        const backupCodes = JSON.parse(user.mfaBackupCodes);
        const codeIndex = backupCodes.indexOf(token);

        if (codeIndex !== -1) {
          // Remover el código usado
          backupCodes.splice(codeIndex, 1);

          // Actualizar códigos de respaldo en la base de datos
          await db.update(users)
            .set({
              mfaBackupCodes: JSON.stringify(backupCodes),
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));

          console.log('✅ AuthService: Código de respaldo válido usado');
          return true;
        }
      }

      console.log('❌ AuthService: Código MFA inválido');
      return false;
    } catch (error) {
      console.error('❌ AuthService: Error verificando MFA:', error);
      return false;
    }
  }

  /**
   * Deshabilita MFA para un usuario
   * Elimina completamente la configuración MFA del usuario, incluyendo secreto y códigos de respaldo
   * @param userId ID del usuario
   * @returns Promise<boolean> true si MFA fue deshabilitado exitosamente
   */
  async disableMFA(userId: string): Promise<boolean> {
    console.log('🔐 AuthService: Deshabilitando MFA para usuario:', userId);

    try {
      await db.update(users)
        .set({
          mfaSecret: null,
          mfaEnabled: false,
          mfaBackupCodes: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('✅ AuthService: MFA deshabilitado para usuario:', userId);
      return true;
    } catch (error) {
      console.error('❌ AuthService: Error deshabilitando MFA:', error);
      return false;
    }
  }

  /**
   * Verifica si un usuario tiene MFA habilitado
   * @param userId ID del usuario
   * @returns Promise<boolean>
   */
  async hasMFAEnabled(userId: string): Promise<boolean> {
    try {
      const [user] = await db.select({ mfaEnabled: users.mfaEnabled })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return user?.mfaEnabled === true;
    } catch (error) {
      console.error('❌ AuthService: Error verificando estado MFA:', error);
      return false;
    }
  }
}

export const authService = new AuthService();