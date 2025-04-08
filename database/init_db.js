const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'canteleen.db');
const db = new sqlite3.Database(dbPath);

// Optional: Uncomment if you want to fully reset the DB
/*db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS meals");
  db.run("DROP TABLE IF EXISTS orders"); 
  db.run("DROP TABLE IF EXISTS clients");
});*/


db.serialize(() => {
  // Create tables in order
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
      client_name TEXT,
      cashier_username TEXT,
      date TEXT,
      payment_method TEXT,
      items TEXT
    )
  `);  


  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      role TEXT CHECK(role IN ('student', 'teacher', 'staff', 'other')),
      card_id INTEGER UNIQUE,
      balance REAL
    )
  `, (err) => {
    if (err) {
      console.error("Error creating clients table:", err);
    } else {
      // Now insert test data AFTER the table is confirmed created
      db.run(`INSERT INTO clients (full_name, role, card_id, balance)
              VALUES 
                ('Alice Student', 'student', 1111 2222, 15.00),
                ('Bob Teacher', 'teacher', 2222 3455, 40.00),
                ('Carol Staff', 'staff', 3333 4556, 25.00),
                ('David Visitor', 'other', NULL, NULL)`, (insertErr) => {
        if (insertErr) {
          console.error("Error inserting into clients table:", insertErr);
        } else {
          console.log('Database initialized successfully with sample clients.');
        }
        db.close();
      });
    }
  });
});
