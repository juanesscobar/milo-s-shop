import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'milos_shop.db');
const db = new Database(dbPath);

console.log('🔍 Verificando servicios en la base de datos...\n');

// Verificar tabla services
const servicesTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='services'").get();
if (!servicesTable) {
  console.log('❌ La tabla services no existe');
  process.exit(1);
}

console.log('✅ Tabla services existe');

// Verificar estructura de la tabla
const columns = db.prepare("PRAGMA table_info(services)").all();
console.log('📋 Columnas de la tabla services:');
columns.forEach(col => {
  console.log(`  - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
});

// Verificar servicios existentes
const services = db.prepare("SELECT id, slug, title, description, image_url, active FROM services").all();
console.log(`\n📊 Servicios encontrados: ${services.length}`);

if (services.length > 0) {
  console.log('\nServicios:');
  services.forEach(service => {
    console.log(`  - ${service.title} (${service.slug})`);
    console.log(`    ID: ${service.id}`);
    console.log(`    Imagen: ${service.image_url || 'Sin imagen'}`);
    console.log(`    Activo: ${service.active ? 'Sí' : 'No'}`);
    console.log('');
  });
} else {
  console.log('⚠️  No hay servicios en la base de datos');
  console.log('💡 Considera poblar la base de datos con datos iniciales');
}

db.close();