require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 5000;

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('Errore di connessione:', err));

// Middleware
app.use(cors({
  origin: 'https://artelegno-frontend-57039ca3092c.herokuapp.com', // Corretto senza barra finale
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configura helmet per includere una Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "font-src": ["'self'", "https://artelegno-frontend-57039ca3092c.herokuapp.com"],
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'", "https://artelegno-backend-46e49583886d.herokuapp.com"],
      },
    },
  })
);

// Route di base
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// Rotte API protette
app.use('/api/auth', authRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Avvio del server
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));