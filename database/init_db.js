const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'canteleen.db');
const db = new sqlite3.Database(dbPath);



// Drop old tables if needed (for clean slate during dev)
// Uncomment if necessary
/*
db.run("DROP TABLE IF EXISTS users");
db.run("DROP TABLE IF EXISTS meals");
db.run("DROP TABLE IF EXISTS orders");
*/

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
    password TEXT,
    role TEXT CHECK(role IN ('cashier', 'manager'))
  )
`);

// Create Meals table
db.run(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_name TEXT,
    meal_price REAL,
    meal_type TEXT,
    ingredients TEXT, 
    nutrients TEXT, 
    allergens TEXT,
    inMenu BOOLEAN DEFAULT 0
  )
`);

// Create Orders table
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    balance REAL,
    items TEXT -- JSON array of meal objects
  )
`);

db.close(() => {
  console.log('Updated database initialized and closed.');
});
