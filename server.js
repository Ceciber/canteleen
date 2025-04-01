const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for login page (GET)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route for signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Handle login form submission (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check for predefined credentials
  if (username === 'cashier' && password === 'cashierpass') {
    res.redirect('/cashier');
  } else if (username === 'manager' && password === 'managerpass') {
    res.redirect('/manager');
  } else {
    res.send('Invalid credentials. Please <a href="/login">try again</a>.');
  }
});

// Cashier dashboard page
app.get('/cashier', (req, res) => {
  console.log("Serving cashier.html");
  res.sendFile(path.join(__dirname, 'views', 'cashier.html'));
});

// Manager dashboard page
app.get('/manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manager.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Canteleen running at http://localhost:${PORT}`);
});

// node server.js
// http://localhost:3000