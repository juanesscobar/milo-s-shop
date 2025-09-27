import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users, companies } from '@shared/auth-schema';
import { services } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * AuthSeed - Production-ready seeding system for authentication
 * Creates test users, companies, and services with proper security
 */
export class AuthSeed {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Seed the database with initial data
   */
  static async seedAll(): Promise<void> {
    console.log('🌱 Starting comprehensive authentication seeding...');

    try {
      // Clear existing data
      await this.clearExistingData();

      // Seed companies first (required for admin users)
      await this.seedCompanies();

      // Seed users (both clients and admins)
      await this.seedUsers();

      // Seed services (existing functionality)
      await this.seedServices();

      console.log('🎉 Authentication seeding completed successfully!');

    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  /**
   * Clear existing data for clean seeding
   */
  private static async clearExistingData(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    
    try {
      // Delete in correct order due to foreign key constraints
      await db.delete(users);
      await db.delete(companies);
      console.log('✅ Cleared existing authentication data');
    } catch (error) {
      console.log('⚠️ No existing data to clear or error clearing:', error);
    }
  }

  /**
   * Seed companies for admin users
   */
  private static async seedCompanies(): Promise<void> {
    console.log('🏢 Seeding companies...');

    const companiesData = [
      {
        name: 'Milos Car Wash',
      },
      {
        name: 'Premium Auto Services',
      },
      {
        name: 'Express Car Care',
      }
    ];

    for (const companyData of companiesData) {
      await db.insert(companies).values({
        ...companyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`✅ Created ${companiesData.length} companies`);
  }

  /**
   * Seed users with proper authentication data
   */
  private static async seedUsers(): Promise<void> {
    console.log('👥 Seeding users...');

    // Test client users
    const clientUsers = [
      {
        name: 'Juan Escobar',
        email: 'escobarbvega.juanandres21@gmail.com',
        phone: '+595973640191',
        password: '123456Aa!', // Meets all security requirements
        role: 'client' as const,
      },
      {
        name: 'María García',
        email: 'maria.garcia@gmail.com',
        phone: '+595984123456',
        password: 'MariaPass123!',
        role: 'client' as const,
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@hotmail.com',
        phone: '+595971234567',
        password: 'Carlos2024@',
        role: 'client' as const,
      },
    ];

    // Test admin users
    const adminUsers = [
      {
        name: 'Admin Principal',
        email: 'admin@miloscarwash.com',
        phone: '+595961000001',
        password: 'AdminPass123!',
        role: 'admin' as const,
        companyId: 1,
      },
      {
        name: 'Laura Administradora',
        email: 'laura@premiumauto.com',
        phone: '+595961000002',
        password: 'LauraAdmin2024@',
        role: 'admin' as const,
        companyId: 2,
      },
    ];

    const allUsers = [...clientUsers, ...adminUsers];

    for (const userData of allUsers) {
      // Hash password with high security
      const passwordHash = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

      // Generate unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Prepare user data for database
      const dbUserData = {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        passwordHash,
        role: userData.role,
        companyId: userData.role === 'admin' ? (userData as any).companyId : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(users).values(dbUserData);

      console.log(`✅ Created ${userData.role} user: ${userData.name} (${userData.email})`);
      
      // Add a small delay to ensure unique timestamps
      await this.delay(10);
    }

    console.log(`✅ Created ${allUsers.length} users total`);
    
    // Display login credentials for testing
    this.displayLoginCredentials(allUsers);
  }

  /**
   * Seed services (maintain existing functionality)
   */
  private static async seedServices(): Promise<void> {
    console.log('🚗 Seeding services...');

    const servicesData = [
      {
        id: "service_basic_wash",
        slug: "basic_wash",
        title: "Lavado Básico",
        description: "Lavado exterior completo con jabón, enjuague y secado. Incluye llantas y rines.",
        prices: {
          auto: 25000,
          suv: 30000,
          camioneta: 35000
        },
        active: true
      },
      {
        id: "service_premium_wash",
        slug: "premium_wash",
        title: "Lavado Premium",
        description: "Lavado completo exterior e interior, aspirado, tablero, cristales y perfumado.",
        prices: {
          auto: 45000,
          suv: 55000,
          camioneta: 65000
        },
        active: true
      },
      {
        id: "service_detail_complete",
        slug: "detail_complete",
        title: "Detallado Completo",
        description: "Servicio premium con cera, pulido, tratamiento de cuero y protección UV.",
        prices: {
          auto: 80000,
          suv: 100000,
          camioneta: 120000
        },
        active: true
      },
      {
        id: "service_express_wash",
        slug: "express_wash",
        title: "Lavado Express",
        description: "Lavado rápido exterior, ideal para mantenimiento semanal.",
        prices: {
          auto: 15000,
          suv: 18000,
          camioneta: 22000
        },
        active: true
      },
      {
        id: "service_engine_wash",
        slug: "engine_wash",
        title: "Lavado de Motor",
        description: "Limpieza especializada del compartimento del motor con productos específicos.",
        prices: {
          auto: 35000,
          suv: 40000,
          camioneta: 45000
        },
        active: true
      },
      {
        id: "service_ceramic_coating",
        slug: "ceramic_coating",
        title: "Recubrimiento Cerámico",
        description: "Protección avanzada con recubrimiento cerámico de larga duración.",
        prices: {
          auto: 150000,
          suv: 180000,
          camioneta: 220000
        },
        active: true
      }
    ];

    // Clear existing services
    try {
      await db.delete(services);
    } catch (error) {
      console.log('⚠️ No existing services to clear');
    }

    // Insert new services
    for (const service of servicesData) {
      await db.insert(services).values({
        ...service,
        createdAt: new Date(),
      });
    }

    console.log(`✅ Created ${servicesData.length} services`);
  }

  /**
   * Display login credentials for testing
   */
  private static displayLoginCredentials(users: any[]): void {
    console.log('\n📋 LOGIN CREDENTIALS FOR TESTING:');
    console.log('='.repeat(60));
    
    const clients = users.filter(u => u.role === 'client');
    const admins = users.filter(u => u.role === 'admin');

    if (clients.length > 0) {
      console.log('\n👤 CLIENTES:');
      clients.forEach(user => {
        console.log(`   📧 ${user.email}`);
        console.log(`   📱 ${user.phone}`);
        console.log(`   🔑 ${user.password}`);
        console.log(`   ---`);
      });
    }

    if (admins.length > 0) {
      console.log('\n🔐 ADMINISTRADORES:');
      admins.forEach(user => {
        console.log(`   📧 ${user.email}`);
        console.log(`   📱 ${user.phone}`);
        console.log(`   🔑 ${user.password}`);
        console.log(`   ---`);
      });
    }

    console.log('\n✅ Usa estas credenciales para probar el sistema de autenticación');
    console.log('='.repeat(60));
  }

  /**
   * Utility function to add delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<void> {
    console.log('\n📊 USER STATISTICS:');
    
    const allUsers = await db.select().from(users);
    const allCompanies = await db.select().from(companies);
    
    const clientCount = allUsers.filter(u => u.role === 'client').length;
    const adminCount = allUsers.filter(u => u.role === 'admin').length;

    console.log(`   Total Users: ${allUsers.length}`);
    console.log(`   Clients: ${clientCount}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Companies: ${allCompanies.length}`);
  }
}

// Execute seeding directly
AuthSeed.seedAll()
  .then(async () => {
    await AuthSeed.getUserStats();
    console.log('✅ Seeding script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });