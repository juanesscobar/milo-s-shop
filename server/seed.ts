import { db } from "./db";
import { services } from "@shared/schema";

const seedServices = [
  {
    nameKey: "basic_wash",
    title: "Lavado Básico",
    description: "Lavado exterior completo con jabón, enjuague y secado. Incluye llantas y rines.",
    prices: {
      auto: 25000,
      suv: 30000,
      camioneta: 35000
    },
    durationMin: 30,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76c8d04d?w=400&h=160&fit=crop",
    active: true
  },
  {
    nameKey: "premium_wash",
    title: "Lavado Premium",
    description: "Lavado completo exterior e interior, aspirado, tablero, cristales y perfumado.",
    prices: {
      auto: 45000,
      suv: 55000,
      camioneta: 65000
    },
    durationMin: 60,
    imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=160&fit=crop",
    active: true
  },
  {
    nameKey: "detail_complete",
    title: "Detallado Completo",
    description: "Servicio premium con cera, pulido, tratamiento de cuero y protección UV.",
    prices: {
      auto: 80000,
      suv: 100000,
      camioneta: 120000
    },
    durationMin: 120,
    imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=160&fit=crop",
    active: true
  },
  {
    nameKey: "express_wash",
    title: "Lavado Express",
    description: "Lavado rápido exterior, ideal para mantenimiento semanal.",
    prices: {
      auto: 15000,
      suv: 18000,
      camioneta: 22000
    },
    durationMin: 15,
    imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=160&fit=crop",
    active: true
  },
  {
    nameKey: "engine_wash",
    title: "Lavado de Motor",
    description: "Limpieza especializada del compartimento del motor con productos específicos.",
    prices: {
      auto: 35000,
      suv: 40000,
      camioneta: 45000
    },
    durationMin: 45,
    imageUrl: "https://images.unsplash.com/photo-1563659983-0f4cca2dc431?w=400&h=160&fit=crop",
    active: true
  },
  {
    nameKey: "ceramic_coating",
    title: "Recubrimiento Cerámico",
    description: "Protección avanzada con recubrimiento cerámico de larga duración.",
    prices: {
      auto: 150000,
      suv: 180000,
      camioneta: 220000
    },
    durationMin: 180,
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=160&fit=crop",
    active: true
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Insert services
    for (const service of seedServices) {
      await db.insert(services).values([service]).onConflictDoNothing({ target: services.nameKey });
    }
    
    console.log("✅ Database seeded successfully!");
    console.log(`📋 Added ${seedServices.length} services`);
    
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