import { authService } from './server/auth/authService.js';
import { db } from './server/db.js';
import { users } from './shared/auth-schema.js';
import { eq } from 'drizzle-orm';

console.log('🚀 Creating admin users using AuthService...');

async function createAdminUsers() {
  try {
    // Delete existing admin users first
    console.log('🗑️ Deleting existing admin users...');
    await db.delete(users).where(eq(users.role, 'admin'));
    console.log('✅ Existing admin users deleted');

    // Create admin users using the same method as registration
    const adminUsers = [
      {
        name: 'Admin Test',
        email: 'admin@test.com',
        phone: '+595961000001',
        password: 'AdminPass123!',
        companyName: 'Test Company'
      },
      {
        name: 'Admin Principal',
        email: 'admin@miloscarwash.com',
        phone: '+595961000002',
        password: 'AdminPass123!',
        companyName: 'Milo\'s Car Wash'
      },
      {
        name: 'Super Admin',
        email: 'super@milosshop.com',
        phone: '+595961000003',
        password: 'AdminPass123!',
        companyName: 'Milo\'s Shop'
      }
    ];

    for (const admin of adminUsers) {
      console.log(`📝 Creating admin: ${admin.name} (${admin.email})`);

      try {
        const result = await authService.registerAdmin({
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          password: admin.password,
          passwordConfirm: admin.password, // Same as password for validation
          companyName: admin.companyName
        });

        console.log(`✅ Admin created successfully: ${admin.name} (${admin.email})`);
      } catch (error) {
        console.log(`❌ Error creating ${admin.name}:`, error.message);
      }
    }

    // Verify creation
    const allUsers = await db.select({
      name: users.name,
      email: users.email,
      role: users.role
    }).from(users);

    console.log('\n📋 All users in database:');
    allUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`));

    const adminCount = allUsers.filter(u => u.role === 'admin').length;
    console.log(`\n🎯 Admin users created: ${adminCount}`);

  } catch (error) {
    console.error('❌ Error in createAdminUsers:', error);
  }
}

// Run the function
createAdminUsers().then(() => {
  console.log('🎉 Admin user creation completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});