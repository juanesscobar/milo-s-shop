import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');
  const users = db.prepare('SELECT name, email, role FROM users').all();
  console.log('👥 Todos los usuarios:');
  users.forEach(u => {
    console.log(`  - ${u.name} (${u.email}) - Role: ${u.role}`);
  });
  db.close();
}).catch(console.error);