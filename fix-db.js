import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'milos_shop.db');
const db = new Database(dbPath);

console.log('=== FIXING DATABASE SCHEMA ===');

try {
  // Check current schema
  const bookingsInfo = db.prepare('PRAGMA table_info(bookings)').all();
  const servicesInfo = db.prepare('PRAGMA table_info(services)').all();

  console.log('Current bookings columns:', bookingsInfo.map(c => c.name));
  console.log('Current services columns:', servicesInfo.map(c => c.name));

  const hasVehicleId = bookingsInfo.some(c => c.name === 'vehicle_id');
  const hasDurationMin = servicesInfo.some(c => c.name === 'duration_min');

  console.log('vehicle_id exists:', hasVehicleId);
  console.log('duration_min exists:', hasDurationMin);

  // Apply migrations
  if (!hasVehicleId) {
    console.log('Adding vehicle_id to bookings...');
    db.exec('ALTER TABLE bookings ADD COLUMN vehicle_id TEXT;');
    console.log('✅ vehicle_id added to bookings');
  }

  if (!hasDurationMin) {
    console.log('Adding duration_min to services...');
    db.exec('ALTER TABLE services ADD COLUMN duration_min INTEGER;');
    console.log('✅ duration_min added to services');
  }

  // Final verification
  const finalBookings = db.prepare('PRAGMA table_info(bookings)').all();
  const finalServices = db.prepare('PRAGMA table_info(services)').all();

  console.log('\n=== FINAL SCHEMA ===');
  console.log('Bookings columns:', finalBookings.map(c => c.name));
  console.log('Services columns:', finalServices.map(c => c.name));

  const finalHasVehicleId = finalBookings.some(c => c.name === 'vehicle_id');
  const finalHasDurationMin = finalServices.some(c => c.name === 'duration_min');

  if (finalHasVehicleId && finalHasDurationMin) {
    console.log('\n🎉 SUCCESS: All required columns are now present!');
  } else {
    console.log('\n❌ ERROR: Some columns are still missing');
  }

} catch (error) {
  console.error('Database error:', error.message);
} finally {
  db.close();
}