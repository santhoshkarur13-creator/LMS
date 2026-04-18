const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all books (with optional search)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new book
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const book = new Book(req.body);
    book.available_copies = book.total_copies;
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
