import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

console.log('🚀 Starting admin user creation...');

try {
  const db = new Database('./milos_shop.db');
  console.log('✅ Database connected');

  // Check current users
  const beforeCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('👥 Users before:', beforeCount.count);

  // Hash password
  console.log('🔐 Hashing password...');
  const passwordHash = bcrypt.hashSync('AdminPass123!', 12);
  console.log('✅ Password hashed');

  // Insert admin user
  const adminId = 'admin_' + Date.now();
  console.log('🆔 Generated admin ID:', adminId);

  const stmt = db.prepare(`
    INSERT INTO users (
      id, name, email, phone, password_hash, role, company_id,
      created_at, updated_at, email_verified, mfa_enabled, mfa_secret, mfa_backup_codes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Create multiple admin users (skip if already exists)
  const adminUsers = [
    { name: 'Admin Principal', email: 'admin@miloscarwash.com' },
    { name: 'Super Admin', email: 'super@milosshop.com' }
  ];

  for (const admin of adminUsers) {
    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(admin.email);
    if (existing) {
      console.log(`⚠️ Admin already exists: ${admin.name} (${admin.email})`);
      continue;
    }

    const adminId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    console.log(`📝 Creating admin: ${admin.name} (${admin.email})`);

    const result = stmt.run(
      adminId,
      admin.name,
      admin.email,
      '+5959610000' + Math.floor(Math.random() * 100),
      passwordHash,
      'admin',
      6,
      Date.now(),
      Date.now(),
      1,
      0,
      null,
      null
    );

    console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
  }

  console.log('✅ Insert result:', result);

  // Check after
  const afterCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('👥 Users after:', afterCount.count);

  // Verify admin user
  const admin = db.prepare('SELECT name, email, role FROM users WHERE role = ?').get('admin');
  console.log('🔐 Admin user found:', admin);

  // Show all users
  const allUsers = db.prepare('SELECT name, email, role FROM users').all();
  console.log('📋 All users:');
  allUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`));

  db.close();
  console.log('✅ Database closed');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

console.log('🎉 Admin user creation completed!');