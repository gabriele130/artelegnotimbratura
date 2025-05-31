require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('Errore di connessione:', err));

// Funzione di semina degli utenti
const seedUsers = async () => {
  try {
    const users = [
      { identificativo: '012', name: 'Davide Micai' },
      { identificativo: '013', name: 'Alan Contreras' },
      { identificativo: '014', name: 'Adriano Pulino' }
    ];

    await User.insertMany(users);
    console.log('Utenti inseriti con successo');
  } catch (error) {
    console.error('Errore durante l\'inserimento degli utenti:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Esegui la semina
seedUsers();

