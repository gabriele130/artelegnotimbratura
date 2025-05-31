const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Importa il modello User
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/timbratura', authMiddleware, async (req, res) => {
  const { type } = req.body;
  const userId = req.user.userId;
  const currentDate = new Date().toISOString().split('T')[0];

  console.log('Richiesta ricevuta:', { userId, currentDate, type });

  if (!type || !['entrata', 'uscita', 'entrata_pausa', 'uscita_pausa'].includes(type)) {
    console.log('Tipo di timbratura non valido:', type);
    return res.status(400).json({ message: 'Tipo di timbratura non valido.' });
  }

  try {
    // Recupera nome e cognome dell'utente dal database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    let attendance = await Attendance.findOne({ userId, date: currentDate });
    console.log('Record trovato:', attendance);

    if (!attendance) {
      attendance = new Attendance({
        userId,
        name: user.name, // Salva il nome
        surname: user.surname, // Salva il cognome
        date: currentDate,
        records: []
      });
      console.log('Nuovo record creato:', attendance);
    }

    // Aggiungi la nuova timbratura
    attendance.records.push({
      type: type,
      timestamp: new Date()
    });

    console.log('Record aggiornato prima del salvataggio:', attendance);
    await attendance.save();
    console.log('Record salvato con successo');
    res.status(201).json({ message: 'Timbratura registrata con successo.' });

  } catch (error) {
    console.error('Errore nella registrazione della timbratura:', error.message);
    res.status(500).json({ message: 'Errore nella registrazione della timbratura.', error: error.message });
  }
});

router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Errore durante il recupero dei log di timbratura:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei log di timbratura.' });
  }
});

module.exports = router;
