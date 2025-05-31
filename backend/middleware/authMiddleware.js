const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decodifica il token e assegna i dati dell'utente alla richiesta
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};

module.exports = authMiddleware;