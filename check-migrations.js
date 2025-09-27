import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== MIGRATIONS DEBUG ===');

  // Check applied migrations
  const migrations = db.prepare('SELECT * FROM __drizzle_migrations ORDER BY created_at').all();
  console.log(`\n📋 Applied migrations: ${migrations.length}`);
  migrations.forEach(m => console.log(`  - ${m.id} (${new Date(m.created_at).toISOString()})`));

  db.close();
}).catch(console.error);