import 'dotenv/config';
import { db } from './server/db.js';
import { services } from './shared/schema.js';

async function checkDB() {
  try {
    // Check tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', tables.map(t => t.name));

    // Check services
    const result = await db.select().from(services);
    console.log('Services in DB:', result.length);
    result.forEach(s => console.log(`- ${s.slug}: ${s.title} (image: ${s.imageUrl || 'none'})`));

    // Check bookings
    const bookings = await db.all("SELECT COUNT(*) as count FROM bookings");
    console.log('Bookings count:', bookings[0].count);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDB();