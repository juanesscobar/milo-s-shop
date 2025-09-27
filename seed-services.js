import 'dotenv/config';
import { db } from './server/db.js';
import { services } from './shared/schema.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'client/src/data/services.json'), 'utf8'));

async function seedServices() {
  try {
    console.log('🌱 Seeding services from services.json...');

    // Clear existing bookings first (due to foreign key constraints)
    await db.run(sql`DELETE FROM bookings`);
    console.log('✅ Cleared existing bookings');

    // Clear existing services
    await db.delete(services);
    console.log('✅ Cleared existing services');

    // Insert services from JSON
    for (const service of servicesData) {
      const serviceData = {
        id: `service_${service.slug}_${Date.now()}`,
        slug: service.slug,
        title: service.titleEs, // Using Spanish as default
        description: service.copyEs,
        prices: service.prices,
        imageUrl: service.imageUrl,
        active: true,
        createdAt: new Date()
      };

      await db.insert(services).values(serviceData);
      console.log(`✅ Inserted service: ${service.slug}`);
    }

    console.log('🎉 Services seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  }
}

seedServices();