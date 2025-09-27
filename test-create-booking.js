import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== TEST CREATE BOOKING ===');

  try {
    // Get existing user, vehicle, service
    const user = db.prepare('SELECT id FROM users LIMIT 1').get();
    const vehicle = db.prepare('SELECT id FROM vehicles LIMIT 1').get();
    const service = db.prepare('SELECT id FROM services LIMIT 1').get();

    console.log('User ID:', user?.id);
    console.log('Vehicle ID:', vehicle?.id);
    console.log('Service ID:', service?.id);

    if (!user || !vehicle || !service) {
      console.log('Missing required data for booking test');
      db.close();
      return;
    }

    // Try to insert booking with current schema fields
    const bookingData = {
      id: `test_booking_${Date.now()}`,
      user_id: user.id,
      vehicle_id: vehicle.id, // This might not exist in table
      service_id: service.id,
      date: '2025-09-27',
      time_slot: '10:00',
      price: 50000,
      status: 'waiting',
      payment_method: 'cash', // This might not exist
      payment_status: 'pending', // This might not exist
      notes: 'Test booking',
      created_at: Date.now(),
      updated_at: Date.now()
    };

    console.log('Attempting to insert booking with data:', bookingData);

    // Try insert
    const stmt = db.prepare(`
      INSERT INTO bookings (id, user_id, service_id, date, time_slot, status, price, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      bookingData.id,
      bookingData.user_id,
      bookingData.service_id,
      bookingData.date,
      bookingData.time_slot,
      bookingData.status,
      bookingData.price,
      bookingData.created_at
    );

    console.log('✅ Booking created successfully:', result);

  } catch (error) {
    console.error('❌ Error creating booking:', error.message);
  }

  db.close();
}).catch(console.error);