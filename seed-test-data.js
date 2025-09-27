import Database from 'better-sqlite3';

// Conectar a la base de datos
const db = new Database('./milos_shop_test.db');

// Insertar servicios de prueba
const services = [
  {
    slug: 'lavado-basico',
    name_key: 'lavado_basico',
    title: 'Lavado Básico',
    description: 'Lavado exterior completo',
    title_es: 'Lavado Básico',
    title_pt: 'Lavagem Básica',
    subtitle_es: 'Lavado exterior completo',
    subtitle_pt: 'Lavagem exterior completa',
    copy_es: 'Servicio de lavado exterior con agua y jabón especializado.',
    copy_pt: 'Serviço de lavagem exterior com água e sabão especializado.',
    prices: JSON.stringify({ auto: 50000, suv: 70000, camioneta: 90000 }),
    duration_min: 30,
    active: 1
  },
  {
    slug: 'lavado-completo',
    name_key: 'lavado_completo',
    title: 'Lavado Completo',
    description: 'Lavado interior y exterior',
    title_es: 'Lavado Completo',
    title_pt: 'Lavagem Completa',
    subtitle_es: 'Interior y exterior',
    subtitle_pt: 'Interior e exterior',
    copy_es: 'Lavado completo incluyendo interior y exterior del vehículo.',
    copy_pt: 'Lavagem completa incluindo interior e exterior do veículo.',
    prices: JSON.stringify({ auto: 80000, suv: 100000, camioneta: 120000 }),
    duration_min: 60,
    active: 1
  }
];

const insertService = db.prepare(`
  INSERT INTO services (slug, name_key, title, description, title_es, title_pt, subtitle_es, subtitle_pt, copy_es, copy_pt, prices, duration_min, active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('Insertando servicios de prueba...');
for (const service of services) {
  try {
    insertService.run(
      service.slug,
      service.name_key,
      service.title,
      service.description,
      service.title_es,
      service.title_pt,
      service.subtitle_es,
      service.subtitle_pt,
      service.copy_es,
      service.copy_pt,
      service.prices,
      service.duration_min,
      service.active
    );
    console.log(`✓ Servicio ${service.title_es} insertado`);
  } catch (error) {
    console.error(`✗ Error insertando ${service.title_es}:`, error.message);
  }
}

// Insertar usuario admin de prueba
const insertUser = db.prepare(`
  INSERT INTO users (name, phone, email, role, language, is_guest)
  VALUES (?, ?, ?, ?, ?, ?)
`);

console.log('Insertando usuario admin de prueba...');
try {
  const result = insertUser.run('Admin Test', '+595981234567', 'admin@test.com', 'admin', 'es', 0);
  console.log('✓ Usuario admin insertado con ID:', result.lastInsertRowid);
} catch (error) {
  console.error('✗ Error insertando usuario admin:', error.message);
}

console.log('Datos de prueba insertados correctamente!');
db.close();