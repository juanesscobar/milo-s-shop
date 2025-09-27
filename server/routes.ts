// Import new auth schema
import { users as authUsers, type InsertUser as AuthInsertUser } from "@shared/auth-schema";

// Import auth controller
import { authController } from './auth/authController';

// Extender la interfaz de Session para incluir nuestras propiedades personalizadas
declare module 'express-session' {
  interface SessionData {
    userId?: string;      // ID del usuario autenticado
    userRole?: string;    // Rol del usuario (client, admin, operator)
  }
}

// Cache simple en memoria para servicios
const servicesCache = {
  data: null as any[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutos
};

/**
 * Registra todas las rutas de la API en la aplicación Express
 *
 * Esta función configura:
 * - Rutas REST para servicios, usuarios, vehículos, reservas y pagos
 * - Middleware de subida de archivos con Multer
 * - Servidor WebSocket con Socket.IO para actualizaciones en tiempo real
 * - Autenticación básica para el panel de administración
 *
 * @param app - Instancia de Express donde registrar las rutas
 * @returns Promise<Server> - Servidor HTTP configurado con WebSockets
 */
export async function registerRoutes(app: Express): Promise<Server> {
