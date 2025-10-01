import { seedDatabase } from './server/seed.ts';

console.log('🌱 Ejecutando seed completo de la base de datos...');

seedDatabase()
  .then(() => {
    console.log('✅ Seed completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  });