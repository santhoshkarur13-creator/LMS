const express = require('express');
const router = express.Router();
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Fine = require('../models/Fine');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Issue a book to member
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { membership_no, isbn, due_date } = req.body;
    
    // Find member by user's membership_no
    const User = require('../models/User');
    const user = await User.findOne({ membership_no });
    if (!user) return res.status(404).json({ message: 'Member not found' });
    
    const member = await Member.findOne({ user_id: user._id });
    if (!member) return res.status(404).json({ message: 'Member details not found' });

    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.available_copies < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const record = new BorrowRecord({
      member_id: member._id,
      book_id: book._id,
      due_date: new Date(due_date)
    });

    book.available_copies -= 1;
    await book.save();
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View my borrow history
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'member') return res.status(403).json({ message: 'Members only' });
    const records = await BorrowRecord.find({ member_id: req.user.memberId }).populate('book_id', 'title author isbn');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return a book
router.put('/:id/return', adminMiddleware, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (record.status !== 'borrowed' && record.status !== 'overdue') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    record.return_date = new Date();
    record.status = 'returned';

    // Calculate fine
    let fineAmount = 0;
    const today = new Date();
    const dueDate = new Date(record.due_date);
    
    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 1; // $1 per day
      
      const fine = new Fine({
        borrow_id: record._id,
        amount: fineAmount
      });
      await fine.save();
    }

    const book = await Book.findById(record.book_id);
    if (book) {
      book.available_copies += 1;
      await book.save();
    }
    await record.save();

    res.json({ record, fineAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
