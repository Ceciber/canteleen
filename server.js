const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route for signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Canteleen running at http://localhost:${PORT}`);
});

// node server.js
// http://localhost:3000