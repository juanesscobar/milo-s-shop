import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== DATABASE TABLES DEBUG ===');

  // Get all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`\n📋 Tables in database: ${tables.length}`);
  tables.forEach(t => console.log(`  - ${t.name}`));

  // Check if bookings table exists
  const bookingsExists = tables.some(t => t.name === 'bookings');
  console.log(`\n📅 Bookings table exists: ${bookingsExists ? '✅ YES' : '❌ NO'}`);

  if (bookingsExists) {
    // Check bookings table structure
    const columns = db.prepare('PRAGMA table_info(bookings)').all();
    console.log(`\n📋 Bookings table columns:`);
    columns.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

    // Check bookings count
    const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
    console.log(`\n📊 Total bookings: ${bookingCount.count}`);
  }

  // Check if vehicles table exists
  const vehiclesExists = tables.some(t => t.name === 'vehicles');
  console.log(`\n🚗 Vehicles table exists: ${vehiclesExists ? '✅ YES' : '❌ NO'}`);

  if (vehiclesExists) {
    const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get();
    console.log(`📊 Total vehicles: ${vehicleCount.count}`);
  }

  // Check if services table exists
  const servicesExists = tables.some(t => t.name === 'services');
  console.log(`\n🧽 Services table exists: ${servicesExists ? '✅ YES' : '❌ NO'}`);

  if (servicesExists) {
    const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
    console.log(`📊 Total services: ${serviceCount.count}`);
  }

  db.close();
}).catch(console.error);