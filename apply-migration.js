import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Conectar a la base de datos
const dbPath = './milos_shop_test.db';
const db = new Database(dbPath);

// Leer el archivo de migración
const migrationPath = path.join(process.cwd(), 'migrations', '0000_good_rocket_raccoon.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Dividir el SQL en statements (separados por --> statement-breakpoint)
const statements = migrationSQL.split('--> statement-breakpoint').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);

console.log(`Aplicando ${statements.length} statements de migración...`);

// Ejecutar cada statement
for (const statement of statements) {
  if (statement.trim()) {
    try {
      db.exec(statement);
      console.log('✓ Statement ejecutado correctamente');
    } catch (error) {
      console.error('✗ Error ejecutando statement:', error.message);
      console.error('Statement:', statement);
    }
  }
}

console.log('Migración completada!');
db.close();