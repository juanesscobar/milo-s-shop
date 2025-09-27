#!/usr/bin/env node

/**
 * Script de backup para la base de datos de Milos-Shop
 *
 * Uso:
 * node backup-db.js          # Backup con timestamp automático
 * node backup-db.js custom   # Backup con nombre personalizado
 */

const fs = require('fs');
const path = require('path');

// Configuración
const DB_PATH = process.env.DATABASE_URL ?
  process.env.DATABASE_URL.replace('file:', '') :
  path.join(__dirname, 'milos_shop.db');

const BACKUP_DIR = path.join(__dirname, 'backups');

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('📁 Directorio de backups creado:', BACKUP_DIR);
}

// Generar nombre del backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const customName = process.argv[2];
const backupName = customName ?
  `${customName}.db` :
  `milos_shop_backup_${timestamp}.db`;

const backupPath = path.join(BACKUP_DIR, backupName);

try {
  // Verificar que la base de datos existe
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Error: Base de datos no encontrada en', DB_PATH);
    process.exit(1);
  }

  // Obtener tamaño del archivo original
  const stats = fs.statSync(DB_PATH);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  // Crear backup
  fs.copyFileSync(DB_PATH, backupPath);

  // Verificar que el backup se creó correctamente
  const backupStats = fs.statSync(backupPath);
  const backupSizeMB = (backupStats.size / (1024 * 1024)).toFixed(2);

  console.log('✅ Backup creado exitosamente!');
  console.log(`📄 Archivo: ${backupName}`);
  console.log(`📍 Ubicación: ${backupPath}`);
  console.log(`📊 Tamaño: ${backupSizeMB} MB`);
  console.log(`🕒 Fecha: ${new Date().toLocaleString()}`);

  // Listar backups existentes
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.db'))
    .sort()
    .reverse();

  console.log('\n📋 Backups disponibles:');
  backups.slice(0, 5).forEach((file, index) => {
    const filePath = path.join(BACKUP_DIR, file);
    const fileStats = fs.statSync(filePath);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
    const modified = fileStats.mtime.toLocaleString();
    console.log(`${index + 1}. ${file} (${fileSizeMB} MB) - ${modified}`);
  });

  if (backups.length > 5) {
    console.log(`... y ${backups.length - 5} más`);
  }

} catch (error) {
  console.error('❌ Error al crear backup:', error.message);
  process.exit(1);
}

// Función para restaurar backup (opcional)
if (process.argv.includes('--restore')) {
  const restoreName = process.argv[process.argv.indexOf('--restore') + 1];

  if (!restoreName) {
    console.log('❌ Especifica el nombre del backup a restaurar:');
    console.log('node backup-db.js --restore nombre-del-backup.db');
    process.exit(1);
  }

  const restorePath = path.join(BACKUP_DIR, restoreName);

  try {
    if (!fs.existsSync(restorePath)) {
      console.error('❌ Backup no encontrado:', restorePath);
      process.exit(1);
    }

    // Crear backup del estado actual antes de restaurar
    const preRestoreBackup = path.join(BACKUP_DIR, `pre_restore_${timestamp}.db`);
    fs.copyFileSync(DB_PATH, preRestoreBackup);

    // Restaurar backup
    fs.copyFileSync(restorePath, DB_PATH);

    console.log('✅ Base de datos restaurada exitosamente!');
    console.log(`📄 Restaurado desde: ${restoreName}`);
    console.log(`💾 Backup del estado anterior: pre_restore_${timestamp}.db`);

  } catch (error) {
    console.error('❌ Error al restaurar backup:', error.message);
    process.exit(1);
  }
}

// Función para limpiar backups antiguos
if (process.argv.includes('--clean')) {
  const keepCount = parseInt(process.argv[process.argv.indexOf('--clean') + 1]) || 10;

  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        stats: fs.statSync(path.join(BACKUP_DIR, file))
      }))
      .sort((a, b) => b.stats.mtime - a.stats.mtime);

    if (backups.length <= keepCount) {
      console.log(`ℹ️ No hay backups para limpiar. Total: ${backups.length}, mantener: ${keepCount}`);
      process.exit(0);
    }

    const toDelete = backups.slice(keepCount);
    let deletedCount = 0;
    let freedSpace = 0;

    toDelete.forEach(backup => {
      try {
        fs.unlinkSync(backup.path);
        deletedCount++;
        freedSpace += backup.stats.size;
      } catch (error) {
        console.warn(`⚠️ No se pudo eliminar ${backup.name}:`, error.message);
      }
    });

    const freedSpaceMB = (freedSpace / (1024 * 1024)).toFixed(2);
    console.log(`🧹 Limpieza completada:`);
    console.log(`📄 Backups eliminados: ${deletedCount}`);
    console.log(`💾 Espacio liberado: ${freedSpaceMB} MB`);
    console.log(`📋 Backups restantes: ${backups.length - deletedCount}`);

  } catch (error) {
    console.error('❌ Error al limpiar backups:', error.message);
    process.exit(1);
  }
}

// Mostrar ayuda
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🛠️ Milos-Shop Database Backup Tool

Uso:
  node backup-db.js                    # Crear backup con timestamp
  node backup-db.js <nombre>           # Crear backup con nombre personalizado
  node backup-db.js --restore <file>   # Restaurar desde backup
  node backup-db.js --clean [n]        # Mantener solo n backups más recientes (default: 10)
  node backup-db.js --help             # Mostrar esta ayuda

Ejemplos:
  node backup-db.js
  node backup-db.js backup-manual
  node backup-db.js --restore milos_shop_backup_2025-01-15.db
  node backup-db.js --clean 5

Configuración:
  DATABASE_URL: ${process.env.DATABASE_URL || 'file:./milos_shop.db'}
  BACKUP_DIR: ${BACKUP_DIR}
  `);
}