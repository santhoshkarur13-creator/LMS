const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  borrow_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord', required: true, unique: true },
  amount: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  paid_date: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Fine', fineSchema);
