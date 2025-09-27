import 'dotenv/config';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

console.log('🔧 Fixing admin users with correct password hashing...');

// Use the same database connection as the server
const sqlite = new Database(process.env.DATABASE_URL.replace('file:', ''));
console.log('✅ Database connected');

try {
  // Check current admin users
  const adminUsers = sqlite.prepare('SELECT id, name, email FROM users WHERE role = ?').all('admin');
  console.log(`👥 Current admin users: ${adminUsers.length}`);
  adminUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - ID: ${u.id}`));

  // Delete existing admin users
  const deleted = sqlite.prepare('DELETE FROM users WHERE role = ?').run('admin');
  console.log(`🗑️ Deleted ${deleted.changes} existing admin users`);

  // Create admin users with correct hashing (same as AuthService.SALT_ROUNDS = 12)
  const adminData = [
    { name: 'Admin Test', email: 'admin@test.com', password: 'AdminPass123!' },
    { name: 'Admin Principal', email: 'admin@miloscarwash.com', password: 'AdminPass123!' },
    { name: 'Super Admin', email: 'super@milosshop.com', password: 'AdminPass123!' }
  ];

  for (const admin of adminData) {
    console.log(`📝 Creating admin: ${admin.name} (${admin.email})`);

    // Hash password with same method as AuthService
    const passwordHash = bcrypt.hashSync(admin.password, 12);

    const userId = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;

    sqlite.prepare(`
      INSERT INTO users (
        id, name, email, phone, password_hash, role, company_id,
        created_at, updated_at, email_verified, mfa_enabled, mfa_secret, mfa_backup_codes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      admin.name,
      admin.email,
      '+5959610000' + Math.floor(Math.random() * 100),
      passwordHash,
      'admin',
      6,
      Date.now(),
      Date.now(),
      1, // email_verified = true
      0, // mfa_enabled = false
      null, // mfa_secret
      null // mfa_backup_codes
    );

    console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
  }

  // Verify final state
  const finalAdmins = sqlite.prepare('SELECT name, email FROM users WHERE role = ?').all('admin');
  console.log(`\n🎯 Final admin users: ${finalAdmins.length}`);
  finalAdmins.forEach(u => console.log(`  - ${u.name} (${u.email})`));

  console.log('\n🔑 Test these credentials:');
  console.log('Email: admin@test.com | Password: AdminPass123!');
  console.log('Email: admin@miloscarwash.com | Password: AdminPass123!');
  console.log('Email: super@milosshop.com | Password: AdminPass123!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
} finally {
  sqlite.close();
  console.log('✅ Database closed');
}