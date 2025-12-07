const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'krish',
  database: 'it_asset_mgmt',
});

async function insertUsers() {
  for (let i = 2; i <= 10; i++) {
    const username = `admin${i}`;
    const password = `admin${i}pass`;
    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password_hash, user_role, dept_id) VALUES (?, ?, ?, ?)', [username, hashed, 'Admin', (i % 3) + 1]);
  }

  for (let i = 3; i <= 100 - 10 + 2; i++) {
    const username = `eng${i}`;
    const password = `eng${i}pass`;
    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password_hash, user_role, dept_id) VALUES (?, ?, ?, ?)', [username, hashed, 'Engineer', (i % 3) + 1]);
  }

  console.log('✅ Inserted 100 users');
}

insertUsers();
