const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

//Tracking the user session when the user logs in
const session = require('express-session');

app.use(session({
  secret: 'canteleen-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Enable JSON parsing for request bodies
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('views'));

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'database', 'canteleen.db');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index-hard-coded', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index_hard_coded.html'));
});

app.get('/index-old', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
});

app.get('/test2', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'test2.html'));
});


// Route for login page (GET)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route for signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Code to handle login submission (POST) is later in this file

// Handle signup form submission (POST)
app.post('/signup', (req, res) => {
  const { email, username, password, repeat_password, role } = req.body;
  
  if (password !== repeat_password) {
    return res.send("Passwords do not match. Please <a href='/signup'>try again</a>.");
  }
  
  // For now, set full_name to username (other fields like country, language, etc. can be null)
  const full_name = username;
  const db = new sqlite3.Database(dbPath);
  const query = `INSERT INTO users (full_name, username, email, password, role)
                 VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [full_name, username, email, password, role.toLowerCase()], function(err) {
    if (err) {
      res.send("Error signing up: " + err.message);
    } else {
      res.redirect('/login');
    }
    db.close();
  });
});


// Cashier dashboard page
app.get('/cashier', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cashier.html'));
});

// Manager dashboard page
app.get('/manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manager.html'));
});

// Route for Add Dish page (GET)
app.get('/adddish', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'adddish.html'));
});


// Route for Modify Dish page (GET)
app.get('/modifydish', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'modifydish.html'));
});


app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'menu.html'));
});

app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'infoScreen.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'map.html'));
});




// GET all meals
app.get('/meals', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM meals", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const meals = rows.map(row => ({
        id: row.id,
        meal_name: row.meal_name,
        meal_price: row.meal_price,
        meal_type: row.meal_type,
        ingredients: JSON.parse(row.ingredients),
        nutrients: JSON.parse(row.nutrients),
        allergens: JSON.parse(row.allergens),
        inMenu: row.inMenu === 1 // 👈 Convert 1/0 to true/false
      }));
      
      res.json(meals);
    }
    db.close();
  });
});

// GET a single meal by id
app.get('/meals/:id', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.get("SELECT * FROM meals WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: "Meal not found" });
    } else {
      const meal = {
        id: row.id,
        meal_name: row.meal_name,
        meal_price: row.meal_price,
        meal_type: row.meal_type,
        ingredients: JSON.parse(row.ingredients),
        nutrients: JSON.parse(row.nutrients),
        allergens: JSON.parse(row.allergens)
      };
      res.json(meal);
    }
    db.close();
  });
});

// POST create a new meal
app.post('/meals', (req, res) => {
  const { meal_name, meal_price, meal_type, ingredients, nutrients, allergens } = req.body;
  const db = new sqlite3.Database(dbPath);
  const query = `INSERT INTO meals (meal_name, meal_price, meal_type, ingredients, nutrients, allergens)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [meal_name, meal_price, meal_type, JSON.stringify(ingredients), JSON.stringify(nutrients), JSON.stringify(allergens)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
    db.close();
  });
});

// PUT update a meal
app.put('/meals/:id', (req, res) => {
  const { meal_name, meal_price, meal_type, ingredients, nutrients, allergens } = req.body;
  const db = new sqlite3.Database(dbPath);
  const query = `UPDATE meals SET meal_name = ?, meal_price = ?, meal_type = ?, ingredients = ?, nutrients = ?, allergens = ? WHERE id = ?`;
  db.run(query, [meal_name, meal_price, meal_type, JSON.stringify(ingredients), JSON.stringify(nutrients), JSON.stringify(allergens), req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ updated: this.changes });
    }
    db.close();
  });
});

// DELETE a meal
app.delete('/meals/:id', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.run("DELETE FROM meals WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
    db.close();
  });
});

// POST copy a meal
app.post('/meals/:id/copy', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.get("SELECT * FROM meals WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      db.close();
    } else if (!row) {
      res.status(404).json({ error: "Meal not found" });
      db.close();
    } else {
      const query = `INSERT INTO meals (meal_name, meal_price, meal_type, ingredients, nutrients, allergens)
                     VALUES (?, ?, ?, ?, ?, ?)`;
      db.run(query, [
         row.meal_name,
         row.meal_price,
         row.meal_type,
         row.ingredients,
         row.nutrients,
         row.allergens
      ], function(err) {
         if (err) {
           res.status(500).json({ error: err.message });
         } else {
           res.json({ id: this.lastID });
         }
         db.close();
      });
    }
  });
});


// GET all meals that are in the Menu
app.get('/meals', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM meals", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const meals = rows.map(row => ({
         id: row.id,
         meal_name: row.meal_name,
         meal_price: row.meal_price,
         meal_type: row.meal_type,
         ingredients: JSON.parse(row.ingredients),
         nutrients: JSON.parse(row.nutrients),
         allergens: JSON.parse(row.allergens),
         inMenu: row.inMenu ? true : false
      }));
      res.json(meals);
    }
    db.close();
  });
});


app.post('/meals/:id/menu/add', (req, res) => {
  const mealId = req.params.id;
  const db = new sqlite3.Database(dbPath);

  // On active uniquement le repas sélectionné, sans toucher aux autres
  db.run("UPDATE meals SET inMenu = 1 WHERE id = ?", [mealId], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: "Failed to add meal to menu" });
    }

    // Log des repas actuellement dans le menu
    db.all("SELECT id, meal_name, meal_type FROM meals WHERE inMenu = 1", [], (err, rows) => {
      db.close();
      if (err) {
        console.error("Error fetching in-menu meals:", err);
      }
      res.json({ message: "Meal added to menu", currentMenu: rows });
    });
  });
});





// Remove a meal from the menu
app.post('/meals/:id/menu/remove', (req, res) => {
  const mealId = req.params.id;
  const db = new sqlite3.Database(dbPath);
  db.run("UPDATE meals SET inMenu = 0 WHERE id = ?", [mealId], function(err) {
    db.close();
    if (err) {
      return res.status(500).json({ error: "Failed to remove meal from menu" });
    }
    res.json({ message: "Meal removed from menu" });
  });
});





app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = new sqlite3.Database(dbPath);

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    db.close();

    if (err || !row) {
      return res.redirect('/login?error=1'); // 👈 redirect to login with error flag
    }

    req.session.user = row.username;

    const role = row.role.toLowerCase();
    if (role === 'cashier') {
      res.redirect('/cashier');
    } else if (role === 'manager') {
      res.redirect('/manager');
    } else {
      res.send("Invalid role.");
    }
  });
});



// GET /profile - fetch user info
app.get('/profile', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

  const db = new sqlite3.Database(dbPath);
  db.get("SELECT * FROM users WHERE username = ?", [req.session.user], (err, row) => {
    db.close();
    if (err || !row) {
      return res.status(500).json({ error: "Failed to retrieve profile" });
    }

    // Provide default language if missing
    row.language = row.language || 'English';
    res.json(row);
  });
});

// POST /profile/update - update user info
app.post('/profile/update', express.json(), (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

  const { full_name, gender, country, language, email } = req.body;

  const db = new sqlite3.Database(dbPath);
  db.run(`
    UPDATE users SET
      full_name = ?,
      gender = ?,
      country = ?,
      language = ?,
      email = ?
    WHERE username = ?
  `, [full_name, gender, country, language, email, req.session.user], function(err) {
    db.close();
    if (err) {
      return res.status(500).json({ error: "Failed to update profile" });
    }
    res.json({ message: "Profile updated" });
  });
});

// DELETE user account and destroy session
app.post('/profile/delete', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  const username = req.session.user;
  const db = new sqlite3.Database(dbPath);
  db.run("DELETE FROM users WHERE username = ?", [username], function(err) {
    if (err) {
      res.status(500).json({ error: "Failed to delete account" });
    } else {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: "Failed to clear session" });
        }
        res.json({ message: "Account deleted" });
      });
    }
    db.close();
  });
});

// Log out endpoint: destroy session and redirect to homepage
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
       return res.send("Error logging out");
    }
    res.redirect('/');
  });
});

// endpoint for users used during the payment method
app.get('/clients', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT full_name, card_id, balance FROM users", [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add route to return clients by role
app.get('/clients/by-role', (req, res) => {
  const role = req.query.role;
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT full_name, card_id, balance FROM clients WHERE role = ?", [role], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add route to handle recharge:
app.post('/clients/recharge', (req, res) => {
  const { card_id, amount } = req.body;
  const db = new sqlite3.Database(dbPath);
  let balance = 0;

  db.get("SELECT balance FROM clients WHERE card_id = ?", [card_id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Client not found" });
    if (row.balance !== null) {
      balance = row.balance;
    }
    const newBalance = parseFloat(balance) + parseFloat(amount);
    db.run("UPDATE clients SET balance = ? WHERE card_id = ?", [newBalance, card_id], function(err) {
      db.close();
      if (err) return res.status(500).json({ error: err.message });
      res.json({ newBalance });
    });
  });

});


app.get('/orders', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM orders", [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.post('/orders', (req, res) => {
  const { card_id, client_name, cashier_username, date, payment_method, items } = req.body;
  const db = new sqlite3.Database(dbPath);

  db.run(`
    INSERT INTO orders (card_id, client_name, cashier_username, date, payment_method, items)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [card_id, client_name, cashier_username, date, payment_method, items], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order saved', order_id: this.lastID });
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`Canteleen running at http://localhost:${PORT}`);
});


// node server.js
// http://localhost:3000