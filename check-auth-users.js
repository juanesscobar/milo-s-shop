import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== CHECK AUTH USERS ===');

  try {
    // Check users table (authUsers)
    const authUsers = db.prepare('SELECT id, name, phone, email, role FROM users').all();
    console.log(`\n👥 Users in table: ${authUsers.length}`);
    authUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - Phone: ${u.phone} - Role: ${u.role}`));

    // Check if email exists
    const userWithEmail = authUsers.find(u => u.email === 'escobarbvega.juanandres21@gmail.com');
    console.log(`\n📧 User with email 'escobarbvega.juanandres21@gmail.com':`, userWithEmail ? 'EXISTS' : 'NOT FOUND');
    if (userWithEmail) {
      console.log('User details:', userWithEmail);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  db.close();
}).catch(console.error);