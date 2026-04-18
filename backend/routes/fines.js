const express = require('express');
const router = express.Router();
const Fine = require('../models/Fine');
const BorrowRecord = require('../models/BorrowRecord');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// View my outstanding fines
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'member') return res.status(403).json({ message: 'Members only' });
    
    // Find all borrow records for this member
    const records = await BorrowRecord.find({ member_id: req.user.memberId });
    const recordIds = records.map(r => r._id);
    
    const fines = await Fine.find({ borrow_id: { $in: recordIds } }).populate({
      path: 'borrow_id',
      populate: { path: 'book_id', select: 'title' }
    });
    
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay fine
router.put('/:id/pay', adminMiddleware, async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) return res.status(404).json({ message: 'Fine not found' });
    if (fine.paid) return res.status(400).json({ message: 'Fine already paid' });

    fine.paid = true;
    fine.paid_date = new Date();
    await fine.save();

    res.json(fine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
