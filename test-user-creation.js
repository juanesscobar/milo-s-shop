// Test user creation endpoint
const testData = {
  name: 'Juan Escobar',
  phone: '0973640191',
  email: 'escobarbvega.juanandres21@gmail.com',
  language: 'es',
  role: 'client'
};

console.log('Testing POST /api/users with data:', testData);

// Since we can't make HTTP calls easily, let's simulate the database query
import('better-sqlite3').then(({default: Database}) => {
  const db = new Database('./milos_shop.db');

  console.log('=== SIMULATING USER CREATION LOGIC ===');

  const { name, phone, email } = testData;

  console.log('🔍 DEBUG: Checking if user exists with phone:', phone, 'or email:', email);

  // Simulate the search logic
  let existingUser;

  if (email) {
    console.log('🔍 DEBUG: Searching by email:', email);
    const emailResults = db.prepare('SELECT * FROM users WHERE email = ?').all(email);
    console.log('🔍 DEBUG: Email query results:', emailResults.length);
    existingUser = emailResults[0];
    console.log('🔍 DEBUG: Email search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
  }

  if (!existingUser) {
    console.log('🔍 DEBUG: Searching by phone:', phone);
    const phoneResults = db.prepare('SELECT * FROM users WHERE phone = ?').all(phone);
    console.log('🔍 DEBUG: Phone query results:', phoneResults.length);
    existingUser = phoneResults[0];
    console.log('🔍 DEBUG: Phone search result:', existingUser ? `FOUND (${existingUser.id})` : 'NOT FOUND');
  }

  if (existingUser) {
    console.log('User already exists:', existingUser.id);
    console.log('Would return existing user');
  } else {
    console.log('Would create new user');
  }

  db.close();
}).catch(console.error);