import 'dotenv/config';
import { db } from "./db";
import { services, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test basic connection
    const result = await db.select().from(services).limit(1);
    console.log("✅ Database connection successful");
    console.log("📊 Current services in DB:", result.length);

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

async function createTestService() {
  try {
    console.log("🔧 Creating a test service manually...");

    const testService = {
      id: "test_service_manual",
      slug: "test_manual",
      title: "Servicio de Prueba Manual",
      description: "Este es un servicio de prueba creado manualmente",
      prices: {
        auto: 50000,
        suv: 60000,
        camioneta: 70000
      } as any,
      active: "true"
    };

    console.log("📝 Test service data:", JSON.stringify(testService, null, 2));

    await db.insert(services).values(testService as any);
    console.log("✅ Test service created successfully");

    // Verify it was created
    const verifyResult = await db.select().from(services).where(eq(services.id, "test_service_manual"));
    console.log("🔍 Verification - services found:", verifyResult.length);
    if (verifyResult.length > 0) {
      console.log("✅ Service verified in database:", verifyResult[0]);
    }

    return true;
  } catch (error: any) {
    console.error("❌ Failed to create test service:", error);
    console.error("❌ Error details:", error?.message);
    console.error("❌ Error stack:", error?.stack);
    return false;
  }
}

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
    } as any,
    active: "true"
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
    } as any,
    active: "true"
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
    } as any,
    active: "true"
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
    } as any,
    active: "true"
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
    } as any,
    active: "true"
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
    } as any,
    active: "true"
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Test database connection first
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error("Cannot connect to database");
    }

    // First, let's try to create just one test service manually
    console.log("🧪 Creating test service manually first...");
    const testCreated = await createTestService();
    if (!testCreated) {
      throw new Error("Failed to create test service");
    }

    // If manual creation works, then proceed with full seeding
    console.log("✅ Manual test service created successfully");
    console.log("🚀 Proceeding with full seeding...");

    // Clear existing services and users
    console.log("🗑️ Clearing existing data...");
    await db.delete(services);
    await db.delete(users);
    console.log("✅ Existing data cleared");

    console.log(`📋 Inserting ${seedServices.length} services...`);

    // Insert services one by one with detailed logging
    for (let i = 0; i < seedServices.length; i++) {
      const service = seedServices[i];
      console.log(`  ➕ [${i + 1}/${seedServices.length}] Inserting service: ${service.title} (${service.slug})`);

      try {
        await db.insert(services).values(service as any);
        console.log(`    ✅ Service inserted successfully: ${service.id}`);
      } catch (serviceError) {
        console.error(`    ❌ Failed to insert service ${service.slug}:`, serviceError);
        throw serviceError;
      }
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
        isGuest: "false",
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
        isGuest: "false",
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
        isGuest: "false",
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
  console.log("🚀 Starting seeding process...");
  console.log("🔧 Process args:", process.argv);
  console.log("📄 Script URL:", import.meta.url);

  // First, just test database connection and create one service
  console.log("🔍 Testing database connection and creating one test service...");

  testDatabaseConnection()
    .then((connected) => {
      if (connected) {
        console.log("✅ Database connection successful");
        return createTestService();
      } else {
        throw new Error("Database connection failed");
      }
    })
    .then((serviceCreated) => {
      if (serviceCreated) {
        console.log("✅ Test service created successfully");
        console.log("🎉 Basic database operations working!");
      } else {
        throw new Error("Failed to create test service");
      }
    })
    .then(() => {
      console.log("✅ All tests passed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test failed:", error);
      console.error("❌ Error stack:", error.stack);
      process.exit(1);
    });
}