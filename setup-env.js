/**
 * Script de configuración para variables de entorno de producción
 *
 * Este script genera valores seguros para SESSION_SECRET y ADMIN_WS_TOKEN
 * que deben configurarse en el dashboard de Railway.
 */

import crypto from 'crypto';

// Función para generar un secreto seguro
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generar secrets
const SESSION_SECRET = generateSecret(32);
const ADMIN_WS_TOKEN = generateSecret(32);

console.log('🚀 Variables de entorno generadas para producción en Railway');
console.log('=' .repeat(60));
console.log('');
console.log('SESSION_SECRET:', SESSION_SECRET);
console.log('ADMIN_WS_TOKEN:', ADMIN_WS_TOKEN);
console.log('');
console.log('📋 Instrucciones para configurar en Railway Dashboard:');
console.log('');
console.log('1. Ve a https://railway.app/dashboard');
console.log('2. Selecciona tu proyecto Milos-Shop');
console.log('3. Ve a la pestaña "Variables"');
console.log('4. Agrega las siguientes variables de entorno:');
console.log('');
console.log('   DATABASE_URL: file:./milos_shop.db');
console.log('   SESSION_SECRET:', SESSION_SECRET);
console.log('   ADMIN_WS_TOKEN:', ADMIN_WS_TOKEN);
console.log('   NODE_ENV: production');
console.log('   PORT: 5000');
console.log('   CORS_ORIGIN: https://tu-dominio-railway.com');
console.log('');
console.log('5. Para las variables opcionales (email, pagos), configúralas según necesites:');
console.log('   SMTP_HOST: smtp.gmail.com');
console.log('   SMTP_PORT: 587');
console.log('   SMTP_USER: tu-email@gmail.com');
console.log('   SMTP_PASS: tu-app-password');
console.log('   STRIPE_SECRET_KEY: sk_live_...');
console.log('   STRIPE_PUBLISHABLE_KEY: pk_live_...');
console.log('   MERCADOPAGO_ACCESS_TOKEN: ...');
console.log('');
console.log('6. Haz deploy de tu aplicación');
console.log('');
console.log('⚠️  IMPORTANTE: Nunca commits estos valores al repositorio.');
console.log('   Mantén los secrets seguros y rota regularmente.');
console.log('');
console.log('🔄 Para generar nuevos secrets, ejecuta: node setup-env.js');