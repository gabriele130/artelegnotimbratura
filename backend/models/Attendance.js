const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // Nome
  date: { type: String, required: true },
  records: [
    {
      type: { type: String, enum: ['entrata', 'uscita', 'entrata_pausa', 'uscita_pausa'], required: true },
      timestamp: { type: Date, required: true }
    }
  ]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
