const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrow_date: { type: Date, default: Date.now },
  due_date: { type: Date, required: true },
  return_date: { type: Date },
  status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
