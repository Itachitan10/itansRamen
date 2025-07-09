const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const conn = require('./db/database'); 
const path = require('path');

// ✅ Allowed origins
const allowedOrigins = [
  'https://tourmaline-babka-c5b065.netlify.app',
  'http://localhost:5173'
];

// ✅ CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Session middleware
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if on HTTPS
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Route handlers
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

// ✅ Server start
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
