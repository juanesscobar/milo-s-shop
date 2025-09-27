import 'dotenv/config';
import { db } from "./db";
import { services, users } from "@shared/schema";
import bcrypt from 'bcrypt';

const seedServices = [
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

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing services and users
    await db.delete(services);
    await db.delete(users);

    // Insert services
    for (const service of seedServices) {
      await db.insert(services).values(service);
    }

    // Insert test users with different formats for testing
    const testUsers = [
      {
        id: "user_test_123",
        name: "Usuario Test",
        email: "test@example.com",
        phone: "123456789",
        password: await bcrypt.hash("Test123!", 12),
        role: "client" as const,
        language: "es",
        isGuest: false,
        createdAt: new Date()
      },
      {
        id: "user_juan_escobar",
        name: "Juan Escobar",
        email: "escobarbvega.juanandres21@gmail.com",
        phone: "+595973640191",
        password: await bcrypt.hash("123456", 12),
        role: "client" as const,
        language: "es",
        isGuest: false,
        createdAt: new Date()
      },
      {
        id: "user_juan_escobar_alt",
        name: "Juan Escobar Alt",
        email: "escobarbvega.juanandres21@gmail.com",
        phone: "0973640191",
        password: await bcrypt.hash("123456", 12),
        role: "client" as const,
        language: "es",
        isGuest: false,
        createdAt: new Date()
      }
    ];

    for (const testUser of testUsers) {
      await db.insert(users).values(testUser);
    }

    console.log("✅ Database seeded successfully!");
    console.log(`📋 Added ${seedServices.length} services`);
    console.log(`👤 Added ${testUsers.length} test users:`);
    testUsers.forEach(user => {
      console.log(`   - ${user.name}: ${user.email} / ${user.phone}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}