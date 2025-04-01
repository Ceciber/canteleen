// database/init_db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'canteleen.db');
const db = new sqlite3.Database(dbPath);

// Drop tables (for dev reset — optional)
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS meals`);
  db.run(`DROP TABLE IF EXISTS orders`);

  // Create User Profiles table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      username TEXT UNIQUE,
      gender TEXT,
      country TEXT,
      language TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Create Meals table
  db.run(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      ingredients TEXT,  -- JSON Array
      nutrients TEXT,    -- JSON Object { calories, fat, sugar }
      allergens TEXT     -- JSON Object { gluten, dairy, eggs, peanuts, soy }
    )
  `);

  // Create Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER,
      balance REAL,
      items TEXT   -- JSON Array of Meal objects
    )
  `);

  console.log('✅ All tables created successfully.');
  db.close();
});
