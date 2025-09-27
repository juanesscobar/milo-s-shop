import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== DATABASE DEBUG ===');

  // Check all users
  const allUsers = db.prepare('SELECT id, name, email, role FROM users').all();
  console.log(`\n👥 Total users: ${allUsers.length}`);
  allUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - Role: ${u.role}`));

  // Check admin users
  const adminUsers = db.prepare('SELECT name, email FROM users WHERE role = ?').all('admin');
  console.log(`\n🔐 Admin users: ${adminUsers.length}`);
  adminUsers.forEach(u => console.log(`  - ${u.name} (${u.email})`));

  // Check table structure
  const columns = db.prepare('PRAGMA table_info(users)').all();
  console.log(`\n📋 Users table columns:`);
  columns.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

  db.close();
}).catch(console.error);