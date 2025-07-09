const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const conn = require('./db/database'); 
const path = require('path');

// ✅ Allowed origins
const allowedOrigins = [
  'https://incredible-cannoli-f5ea80.netlify.app',
  'https://tourmaline-babka-c5b065.netlify.app',
  'http://localhost:5173'
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "your_secret_key", 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true kung HTTPS (e.g. production)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Import route handlers
const login = require('./routes/login');
const register = require('./routes/register');
const product = require('./routes/product');
const cart = require('./routes/cart');
const fullVerify = require('./routes/verefy');

// ✅ Mount routes
app.use('/', login);
app.use('/', register);
app.use('/', product);
app.use('/', cart);
app.use('/', fullVerify);

// ✅ Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});