const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String },
  total_copies: { type: Number, default: 1 },
  available_copies: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
