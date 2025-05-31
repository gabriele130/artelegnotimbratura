const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/access', async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findOne({ identificativo: id });
    if (!user) {
      return res.status(400).json({ message: `Identificativo non trovato con il codice ${id}` });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, name: user.name });
  } catch (error) {
    console.error('Errore durante l\'accesso:', error);
    res.status(500).json({ message: 'Errore durante l\'accesso' });
  }
});

module.exports = router;
