import Database from 'better-sqlite3';
const db = new Database('./milos_shop.db');

console.log('=== DATABASE SCHEMA ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

console.log('\n=== USERS TABLE SCHEMA ===');
const usersSchema = db.prepare("PRAGMA table_info(users)").all();
console.log('Users columns:', usersSchema.map(col => `${col.name} (${col.type})`));

console.log('\n=== USERS DATA ===');
const users = db.prepare("SELECT id, name, email, phone, role, password_hash FROM users").all();
console.log('Users count:', users.length);
users.forEach(user => {
  console.log(`- ${user.name} (${user.email}): ${user.password_hash ? 'HAS PASSWORD' : 'NO PASSWORD'}`);
});

db.close();