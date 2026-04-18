const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const User = require('../models/User');
const { adminMiddleware } = require('../middleware/auth');

// Get all members (Admin only)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    // Find all users with role member
    const users = await User.find({ role: 'member' }).select('-password_hash');
    
    // Find all member details
    const members = await Member.find().populate('user_id', '-password_hash');
    
    // Merge data for a clean response
    const formattedMembers = members.map(m => {
      return {
        _id: m._id,
        user_id: m.user_id._id,
        name: m.user_id.name,
        email: m.user_id.email,
        membership_no: m.user_id.membership_no,
        phone: m.phone,
        address: m.address,
        membership_expiry: m.membership_expiry,
        joined: m.createdAt
      };
    });

    res.json(formattedMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
