import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');
  const users = db.prepare('SELECT id, name, email, role, email_verified, mfa_enabled FROM users').all();
  console.log('👥 Usuarios en la base de datos:');
  users.forEach(u => {
    console.log(`  - ${u.name} (${u.email}) - Role: ${u.role} - Email verified: ${u.email_verified} - MFA: ${u.mfa_enabled}`);
  });
  db.close();
}).catch(console.error);